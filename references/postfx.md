# 后期处理（PostFX）

0.5.0 起，调试器自带一条后期处理链路：泛光（Bloom）、调色、暗角、色差、颗粒、锐化、描边、像素化，外加线框/法线/剪影三种调试视图。

0.9.0 起它多了一种工作方式：**场景已经有 `EffectComposer` 时优先接管**——有 Bloom pass 就直连它的参数，没有就往 composer 里插一条自己的 pass；只有在完全没有 composer 时才走自带的离屏链路。见下文「接管宿主的 EffectComposer」。

自带链路**不依赖 `EffectComposer` / `UnrealBloomPass`**。原因不是「重复造轮子」，而是这个技能的前提是「注入宿主已有的 Three」：一旦 import addon，打包器很容易带进第二份 `three`，两份实例的 `WebGLRenderTarget`、`ShaderMaterial`、色彩空间常量互不认账。整条链路压在同一个文件里，只用宿主注入的 `THREE`。

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
| `enabled` | bool | `attach` 下 `true`，`inject` / 无 composer 下 `false` | 总开关。接管模式下是「是否接管」：关掉会把宿主 Bloom 的开关与强度/半径/阈值**全部**还回去。拖动其它任意参数会自动把它打开 |
| `view` | `final`/`wireframe`/`normal`/`flat` | `final` | 调试视图，用 `scene.overrideMaterial` 实现（composer 场景里不生效，见下） |
| `bloom.enabled` | bool | `true` | 接管模式下直连宿主 Bloom pass 的 `enabled`；inject 模式下控制自建 pass 的泛光 |
| `bloom.strength` | 0–5 | 0.8 | 泛光叠加强度 |
| `bloom.radius` | 0–1 | 0.6 | 各级模糊层的权重跨度：0 贴紧亮部，1 铺成大范围柔光（接管模式下写宿主 pass 的 `radius`） |
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

## 接管宿主的 EffectComposer

注册时会先「看一眼场景」再决定走哪条路，不用宿主改渲染代码：

```js
sceneDebug.registerPostProcessing(composer);   // 显式
// 不调用也可以：options.composer，或 window.composer / finalComposer / effectComposer 兜底探测
sceneDebug.composerInfo();
// attach: {mode:'attach', bloomPass:'UnrealBloomPass', bloomIndex:2, helperIndex:3, linearOutput:true}
// inject: {mode:'inject', bloomPass:null, bloomIndex:-1, helperIndex:3, linearOutput:true}
// off   : 没有 composer，走自带离屏链路
```

| mode | 触发条件 | 面板行为 |
|---|---|---|
| `attach` | composer 里能找到 Bloom pass（`isUnrealBloomPass`、类名含 Bloom，或同时有 `strength`/`radius`/`threshold` 三个数值字段） | 接管它：三个参数直连同名字段，`Bloom 开关` 写它的 `enabled`；调色/暗角等另外插一条 `TsdPostFXPass` |
| `inject` | 有 composer，但没有 Bloom pass | 面板「启用后期处理」勾上时，把 `TsdPostFXPass` 插进 `composer.passes`，整条链路（Bloom + 调色 + 暗角…）由它画 |
| `off` | 没有 composer | 沿用自带的离屏链路，patch `renderer.render` |

几条硬约束：

