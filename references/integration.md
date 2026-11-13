# 接入与生命周期

## 设计边界

这是开发期调试面板，也是仓库根目录的 Agent Skill。内嵌原生 DOM UI，无 lil-gui/Tweakpane，发布的运行文件不内置第二份 Three。`scripts/three-scene-debugger.js` 是唯一核心源文件，UMD 可直接 script 加载，也可 CommonJS require。UMD 文件不能同时拥有原生 ESM named exports；`node scripts/build.cjs` 从同一实现自动生成 `dist/three-scene-debugger.mjs`（真正命名导出）及 UMD 副本。两个 dist 都是单文件、不依赖构建工具即可在页面运行。修改源文件后必须重新构建，不手改 dist。包通过 GitHub 分发，没有发布到 npm registry。

“零侵入”指无用户原型/渲染方法 monkey patch、无 userData 元数据、无自动源文件/存储写入、不接管 render 循环；用户主动操作当然会改变运行态及派生矩阵。destroy 默认不撤回主动修改、不 dispose 用户 geometry/material/texture/render target。

## 方式一：ESM（本地单文件）

```js
import * as THREE from 'three'; // 现有应用的同一份 Three
import { createSceneDebugger } from './three-scene-debugger/dist/three-scene-debugger.mjs';
const debug = createSceneDebugger({ scene, camera, renderer, THREE, controls,
  container: document.body, pixelRatioCap: 2 });
// 可选：在自己的每个实际渲染帧中调用一次。没有 tick 时 FPS 为 null。
function animate(now) {
  requestAnimationFrame(animate);
  controls?.update();
  renderer.render(scene, camera);
  debug.tick(now);
}
requestAnimationFrame(animate);
```

不要为了调试器新增第二个应用渲染循环。已有循环中加一行 `debug?.tick(now)` 即可；不加也能改属性，性能面板只显示 renderer.info 和估算，不谎称面板 RAF 就是渲染 FPS。暂停应用后 FPS 是最后一次样本，不是即时“0”；独立面板 RAF 仅每约 500ms 更新文字。

## 方式二：UMD script（也即本地单文件引入）

```html
<!-- Three、scene/camera/renderer 仍由应用自己提供；不强制全局 THREE -->
<script src="./scripts/three-scene-debugger.js"></script>
<script>
const debug = ThreeSceneDebugger.createSceneDebugger({ scene, camera, renderer, THREE });
</script>
```

UMD namespace：`globalThis.ThreeSceneDebugger`。自动发现只兜底读取 `window.scene/camera/renderer/THREE/controls`，不扫 DOM、React Fiber 或闭包。显式注入始终优先；相机是必需的。`THREE` 可省略：标量、现有 Color 编辑/资源操作可用；创建 Fog/Color、typed snapshot 恢复及相应 undo 建议始终传入同一份 namespace。

## 方式三：npm devDependency（本地路径或 GitHub，不是 registry）

不要声称 `npm install three-scene-debugger` 或裸 `npx three-scene-debugger` 能从 npm registry 成功。本包没有执行 `npm publish`。

```sh
# 本地路径。构建只用 Node 标准库，不安装第二份 Three。
npm run build
npm install -D /absolute/path/to/three-scene-debugger

# GitHub。说明符指向默认分支，该分支需要已经包含这份 package.json。
npm install -D github:8vdpxdrv4c-dot/three-scene-debugger
```

```json
{
  "devDependencies": { "three-scene-debugger": "github:8vdpxdrv4c-dot/three-scene-debugger" },
  "dependencies": { "three": "^0.187.0" }
}
```

`peerDependencies.three` 为 `>=0.160.0 <1`；按属性存在性生成控件，只有 r187 实测，宽 peer 区间不是逐版本认证。支持 `import {createSceneDebugger} from 'three-scene-debugger'` 与 `require(...)`。Git 安装会在打包前运行 `prepack`（即 `node scripts/build.cjs`）重新生成已提交的 dist。从 GitHub 用 npx 运行 CLI 时，npm 可能按 peerDependency 自动安装 three；那份 three 只出现在安装器的临时依赖里，不会被打进 dist，安装器也不会把它复制到 Skill 目录。

## 方式四：把 Skill 安装给 Agent

