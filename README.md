# three-scene-debugger · 3D 场景调试大师

> 给现有 Three.js 页面插一块**仅开发期使用**的运行时调试面板：点选物体、改参数、换材质、调后期，改完把结果导出成可粘贴的源码或一段发给 AI 的修改提示词。
> 同时它也是一个可被 Agent 直接调用的 Skill——你说「帮我把泛光调弱一点」，Agent 知道用哪个 API、按什么顺序改。

## 为什么需要它

Vibe coding 3D 场景时，最贵的不是写代码，是**验证**：

- **画面是唯一反馈，但它不可读。** 灯光强度、`roughness`、bloom 阈值、相机位置、贴图 `repeat` 全是标量，代码里写 `1.2` 还是 `1.5` 只能靠猜。
- **一轮对话只能验证一个猜测。** 改一行 → 保存 → 等 HMR → 看画面 → 截图 → 描述给 Agent，一次迭代几十秒，猜中一个参数往往要好几轮。
- **描述损耗。** 「再亮一点点」「那面墙有点脏」变不成数值；Agent 拿不到 `name` / `uuid`，只能在 `scene.traverse` 里乱找。
- **token 花在往返上。** 每一轮都要把场景状态、报错、截图重新讲一遍，真正用于「改」的部分少得可怜。

这个技能把「猜」换成「点」：

| 原来 | 现在 |
|---|---|
| 改代码试参数，等构建看结果 | 拖滑块实时看画面，松手才记一条改动 |
| 用文字描述「哪个物体」 | 点选即定位，拿到准确的 name / uuid / 材质槽位 |
| 改坏了推倒重来 | 逐条撤销 + 冲突检测，试错成本接近零 |
| 多轮口述场景状态给 Agent | 一次 `aiPrompt()` 复制完整参数 + 定位代码块 |
| 让 Agent 猜数值 | 导出 `target.position.y = 2.45` 这种可直接执行的代码 |

省下的是两样东西：**时间**——一轮迭代从「几十秒」压到「一次拖动」；**token**——把多轮往返描述压成一次复制。

---

| 项 | 值 |
|---|---|
| 版本 | 0.10.2 |
| 许可 | **CC BY-NC 4.0**——必须注明出处、禁止商用，商业使用需另行授权 |
| 运行环境 | 宿主页面自带 `three` ≥ 0.160、< 1；Node ≥ 18（仅安装器需要） |
| 分发 | GitHub `main` 分支，**未发布到 npm registry** |
| 依赖 | 零 UI 依赖（不引 Tweakpane / lil-gui / dat.gui），不内置第二份 Three |

---

## 1. 它能做什么

一句话：**不用改架构，给已经跑起来的场景加一个 inspector。**

| 能力 | 说明 |
|---|---|
| **场景树** | traverse 出完整层级，name / 类型 / uuid、折叠、搜索、类型过滤；点一行 = 选中该对象 + 相机缓动飞过去取景 |
| **属性检查** | 变换、可见性、阴影标志、userData；材质、纹理、灯光、相机、场景、renderer 按类型给不同控件 |
| **实时调参** | 滑块负责探索、数字框负责精确值；字段名可按住左右拖动改值（Shift ×10 / Alt ×0.1），整段拖动只记一条改动 |
| **材质切换** | Standard / Physical / Phong / Lambert / Basic / Toon / Normal / Matcap / Depth / Shadow，材质数组按槽位，可选同步共用该材质的其他对象 |
| **程序化贴图库** | 12 套材质（橡木、红砖、清水混凝土、大理石、拉丝金属、六角砖、石板路、皮革、亚麻、沙地、锈蚀、水磨石），浏览器里用周期噪声现算**基础色 + 法线 + 粗糙度**，零图片、零请求、四边无缝 |
| **HDR 素材库** | 4 个 CC0 HDR 天空盒 + 1 个 LDR 环境 + 8 套 PBR 贴图，清单驱动、懒加载；删掉 `assets/` 也能用程序化环境 |
| **后期处理** | Bloom / 调色 / 暗角 / 色差 / 颗粒 / 锐化 / 描边 / 像素化 + 线框/法线/剪影调试视图。**页面已有 `EffectComposer` 就接管**（直连现成 Bloom pass 的开关与参数），没有才插自己的 pass，再没有才走内置离屏链路。另有三套一键风格：自然柔和 / 电影感 / 霓虹夜景 |
| **景深** | 独立 BokehPass 通道，按当前机位自动算 `focus/aperture`，关闭时整条 pass 摘除、中间目标 dispose |
| **性能** | 真实渲染 FPS、draw call、三角形数、纹理与几何内存估算（基于缓存的估算，不冒充精确显存） |
| **场景编辑** | 点选高亮、TransformControls 拖拽（W/E/R）、加光源、克隆、删除、聚焦、网格与坐标轴、光源/阴影 helper、截图与统计 |
| **改动追踪** | 每条改动深拷贝 old/new，逐条撤销、冲突检测；面板底部常驻「复制修改提示词」大按钮 |
| **导出** | 精简快照 JSON / 一个对象一段可执行代码 / 后期与环境导出成 `tsd.setPostFX(...)` / 直接发给 Agent 的修改提示词 |
| **生命周期** | 幂等 `destroy()`，精确清理自己的 DOM、事件、RAF、引用；不 dispose 用户的 GPU 资源，不 patch 用户方法 |