- **接管时把宿主现值读进 state**（`strength/radius/threshold/enabled`），所以勾「接管」画面不会跳；`resetPostFX()` 回到的是接管瞬间那组值。
- **插入位置**：插在编码 pass 之前（`OutputPass`，或片元里带 `colorspace_fragment` / `sRGBTransferOETF` 的 `ShaderPass(GammaCorrectionShader)`）。认编码 pass 不能只看类名——`GammaCorrectionShader` 包进 `ShaderPass` 后类名只剩 `ShaderPass`，认错就会把已经编码的画面再编一次，整体发灰发白。找不到编码 pass 时插在末尾，由自己完成 tone mapping + sRGB。
- **插进去的 pass 必须输出线性值**：用 `compositeLinear` 变体（去掉 tone mapping 与 `colorspace_fragment`），编码交给链末。反了就是「一开后期暗部全黑、只剩自发光」。
- `attach` 模式下 Bloom 归宿主的 pass，`TsdPostFXPass` 只画调色类效果，避免叠两层泛光；当调色参数全是中性值时这个 pass 直接 `enabled = false`，零开销。
- **视图切换（线框/法线/剪影）在 composer 场景里不生效**：它靠 patch `renderer.render` 时的 `scene.overrideMaterial`，而 `RenderPass` 渲染时目标已绑定、patch 整趟让路。
- 参数不在 composer 里也能调单个 pass：目标下拉 `pass:<index>`（`registerPostProcessing` 后可用），`tsd.set('pass:2','strength',3)` 下一帧生效。
- 实例：丽泽 3D 大屏首页 `finalComposer = [RenderPass, LizeDepthOfFieldPass, UnrealBloomPass, OutputPass, FXAA]` → 接管 `passes[2]`，附加 pass 落在 `passes[3]`；`/detail` 页只有 `[RenderPass, OutlinePass, FXAA, GammaCorrection]`，走 `inject`，附加 pass 落在 `passes[3]`（Gamma 之前）。

### 总开关与「拖了没反应」

- `attach`：`registerPostProcessing()` 一返回就 `enabled === true`。参数是先从宿主读进来的，所以接管瞬间画面与宿主一致；取消勾选才是真正交还（Bloom 三个数值也一起还原），再勾回来继续用面板里的值。
- `inject` / 无 composer：默认 `false`。这两条路是「凭空加一层后期」，默认开会让页面一加载就和原来的基线不同。
- 任意非 `enabled` 路径的 `setPostFX` / `previewPostFX` 会先调 `ensureActive()` 把总开关打开，只翻那个勾选框、不重刷其它滑块。理由：拖着滑块数字在动、画面不动、也不报错，是最难自查的失败态——0.9.1 的 `镜头与风格`（色差 / 颗粒 / 锐化 / 描边 / 像素化）就栽在这，Bloom 三项因为直写宿主 pass 反而正常，表现成「半好半坏」。
- 排查顺序：`composerInfo().mode` → `state.enabled` → `composerPass.enabled`。`attach` 下附加 pass 只有在**存在非 Bloom 的改动**时才 `enabled`（`extrasActive()`），全中性时状态条会写「无调色改动，暂不参与渲染」，这是正常的。
- **不要再试 0.8.4 那条内联路线**：把场景渲进自己的 RT、合成后写回调用前的目标，在宿主 MSAA + HalfFloat 中间目标上会塌成「只有自发光、暗部全黑」（多采样目标未 resolve 就被下游采样）。要往 composer 里加东西，只能实现 pass 协议。

## 虚化通道（BokehPass）

