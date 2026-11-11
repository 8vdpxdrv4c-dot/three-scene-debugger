# 安装 three-scene-debugger

一个**仅用于开发环境**的 Three.js 场景调试器，同时是可被 Agent 发现的 Skill。
浏览器里点选物体、改参数、切材质、调后期，再把改动导出成可直接执行的 `tsd.*` 调用或发给 AI 的修改提示词。

| 项 | 值 |
|---|---|
| 仓库 | <https://github.com/8vdpxdrv4c-dot/three-scene-debugger> |
| 当前版本 | 0.10.1 |
| 许可 | MIT |
| 运行环境 | Node ≥ 18；宿主页面自带 `three` ≥ 0.160 且 < 1 |
| 分发方式 | GitHub（`main` 分支），**未发布到 npm registry** |

> 不要执行 `npm install three-scene-debugger`，也不要裸跑 `npx three-scene-debugger`。
> 本包不内置第二份 Three，运行时复用页面已有的 `THREE`。

---

## 一、安装 Agent Skill（推荐）

在**你的项目目录**执行：

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
- `--target` 只复制到该目录，**不代表任何 Agent 会自动发现它**；`~` 不会展开，请写绝对路径。
- 多个目标会先全部检查，任一拒绝则一个都不写。
- 安装后目录含 `assets/`（约 22 MB 的 CC0 HDR 与 PBR 素材）；整目录删掉不影响核心功能，只是少了素材网格。自制贴图库是程序化生成的，不依赖这些图片。

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

`--version` 应打印 `three-scene-debugger 0.10.1`。

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
| npx 拉到旧版本 | 加 `--yes`，或清 `~/.npm/_npx` 缓存，或写死 `#main` / commit；当前 `main` 就是 0.10.1 |
| 私有网络 / 公司代理拉不到 GitHub | 先 `git clone` 仓库，再用本地路径：`npm install -D /path/to/three-scene-debugger`，安装器用 `node bin/three-scene-debugger.js install` |
| 页面报 `THREE` 相关错误 | 传页面已有的同一份 `THREE`，不要 import 第二份 |
| 生产包里还带着调试器 | 确认 `import.meta.env.DEV` 分支被构建工具消除，检查产物 |
| 贴图库没图片 / 素材太大 | 自制贴图库不需要图片；`assets/` 可整目录删除 |
| Claude Code 找不到 Skill | 它不发现 `.agents/skills`，必须加 `--agent claude-code` |

更多：功能总览见 [README.md](README.md)，Agent 用法见 [SKILL.md](SKILL.md)，页面接入细节见 [references/integration.md](references/integration.md)，贴图库见 [references/textures.md](references/textures.md)。

---

## English quick start

```sh
# Agent Skill (shared discovery dir; add --agent claude-code for Claude Code)
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install

# Runtime library in your Three.js app
npm install -D github:8vdpxdrv4c-dot/three-scene-debugger
```

```js
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('three-scene-debugger/dist/three-scene-debugger.mjs');
  window.__tsd = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
```

Development only, MIT, Three ≥ 0.160 < 1 supplied by the host app. Not published to npm.
