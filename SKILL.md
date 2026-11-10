---
name: three-scene-debugger
description: >-
  当用户要求调试现有 Three.js 场景、运行时场景树、材质纹理/灯光阴影/相机与 OrbitControls
  调参、泛光等后期处理、环境贴图与天空盒、程序化贴图（基础色/法线/粗糙度）、配置快照或调参代码导出、调试器卸载，或提到
  three-scene-debugger、createSceneDebugger、调试面板、3D场景调试大师 时使用。
---
# Three Scene Debugger

在现有 Three.js 页面中接入开发期运行时调试面板，检查场景树、实时修改渲染属性，把主动修改导出为精简快照或可粘贴源码。

## 何时使用

- 用户要求 Three.js 场景调试、运行时 inspector、场景树、材质/纹理/灯光/阴影调参、相机/OrbitControls 调整。
- 用户要调泛光（Bloom）、暗角、色差、颗粒、锐化这类画面效果，或要在运行时换 HDR 天空盒 / PBR 贴图。
- 用户想要不依赖图片文件的贴图（木纹/砖墙/石材/皮革/织物等），需要同时有基础色与法线，能直接贴到材质上。
- 用户提到 `three-scene-debugger`、`createSceneDebugger`、“调试面板”“配置快照”“导出调参代码”“卸载调试器”。
- 在已存在的渲染循环中调参，需要保留可审计、可撤销的改动，且不想重写应用架构。

## 何时不使用

- 生产用户遥测/远程调试代理、完整 GPU profiler、自动修复源码或自动上传数据。
- 创建全新 Three 特效、设计整站 UI、离线模型编辑、任意私有节点材质图和自定义 Shader 全覆盖。
- 用户没有授权就释放其 GPU 资源、覆盖业务状态、改写 userData、把面板强行打包到生产。
- 用户打包发布部署上线的时候，卸载。

## 快速开始

1. 确认现有 `scene/camera/renderer`，优先显式引用，不从闭包或 React 私有数据探测。
2. 首先按需读 [接入指南](references/integration.md)。核心是 `scripts/three-scene-debugger.js`，无需 UI 依赖；dist 是预生成单文件。
3. ESM 开发条件引入：

```js
let sceneDebug;
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('./three-scene-debugger/dist/three-scene-debugger.mjs');
  sceneDebug = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
// 在已有用户渲染帧完成后可选加一行，绝不新增第二个 render 循环：
// sceneDebug?.tick(now);
// 卸载/HMR：sceneDebug?.destroy(); sceneDebug = undefined;
```

`THREE` 是应用已有的同一 namespace，不能偷偷 import 第二份。标量编辑可不传，Fog/typed 恢复建议注入。`container`、`pixelRatioCap`、`storage`、`assets` 可选。

UMD/script 单文件：

```html
<script src="./three-scene-debugger/scripts/three-scene-debugger.js"></script>
<script>
const sceneDebug = ThreeSceneDebugger.createSceneDebugger({ scene, camera, renderer, THREE });
</script>
```

ESM 与 UMD 是不同格式；UMD 源不能同时提供原生命名导出。`node scripts/build.cjs` 从同一核心生成 `dist/three-scene-debugger.mjs` 与 UMD 副本。不是“给 UMD 改扩展名当 ESM”。

## 安装 Skill 与安装运行库

