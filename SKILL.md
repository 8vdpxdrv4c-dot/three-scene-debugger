---
name: three-scene-debugger
description: >-
  当用户要求调试现有 Three.js 场景、运行时场景树、材质纹理/灯光阴影/相机与 OrbitControls
  调参、配置快照或调参代码导出、调试器卸载，或提到 three-scene-debugger、createSceneDebugger、调试面板、scene
  inspector 时使用。
---
# Three Scene Debugger

在现有 Three.js 页面中接入开发期运行时调试面板，检查场景树、实时修改渲染属性，把主动修改导出为精简快照或可粘贴源码。

## 何时使用

- 用户要求 Three.js 场景调试、运行时 inspector、场景树、材质/纹理/灯光/阴影调参、相机/OrbitControls 调整。
- 用户提到 `three-scene-debugger`、`createSceneDebugger`、“调试面板”“配置快照”“导出调参代码”“卸载调试器”。
- 在已存在的渲染循环中调参，需要保留可审计、可撤销的改动，且不想重写应用架构。

## 何时不使用

- 生产用户遥测/远程调试代理、完整 GPU profiler、自动修复源码或自动上传数据。
- 创建全新 Three 特效、设计整站 UI、离线模型编辑、任意私有节点材质图和自定义 Shader 全覆盖。
- 用户没有授权就释放其 GPU 资源、覆盖业务状态、改写 userData、把面板强行打包到生产。

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

`THREE` 是应用已有的同一 namespace，不能偷偷 import 第二份。标量编辑可不传，Fog/typed 恢复建议注入。`container`、`pixelRatioCap`、`storage` 可选。

UMD/script 单文件：

```html
<script src="./three-scene-debugger/scripts/three-scene-debugger.js"></script>
<script>
const sceneDebug = ThreeSceneDebugger.createSceneDebugger({ scene, camera, renderer, THREE });
</script>
```

ESM 与 UMD 是不同格式；UMD 源不能同时提供原生命名导出。`node scripts/build.cjs` 从同一核心生成 `dist/three-scene-debugger.mjs` 与 UMD 副本。不是“给 UMD 改扩展名当 ESM”。

## 安装 Skill 与安装运行库