### 面板长什么样

- 页面左上角常驻一个红色按钮「3D场景调试大师」（`position: fixed`、最高 z-index），面板默认关闭。
- 按钮**可以拖走**（双击复位），面板拖标题栏也能换位置；按钮与面板的位置都会记住，换屏后自动夹回视口内。
- 点按钮开关面板；标题栏可拖拽到任意位置（限制在视口内），双击复位。
- 左边缘是宽度拖拽条（双击复位、宽度记忆），标题下方是「展开全部 / 收起全部 / 复位布局」快捷条。
- **只有面板打开时才允许点选与拖拽**，关闭面板同时清空选中。
- 快捷键：`W / E / R` 换手柄模式、`Esc` 取消选中、`Ctrl / Cmd + Z` 撤销最近一条改动（焦点在输入框里时不抢）。

---

## 2. 怎么用

### 2.1 说一句话就能接入

装了 Agent Skill 之后，不用自己找接入点。把需求直接说出来：

| 你说 | Agent 会做 |
|---|---|
| **给我启动 3D 场景调试** | 扫描项目 → 找到 `scene/camera/renderer` → 插入 DEV 分支 → 跑起来验证 |
| **启用 3D 场景调试** | 同上；已接入且能跑就只补缺失项（例如没注入 `TransformControls`） |
| **3D 场景调试大师** | 同上，「3D场景调试大师」就是面板入口按钮的名字 |
| **关闭 / 卸载 3D 场景调试** | 默认移除接入代码；只要求关面板时才 `destroy()` 保留代码 |
| **检查 3D 场景调试接好没** | 只读检查，不改代码 |

其它等价说法：`接入 three-scene-debugger`、`加个 Three.js 调试面板`、`装个场景 inspector`、`我要调后期`、`查一下掉帧`——后两种会先接入，再执行你点名的那件事。

Agent 的动作顺序是固定的：

1. 探测构建工具与 `three` 版本，确认有没有现成的初始化调用。
2. 找到 `scene` / `camera` / `renderer` 的定义处，只用显式引用。
3. 有打包器走 ESM + `import.meta.env.DEV`；无构建的单页走 UMD `script`。
4. 插入代码，不新增 render 循环，`tick` 挂在已有帧上。
5. 验证：按钮出现、控制台无报错、生产构建里确实没有调试器。
6. 回报：改了哪个文件、加在第几行附近、怎么关。

> 找不到 `scene` 就停下来给候选位置，不会去翻闭包或 React 私有数据硬猜；也不会为了接入改你的构建配置。

### 2.2 接进页面（三种方式，选一种）

**A. ESM + 构建期 DEV 分支（推荐）**

```sh
npm install -D github:8vdpxdrv4c-dot/three-scene-debugger
# 本地副本：npm install -D /absolute/path/to/three-scene-debugger
```

```js
let sceneDebug;
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('three-scene-debugger/dist/three-scene-debugger.mjs');
  sceneDebug = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
// 已有渲染帧里可选加一行，绝不新增第二个 render 循环
// sceneDebug?.tick(now);
// 卸载 / HMR：sceneDebug?.destroy(); sceneDebug = undefined;
```