`npx` 在这里只运行文件复制安装器，把本目录的 `SKILL.md`、`scripts/`、`dist/`、`references/`、`tests/`、`assets/` 等拷到 Agent 技能目录。它不把浏览器调试器当成命令执行，不启动面板，也不在目标目录安装 Three。

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent claude-code
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --list-agents
```

不带 `--agent` 时写入项目 `.agents/skills/three-scene-debugger`。这是 Cursor、Codex、GitHub Copilot CLI、Gemini CLI、OpenCode 文档里的共享发现目录，不是 Claude Code 的文档路径。Claude Code 用 `--agent claude-code`（项目 `.claude/skills`，全局 `~/.claude/skills`）。`--agent` 可重复，或写成逗号列表；相同目标只写一次。`--global` 只使用该 agent 自己文档里的用户目录，没有文档记录就不写，也不改用 Claude 的全局目录。`--target <目录>` 只复制到这个目录，不代表任何 Agent 会自动发现它。已有非空目录不静默覆盖；内容相同则直接成功。`--force` 只更新本 Skill 的普通文件，不删除无关文件，不覆盖符号链接。非交互终端不会提问。上述 GitHub 说明符在合并后指向默认分支。

运行库没有发布到 npm registry。不要使用 `npm install three-scene-debugger`，也不要使用裸 `npx three-scene-debugger`。宿主自行安装 Three；本包只把 three 声明为 peerDependency，dist 不内置第二份。本地 devDependency：`npm install -D /absolute/path/to/three-scene-debugger`。GitHub devDependency：`npm install -D github:8vdpxdrv4c-dot/three-scene-debugger`。列为 devDependency 不保证生产剔除，必须用构建期 DEV 分支并检查产物：

```js
let sceneDebug;
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('three-scene-debugger');
  sceneDebug = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
