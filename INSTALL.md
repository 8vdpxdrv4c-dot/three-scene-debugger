# 安装 three-scene-debugger

一个**仅用于开发环境**的 Three.js 场景调试器，同时是可被 Agent 发现的 Skill。
浏览器里点选物体、改参数、切材质、调后期，再把改动导出成可直接执行的 `tsd.*` 调用或发给 AI 的修改提示词。

| 项 | 值 |
|---|---|
| 仓库 | <https://github.com/8vdpxdrv4c-dot/three-scene-debugger> |
| 当前版本 | 0.10.2 |
| 许可 | CC BY-NC 4.0（必须署名，禁止商用） |
| 运行环境 | Node ≥ 18；宿主页面自带 `three` ≥ 0.160 且 < 1 |
| 分发方式 | GitHub（`main` 分支），**未发布到 npm registry** |

> 不要执行 `npm install three-scene-debugger`，也不要裸跑 `npx three-scene-debugger`。
> 本包不内置第二份 Three，运行时复用页面已有的 `THREE`。

---

## 一、安装 Agent Skill（推荐）

也可以直接对 Agent 说一句，让它代跑下面的安装器：

| 你说 | 效果 |
|---|---|
| **给我安装这个技能** | 装到当前项目的 `.agents/skills/three-scene-debugger`；Claude Code 会改走 `--agent claude-code` |
| 装到 Claude Code / Cursor / 全局 / 指定目录 | 对应 `--agent`、`--global`、`--target` |
| 升级这个技能 | 同命令加 `--force` |

在**你的项目目录**执行（等价的命令）：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
```

不带 `--agent` 时写入 `.agents/skills/three-scene-debugger/`（Cursor、Codex、GitHub Copilot CLI、Gemini CLI、OpenCode 文档中的共享发现目录），无交互、非 TTY 也能跑。
安装器**只复制文件**：不安装 Three、不启动面板、不读取凭证、不改项目配置。

### 选择目标 Agent

```sh
# Claude Code（项目 .claude/skills）
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent claude-code

# 多个 Agent（逗号分隔，或重复 --agent）
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent cursor,opencode

# 全局目录
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --global --agent gemini-cli

# 自定义路径（WorkBuddy 用户用这个）
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

行为约定：

- 已有非空目录**不会静默覆盖**；内容相同则再次执行直接成功。
- `--force` 只替换本 Skill 清单里的普通文件，不删除无关文件，不覆盖符号链接。
- `--target` 只复制到该目录，**不代表任何 Agent 会自动发现它**；开头的 `~/` 由安装器展开（不依赖 shell），Windows 上也可以照抄上面的示例。
- 多个目标会先全部检查，任一拒绝则一个都不写。
- 安装后目录含 `assets/`（约 22 MB 的 CC0 HDR 与 PBR 素材）；整目录删掉不影响核心功能，只是少了素材网格。自制贴图库是程序化生成的，不依赖这些图片。

### 任意 Agent 都能装（上表不是白名单）

上面的 `--agent` 表只是**已知产品的默认路径速查**，不是支持列表。本 Skill 不绑定任何产品：Agent Skills 规范只要求「一个目录里有带 `name` / `description` frontmatter 的 `SKILL.md`」，目录位置由各产品自己规定。任何支持按目录加载 Skill 的 Agent 都能安装。

| 方式 | 命令 / 动作 | 适用 |
|---|---|---|
| ① `npx --target` | `npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target <该产品 skills 目录>/three-scene-debugger` | 通用首选；项目级 / 用户级路径都行，`~/` 自动展开 |
| ② 本地副本 | `git clone https://github.com/8vdpxdrv4c-dot/three-scene-debugger.git` → `node bin/three-scene-debugger.js install --target <目录>` | 内网、代理拉不到 GitHub、不想用 npx |
| ③ 手工复制 | 把仓库内容复制进该产品 skills 目录，文件夹命名 `three-scene-debugger/` | 完全不跑安装器 |

`<该产品 skills 目录>` 从该产品文档里的 `Skills` / `Agent Skills` / `技能目录` 一节查；注意区分项目级（`<项目>/.xxx/skills`）与用户级（`~/.xxx/skills`）。不确定就先跑 `--list-agents` 查已收录路径，没有再用 `--target`。已知示例：WorkBuddy 是 `~/.workbuddy/skills`，所以完整目标是 `~/.workbuddy/skills/three-scene-debugger`。

手工复制时的文件集合：

- 最小可用：`SKILL.md` + `references/` —— Agent 靠这两样即可读懂并执行本技能。
- 页面里要跑调试器：再加 `dist/` + `scripts/`；`assets/` 可选（约 22 MB，删掉不影响核心功能）。
- 想省事就复制整个仓库；不要只拷 `SKILL.md`，它会引用 `references/`。