**B. 直接引用预生成单文件**

```js
import { createSceneDebugger } from './three-scene-debugger/dist/three-scene-debugger.mjs';
```

**C. UMD / 无构建器的单页 HTML**

```html
<script src="./three-scene-debugger/dist/three-scene-debugger.js"></script>
<script>
  const sceneDebug = ThreeSceneDebugger.createSceneDebugger({ scene, camera, renderer, THREE });
</script>
```

> ESM 与 UMD 是两种格式，不能把 UMD 改扩展名当 ESM 用。
> `node scripts/build.cjs` 从同一份核心生成 `dist/*.mjs` 与 UMD 副本。

### 2.3 参数怎么传

```js
sceneDebug = createSceneDebugger({
  scene, camera, renderer, THREE,   // 必填：显式引用，THREE 用页面已有的同一份
  controls,                          // 可选：OrbitControls
  transformControls: TransformControls, // 可选：不传就只有选中高亮，没有拖拽手柄
  lightHelpers: true,                // 默认 true，为每个光源挂 helper
  assets: './assets/',               // 可选：HDR 天空盒 + PBR 贴图素材库
  autoNear: true,                    // 可选：聚焦比相机 near 还小的物体时临时压低 near
  postfx: { enabled: false },        // 可选：覆盖后期默认值
  bokehPass: BokehPass,              // 可选：景深通道需要宿主注入构造函数
  onSelect: obj => {}, onToggle: open => {},
});
```

几个刻意的设计：

- **`THREE` 必须复用宿主的同一份 namespace**。技能内部不 import addon（`TransformControls`、`BokehPass` 都由你注入），否则会打进第二份 `three`，两套 `WebGLRenderTarget` 和常量互不认账。
- **显式传 `scene/camera/renderer`**，`window` 全局只作兜底探测，不去翻 React 私有数据。
- **不新增 render 循环**，只在你的帧末尾调一次 `tick(now)` 拿真实 FPS。

### 2.4 常用操作

```js
// 选中与取景
sceneDebug.selectObject(mesh);
sceneDebug.focusObject(mesh.uuid, { instant: false, duration: 600 });
sceneDebug.setTransformMode('rotate');        // 画布上也支持 W / E / R
sceneDebug.addLight('directional', { intensity: 2 });
sceneDebug.screenshot();                      // 或 downloadScreenshot()

// 属性与撤销
sceneDebug.set(mesh, 'position.x', 2);
sceneDebug.undo(record.id);

// 后期
sceneDebug.setPostFX('bloom.threshold', 1.05); // 线性 HDR：1.0 = 白点以上
sceneDebug.setPostFX('bloom.enabled', false);
sceneDebug.composerInfo();                     // {mode:'attach'|'inject'|'off', ...}
sceneDebug.focusBokeh();                       // 对焦到观察中心 / 选中物体

// 环境与材质
sceneDebug.setEnvironment('hdr:venice_sunset');
sceneDebug.setMaterial(mesh.uuid, 'MeshPhysicalMaterial', { slot: 0, spread: true });
sceneDebug.applyTexturePreset(mesh.uuid, 'oak', {
  slots: ['map', 'normalMap', 'roughnessMap'], size: 512, repeat: 4
});
```

### 2.5 把改动带出浏览器

| 方法 | 产出 |
|---|---|
| `exportPrompt()` / 面板底部「复制修改提示词」 | 一段可直接发给 Agent 的修改提示词（含场景概览、目标定位、待应用改动；同一属性多步改动合并成「首次旧值 → 最终值」一行） |
| `aiPrompt(targetId?)` | 指令前言 + 场景概览 + 选中对象全部参数 + 定位代码块 + 待应用改动，写入输出框并自动复制 |
| `exportCode()` | 一个对象一段可执行代码：先 `const target = scene.getObjectByName("…")`，再逐条赋值，粘贴即生效 |
| `exportSnapshot()` | 只含最终被改动的属性、剔除等于基线的项，JSON 文本 |
| `exportChangeMarkdown()` | 带说明的改动清单，用于贴进 issue / PR |

后期、环境贴图、helper 开关这类不属于任何 `Object3D` 的编辑器动作，会导出成 `tsd.setPostFX(...)` / `tsd.setEnvironment(...)`，代码里的 `tsd` 指调试器实例。