```

## 核心能力概览

| 模块 | 能力 |
|---|---|
| SceneDiscovery | 显式 scene/camera/renderer；window 全局仅兜底 |
| SceneTreeBuilder | 打开/刷新时 traverse；name/type/uuid、折叠、名称搜索、类型过滤；缓存定位 |
| PropertyInspector | Object3D 变换/显示/阴影标志/userData JSON；按类型材质、纹理、灯光、相机、场景与 renderer 控件 |
| ChangeTracker | 深拷贝 old/new、对象分组、逐条冲突检测撤销、清空记录、精简 JSON/赋值代码 |
| PerformanceMonitor | 可选 tick 的真实渲染 FPS；renderer.info calls/triangles；缓存资源内存估算 |
| UILayer | 内嵌原生 DOM/ShadowRoot；左上角常驻红色入口按钮「3D场景调试大师」（fixed、最高 z-index），面板标题栏可拖拽，双击标题栏回默认位置；无需 Tweakpane/lil-gui；本地输出、导入、复制、显式存储 |
| PostFX（0.5.0） | 自研离屏后期链路：Bloom / 调色 / 暗角 / 色差 / 颗粒 / 锐化 / 描边 / 像素化，外加线框/法线/剪影调试视图；零 addon 依赖 |
| UILayer（0.6.0） | 宽度拖拽条（宽度记忆）、快捷工具条、自绘滑块 + 可键入数字框、字段名横向拖拽改值、属性筛选、手柄模式按钮；细节见 [面板交互](references/ui.md) |
| AssetLibrary（0.5.0） | CC0 HDR 天空盒 + PBR 贴图，清单驱动、懒加载；缺素材时自动降级为程序化环境 |
| TextureStudio（0.8.0） | 12 套**程序化**材质贴图（零图片文件、零网络）：同一生成器出基础色 / 法线 / 粗糙度，方形无缝平铺；面板抽屉可预览、选通道、调平铺与尺寸；写入材质槽位、可撤销、可导出 |
| 可选扩展 | registerPostProcessing(composer)、registerAnimationMixer(mixer, actions?)，无 composer/mixer 强依赖 |
| SceneEditor（0.5.0） | 点选高亮、注入式 TransformControls 拖拽、光源/阴影相机 helper、加光源/克隆/删除/聚焦、网格与坐标轴、截图与统计、材质快捷编辑、可复制的改动日志 |
| 材质切换（0.7.0） | 选中物体后按对象种类换成 Standard/Physical/Phong/Lambert/Basic/Toon/Normal/Matcap/Depth/Shadow（材质数组按槽位）；新建实例并搬运颜色/贴图/透明度等；可同步共用该材质的其他对象；一条改动记录，可撤销、可导出 |
| 生命周期 | 幂等 destroy，自己的 DOM/事件/RAF/引用/全局所有权精确清理，无用户方法 patch |

完整属性范围、单位、枚举、版本限制参见 [属性对照表](references/inspectable-properties.md)。所有枚举用当前应用 Three 常量的数值/字符串，不能从其他版本瞎猜。

## 编辑器模式

**入口与开关**：初始化后只在页面左上角渲染一个常驻红色按钮「3D场景调试大师」（`position:fixed`、`z-index:2147483647`），参数面板默认关闭；点按钮打开/收起，`open()/close()` 等价。面板标题栏可按住拖拽到任意位置（限制在视口内），双击标题栏恢复默认右上角位置。只有面板打开时点选与拖拽才生效，关闭会同时清空选中。宿主若要把自己的 UI 挂在面板根上，监听 `onToggle(open)` 即可，不要直接读 ShadowRoot。

不传额外参数即可获得点选、场景设置与后期；拖拽需宿主注入 `TransformControls` 构造函数（技能不内置 addon，避免第二份 Three）：

```js
import { TransformControls } from 'three/addons/controls/TransformControls.js';
sceneDebug = createSceneDebugger({
  scene, camera, renderer, THREE, controls,
  transformControls: TransformControls,   // 可选：不传则只有选中高亮，没有拖拽
  lightHelpers: true,                     // 默认 true，为每个光源挂 helper
  assets: './assets/',                    // 可选：HDR 天空盒 + PBR 贴图素材库
  postfx: { enabled: false },             // 可选：覆盖后期默认值
  onSelect: obj => {}, onDeselect: () => {}, onToggle: open => {},
  onTransformStart: obj => {}, onTransform: obj => {}, onTransformEnd: obj => {},
});
```

| 能力 | API |
|---|---|
| 点选 / 高亮 / Esc 取消 | `setPicking(bool)`、`selectObject(objOrId)`、`getSelected()`、`clearSelection()` |
| 拖拽模式 | `setTransformMode('translate'|'rotate'|'scale')`、`getTransformMode()`、`getGizmo()`；画布上 W/E/R 快捷键 |
| 编辑器动作 | `addLight(type, opts)`、`cloneObject(id)`、`removeObject(id)`、`focusObject(id)`、`setGridHelper(bool)`、`setAxesHelper(bool)`、`screenshot()`、`downloadScreenshot()`、`getStats()` |
| 光源辅助 | `setLightHelpers(bool)`、`setShadowHelpers(bool)`；helper 标 `userData.tsdIgnore`，不进场景树但可点选 |
| 环境贴图 | `setEnvironment('hdr:<id>'|'studio'|'sunset'|'night'|'white'|'gray'|'none')`、`setEnvBackground(bool)`、`getEnvironment()`；HDR 来自素材库，程序化预设零外部文件 |
| 后期处理 | `setPostFX(path, value)`、`getPostFX(path?)`、`previewPostFX(path, value)`、`resetPostFX()`、`setViewMode('final'|'wireframe'|'normal'|'flat')`、`exportPostFXMarkdown()` |
| 素材贴图 | `applyAssetTexture(targetId, path, assetId, kind, opts)`，`kind` = `diff`/`nor`/`rough`/`arm`；`opts.index` 材质数组下标 |
| 自制贴图库 | `listTexturePresets()`、`presetTexture(id, kind, size)`、`applyTexturePreset(targetId, presetId, {slots, kind, size, repeat, index})`、`materialTarget(id, slot, index)` |
| 材质切换 | `setMaterial(id, type, opts)`、`getMaterialTypes(id?)`、`materialUsers(material)`；`opts.slot` 材质数组下标、`opts.copy:false` 不搬参数、`opts.spread:true` 同步共用该材质的对象、`opts.force:true` 同类型也重建 |
| 改动输出 | `exportPrompt()`（0.8.2，包装成可直接发给 agent 的修改提示词）、`exportChangeMarkdown()`、`exportCode()`；面板「改动 N」支持单条 / 按对象 / 组内复制，同时 `console.info` 一行摘要。**面板底部有一个始终吸底的大按钮「复制修改提示词」**：随滚动固定在面板底部，显示改动处数、无改动时禁用，点一下即复制提示词。同一对象同一属性的多步改动在复制/导出时合并为「首次旧值 → 最终值」一行，面板仍保留逐步记录供 `undo()`。**命令区另有「AI 提示词」按钮**（`aiPrompt(targetId?)`，0.8.3）：生成「指令前言 + 场景概览 + 选中对象全部参数 + 定位代码块 + 待应用改动」的完整提示词，写入输出框并自动复制，可直接发给 AI |
| 属性 / 材质页签 | 选中目标后参数区分「属性」「材质」两栏：属性放 transform 等对象字段，材质放常用参数（基础色/粗糙度/金属度/不透明度/发光/开关）+「全部材质参数」折叠区；材质数组有槽位下拉。无材质的目标、场景、renderer、controls 会禁用材质页签；直接选中材质/纹理目标时强制在材质页签 |

- 拖拽结束按 position / rotation / scale 各记一条，`undo()` 可回滚。被拖过的对象是否继续受应用动画驱动由宿主决定，技能只发 `onTransformStart` 回调。
- 滑块拖动走 `preview()/commitPreview()`：实时改值，松手才写一条记录，避免改动日志被刷屏。
- 换材质是**新建实例**：`setMaterial()` 只搬运 `MATERIAL_COPY_PROPS` 白名单里的属性（颜色/贴图/透明度/双面/粗糙度…），Color 复制值、贴图共用同一张纹理，旧材质不 dispose（可能还被别的对象用着）。换完走 `resyncAfterMaterial()` 只重建 inspector 目标，不整棵 UI 刷新，场景树展开状态不会丢。
- 材质切换在导出里是一条可执行调用 `tsd.setMaterial(target, "MeshPhysicalMaterial", {"slot":1,"spread":true})`；不能写成注释，否则交回给 agent 等于没改。
- `setEnvironment` 在首次切换前捕获原 `scene.environment/background`，切回 `'none'` 恢复原值；PMREM 目标是技能自己创建的，`destroy()` 一并释放，用户资源永不 dispose。
- 点选有两条硬规则：**不可见对象不参与射线**（`Raycaster` 自己不检查 `visible`，必须手动过滤），**光源/阴影 helper 这类代理 Mesh 只在没有真实几何被命中时才算数**（否则半球光的大球心会吞掉地板中央的每一次点击）。
- 属性区标题在点选物体/光源后显示「当前选中的是：名称 · 类型 · 短 uuid」，完整 uuid 在 `title` 悬停提示里；材质、纹理、renderer 等非 Object3D 目标保持原标签（如「Cube_2 的材质（MeshStandardMaterial）」）。
- 点选、拖拽、helper 都可用 `picking: false` / `lightHelpers: false` / 不传 `transformControls` 关闭。

## 后期处理

0.5.0 自带一条后期链路，**不依赖 `EffectComposer`**（避免打包进第二份 Three）。渲染路径是：场景先画到离屏 `WebGLRenderTarget`（HalfFloat 可选、4x MSAA）→ 阈值提取 → 4 级高斯模糊 → 合成着色器（Bloom + 调色 + 暗角 + 色差 + 颗粒 + 锐化 + 描边 + 像素化）。合成通道 `toneMapped: true` + `#include <colorspace_fragment>`，色调映射与色彩空间交给宿主的 `renderer`，不自己造 ACES。