0.10.0 增加的一组独立通道：官方 [`BokehPass`](https://threejs.org/docs/#examples/en/postprocessing/BokehPass) 景深，默认关闭。

```js
const dbg = createSceneDebugger({ scene, camera, renderer, THREE, composer, bokehPass: BokehPass });
dbg.setPostFX('bokeh.enabled', true);
dbg.setPostFX('bokeh.focus', 5.34);    // 世界单位
dbg.setPostFX('bokeh.aperture', 0.0075);
dbg.setPostFX('bokeh.maxblur', 0.02);
```

| 路径 | 范围 | 默认 | 说明 |
|---|---|---|---|
| `bokeh.enabled` | bool | `false` | 独立开关。不看后期总开关；开启即往 composer 插 pass，关闭即整条摘掉 |
| `bokeh.focus` | 0–500 | 相机→观察中心 | 对焦距离（世界单位）。`controls.target` 优先，其次是选中物体包围球中心 |
| `bokeh.aperture` | 0–0.05 | `maxblur / (0.5·focus)` | 与「世界单位深度差」相乘；越大景深越浅。滑块/导出保留 4 位小数 |
| `bokeh.maxblur` | 0–0.2 | `0.02` | 模糊上限（UV 比例）：0.01 轻微，0.05 明显 |

### 为什么必须注入、为什么默认值不是 0.025

- 技能里**不 import** `three/examples/jsm/postprocessing/BokehPass.js`：打包器很容易带进第二份 three，两套 `WebGLRenderTarget` / `ShaderMaterial` / 色彩常量的实例互不认账。和 `transformControls` 一样由宿主注入构造函数，面板只负责插 pass、写 uniforms。
- `BokehShader` 的模糊量是 `clamp((focus - depth) * aperture, -maxblur, maxblur)`，`depth` 是**世界单位**。three 默认 `aperture = 0.025` 是给「场景约 1 单位」调的；本项目整场景 2 单位、相机在 5.3 外，照搬就是整屏一秒撞到 `maxblur`——均匀糊成一片，看着像「糊了但没景深」。
- 反过来也不能用场景包围盒半径归一：地面 + 天空球把半径撑到 28.6（实测），算出来 0.0007，肉眼看不见，又像「没生效」。取 `maxblur / (0.5·focus)` 是折中：1.5 倍对焦距离处糊到上限，主体到前景之间还有层次。

### 模式与关闭

| 场景 | 行为 |
|---|---|
| 有 composer（`attach` / `inject`） | pass 插在「附加调色 pass / 编码 pass」之前，索引用 `indexOf` 动态取；`composer.setSize` 之后新插的 pass 由自己补一次 `pass.setSize()`（否则深度 RT 停在 1×1，整屏按「全在焦外」糊） |
| 无 composer | 走自带离屏链路：场景 RT → `BokehPass` → bloom / 合成。这条路上虚化依附总开关（`state.enabled` 会被自动置真） |

关闭语义（都实测过）：

- 面板取消勾选 → `passes.splice()` 摘除 + `pass.enabled = false` + dispose `bokehRT`，画面回到 0.7/255 的动画噪声范围（同等同于「从没开过」）。
- 再次勾开 → `attachBokehPass()` 先 `pass.enabled = true` 再 `splice` 插回。**漏了这一步就是「只能用一次」**：pass 回到链上但仍是禁用态，composer 直接 `continue`（0.10.1 修）。
- `resetPostFX()` → 一并关闭并回到 `composerDefaults`（`enabled:false`）。
- `destroy()` / `releaseComposer()` → 先摘 pass 再释放，不会挂到旧链上继续渲。
- 单把 `focus` 调到很大**不是关闭**：深度 pass 照常跑，开销不变，只是找不到合焦点。

### 生成提示词

开启状态下 `exportPostFXMarkdown()` 会多一节，可直接喂给 agent 改源码：

```
## 虚化通道（BokehPass 景深）
1) 安装：BokehPass 随 three 的 examples/jsm 分发，不是独立 npm 包 → npm i three
2) import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
3) 插到 composer.passes[3]（编码 pass 之前、调色 pass 之前）
   new BokehPass(scene, camera, { focus: 5.34, aperture: 0.0075, maxblur: 0.02 })
4) 关闭：bokehPass.enabled = false（临时对比）/ splice + dispose（彻底移除）
5) 注意：每帧多一次全场景深度 pass；focus 是世界单位；只调 focus 不等于关闭
```

宿主 composer 里已有景深 pass 时，这一节会额外点名（本项目首页 `LizeDepthOfFieldPass`），提示先关掉再叠。

## 统计口径

开启后期后，`renderer.info.render` 只会反映「最后那一趟合成」，`calls` 变成 1、`triangles` 变成 1。`getStats()` 内部保存了场景那一趟的真实数字（`postfx.sceneInfo`），并优先返回它——所以面板里的 draw call 数在开关前后是连续的，不会突然掉到 1。

## 已知取舍

- 4x MSAA 只在 WebGL2 可用（`samples: 4`）。WebGL1 走无 MSAA 的路径，边缘会硬一些。
- RT 用 `HalfFloatType` 需要 `EXT_color_buffer_float` / `EXT_color_buffer_half_float`，都拿不到时退回 `UnsignedByteType`，此时超过 1.0 的亮度在 RT 里就被截断，泛光会偏「平」。
- 早期版本用 `renderer.copyFramebufferToTexture` 抓当前帧再合成。实测在 r160 + WebGL2 + SwiftShader 下，这个调用在真实渲染回调内持续失败（`GL_INVALID_VALUE: glCopyTexSubImage2D: Offset overflows texture dimensions`），同一调用在渲染回调外却返回 0。**不要改回那条路**：离屏 RT 不仅稳定，还顺带拿到了 HDR 与 MSAA。
