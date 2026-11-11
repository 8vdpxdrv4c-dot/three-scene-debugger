---
name: three-scene-debugger
description: >-
  当用户要求调试现有 Three.js 场景、运行时场景树、材质纹理/灯光阴影/相机与 OrbitControls 调参、
  泛光等后期处理、环境贴图与天空盒、程序化贴图（基础色/法线/粗糙度）、FPS/draw call/三角形/显存等运行时性能检查、
  点选与拖拽手柄（TransformControls）/加光源/克隆/删除/聚焦/截图、配置快照或调参代码导出、调试器卸载，
  或在单页 HTML/静态 demo/本地 three.js 页面里做上述调试，或提到
  three-scene-debugger、createSceneDebugger、调试面板、3D场景调试大师 时使用。
  用户说「给我启动 3D 场景调试」「启用 3D 场景调试」「开启 3D 场景调试」「关闭/卸载 3D 场景调试」
  这类口令，或要求把调试面板接进当前项目、检查是否已接入时，同样使用。
  用户说「给我安装这个技能」「安装 three-scene-debugger」时也使用（见「提示词安装」）。
---
# Three Scene Debugger

在现有 Three.js 页面中接入开发期运行时调试面板，检查场景树、实时修改渲染属性，把主动修改导出为精简快照或可粘贴源码。

## 何时使用

- 用户要求 Three.js 场景调试、运行时 inspector、场景树、材质/纹理/灯光/阴影调参、相机/OrbitControls 调整。
- 用户要调泛光（Bloom）、暗角、色差、颗粒、锐化这类画面效果，或要在运行时换 HDR 天空盒 / PBR 贴图。
- 用户想要不依赖图片文件的贴图（木纹/砖墙/石材/皮革/织物等），需要同时有基础色与法线，能直接贴到材质上。
- 用户提到 `three-scene-debugger`、`createSceneDebugger`、“调试面板”“配置快照”“导出调参代码”“卸载调试器”。
- 在已存在的渲染循环中调参，需要保留可审计、可撤销的改动，且不想重写应用架构。
- 用户抱怨卡顿、掉帧，想看 FPS、draw call、三角形数或纹理/几何内存占用。
- 用户想在页面上点选物体、拖拽变换手柄，或要加光源、克隆/删除/聚焦对象、截图与查看统计。
- 宿主是一个单页 HTML、静态 demo 或没有构建工具的本地 three.js 页面，希望直接加个调试面板而不改架构。

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

## 提示词安装（用户说一句话就装）

用户不必记命令。下列说法都是「把这个 Skill 复制到某个 Agent 的技能目录」，由你代跑安装器。

| 用户说法 | 意图 | 动作 |
|---|---|---|
| 给我安装这个技能 / 安装 three-scene-debugger / 装一下这个技能 | 装到默认位置 | 写到当前项目的共享目录 `.agents/skills/three-scene-debugger` |
| 装到 Claude Code / Cursor / Codex / Copilot / Gemini / OpenCode | 指定 Agent | 加 `--agent <产品>` |
| 装到全局 / 所有项目都能用 | 用户级目录 | 加 `--global`，且该产品必须有文档化的全局目录 |
| 装到 `~/.workbuddy/skills` / 装到指定目录 | 自定义路径 | `--target <绝对路径>` |
| 升级这个技能 / 更新一下 | 覆盖 | 同命令加 `--force` |

执行步骤：

1. **确定来源**：本机已有仓库副本 → `node bin/three-scene-debugger.js install …`；没有 → 用 GitHub 说明符。
2. **确定目标**：从宿主线索判断当前 Agent（Claude Code 用 `.claude/skills` 且不发现共享目录；Cursor / Codex / Copilot CLI / Gemini CLI / OpenCode 走 `.agents/skills`）。**线索不足只问一次**，不要一次写进六个产品目录。
3. **执行**：

```sh
# 默认（共享发现目录，无交互）
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install

# 指定 Agent / 全局 / 自定义路径 / 覆盖升级
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent claude-code
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --global --agent gemini-cli
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target /abs/path/three-scene-debugger
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --force
```