```js
sceneDebug.setPostFX('enabled', true);
sceneDebug.setPostFX('bloom.threshold', 1.05);   // 线性 HDR 空间：1.0 = 白点以上
sceneDebug.setPostFX('bloom.strength', 0.8);
sceneDebug.setPostFX('vignette.amount', 0.35);
```

- `enabled === false` 时直接转调原 `renderer.render`，零额外开销、零 draw call。
- 阈值不是 sRGB 0–1：`1.0` 表示「比白点更亮」，想让所有东西发光就压到 0.2–0.4。参数全表、性能取舍与历史坑见 [后期处理](references/postfx.md)。
- 开启后期后 `renderer.info.render` 只统计最后那趟合成，`getStats()` 已改用内部保存的场景那一趟数字，draw call 不会突然掉到 1。

## 素材库

`assets/` 有 4 个 HDR 天空盒 + 1 个 LDR 环境 + 8 套 PBR 贴图，全部 CC0，由 `manifest.json` 驱动、按需懒加载。不传 `assets` 参数就只用程序化环境（`studio`/`sunset`/`night`/`white`/`gray`），功能面只是少了 HDR 与贴图网格。

```js
sceneDebug.setEnvironment('hdr:venice_sunset');
sceneDebug.setEnvBackground(false);                       // 只吃环境光，不显示天空盒
sceneDebug.applyAssetTexture('material:<uuid>', 'map', 'red_brick_03', 'diff');
```