`npx` 在这里只运行文件复制安装器，把本目录的 `SKILL.md`、`scripts/`、`dist/`、`references/`、`tests/` 等拷到 Agent 技能目录。它不把浏览器调试器当成命令执行，不启动面板，也不在目标目录安装 Three。

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
```

默认目录是当前项目 `.claude/skills/three-scene-debugger`。`--global` 安装到 `~/.claude/skills/three-scene-debugger`。`--target <目录>` 里的目录本身就是 Skill 根，直接包含 `SKILL.md`。已有非空目录不静默覆盖；内容相同则直接成功。只有已安装的本 Skill 才能用 `--force` 更新清单内的普通文件，且不删除无关文件、不覆盖符号链接。上述 GitHub 说明符指向仓库默认分支。

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
| UILayer | 内嵌原生 DOM/ShadowRoot；无需 Tweakpane/lil-gui；本地输出、导入、复制、显式存储 |
| 可选扩展 | registerPostProcessing(composer)、registerAnimationMixer(mixer, actions?)，无 composer/mixer 强依赖 |
| 生命周期 | 幂等 destroy，自己的 DOM/事件/RAF/引用/全局所有权精确清理，无用户方法 patch |

完整属性范围、单位、枚举、版本限制参见 [属性对照表](references/inspectable-properties.md)。所有枚举用当前应用 Three 常量的数值/字符串，不能从其他版本瞎猜。

## 操作与改动导出

- 用户在 UI 选择 Object3D/material/texture/renderer/controls/Pass/Action 目标即可修改；新资源由应用加载后 `registerResource(texture)`，刷新树后可检查纹理参数。
- API 示例：`sceneDebug.set(mesh, 'position.x', 2)`；`sceneDebug.lookAt(camera,0,0,0)`；`sceneDebug.undo(record.id)`。
- `exportSnapshot()` 只返回最终被修改的属性，等于基线的项移除；JSON.stringify 后复制。`loadSnapshot(json)` 返回 `{applied, errors}`，必须逐项检查错误，不能把部分成功当全部成功。
- `exportCode()` 优先 `scene.getObjectByName(...)`；空名/重名回退 UUID 并注释。代码需要已有 scene/camera/renderer/THREE；扩展上下文与资源 UUID 约定见 [改动协议](references/change-tracking.md)。不自动执行或写回源码。
- `exportFullSceneJSON()` 单独使用 `scene.toJSON()` 做存档兜底，不混入主快照格式，不保证函数/外部资源可恢复。
- 默认不写 localStorage；只有显式“保存本地”或 `saveSnapshot(name)`，统一键 `tsd:snapshot:*`。

## 卸载

```js
sceneDebug?.destroy();
sceneDebug = undefined; // 同时停止业务循环调用 tick
// 需要清除此 origin 的全部本库快照时，应在置空前调用：
// sceneDebug.destroy({ clearStorage: true });
```

destroy 幂等；清理本实例 DOM、监听、RAF、缓存、场景/renderer/扩展/撤销引用。默认不恢复用户主动修改，不 dispose 用户 GPU 资源、不停止业务 render 循环。没有默认 monkey patch。UMD 只在最后一个实例销毁且全局仍指向本库时移除 namespace；不删除其他实例/第三方值。Storage 对象为重复 clearStorage 请求有意保留，不含场景引用。

卸载验证表在 [integration.md](references/integration.md)。阴影 mapSize 在旧 Three/PointLight cube target 的资源失效涉及所有权，必须先读 [troubleshooting.md](references/troubleshooting.md)，禁止偷偷 dispose 用户 target。

## 给 Claude 的执行规则

1. 先查现有初始化、循环、资源所有权、Three 版本、卸载/HMR 时机；不因“调试”就改应用架构。
2. 核心实现只改 `scripts/three-scene-debugger.js`；维持 SceneDiscovery、SceneTreeBuilder、PropertyInspector、ChangeTracker、PerformanceMonitor、UILayer 分层；修改后重建两种 dist。
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
13. 所有持久化 opt-in，键统一 tsd:snapshot:*；destroy 可重复、安全清理，多实例不互相删 DOM/监听/全局引用。
14. 用户需要保留改动时先导出；不自动写源码、不自动发布 npm、不自动上传快照/完整场景。
15. 使用开发条件动态引入，检查真实生产包是否移除；devDependency 不等于构建剔除。
16. 运行 `tests/runtime.cjs` 与可用的 `tests/browser.cjs`；记录版本/结果。真实 GPU/WebGL/视觉没测就明确没测，不以 stub 冒充真实渲染验证。
17. 发生失败按排障索引定位，不用绕过路径校验/撤销冲突/权限保护来“修复”。

## 参考文件索引（按需加载）

- [references/integration.md](references/integration.md)：三种接入（含本地单文件）、npm、准确 API、生产剔除、destroy 清单和验证表。
- [references/inspectable-properties.md](references/inspectable-properties.md)：Object3D→Material→Texture→Light→Camera→Scene→Renderer→可选扩展的完整支持表。
- [references/change-tracking.md](references/change-tracking.md)：记录协议、深拷贝/资源、撤销冲突、精简快照与可执行代码模板、不可序列化约定。
- [references/troubleshooting.md](references/troubleshooting.md)：自动发现、纹理、阴影、遮挡、销毁残留及错误恢复。
- `scripts/three-scene-debugger.js`：单文件 UMD 核心；`scripts/build.cjs`：无构建工具的 ESM/UMD 格式生成。
- `dist/three-scene-debugger.mjs`、`dist/three-scene-debugger.js`：预生成可运行单文件。
- `tests/README.md`、`tests/runtime.cjs`、`tests/browser.cjs`：环境、结果与可复现验证。