边界：

- `--target` 只复制文件，**不向任何 Agent 注册发现路径，也不保证被自动发现** —— 这取决于该产品是否扫描你选的目录。
- 给多个产品各装一份，重复运行安装器即可；`--agent` 支持逗号列表，但 `--target` 不能与 `--agent` / `--global` 同用。
- 若某产品完全不支持按目录加载 Skill，把它当纯文本用：把 `SKILL.md` 内容贴进该 Agent 的规则 / 自定义指令。
- 安装器不会因为路径不在 `--list-agents` 表里就拒绝；它只拒绝系统目录、home 本身、符号链接和逃出目标的路径。

验证：目标目录含 `SKILL.md`；`--version` 打印 `0.10.2`；让该 Agent 说「检查 3D 场景调试接好没」能读到本技能。

### 一句话安装：发给任意 Agent 的提示词

**先分清两种场景**：「给我安装这个技能」这类口令只对**已经装了本 Skill 的 Agent** 有效——它读得到 `SKILL.md` 里的口令表。一个从没装过的 Agent 不知道这是什么、从哪拉、装到哪，所以要把上下文一起写进提示词。

**短版**（对方 Agent 会自己查路径时）：

```text
请安装 Agent Skill three-scene-debugger（3D 场景调试大师），来源 https://github.com/8vdpxdrv4c-dot/three-scene-debugger ，未发布到 npm registry。用 npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target <你的 skills 目录>/three-scene-debugger 装好，回报路径、升级方式和卸载方式。
```

**完整版**（推荐，自包含、不依赖对方已知任何约定）：

```text
请帮我安装 three-scene-debugger（3D 场景调试大师）这个 Agent Skill。

来源：https://github.com/8vdpxdrv4c-dot/three-scene-debugger
注意：它未发布到 npm registry，禁止 npm install three-scene-debugger，也不要裸跑 npx three-scene-debugger。

步骤：
1. 查你自己的文档，确定你加载 Skill 的目录（项目级或用户级都行）。不确定先跑：
   npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --list-agents
   这张表只是已知产品的默认路径速查，不是白名单；表里没有你的产品也照样能装。
2. 执行（把 <目录> 换成第 1 步的结果）：
   npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target <目录>/three-scene-debugger
   Claude Code 改用 --agent claude-code；WorkBuddy 的目标是 ~/.workbuddy/skills/three-scene-debugger。
   内网拉不到 GitHub：先 git clone 该仓库，再在仓库里跑
   node bin/three-scene-debugger.js install --target <目录>。
3. 验证：--version 打印 0.10.2；目标目录含 SKILL.md、references/、dist/、scripts/。
4. 回报：装到哪个路径、给哪个 Agent 用、怎么升级（同命令加 --force）、怎么卸载（删目录）。

约束：安装器只复制文件。不要安装 three、不要启动调试面板、不要改我的项目配置、
不要把运行库写进 dependencies。装完不要自作主张改我的 Three.js 代码，
等我明确说「给我启动 3D 场景调试」时再走接入流程。
```

**已装本 Skill 的 Agent 只需一句话**：

| 你说 | 效果 |
|---|---|
| **给我安装这个技能** / 安装 three-scene-debugger | 装到当前项目默认目录；Claude Code 自动改走 `--agent claude-code` |
| 装到 Claude Code / Cursor / 装到全局 / 装到 `~/.workbuddy/skills` | 加对应 `--agent` / `--global` / `--target` |
| 装到其它任意 Agent | 加上目标产品名或它的 skills 目录，Agent 会走 `--target` |
| 升级这个技能 / 检查装好没 | 加 `--force` / 只读检查 |

> 提示词里的 `<目录>` 是占位符，不是命令的一部分；`--target` 开头的 `~/` 由安装器展开，Windows 也能照抄。

### 装完怎么用：一句话

不需要自己找接入点，在 Agent 里直接说：

```text
给我启动 3D 场景调试
启用 3D 场景调试
3D 场景调试大师
```

Agent 会探测构建工具与 `three` 版本 → 定位 `scene/camera/renderer` → 插入 `import.meta.env.DEV` 分支 → 验证面板能开 → 回报改了哪个文件。已接入的项目只补缺失项，不会重复插入。

其余口令：`关闭 / 卸载 3D 场景调试`（默认移除接入代码）、`检查 3D 场景调试接好没`（只读检查）。
口令表与执行约束见 [SKILL.md](SKILL.md) 的「提示词接入」一节。

---

## 二、把运行库接进 Three.js 页面