- HDR 是手写 Radiance RGBE 解析（不用 `RGBELoader`）。new-style RLE **每行按 4 个通道各一条流**，按像素交错解析会整行错位——正确性用「解码消耗字节数 == 文件字节数」硬校验。
- `arm` 贴图的通道约定：`aoMap → channel 0`、`roughnessMap → channel 1`、`metalnessMap → channel 2`。
- 清单格式、加素材的步骤、体积取舍见 [素材库](references/assets.md)。

## 自制贴图库

`assets/` 需要下载、约 22 MB；**自制贴图库不需要任何图片文件**：12 套材质（橡木/红砖/清水混凝土/大理石/拉丝金属/六角砖/石板路/皮革/亚麻/沙地/锈蚀/水磨石）在浏览器里用周期噪声算出来，一次生成**基础色 + 法线 + 粗糙度**三张 `DataTexture`。断网、缺 `assets/` 都能用。

```js
sceneDebug.listTexturePresets();                                  // 12 条，含 id/label/hint/kinds
sceneDebug.presetTexture('oak', 'nor', 512);                      // 直接拿一张 DataTexture
sceneDebug.applyTexturePreset(mesh.uuid, 'oak', {                 // 整套三通道写进材质
  slots: ['map', 'normalMap', 'roughnessMap'], size: 512, repeat: 4
});
```

- 三个通道共用一次 `bake()`：`H` 高度只用来求梯度，`A` 反照率、`R` 粗糙度直接打包。整套写三个槽位只跑一遍生成器。
- 所有图案都按**整数周期**生成（`vnoise2` 格点数取整数、`worley` 格点取模、`fbm` 每层周期翻倍），因此方形贴图四边无缝；六角砖取 `R=1/9`、`SX=5√3/9` 让 `(1,0)`/`(0,1)` 同时落在格点上。接缝用「跨边界像素差 / 内部平均差」自动回归，实测 0.00。
- 法线是 3×3 Sobel：`N = (-dh/du, -dh/dv, 1)`。`DataTexture` 默认 `flipY = false`，**`ny` 必须取负**，否则凸起会渲染成凹陷；这个符号是用真实渲染比对上下半坡亮度定下来的，别凭直觉改。
- `repeat !== 1` 时 `clone()` 一份再改 `repeat`：缓存纹理是全局共用的，直接改会把同一预设的其他材质一起带偏。
- 通道映射**不能**用素材库的 `ASSET_SLOT_KIND`（那表把 `aoMap`/`metalnessMap` 指向 `arm`，自制贴图库没有这一路）。独立用 `TEX_SLOT_KIND`：`map→diff`、`normalMap`/`bumpMap→nor`、`roughnessMap`/`aoMap`/`metalnessMap→rough`。用错表不会报错，只会把彩色图静默写进金属度槽位。
- 导出成一行 `tsd.applyTexturePreset(target, "brick", {"slots":[...],"size":256,"repeat":6})`；这类动作没有快照条目，由 `exportCode()` 末尾单独兜。撤销恢复原纹理实例（通常是 `null`）。
- 内存：512px 三通道约 4 MB（含 mipmap），1024px 单套约 16 MB；`destroy()` 释放全部缓存纹理与缩略图，不碰用户资源。
- 面板：材质页每行「缩略图 + 名称 + 选择…」打开抽屉，四个页签（基础色/法线/粗糙度/整套），底部平铺 1–8 与尺寸 128/256/512/1024。缩略图是用同一生成器在 96px 上重算的 data URL，不是缩放，也不发网络请求。

细节（12 套构成、无缝证明、法线符号判定、槽位表、内存账）见 [自制贴图库](references/textures.md)。

## 操作与改动导出