4. **验证**：`--version` 打印 `0.10.2`；目标目录里有 `SKILL.md`、`dist/`、`references/`、`scripts/`。
5. **回报**：装到哪个路径、给哪个 Agent 用、怎么升级、怎么卸载（删目录）。装完若用户还要「用起来」，接着走「提示词接入」。

硬约束：

- **禁止** `npm install three-scene-debugger` 和裸 `npx three-scene-debugger`——本包不在 npm registry。
- 安装器**只复制文件**：不装 three、不启动面板、不改项目配置、不读凭证。不要顺手把运行库写进 `dependencies`；要接页面就走接入流程（`devDependency`）。
- 用户没说「全局」就不要加 `--global`；`--target` 不展开 `~`，先换成绝对路径。
- 已有非空目录不静默覆盖；内容相同会直接成功。目标拒绝时如实报告，不要绕过或用 `--force` 强推。
- 私有网络 / 代理拉不到 GitHub → 先 `git clone`，再用本地路径跑 `node bin/three-scene-debugger.js install`。

## 提示词接入（一句话启动）

用户不需要知道 API，也不该被反问「要不要装」。下列说法一律视为「把调试器接到当前项目」，直接按本节流程执行。

| 用户说法（含同义变形） | 意图 | 做什么 |
|---|---|---|
| 给我启动 3D 场景调试 / 启用 3D 场景调试 / 开启调试面板 / 启动 3D 场景调试大师 | 接入并运行 | 扫描项目 → 插入 DEV 分支 → 跑起来验证 |
| 3D 场景调试大师 / three-scene-debugger / 接入 three-scene-debugger / 加个 Three.js 调试面板 | 接入并运行 | 同上 |
| 我要调材质 / 调后期 / 查掉帧 / 点选不到东西 | 接入 + 具体任务 | **先接入**，再执行被点名的操作，不要只给 API 不给面板 |
| 关闭 / 卸载 / 别把调试器带进生产 | 移除 | 默认移除接入代码；仅当用户明确说「只是关掉面板」时才保留代码、调 `destroy()` |
| 检查 3D 场景调试接好没 / 调试器还在吗 | 只读检查 | 不改代码，输出检查结果 |

执行顺序固定，任一步失败就停下如实报告，不许猜、不许「先写上再说」：

1. **探测**：包管理器与构建工具（vite / webpack / umi / next / 无构建单页）、`three` 版本（`package.json` 或 import 语句）、是否已存在 `createSceneDebugger` 调用。已存在且能跑 → 跳过插入，进入第 5 步补缺。
2. **定位**：搜 `new THREE.WebGLRenderer` / `new Scene(` / `PerspectiveCamera`，确认 `scene` / `camera` / `renderer` 的作用域与生命周期。只用显式引用。
3. **选格式**：有打包器 → ESM + `import.meta.env.DEV`；纯静态 HTML / 无构建器 → UMD `scripts/three-scene-debugger.js`。
4. **插入**：单点初始化、最小 diff，不新增 render 循环，`tick` 挂在已有帧末尾；`controls` / `transformControls` / `bokehPass` 按项目实情注入，没有就不传，不为此新增依赖。
5. **验证**：dev 下按钮出现、面板能开、控制台无报错；再单独确认生产构建的产物里没有调试器。没验证到就写明没验证。
6. **回报**：改了哪个文件、插在第几行附近、验证了什么、怎么关。

硬约束：

- 已接入且可用 → **不重复插入**；只补确实缺的项（如补 `transformControls`、`assets`、`tick`）。
- 找不到 `scene` / `renderer` → 停下来讲清缺什么、给出候选位置。不许翻闭包、`window.__proto__`、React fiber 硬猜，也不许为了接入重构应用架构。
- 不改构建配置、不把调试器写进生产入口、不伪造验证结果。
- 不因为「是调试」就降低要求：`THREE` 必须复用宿主那份，`destroy()` 必须能被 HMR/卸载安全调用。

报告模板（照这个结构写，别写成散文）：