这一步不是「安装 Skill」，而是让调试面板出现在你的页面里。

```sh
npm install -D github:8vdpxdrv4c-dot/three-scene-debugger
# 或用本地副本：npm install -D /absolute/path/to/three-scene-debugger
```

**ESM（推荐，开发条件引入）：**

```js
let sceneDebug;
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('three-scene-debugger/dist/three-scene-debugger.mjs');
  sceneDebug = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
// 已有渲染帧结束后可选一行；不要新增第二个 render 循环
// sceneDebug?.tick(now);
// 卸载 / HMR：sceneDebug?.destroy(); sceneDebug = undefined;
```

`THREE` 必须是页面**已有**的同一份 namespace。`container`、`pixelRatioCap`、`storage`、`assets` 可选。

**UMD / 单文件 script（无需打包器）：**

```html
<script src="./three-scene-debugger/dist/three-scene-debugger.js"></script>
<script>
  const sceneDebug = ThreeSceneDebugger.createSceneDebugger({ scene, camera, renderer, THREE });
</script>
```

要点：

- ESM 与 UMD 是不同格式，不能把 UMD 文件改扩展名当 ESM 用。
- 用构建期 DEV 分支，并检查生产产物里没有调试器（列为 devDependency 本身不保证剔除）。
- 打开面板后点选场景物体；面板左上角常驻红色入口「3D场景调试大师」，关闭面板即停用点选与拖拽。

---

## 三、验证安装

```sh
# 1. 安装器能跑、路径正确
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --version
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --list-agents

# 2. 目标目录里有 SKILL.md / dist / references
ls .agents/skills/three-scene-debugger

# 3. 页面里
#    左上角出现红色「3D场景调试大师」按钮 → 点开 → 选中物体 → 材质页 → 贴图库
```

`--version` 应打印 `three-scene-debugger 0.10.2`。

---

## 四、升级与卸载

| 操作 | 做法 |
|---|---|
| 升级 Skill | 再执行一次 `install`，加 `--force` 覆盖本技能的普通文件 |
| 固定版本 | 把说明符换成明确 ref：`github:8vdpxdrv4c-dot/three-scene-debugger#main` 或指定 commit |
| 卸载 Skill | 删除目标目录（如 `.agents/skills/three-scene-debugger`） |
| 卸载运行库 | `npm uninstall -D three-scene-debugger`，删掉 `createSceneDebugger` 调用并 `destroy()` |

---

## 五、常见问题

| 问题 | 处理 |
|---|---|
| `npm ERR! 404` / 装不到包 | 本包不在 npm registry，必须用 `github:` 说明符或本地路径 |
| npx 拉到旧版本 | 加 `--yes`，或清 `~/.npm/_npx` 缓存，或写死 `#main` / commit；当前 `main` 就是 0.10.2 |
| 私有网络 / 公司代理拉不到 GitHub | 先 `git clone` 仓库，再用本地路径：`npm install -D /path/to/three-scene-debugger`，安装器用 `node bin/three-scene-debugger.js install` |
| 页面报 `THREE` 相关错误 | 传页面已有的同一份 `THREE`，不要 import 第二份 |
| 生产包里还带着调试器 | 确认 `import.meta.env.DEV` 分支被构建工具消除，检查产物 |
| 贴图库没图片 / 素材太大 | 自制贴图库不需要图片；`assets/` 可整目录删除 |
| Claude Code 找不到 Skill | 它不发现 `.agents/skills`，必须加 `--agent claude-code` |
| 我的 Agent 不在 `--list-agents` 表里 | 用 `--target <该产品 skills 目录>/three-scene-debugger`；表只是已知默认值，不是白名单 |
| 装完 Agent 还是没发现 Skill | `--target` 不注册发现路径；确认该产品是否扫描这个目录，或项目级 / 用户级是否选错 |

更多：功能总览见 [README.md](README.md)，Agent 用法见 [SKILL.md](SKILL.md)，页面接入细节见 [references/integration.md](references/integration.md)，贴图库见 [references/textures.md](references/textures.md)。

---

## English quick start

```sh
# Agent Skill (shared discovery dir; add --agent claude-code for Claude Code)
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install

# Any other agent: point --target at that product's skills directory
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target ~/.your-agent/skills/three-scene-debugger

# Runtime library in your Three.js app
npm install -D github:8vdpxdrv4c-dot/three-scene-debugger
```

```js
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('three-scene-debugger/dist/three-scene-debugger.mjs');
  window.__tsd = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
```

Development only, CC BY-NC 4.0 (attribution required, commercial use prohibited), Three ≥ 0.160 < 1 supplied by the host app. Not published to npm.