- 用户在 UI 选择 Object3D/material/texture/renderer/controls/Pass/Action 目标即可修改；新资源由应用加载后 `registerResource(texture)`，刷新树后可检查纹理参数。
- API 示例：`sceneDebug.set(mesh, 'position.x', 2)`；`sceneDebug.lookAt(camera,0,0,0)`；`sceneDebug.undo(record.id)`。
- 工具类辅助对象（如 TransformControls 的 gizmo、BoxHelper）给 `object.userData.tsdIgnore = true` 后，该子树不进场景树与目标下拉，`refresh()` 也不会重新收录；调试器只读这个约定标记，从不写 userData。
- 外部交互可用 `sceneDebug.selectTarget(id)` 反向驱动面板：若面板已关闭则先打开，把目标下拉定位到该 id、渲染属性并滚动到属性区（不重建场景树，不需要访问 ShadowRoot 内部 DOM）。`isOpen()` 返回当前面板开关态。
- `exportSnapshot()` 只返回最终被修改的属性，等于基线的项移除；JSON.stringify 后复制。`loadSnapshot(json)` 返回 `{applied, errors}`，必须逐项检查错误，不能把部分成功当全部成功。
- `exportChangeMarkdown()` 每个对象**一段可执行代码**：先 `const target = scene.getObjectByName("…");`，再用 `target.position.y = …` 赋值。一段粘贴即生效，不要把它拆成「只有 locator」和「只有赋值」两段。空名/重名回退 UUID 并注释。
- 编辑器层的改动（后期参数、环境贴图、光源 helper 开关）不属于任何 Object3D，导出成 `tsd.setPostFX(...)` / `tsd.setEnvironment(...)` / `tsd.setLightHelpers(...)`。代码里的 `tsd` 指调试器实例（宿主自己挂到 `window.__tsd` 或按需改名），页脚有这句说明。
- `exportCode()` 优先 `scene.getObjectByName(...)`；代码需要已有 scene/camera/renderer/THREE；扩展上下文与资源 UUID 约定见 [改动协议](references/change-tracking.md)。不自动执行或写回源码。
- `exportFullSceneJSON()` 单独使用 `scene.toJSON()` 做存档兜底，不混入主快照格式，不保证函数/外部资源可恢复。
- 默认不写 localStorage；只有显式“保存本地”或 `saveSnapshot(name)`，统一键 `tsd:snapshot:*`。

## 卸载

```js
sceneDebug?.destroy();
sceneDebug = undefined; // 同时停止业务循环调用 tick
// 需要清除此 origin 的全部本库快照时，应在置空前调用：
// sceneDebug.destroy({ clearStorage: true });
```

destroy 幂等；清理本实例 DOM、监听、RAF、缓存、场景/renderer/扩展/撤销引用，并把 `renderer.render` 换回原函数。默认不恢复用户主动修改，不 dispose 用户 GPU 资源、不停止业务 render 循环。没有默认 monkey patch。UMD 只在最后一个实例销毁且全局仍指向本库时移除 namespace；不删除其他实例/第三方值。Storage 对象为重复 clearStorage 请求有意保留，不含场景引用。

`tick()` 在销毁后**静默返回**（不抛错）：宿主循环常写成 `dbg.tick(now)`，销毁瞬间抛错会让整帧中断、连带业务相机动画一起挂掉。写操作（`set`/`undo`/`export*`）仍然抛 `Debugger destroyed`，避免误用已销毁实例。

卸载验证表在 [integration.md](references/integration.md)。阴影 mapSize 在旧 Three/PointLight cube target 的资源失效涉及所有权，必须先读 [troubleshooting.md](references/troubleshooting.md)，禁止偷偷 dispose 用户 target。

## 给执行此 Skill 的 Agent 的规则

