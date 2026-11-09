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

这条命令复制 Skill 文件，不启动浏览器 runtime，也不在目标项目执行 `npm install`。

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --global
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target /absolute/path/to/three-scene-debugger
```

默认目标是项目 `.claude/skills/three-scene-debugger`。`--global` 目标是 `~/.claude/skills/three-scene-debugger`。`--target` 给出的目录本身就是 Skill 根。仓库根目录的 `SKILL.md` 也能被 `npx skills add` 这类按目录发现 Skill 的工具看到；本仓库不依赖那个第三方 CLI。安装器拒绝静默覆盖非空的无关目录，拒绝符号链接和逃出目标目录的路径。

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
| `createSceneDebugger({scene,camera,renderer,container?,THREE?,controls?,pixelRatioCap?,storage?})` | 初始化打开面板并遍历一次；storage 可注入 Storage 同构对象 |
| `open()/close()/refresh()` | open 仅从关闭状态重开时遍历；refresh 显式重建缓存树；close 保留运行态 |
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

目标 ID：`object:<uuid>`（包含 scene/camera/light）、`material:<uuid>`、`texture:<uuid>`、`renderer`、`controls`、`pass:<index>`、`mixer:<registrationIndex>`、`action:<mixerIndex>:<index>`。共享材质/纹理按引用去重，定位到缓存中第一个拥有者。脱离场景后不能跨应用自动寻回：先刷新、注册资源，并检查恢复报告。

UI 包含树、搜索、类型过滤、目标下拉、属性编辑、相机 lookAt、逐条撤销、按对象改动、JSON/代码/存档导出、输入快照恢复、本地显式保存/读取。可直接选择复制 textarea，Clipboard API 要求安全上下文和权限。CSS 在 ShadowRoot 中隔离；container 只决定挂载点，面板默认 fixed。

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