> 默认不写 localStorage。只有你显式点「保存本地」或调 `saveSnapshot(name)` 才落盘，键统一为 `tsd:snapshot:*`。

---

## 3. 怎么安装

两条独立的安装线，别混：

| 你要什么 | 装什么 | 命令 |
|---|---|---|
| 让 **任意 Agent** 会调这个技能 | 安装 Agent Skill（复制 SKILL.md / references / dist 等文件） | 见 3.1，任意产品见 3.1.1 |
| 让 **页面** 出现调试面板 | 安装运行库（`devDependency`） | 见 3.2 |

`npx` 在这里只负责跑文件复制安装器：不安装 Three、不启动面板、不执行项目脚本、不读取凭证。

### 3.1 安装 Agent Skill

**也可以直接说一句话**，让 Agent 代跑安装器：

| 你说 | Agent 会做 |
|---|---|
| **给我安装这个技能** | 判断当前 Agent → 选对应目录 → 跑安装器 → 验证目录与版本 |
| 装到 Claude Code / Cursor | 加 `--agent claude-code` / `--agent cursor` |
| 装到全局，所有项目都能用 | 加 `--global`（该产品必须有文档化的全局目录） |
| 装到 `~/.workbuddy/skills` | 用 `--target`，`~/` 由安装器展开，无需自己换成绝对路径 |
| 装到其它任意 Agent | 说出产品名或它的 skills 目录，Agent 走 `--target` |
| 升级这个技能 | 同命令加 `--force` |

它不会一次写进六个产品目录，也不会顺手把运行库塞进 `dependencies`——安装 Skill 和接进页面是两件事。