这条命令复制 Skill 文件，不启动浏览器 runtime，也不在目标项目执行 `npm install`。它不扫描项目来猜测该用哪一个 Agent，也不读取凭证。

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent claude-code
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent cursor,opencode
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --global --agent gemini-cli
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --list-agents
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target /absolute/path/to/three-scene-debugger
```

不带 `--agent` 时，项目目录是 `.agents/skills/three-scene-debugger`，`--global` 是 `~/.agents/skills/three-scene-debugger`。Agent Skills 规范只规定 Skill 目录内部要有 `SKILL.md`，没有规定必须放在 `.agents/skills`。下面这些产品的官方文档写了它们会发现这个共享目录：Cursor、Codex、GitHub Copilot CLI、Gemini CLI、OpenCode。Claude Code 的官方文档写的是 `.claude/skills` 与 `~/.claude/skills`，没有写 `.agents/skills`，所以默认安装不会放到 Claude 目录。

`--agent <id>` 可以重复，也可以用逗号分隔。每个 id 使用该产品文档中的目录，而不是一律写到 Claude。同一个目标路径只复制一次。`--target` 是任意目录，开头写 `~/` 时由安装器自己展开（cmd.exe 不展开波浪号），安装器不向任何 Agent 注册它；工具不会因此自动发现这个路径。仓库根目录的 `SKILL.md` 能被按根目录发现 Skill 的工具看到。路径表只是已知产品的默认值，**不是支持列表**：任何按目录加载 Skill 的 Agent 都可装，把 `--target` 指向它自己的 skills 目录即可，或手工复制 `SKILL.md` + `references/` 到该目录。安装器拒绝静默覆盖非空的无关目录，拒绝符号链接和逃出目标目录的路径。完整路径表和来源链接在 README，也可以运行 `--list-agents`。

## 确保生产构建剔除

```js
let debug;
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('three-scene-debugger');
  debug = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