```
接入完成 · vite + three 0.169
改动：src/scene/init.ts:42-49  DEV 分支动态 import，传 scene/camera/renderer/THREE/controls
未传：transformControls（项目未安装 addon，需要拖拽手柄时再加）
验证：dev 下红色按钮已出现、面板可开；生产产物已检查，无调试器代码
关闭：删掉该 DEV 分支，或运行时 sceneDebug.destroy()
```

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
| UILayer | 内嵌原生 DOM/ShadowRoot；左上角常驻红色入口按钮「3D场景调试大师」（fixed、最高 z-index），按钮可拖动避让宿主 UI、面板标题栏可拖拽，位置与宽度记忆（双击复位）；无需 Tweakpane/lil-gui；Ctrl/Cmd+Z 撤销最近一条改动；本地输出、导入、复制、显式存储 |
| PostFX（0.9.0） | Bloom / 调色 / 暗角 / 色差 / 颗粒 / 锐化 / 描边 / 像素化 + 线框/法线/剪影视图；**有 `EffectComposer` 时接管已有 Bloom pass 或插入自己的 pass**，没有才走自研离屏链路；零 addon 依赖；0.10.2 增「自然柔和 / 电影感 / 霓虹夜景」一键风格预设 |
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
  transformControls: TransformControls,   // 可选：不传则只有选中高亮，没有拖拽；r169+ 内部用 getHelper()，旧版直接用对象本身
  lightHelpers: true,                     // 默认 true，为每个光源挂 helper
  assets: './assets/',                    // 可选：HDR 天空盒 + PBR 贴图素材库
  autoNear: true,                         // 可选：聚焦比相机 near 还小的物体时临时压低 near（默认 false，不动宿主相机）
  postfx: { enabled: false },             // 可选：覆盖后期默认值
  onSelect: obj => {}, onDeselect: () => {}, onToggle: open => {},
  onTransformStart: obj => {}, onTransform: obj => {}, onTransformEnd: obj => {},
});
```

| 能力 | API |
|---|---|
| 点选 / 高亮 / Esc 取消 | `setPicking(bool)`、`selectObject(objOrId)`、`getSelected()`、`clearSelection()`；**点场景树的一行 = 选中该对象 + 相机飞过去取景**，行会高亮 |
| 聚焦取景 | `focusObject(id, {instant, duration})`、`setFocusOnSelect(bool)`、`setFocusDuration(ms)`、`setAutoNear(bool)`；目标比相机 `near` 还小时自动临时压低 near，镜头拉远自动还原 |
| 拖拽模式 | `setTransformMode('translate'|'rotate'|'scale')`、`getTransformMode()`、`getGizmo()`；画布上 W/E/R 快捷键 |
| 编辑器动作 | `addLight(type, opts)`、`cloneObject(id)`、`removeObject(id)`、`focusObject(id)`、`setGridHelper(bool)`、`setAxesHelper(bool)`、`screenshot()`、`downloadScreenshot()`、`getStats()` |
| 光源辅助 | `setLightHelpers(bool)`、`setShadowHelpers(bool)`；helper 标 `userData.tsdIgnore`，不进场景树但可点选 |
| 环境贴图 | `setEnvironment('hdr:<id>'|'studio'|'sunset'|'night'|'white'|'gray'|'none')`、`setEnvBackground(bool)`、`getEnvironment()`；HDR 来自素材库，程序化预设零外部文件 |
| 后期处理 | `setPostFX(path, value)`、`getPostFX(path?)`、`previewPostFX(path, value)`、`resetPostFX()`、`setViewMode('final'|'wireframe'|'normal'|'flat')`、`exportPostFXMarkdown()`、`composerInfo()`（接管状态：mode / bloomIndex / helperIndex / linearOutput / bokeh） |
| 虚化（BokehPass） | `setPostFX('bokeh.enabled'|'bokeh.focus'|'bokeh.aperture'|'bokeh.maxblur', v)`、`focusBokeh()`（对焦到观察中心 / 选中物体）、`bokehInfo()`；需要宿主注入 `bokehPass: BokehPass` |
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

0.9.0 起分三条路，**先看场景有没有后期：有就接管，没有才自建**。

| 场景状态 | 面板「后期处理」页签做什么 | 关掉「接管」会怎样 |
|---|---|---|
| 有 `EffectComposer` + Bloom pass（`UnrealBloomPass` 或同字段的自定义 pass） | **接管**（默认就处于接管态）：`strength`/`radius`/`threshold` 直连该 pass，`Bloom 开关` = 它的 `enabled`；调色/暗角等另插一条 `TsdPostFXPass` 在编码 pass 之前 | 完全交还宿主：Bloom 的开关与强度/半径/阈值一起还原成接管前的值 |
| 有 `EffectComposer`、没有 Bloom | **插入**：勾选「启用后期处理」往 composer 的编码 pass 前塞一条 `TsdPostFXPass`，整条链路（Bloom + 调色 + 暗角…）由它画 | pass `enabled = false`，画面回到宿主原样 |
| 没有 `EffectComposer` | 走内置离屏链路（0.5.0 那套），patch `renderer.render` | 直接转调原 `renderer.render`，零开销 |

```js
sceneDebug.composerInfo();   // {mode:'attach'|'inject'|'off', bloomPass, bloomIndex, helperIndex, linearOutput}
sceneDebug.setPostFX('enabled', true);        // 接管 / 启用后期
sceneDebug.setPostFX('bloom.enabled', false); // 关掉场景真实存在的泛光
sceneDebug.setPostFX('bloom.threshold', 1.05); // 线性 HDR 空间：1.0 = 白点以上
```

- 注册方式不变：`registerPostProcessing(composer)`。不调用也会用 `options.composer` 或 `window.composer` / `finalComposer` / `effectComposer` 兜底探测（形状对得上才认）。
- **插进 composer 的 pass 必须输出线性值**：`TsdPostFXPass` 用 `compositeLinear` 变体（去掉 tone mapping 与 `colorspace_fragment`），编码交给链末 OutputPass / GammaCorrectionShader。反了就是「一开后期暗部全黑、只剩自发光」。
- 认编码 pass 不能只看类名：`ShaderPass(GammaCorrectionShader)` 的类名只剩 `ShaderPass`，还要看片元里有没有 `colorspace_fragment` / `sRGBTransferOETF`。认错位置会双重编码，画面整体发灰发白。
- 接管时参数是**从宿主读进来的**，所以勾「接管」画面不会跳；`resetPostFX()` 回到接管瞬间那组值，而不是硬编码默认值。
- 没有 Bloom 的场景默认给 `threshold 0.35 / strength 1.2`。阈值是线性 HDR 亮度，`1.0` 只让白点以上发光，暗场景（室内/夜景）开了会像没开，这时降到 `0.15–0.3`。
- **不再 patch `renderer.render` 去合成**：0.8.4 试过内联（渲进自己的 RT、写回宿主目标），在 MSAA + HalfFloat 中间目标上画面塌成黑屏，已回滚。composer 场景一律走插入 pass。
- 导出的修改提示词（底部大按钮 / `exportPostFXMarkdown()`）会带一节「后期链路（EffectComposer）」：pass 顺序、接管的是第几个 pass、附加 pass 该插在第几位、目标参数与编码约束。
- 开启后期后 `renderer.info.render` 只统计最后那趟合成，`getStats()` 已改用内部保存的场景那一趟数字，draw call 不会突然掉到 1。
- **总开关的默认值按模式走**：`attach` 注册完就是 `enabled === true`（参数是从宿主读来的，画面不会变，等于「接管」这件事本身）；`inject` 与无 composer 场景默认 `false`，避免页面一加载就被套上一层泛光、把基线改掉。
- **拖任意后期参数会自动打开总开关**（`ensureActive`）：`enabled === false` 时滑块能拖、数字在动、画面完全不动，是最糟的反馈。0.9.1 及之前 `attach` 默认关闭，`镜头与风格`（色差/颗粒/锐化/描边/像素化）全部被这层开关挡住，而 Bloom 三项因为直写宿主 pass 反而"能用"，于是表现得半好半坏。现在关着也能拖，拖哪个就自动接管。
- 关闭接管时 `applyComposer()` 连 `strength/radius/threshold` 一起还原，不是只还 `enabled`——否则 A/B 对比看到的是「宿主开关 + 面板强度」的混合体，不是宿主原样。

### 虚化通道（BokehPass）

面板里「虚化 · BokehPass 景深」是一组**独立通道**，默认关闭，不看后期总开关（无 composer 的离屏链路除外，那条路必须先启用后期）。

```js
createSceneDebugger({ ..., bokehPass: BokehPass });   // 必须注入：技能内不 import addon
tsd.setPostFX('bokeh.enabled', true);                 // 插 pass，默认参数按当前机位算
tsd.setPostFX('bokeh.focus', 5.34);                   // 世界单位的对焦距离
tsd.focusBokeh();                                     // 一键对焦到观察中心 / 选中物体
tsd.bokehInfo();                                      // {available, enabled, params, index, hostDof, mode}
```

- **注入原因**：`three/examples/jsm` 是 ESM addon，技能里 import 会把第二份 `three` 打进包（两套 `WebGLRenderTarget` / 常量互不认账）。所以和 `transformControls` 一样由宿主注入构造函数。
- 插入位置：`composer.passes` 里「附加调色 pass（`TsdPostFXPass`）、编码 pass」之前——即宿主 Bloom 之后。位置由 `indexOf` 动态算，不写死下标。
- 关闭 = `passes.splice(index,1)` + `pass.enabled=false`，**画面与没开过一致**，中间目标（`bokehRT`）也一起 dispose；`resetPostFX()` / `destroy()` 走同一条路。不要只用 `focus` 调远来「关」——深度 pass 仍在跑，开销不变。
- 摘除后**再勾开必须显式 `pass.enabled = true`**：`EffectComposer` 会跳过 `enabled === false` 的 pass，实例明明在链上却不渲染，表现就是「第二次开启没效果、再取消也没效果」（0.10.1 修）。`bokehInfo()` 因此分两个字段：`enabled` 是用户意图，`active` 是「此刻真的在出画面」；两者不一致时状态条直接提示。
- 参数默认值按机位算，不是 three 的默认 0.025：`focus = 相机到观察中心`，`aperture = maxblur / (0.5 × focus)`。原因是 `dofblur = clamp((focus - depth) * aperture, ±maxblur)` 里的 depth 是世界单位，而 three 默认值是给「场景约 1 单位」调的。本项目整场景 2 单位、相机在 5.3 外，照搬 0.025 会整屏一秒撞到 maxblur，看起来「糊成一片、没有层次」。**也不要用场景包围盒半径归一**：地面 + 天空球会把半径撑到 28.6，算出的光圈小到看不见。
- 首次勾开时若用户没手动调过参数，会按**当下机位**重算一次（composer 注册往往早于相机就位，`/detail` 实测注册时 focus=1、勾开时实际 13）。手调过就保留用户值。
- 每帧成本 = 一次全场景 `MeshDepthMaterial` 深度渲染（draw call 约翻倍）。宿主 composer 里已有景深 pass（如 `LizeDepthOfFieldPass`）时状态条会点名提醒，两层 DOF 叠加会互相糊。
- 导出：`exportPostFXMarkdown()` 在开启时会附一节「虚化通道（BokehPass 景深）」，写明装什么包、`import` 路径、插到 `composer.passes[n]`、当前四个参数（focus/aperture 保留 4 位小数）以及两种关闭写法。

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
12c. 后期链路：没有 composer 时只 patch `renderer.render`，不新增 RAF、不改宿主的 `toneMapping`/`outputColorSpace`；`enabled` 关闭时必须原样转调，保持零开销。有 composer 时**禁止再 patch 渲染路径做内联合成**（MSAA 中间目标会塌），只能用实现 pass 协议、插进 `composer.passes` 的方式，且必须输出线性值。禁止改回 `copyFramebufferToTexture` 抓帧方案（在 r160 + WebGL2 下帧内调用不稳定）。
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