> 上面的口令只对**已装本 Skill 的 Agent** 有效。要在一个从没装过的 Agent 里一句话装好，把自包含的引导提示词发给它，见 [INSTALL.md「一句话安装」](INSTALL.md#一句话安装发给任意-agent-的提示词)。短版：
>
> ```text
> 请安装 Agent Skill three-scene-debugger，来源 https://github.com/8vdpxdrv4c-dot/three-scene-debugger ，未发布到 npm registry。用 npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target <你的 skills 目录>/three-scene-debugger 装好，回报路径、升级方式和卸载方式。
> ```

在项目目录执行（等价的命令）：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
```

不带 `--agent` 时写入 `.agents/skills/three-scene-debugger/`（Cursor、Codex、GitHub Copilot CLI、Gemini CLI、OpenCode 文档里的共享发现目录），无交互，非 TTY 也能跑。

```sh
# Claude Code（它不发现 .agents/skills）
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent claude-code

# 多个 Agent
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent cursor,opencode

# 全局目录
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --global --agent gemini-cli

# 自定义路径（WorkBuddy 用户走这条）
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target ~/.workbuddy/skills/three-scene-debugger

# 查看全部支持的产品与路径
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --list-agents
```

| `--agent` | 项目目录 | 全局目录（`--global`） |
|---|---|---|
| 省略 / `agents` / `codex` | `.agents/skills/three-scene-debugger` | `~/.agents/skills/three-scene-debugger` |
| `claude-code` | `.claude/skills/three-scene-debugger` | `~/.claude/skills/three-scene-debugger` |
| `cursor` | `.cursor/skills/three-scene-debugger` | `~/.cursor/skills/three-scene-debugger` |
| `github-copilot` | `.github/skills/three-scene-debugger` | `~/.copilot/skills/three-scene-debugger` |
| `gemini-cli` | `.gemini/skills/three-scene-debugger` | `~/.gemini/skills/three-scene-debugger` |
| `opencode` | `.opencode/skills/three-scene-debugger` | `~/.config/opencode/skills/three-scene-debugger` |

行为约定：已有非空目录不静默覆盖；内容相同则直接成功；`--force` 只替换本技能清单内的普通文件，不删无关文件；多个目标先全部检查，任一拒绝则一个都不写；`--target` 里开头的 `~/` 由安装器自己展开（cmd.exe 这类不展开波浪号的 shell 也能照抄示例），但它不代表任何 Agent 会自动发现该目录。

### 3.1.1 任意 Agent 都能装（上表不是白名单）

上表只是**已知产品的默认路径速查**，不是支持列表。本 Skill 不绑定任何 Agent：Agent Skills 规范只要求「一个目录里有带 `name` / `description` frontmatter 的 `SKILL.md`」，这个目录放在哪由各产品自己规定。凡支持按目录加载 Skill 的 Agent 都能装，三条路任选：

**① 知道该产品的 skills 目录 → 直接指过去（推荐）**

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target <该产品的 skills 目录>/three-scene-debugger
```

`<...>` 换成该产品文档里的路径，项目级、用户级都行。例如 WorkBuddy 是 `~/.workbuddy/skills`，于是完整目标为 `~/.workbuddy/skills/three-scene-debugger`。`--target` 接受绝对路径、相对路径和 `~/...`（安装器自己展开），不校验它属于哪个产品，也不替你注册发现路径。给多个产品各装一份，重复运行即可。

**② 内网 / 不想走 npx → 本地仓库副本**

```sh
git clone https://github.com/8vdpxdrv4c-dot/three-scene-debugger.git
cd three-scene-debugger
node bin/three-scene-debugger.js install --target <该产品的 skills 目录>/three-scene-debugger
```

**③ 完全手工（不跑安装器）**

把仓库内容复制到该产品 skills 目录下、文件夹命名为 `three-scene-debugger/`。最小可用集合：`SKILL.md` + `references/`（Agent 靠这两样就能读懂并执行本技能）；要在页面里真正跑起调试器再加 `dist/`、`scripts/`，`assets/` 可选（约 22 MB，删掉不影响核心功能）。直接复制整个仓库最省事。

**怎么找这个目录**：查该产品文档里的 `Skills` / `Agent Skills` / `技能目录`，注意区分项目级（`<项目>/.xxx/skills`）与用户级（`~/.xxx/skills`）；先跑 `--list-agents` 看有没有已收录的路径，没有就用 `--target`。若某产品完全不支持按目录加载 Skill，把它当纯文本用：把 `SKILL.md` 内容贴进该 Agent 的规则 / 自定义指令。

**装完验证**：目标目录里有 `SKILL.md`；让该 Agent 说「检查 3D 场景调试接好没」能读到本技能。`--target` 只负责复制文件，**是否自动发现由该产品自己的目录约定决定**。

### 3.2 安装运行库

```sh
# GitHub（推荐）
npm install -D github:8vdpxdrv4c-dot/three-scene-debugger

# 本地副本 / 内网（先把仓库 clone 下来）
npm install -D /absolute/path/to/three-scene-debugger
```

也可以直接写进 `devDependencies`：

```json
{ "three-scene-debugger": "github:8vdpxdrv4c-dot/three-scene-debugger" }
```

**不要**执行 `npm install three-scene-debugger`，也不要裸跑 `npx three-scene-debugger`——本包不在 npm registry。

`devDependency` 不保证生产包剔除，必须用构建期 `import.meta.env.DEV` 分支，并检查产物里确实没有调试器代码。

### 3.3 怎么确认装好了

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --version   # three-scene-debugger 0.10.2
ls .agents/skills/three-scene-debugger                                                          # SKILL.md / dist / references / scripts
```

页面里：左上角出现红色「3D场景调试大师」→ 点开 → 点场景里的物体 → 属性页 / 材质页 / 贴图库。

### 3.4 升级与卸载

| 操作 | 做法 |
|---|---|
| 升级 Skill | 再跑一次 `install`，加 `--force` |
| 锁定版本 | 说明符带 ref：`github:8vdpxdrv4c-dot/three-scene-debugger#main` 或指定 commit |
| 卸载 Skill | 删除目标目录 |
| 卸载运行库 | `npm uninstall -D three-scene-debugger`，删掉初始化代码 |
| 运行时卸载 | `sceneDebug?.destroy()`（幂等，清理自己的 DOM/监听/RAF/引用，不动用户资源） |

---

## 4. 边界

**适合**：已跑起来的场景要调参、单页 HTML / 静态 demo 想加面板而不改架构、想查掉帧与 draw call、想把调参结果交回给代码或 Agent。

**不适合**：

- 生产环境的用户遥测、远程调试代理、完整 GPU profiler。
- 从零做 Three 特效、整站 UI 设计、离线模型编辑。
- 覆盖自定义 Shader 全链路（支持常用材质参数，不是着色器 IDE）。
- 未授权就 dispose 你的 GPU 资源、改写 `userData`、把面板强打进生产包。

---

## 5. 开发与验证

```sh
npm test               # 安装器用例，零额外依赖
npm run test:runtime   # 真实 Three 对象上的行为，renderer 为 stub
npm run test:browser   # headless Chrome DOM 断言，关闭 GPU
node scripts/build.cjs # 从核心源重建 dist/ 两种格式
```

`tests/runtime.cjs` 与 `tests/browser.cjs` **没有**创建真实 `WebGLRenderer`，因此不能据此声称阴影、纹理上传或画面已通过 GPU 验证。历史真实 WebGL 验证（SwiftShader 软件光栅化）覆盖核心功能 60/60、导出往返 17/17、跨场景巡检 56/56、自制贴图库 41/41，但软件光栅化不代表真实 GPU 性能与驱动兼容性。详见 [tests/README.md](tests/README.md)。

## 6. 目录结构

```
three-scene-debugger/
├── SKILL.md                     # Agent 入口（何时用、怎么接、规则与红线）
├── README.md                    # 本文件：能做什么 / 怎么用 / 怎么装
├── INSTALL.md                   # 安装细节：路径表、验证、升级、FAQ
├── scripts/
│   ├── three-scene-debugger.js  # 唯一核心源文件（UMD）
│   └── build.cjs                # 生成 dist/ 的 ESM 与 UMD 两种格式
├── dist/                        # 预生成单文件：.mjs（命名导出）+ .js（UMD）
├── bin/three-scene-debugger.js  # 安装器 CLI
├── references/                  # 按需加载：接入 / 属性表 / 改动协议 / 后期 / 素材 / 贴图 / UI / 排障
├── tests/                       # cli / runtime / browser 三套用例
└── assets/                      # 可选 CC0 素材（约 22 MB），可整目录删除
```

## 7. 文档索引

| 文档 | 内容 |
|---|---|
| [INSTALL.md](INSTALL.md) | 安装全流程、Agent 路径表、验证、升级、常见问题 |
| [SKILL.md](SKILL.md) | Agent 使用说明：触发场景、**提示词接入口令表**、接入流程、能力表、实现红线 |
| [references/integration.md](references/integration.md) | 三种接入方式、准确 API、生产剔除、destroy 清单 |
| [references/inspectable-properties.md](references/inspectable-properties.md) | Object3D → Material → Texture → Light → Camera → Renderer 完整支持表 |
| [references/postfx.md](references/postfx.md) | 后期链路、参数范围、阈值语义、与宿主后处理共存 |
| [references/textures.md](references/textures.md) | 12 套程序化贴图、三通道生成、无缝约束、法线方向 |
| [references/change-tracking.md](references/change-tracking.md) | 改动记录协议、撤销冲突、快照与代码模板 |
| [references/ui.md](references/ui.md) | 面板结构、交互细节、快捷键 |
| [references/troubleshooting.md](references/troubleshooting.md) | 自动发现、阴影、遮挡、后期黑屏、销毁残留 |

## 许可

**CC BY-NC 4.0**（Creative Commons Attribution-NonCommercial 4.0 International），全文见 [LICENSE](LICENSE)。

| 允许 | 必须 | 禁止 |
|---|---|---|
| 复制、分发、修改、二次创作 | 注明出处来源、保留版权与许可声明、标注是否修改 | 商业用途（含内置到对外销售的产品、SaaS、客户交付项目、付费内容） |

署名至少长这样，放在 README / 关于页面 / 源码头部任一处：

```text
three-scene-debugger (3D 场景调试大师) © 2026 three-scene-debugger authors
来源: https://github.com/8vdpxdrv4c-dot/three-scene-debugger
许可: CC BY-NC 4.0 — https://creativecommons.org/licenses/by-nc/4.0/
修改: 未修改
```

商业使用需事先取得书面授权，在 [Issues](https://github.com/8vdpxdrv4c-dot/three-scene-debugger/issues) 说明用途即可。**拿不准就先问，别默认可用。**

`assets/` 下的 HDR 与 PBR 素材是 CC0，不受本许可约束（来源见 [assets/CREDITS.md](assets/CREDITS.md)）；运行时复用的 three.js 按宿主应用自己的 MIT 许可处理。