// 已有 render 循环：debug?.tick(now)
// Vite HMR / 路由卸载：
if (import.meta.hot) import.meta.hot.dispose(() => { debug?.destroy(); debug = undefined; });
```

Webpack 等用其能常量折叠的 `process.env.NODE_ENV !== 'production'`，而不是运行时 URL 参数。只列为 devDependency **不等于**生产 bundle 会自动剔除；检查真实构建产物、network 和 DOM。script 部署应只在开发模板中插入。

## 准确 API

| API | 行为 |
|---|---|
| `createSceneDebugger({scene,camera,renderer,container?,THREE?,controls?,pixelRatioCap?,storage?,transformControls?,picking?,lightHelpers?,shadowHelpers?,envAsBackground?,logChanges?,onSelect?,onDeselect?,onToggle?,onTransformStart?,onTransform?,onTransformEnd?,onMode?})` | 初始化面板（默认关闭，只在左上角留红色入口按钮「3D场景调试大师」）并遍历一次；storage 可注入 Storage 同构对象 |
| `open()/close()/refresh()/isOpen()` | open 从关闭状态重开时遍历一次；close 隐藏面板并清空选中（点选/拖拽同时停用）；refresh 显式重建缓存树；isOpen 返回面板当前开关态 |
| `selectTarget(id)` | 必要时先打开面板、定位目标下拉、渲染属性并滚动到属性区；不重建场景树 |
| `set(target, propertyPath, value)` | target 为对象引用、target ID 或 Object3D uuid；返回改动记录或 null |
| `lookAt(cameraTarget,x,y,z)` | 原子记录 Euler rotation，可撤销 |
| `tick(timeMs?)` | 传用户渲染帧的高精度毫秒时间；不调用 render |
| `registerResource(textureOrMaterial)` | 加入 UUID 资源表；替换纹理下拉可选已加载 Texture；新建纹理请由应用负责加载/生命周期，然后刷新索引 |
| `registerPostProcessing(composer)` | 缓存 composer.passes，重注册可更新 Pass 列表；只检查注册时的参数 |
| `registerAnimationMixer(mixer, actions?)` | 建议显式 actions 数组；省略时兼容 `_actions`，这是不保证稳定的 Three 内部接口 |
| `undo(recordId)/clearChanges()` | 冲突检测撤销/重置记录基线，不恢复全部运行态 |
| `exportSnapshot()/loadSnapshot(objectOrJSON)` | 返回对象/逐条应用，恢复返回 `{applied,errors:[{index,message}]}` |
| `exportCode()/exportFullSceneJSON()` | 返回 JS 字符串/原始 scene.toJSON() 对象 |
| `saveSnapshot(name?)/loadSavedSnapshot(name?)` | 显式 localStorage 持久化，默认 name=manual，前缀 `tsd:snapshot:` |
| `destroy({clearStorage?:true})` | 幂等释放实例；clearStorage 清除此 origin 全部此前缀键，包括其他调试实例快照 |
| `setPicking(bool)` | 开关画布点选；关闭时清除当前选中 |
| `selectObject(objOrId)/getSelected()/clearSelection()` | 用对象引用、uuid 或唯一 name 选中；选中会展开面板并定位属性 |
| `setTransformMode(mode)/getTransformMode()/getGizmo()` | `translate` / `rotate` / `scale`；画布上 W/E/R 切换，Esc 取消选中 |
| `setLightHelpers(bool)/setShadowHelpers(bool)` | 光源 helper 与阴影相机 helper；默认开启，helper 可点选但不在场景树里 |
| `setEnvironment(id)/getEnvironment()/setEnvBackground(bool)` | 预设 `none` / `studio` / `sunset` / `night` / `white` / `gray`；PMREM 程序化生成，首次切换会记录原 environment/background，切回 none 恢复 |
| `preview(id,path,value)/commitPreview(id,path,value)` | 滑块拖动用：先实时写值，松手时以拖动前的旧值记一条改动 |
| `exportChangeMarkdown()` | 按对象分组的 Markdown 改动清单，含 `const target = ...` 定位表达式，可直接贴给 agent；同一对象同一属性多步改动只输出「首次旧值 → 最终值」一行 |

目标 ID：`object:<uuid>`（包含 scene/camera/light）、`material:<uuid>`、`texture:<uuid>`、`renderer`、`controls`、`pass:<index>`、`mixer:<registrationIndex>`、`action:<mixerIndex>:<index>`。共享材质/纹理按引用去重，定位到缓存中第一个拥有者。脱离场景后不能跨应用自动寻回：先刷新、注册资源，并检查恢复报告。

编辑器层（0.4.0）的对象归属：
- 选中包围盒、`TransformControls` gizmo 都标 `userData.tsdIgnore`，不进树、不参与拾取。
- 光源 helper 同时标 `tsdIgnore` 与 `tsdTarget=<light.uuid>`：不进树，但射线拾取会命中并映射回光源，因此可以直接点 helper 选中光源再拖拽。
- 环境贴图的 PMREM 渲染目标是技能自建的，`destroy()` 会 dispose；`scene.environment/background` 只在用户主动切换预设时改动，`none` 会恢复进入时的原值。

场景树默认从 scene 深度遍历。编辑器/调试用的辅助对象（`TransformControls` 的 gizmo、`BoxHelper`、临时 axes/grid）可设置 `object.userData.tsdIgnore = true`，该子树连同所有后代都不会进入场景树、目标下拉与属性检查，`refresh()` 后仍然跳过。调试器自身从不向用户对象写入 userData，只读取这一约定标记。

UI 包含一个常驻左上角的红色入口按钮「3D场景调试大师」（`position:fixed`、`z-index:2147483647`、ShadowRoot 内隔离）和由它开关的参数面板；面板标题栏可拖拽（限制在视口内，双击复位到默认右上角位置），默认关闭。面板内包含树、搜索、类型过滤、目标下拉、**属性 / 材质两个页签**（属性＝transform 等对象字段；材质＝常用参数快捷区 + 「全部材质参数」折叠区，材质数组带槽位下拉）、相机 lookAt、逐条撤销、按对象改动、JSON/代码/存档导出、输入快照恢复、本地显式保存/读取。可直接选择复制 textarea，Clipboard API 要求安全上下文和权限。CSS 在 ShadowRoot 中隔离；container 只决定挂载点，面板与入口按钮均为 fixed。

## destroy 清单与卸载验证

| 项目 | 清理动作 | 卸载后验证 |
|---|---|---|
| DOM | 删除自身 host 与 ShadowRoot 面板 | `[data-three-scene-debugger]` 数量减一；其他实例保留 |
| 事件 | 移除每个精确注册的 element/type/function；重绘子控件亦及时清理 | 留住旧 input 再 dispatch change 不改场景；无 document/window 全局监听 |
| 定时器 | 无 setInterval/setTimeout；取消自身 RAF | 测试 fake RAF 队列为空（或仅剩其他实例） |
| 对象引用 | 清空树、目标、资源 Map、改动/撤销引用、扩展、THREE/scene/camera/renderer/controls/UI 引用 | 实例字段置 null；不 dispose 用户资源 |
| 存储 | 默认不写、不删；只在显式保存或 clearStorage 操作 | 保留非 `tsd:snapshot:*` 键；二次 destroy 仍支持 clearStorage |
| 全局变量 | 不注册全局实例；UMD 最后一个实例销毁时仅当 namespace 仍是本库原引用才删除 | 两实例时先销毁一个仍可用；别人覆盖 namespace 不删除 |
| 原型/monkey patch | 默认零 patch（包括 render/traverse、OrbitControls、Three 原型） | 保存原方法比较严格相等；应用自己存的 debug 变量需自行清空 |
| 生产包 | 生命周期清理不能替代 DEV 条件编译 | 构建后搜索 namespace、面板文案、检查独立调试 chunk 不被包含/请求 |

destroy 保留 Storage 对象引用，仅为重复 `destroy({clearStorage:true})`；它不含场景/GPU 引用。UMD 无实例从未启动时不会自动删除静态库 namespace。宿主业务自己创建的事件、引用、定时器、资源与循环仍归宿主管理。没有卸载后恢复应用原状态的隐式行为；需要回滚先按逆序 undo，再 destroy。
