# 后期处理（PostFX）

0.5.0 起，调试器自带一条后期处理链路：泛光（Bloom）、调色、暗角、色差、颗粒、锐化、描边、像素化，外加线框/法线/剪影三种调试视图。

它**不依赖 `EffectComposer` / `UnrealBloomPass`**。原因不是「重复造轮子」，而是这个技能的前提是「注入宿主已有的 Three」：一旦 import addon，打包器很容易带进第二份 `three`，两份实例的 `WebGLRenderTarget`、`ShaderMaterial`、色彩空间常量互不认账。整条链路压在同一个文件里，只用宿主注入的 `THREE`。

## 链路

```
scene
  └─(renderer.setRenderTarget) → rt  : HalfFloat(可选) + depth + samples:4
        ├─ 阈值提取 → bright           : 线性 HDR 空间，uThreshold / uKnee
        ├─ 4 级降采样 + 双向高斯       : levels[0..3]
        └─ 合成 → 屏幕                 : bloom 叠加 + grade + vignette + grain …
```

- **合成通道交给 Three 收尾**：材质 `toneMapped: true`，片元最后 `#include <colorspace_fragment>`。这样 `renderer.toneMapping`、`renderer.outputColorSpace` 由宿主决定，调试器不自己写一套 ACES，避免双重色调映射（画面发灰、白点偏移）。
- **中间通道保持线性**：阈值/模糊两个通道 `toneMapped: false`，在渲染目标里工作，不提前编码 sRGB。
- **关闭时零开销**：`enabled === false` 时 `renderer.render` 直接转调原函数，不建 RT、不多一趟 draw call。
- **销毁还原**：`destroy()` 把 `renderer.render` 换回原始引用（只还原自己仍持有的那个 patch）。

## 参数

`setPostFX(path, value)` 的路径与范围。数值超界会被 `POSTFX_LIMITS` 夹紧。

| 路径 | 范围 | 默认 | 说明 |
|---|---|---|---|
| `enabled` | bool | `false` | 总开关；关闭即恢复直通渲染 |
| `view` | `final`/`wireframe`/`normal`/`flat` | `final` | 调试视图，用 `scene.overrideMaterial` 实现 |
| `bloom.enabled` | bool | `true` | 单独关泛光、保留其它合成效果 |
| `bloom.strength` | 0–5 | 0.8 | 泛光叠加强度 |
| `bloom.radius` | 0–1 | 0.6 | 参与合成的模糊层权重跨度 |
| `bloom.threshold` | 0–2 | 1.0 | **线性 HDR 亮度**阈值，1.0 = 白点以上才发光 |
| `grade.brightness` | -1–1 | 0 | 加法亮度 |
| `grade.contrast` | 0–2 | 1 | 围绕 0.5 的对比 |
| `grade.saturation` | 0–2 | 1 | 0 = 灰度 |
| `grade.temperature` | -1–1 | 0 | 暖/冷偏色 |
| `grade.tint` | -1–1 | 0 | 品红/绿偏色 |
| `vignette.amount` | 0–1 | 0.35 | 边角压暗强度 |
| `vignette.softness` | 0.05–1.5 | 0.6 | 起压半径，越小越向中心蔓延 |
| `aberration` | 0–8 | 0 | 色差（像素级偏移） |
| `grain` | 0–1 | 0 | 颗粒；用 `uTime` 做时间抖动 |
| `sharpen` | 0–1 | 0 | 十字采样锐化 |
| `outline` | 0–1 | 0 | 边缘描边（青色） |
| `pixelate` | 1–32 | 1 | 整数倍马赛克 |

**阈值语义**最容易踩错：它工作在线性 HDR 空间，`threshold = 1.0` 表示「比白点更亮的像素」才泛光。想要「所有东西都发光」就把阈值压到 0.2–0.4；想让泛光只出现在自发光/高光上，用 0.9–1.2。改用 sRGB 0–1 的直觉去设 0.5，会得到一片糊光。

## API

```js
sceneDebug.setPostFX('enabled', true);
sceneDebug.setPostFX('bloom.threshold', 1.05);
sceneDebug.setPostFX('vignette.amount', 0.4);

sceneDebug.getPostFX('bloom.strength');   // 0.8
sceneDebug.getPostFX();                   // 整个 state 的深拷贝

sceneDebug.previewPostFX('bloom.strength', 2.4);   // 拖动中：只改值不记录
sceneDebug.setPostFX('bloom.strength', 2.4);       // 松手：记一条改动

sceneDebug.setViewMode('wireframe');      // 等价于 setPostFX('view', 'wireframe')
sceneDebug.resetPostFX();                 // 回到默认并记一条可撤销的「重置」
sceneDebug.exportPostFXMarkdown();        // 把当前后期参数导成可执行的 tsd.setPostFX(...)
```

改动会进统一改动日志，导出时写成 `tsd.setPostFX('bloom.strength', 2.4);` —— 因为后期参数不属于某个 `Object3D`，只能通过调试器实例复原。

## 与宿主渲染循环的关系

- 不新增 RAF、不接管循环。它 patch 的是 `renderer.render(scene, camera)` 本身，宿主原来怎么调还是怎么调。
- 宿主若自己也有后处理（`EffectComposer`），把调试器的 `enabled` 关掉，或让 composer 的最终 pass 之后不要再叠一层色调映射。两层 Bloom 会互相抬亮。
- `renderer.getRenderTarget() !== null` 时（宿主正在渲染到自己的 RT，比如阴影或反射探针）调试器会直接转调原函数，不做后期——否则会把宿主的中间结果画到屏幕。

## 统计口径

开启后期后，`renderer.info.render` 只会反映「最后那一趟合成」，`calls` 变成 1、`triangles` 变成 1。`getStats()` 内部保存了场景那一趟的真实数字（`postfx.sceneInfo`），并优先返回它——所以面板里的 draw call 数在开关前后是连续的，不会突然掉到 1。

## 已知取舍

- 4x MSAA 只在 WebGL2 可用（`samples: 4`）。WebGL1 走无 MSAA 的路径，边缘会硬一些。
- RT 用 `HalfFloatType` 需要 `EXT_color_buffer_float` / `EXT_color_buffer_half_float`，都拿不到时退回 `UnsignedByteType`，此时超过 1.0 的亮度在 RT 里就被截断，泛光会偏「平」。
- 早期版本用 `renderer.copyFramebufferToTexture` 抓当前帧再合成。实测在 r160 + WebGL2 + SwiftShader 下，这个调用在真实渲染回调内持续失败（`GL_INVALID_VALUE: glCopyTexSubImage2D: Offset overflows texture dimensions`），同一调用在渲染回调外却返回 0。**不要改回那条路**：离屏 RT 不仅稳定，还顺带拿到了 HDR 与 MSAA。