1. 先查现有初始化、循环、资源所有权、Three 版本、卸载/HMR 时机；不因“调试”就改应用架构。
2. 核心实现只改 `scripts/three-scene-debugger.js`；维持 SceneDiscovery、SceneTreeBuilder、PropertyInspector、ChangeTracker、PerformanceMonitor、UILayer、PostFX、AssetLibrary、TextureStudio 分层；修改后重建两种 dist。
3. 显式引用接入优先，window 仅兜底。注入已有 THREE，不能引入重复 Three 实例。
4. 只在面板打开/手动刷新构建场景树；导出/每帧/性能采样用缓存，不每帧 scene.traverse。
5. 调试状态保存在实例内，不向 userData/原型/用户对象写内部元数据；明确主动编辑才改变运行态。
6. 不默认 monkey patch。确有授权扩展需求时保存精确原引用、记录所有权，destroy 只还原自己仍持有的 patch，不能覆盖别人的更新。
7. 记录 deep-copy old/new，GPU 资源保留原引用，不 clone；路径白名单与原型污染检查必须保留。
8. 逐条撤销先检查后续重叠改动与外部更新；不得旧值覆盖新值。快照按最终属性合并、基线相等剔除、缺失资源明确报错。
9. 源码导出优先唯一名称，空名/重复名用 UUID 注释回退；共享材质/纹理、renderer/controls/Pass/mixer/action 定位不能弄错。
10. 每次合法修改要走统一更新规则：texture/material.needsUpdate、camera projection、shadow flags、transform matrix；不只做 UI 数值变化。
11. FPS 只来自用户 tick，独立 RAF 只刷新面板；renderer.info 是当前引擎统计，内存是缓存范围估算，不能假冒精确显存。
12. 不强依赖后处理/动画插件，不执行任意第三方代码，不自动加载网络资产，不擅自 dispose 用户资源。
12b. 编辑器层（点选、gizmo、light helper、环境贴图）必须可逐项关闭，且不得接管或新增宿主 render 循环；`TransformControls` 只能由宿主注入。
12c. 后期链路只 patch `renderer.render`，不新增 RAF、不改宿主的 `toneMapping`/`outputColorSpace`；`enabled` 关闭时必须原样转调，保持零开销。禁止改回 `copyFramebufferToTexture` 抓帧方案（在 r160 + WebGL2 下帧内调用不稳定）。
12d. 拾取必须先过滤 `visible === false`，并让真实几何优先于光源/阴影 helper 代理；这两条是修过的真实缺陷，别为了“少一次遍历”删掉。
13. 所有持久化 opt-in，键统一 tsd:snapshot:*；destroy 可重复、安全清理，多实例不互相删 DOM/监听/全局引用。
14. 用户需要保留改动时先导出；不自动写源码、不自动发布 npm、不自动上传快照/完整场景。
15. 使用开发条件动态引入，检查真实生产包是否移除；devDependency 不等于构建剔除。
16. 运行 `tests/runtime.cjs` 与可用的 `tests/browser.cjs`；记录版本/结果。真实 GPU/WebGL/视觉没测就明确没测，不以 stub 冒充真实渲染验证。
17. 发生失败按排障索引定位，不用绕过路径校验/撤销冲突/权限保护来“修复”。

## 参考文件索引（按需加载）

- [references/integration.md](references/integration.md)：三种接入（含本地单文件）、npm、准确 API、生产剔除、destroy 清单和验证表。
- [references/inspectable-properties.md](references/inspectable-properties.md)：Object3D→Material→Texture→Light→Camera→Scene→Renderer→可选扩展的完整支持表。
- [references/change-tracking.md](references/change-tracking.md)：记录协议、深拷贝/资源、撤销冲突、精简快照与可执行代码模板、不可序列化约定。
- [references/postfx.md](references/postfx.md)：后期链路、全部参数与范围、阈值语义、统计口径、与宿主后处理的共存方式。
- [references/assets.md](references/assets.md)：manifest 格式、HDR 解析陷阱、arm 通道约定、加素材步骤、体积取舍。
- [references/textures.md](references/textures.md)：12 套程序化贴图、三通道生成、无缝平铺的周期约束、法线方向、槽位映射、平铺 clone 与导出。
- [references/ui.md](references/ui.md)：面板结构、宽度拖拽条、滑块/数字框、字段名拖拽改值、属性筛选、模式按钮、快捷键与改样式的坑。
- [references/troubleshooting.md](references/troubleshooting.md)：自动发现、纹理、阴影、遮挡、后期黑屏、销毁残留及错误恢复。
- `scripts/three-scene-debugger.js`：单文件 UMD 核心；`scripts/build.cjs`：无构建工具的 ESM/UMD 格式生成。
- `dist/three-scene-debugger.mjs`、`dist/three-scene-debugger.js`：预生成可运行单文件。
- `tests/README.md`、`tests/runtime.cjs`、`tests/browser.cjs`：环境、结果与可复现验证。
