# three-scene-debugger

Development-only Three.js scene inspector，同时是仓库根目录可发现的 Agent Skill。面板在浏览器里检查场景树并导出调参结果；命令行安装器只把 Skill 文件复制到目标目录。

当前工作副本为 **0.8.0**：0.5.0 补上了**后期处理**与**素材库**两块能力，0.6.0 把面板本身按「能长时间用」重做了一遍，0.7.0 增加**材质切换**，0.8.0 增加**自制贴图库**。

- 面板左边缘是一条**宽度拖拽条**（双击复位），宽度存 localStorage；标题栏下方有「展开全部 / 收起全部 / 复位布局」快捷条；分组改成了带箭头的卡片。
- 所有滑块换成自绘轨道（填充进度 + 圆形拇指，拖动时放大发光），并把数值做成**可键入的数字框**：滑块负责探索，数字框负责精确值。
- 属性页的字段名可以**按住左右拖动改值**（Shift ×10、Alt ×0.1，整段拖动只记一条改动、一步可撤销），配「筛选属性」输入框和「移动/旋转/缩放」手柄模式按钮（与 W/E/R 等价）。
- 显示层去掉了浮点长串（最多 4 位小数）与数字框的上下箭头，宽面板下拉框不会跟着无限拉长。
- **自制贴图库**：12 套材质（橡木 / 红砖 / 清水混凝土 / 大理石 / 拉丝金属 / 六角砖 / 石板路 / 皮革 / 亚麻 / 沙地 / 锈蚀 / 水磨石）全部在浏览器里用周期噪声算出来，不读任何图片、不发网络请求。每套同时产出**基础色 + 法线 + 粗糙度**三张 `DataTexture`，方形四边无缝；面板抽屉按通道分组预览（基础色 / 法线 / 粗糙度 / 整套），可调平铺与尺寸，点图即写入材质槽位，一条改动、可撤销、导出成 `tsd.applyTexturePreset(...)`。
- 选中物体后可以在材质页把材质**换成另一种类型**（Standard / Physical / Phong / Lambert / Basic / Toon / Normal / Matcap / Depth / Shadow，材质数组按槽位）：新建实例、搬运颜色与贴图等参数、可选同步共用该材质的其他对象；一次切换记一条改动，可撤销，导出成一行 `tsd.setMaterial(target, "MeshPhysicalMaterial")`。

- 后期链路是自己实现的：场景先画到离屏 `WebGLRenderTarget`（HalfFloat 可选、4x MSAA），再阈值提取 → 4 级高斯模糊 → 合成（Bloom / 调色 / 暗角 / 色差 / 颗粒 / 锐化 / 描边 / 像素化），外加线框/法线/剪影调试视图。**不依赖 `EffectComposer`**，避免打包进第二份 Three；合成通道交给宿主 renderer 做色调映射与色彩空间编码，不自己造 ACES。关闭时直接转调原 `renderer.render`，零开销。
- 素材库随包分发 4 个 CC0 HDR 天空盒 + 8 套 PBR 贴图（`assets/`，约 22 MB，清单驱动、懒加载、可整目录摘掉）。HDR 解析是手写的 Radiance RGBE 解码，正确性用「解码字节数 == 文件字节数」硬校验。
- 编辑器补齐加光源 / 克隆 / 删除 / 聚焦、网格与坐标轴、截图与统计；面板仍是左上角常驻红色入口按钮「3D场景调试大师」，标题栏可拖拽、双击复位，只有面板打开时才允许点选与拖拽。
- 改动导出改成「一个对象一段可执行代码」：先 `const target = …`，再 `target.xxx = …`。后期/环境这类编辑器动作导出成 `tsd.setPostFX(...)` 这类调用。

接入方式见 `SKILL.md` 的「编辑器模式」「后期处理」「素材库」「自制贴图库」四节。

## 不是 npm registry 包

这个仓库没有执行 `npm publish`。下面两条都**不能**从 npm registry 安装：

- `npm install three-scene-debugger`
- `npx three-scene-debugger`

`npx` 在这里的作用是运行安装器，不是把浏览器调试器当成命令启动。安装器不执行项目脚本、不读取密钥、不打开网络，也不往 Skill 目录安装 Three.js。

## 安装 Agent Skill

合并到默认分支之后，在项目目录执行。不带 `--agent` 时没有交互，终端是不是 TTY 都一样：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
```

这会复制到 `.agents/skills/three-scene-debugger/`。指定 Agent、全局目录或自定义路径：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent claude-code
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent cursor,opencode
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --global --agent gemini-cli
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target ./my-skills/three-scene-debugger
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger --list-agents
```

`--agent` 可重复，或用逗号分隔。同一个目录只写一次。当前已发布的 `main`（0.1.0）仍默认写到 `.claude/skills`；上面的共享目录是本分支的行为，合并后才会成为默认说明符的结果。

| 选择 | 项目目录 | 全局目录（`--global`） | 官方文档 |
|---|---|---|---|
| 省略 `--agent` | `.agents/skills/three-scene-debugger` | `~/.agents/skills/three-scene-debugger` | 见下表“会发现共享目录”的产品。规范本身不规定这个路径：<https://agentskills.io/specification> |
| `claude-code` | `.claude/skills/three-scene-debugger` | `~/.claude/skills/three-scene-debugger` | <https://code.claude.com/docs/en/skills> |
| `cursor` | `.cursor/skills/three-scene-debugger` | `~/.cursor/skills/three-scene-debugger` | <https://cursor.com/docs/skills> |
| `codex` | `.agents/skills/three-scene-debugger` | `~/.agents/skills/three-scene-debugger` | <https://learn.chatgpt.com/docs/build-skills.md> |
| `github-copilot` | `.github/skills/three-scene-debugger` | `~/.copilot/skills/three-scene-debugger` | <https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills> |
| `gemini-cli` | `.gemini/skills/three-scene-debugger` | `~/.gemini/skills/three-scene-debugger` | <https://geminicli.com/docs/cli/skills/> |
| `opencode` | `.opencode/skills/three-scene-debugger` | `~/.config/opencode/skills/three-scene-debugger` | <https://opencode.ai/docs/skills/> |
| `--target <目录>` | 该目录本身 | 不使用 | 自定义路径。安装器不向任何 Agent 注册它 |

省略 `--agent` 时，文档写明会发现 `.agents/skills` 或 `~/.agents/skills` 的是 Cursor、Codex、GitHub Copilot CLI、Gemini CLI 和 OpenCode。Claude Code 的文档没有写这个目录，所以默认安装不会放进 `.claude`。Cursor 的文档同时加载 `.agents/skills` 和 `.cursor/skills`；`--agent cursor` 写的是后者。Codex 当前文档的发现位置就是 `.agents/skills`，不是旧的 `.codex/skills`。Copilot CLI 也接受 `.agents/skills` 和 `~/.agents/skills`，`--agent github-copilot` 写的是文档里列出的 `.github/skills` 与 `~/.copilot/skills`。Gemini CLI 在同一层级里让 `.agents/skills` 优先于 `.gemini/skills`。OpenCode 还会从 `.opencode/skills` 和 `~/.config/opencode/skills` 加载，并且优先级高于共享目录。

没有在上述文档里看到全局目录的 Agent 会直接报错，不会改写到 Claude 的全局目录。这次列出的六个产品都有文档中的全局目录。安装器不扫描项目，不读取凭证，也不默认把同一份 Skill 写进每一个产品目录。

已有非空目录不静默覆盖。内容相同则再次执行直接成功。`--force` 只替换本 Skill 清单里的普通文件，不删除无关文件，也不替换或跟随符号链接。多个目标会先全部检查，任一拒绝则一个都不写。

`--target` 不展开 `~`。把文件放到自定义目录不等于 Cursor、Claude Code 或其他工具会自动发现它。

`npx` 仍然只运行安装器。没有发布到 npm registry，裸 `npx three-scene-debugger` 不可用。npx 可能把 peer `three` 放进自己的缓存，不会放进 Skill 目录。

仓库根目录有 `SKILL.md`，所以按根目录发现 Skill 的工具能看到它。2026-11-09 用第三方 CLI 对当时的 `main` 实测：`npx --yes skills add 8vdpxdrv4c-dot/three-scene-debugger --list` 找到 `three-scene-debugger`；`npx --yes skills add 8vdpxdrv4c-dot/three-scene-debugger -a cursor -s three-scene-debugger -y --copy` 退出码 0，并把文件复制到 `./.agents/skills/three-scene-debugger`。这只说明该 CLI 的 Cursor 项目安装使用共享目录，不是所有 Agent 的唯一路径，也没有启动这些 Agent。本仓库不依赖这个 CLI。

本分支 `cursor/multi-agent-skill-install-b048` 用全新 npm 缓存实测，退出码都是 0，装到的 `package.json` 版本是 0.2.0：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger#cursor/multi-agent-skill-install-b048 three-scene-debugger --version
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger#cursor/multi-agent-skill-install-b048 three-scene-debugger install
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger#cursor/multi-agent-skill-install-b048 three-scene-debugger install --agent claude-code --agent opencode
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger#cursor/multi-agent-skill-install-b048 three-scene-debugger install --target <dir>
```

第一条打印 `three-scene-debugger 0.2.0`。第二条只创建 `.agents/skills/three-scene-debugger`，没有创建 `.claude`。第三条分别创建 `.claude/skills/three-scene-debugger` 和 `.opencode/skills/three-scene-debugger`，没有再写共享目录。第四条只创建 `--target` 目录。合并前不要用无 ref 的说明符来获得这套路径；当前 `main` 仍是 0.1.0。

## 把运行库装进应用

宿主自己安装 Three。本包的 `peerDependencies.three` 是 `>=0.160.0 <1`，`dependencies` 为空。`dist/` 与 `scripts/three-scene-debugger.js` 都不包含第二份 Three。实测用本地 tarball 执行 `npx --yes --package=<tarball> three-scene-debugger install` 时，npm 会把 peer `three` 下载到 npx 自己的缓存（`~/.npm/_npx/.../node_modules/three`）。安装器不读取、不执行这份 three，也不会把它复制进 Skill 目标目录；目标目录没有 `node_modules`。

本地路径：

```sh
npm install -D /absolute/path/to/three-scene-debugger
```

GitHub（同样要等默认分支包含 `package.json`）：

```sh
npm install -D github:8vdpxdrv4c-dot/three-scene-debugger
```

也可以写进应用的 `devDependencies`：`"three-scene-debugger": "github:8vdpxdrv4c-dot/three-scene-debugger"`。devDependency **不会**自动从生产包移除。只在 DEV 分支里动态引入，并检查生产产物、network 和 DOM：

```js
let sceneDebug;
if (import.meta.env.DEV) {
  const { createSceneDebugger } = await import('three-scene-debugger');
  sceneDebug = createSceneDebugger({ scene, camera, renderer, THREE, controls });
}
// 在已有渲染帧结束后可选调用，不要新增第二个 render 循环：
// sceneDebug?.tick(now);
```

`THREE` 必须是应用里已有的那一份 namespace。UMD 页面用 `scripts/three-scene-debugger.js`（或 `dist/three-scene-debugger.js`）里的 `ThreeSceneDebugger.createSceneDebugger`。接入、API、卸载和排障仍以 `references/` 为准。

## 布局

根目录就是 Skill：`SKILL.md` 保持大写，正文少于 500 行。`scripts/three-scene-debugger.js` 是唯一核心源文件；`node scripts/build.cjs` 用 Node 标准库生成 `dist/three-scene-debugger.mjs`（命名导出）和 UMD 副本。安装器会连同 `references/`、`dist/`、`scripts/`、`tests/`、`bin/` 和 `assets/` 一起复制；`assets/`（约 22 MB 的 CC0 素材）是可选的，删掉它安装器照样工作，只是少了 HDR 天空盒与贴图网格。

Node.js `>=18`。安装器本身没有运行时依赖。

## 验证范围

`tests/runtime.cjs` 在真实 Three 对象上检查行为，renderer 是测试 stub。`tests/browser.cjs` 用 headless Chrome 做 DOM 断言，并关闭 GPU。两处都**没有**创建真实 WebGLRenderer，不能据此声称阴影、纹理上传或画面已经过 GPU 验证。记录见 `tests/README.md`。

0.5.0 开发期间另外跑了一套**真实 WebGL**的验证（Playwright + Chromium，`--use-angle=swiftshader`，4 个自制大场景：影棚、夜间城市、太阳系、画廊）：

| 套件 | 内容 | 结果 |
|---|---|---|
| 核心功能 | 60 项：树/属性/质感/撤销/快照/导出/点选/后期/统计/销毁 | 60/60 |
| 导出往返 | 17 项：A 页改 → 抽代码块 → B 页执行 → 11 个状态字段比对 + 幂等 | 17/17 |
| 跨场景巡检 | 56 项：4 场景 × 点选/高亮/手柄拖拽/后期/视图/resize/销毁 | 56/56 |
| 50 轮自测 | 50 项：4 场景 × 12 轮 + 主测试页 + 素材库完整性 | 50/50 |
| 自制贴图库 | 41 项：12 套预设 / 缩略图 data URL / 整套与单通道写入 / 色彩空间 / 法线起伏 / 平铺 clone 隔离 / 撤销 / 导出 / 槽位通道映射 / 深色与 430px 窄屏 / 实拍变化 | 41/41 |
| 安装器 | node 标准库用例（本机无法建符号链接、无 npm/tar，2 项显式跳过） | 9 passed / 2 skipped |

SwiftShader 是软件光栅化，能验证「画面确实变了、颜色分布合理、目标尺寸跟随 resize」，但**不能**代表真实 GPU 上的性能与驱动兼容性。

```sh
npm test                  # 安装器，无额外依赖
npm run test:runtime      # 需要外部 three 与 jsdom，见 tests/README.md
npm run test:browser      # 另外需要 playwright 和 Chrome
```

## 许可

MIT，见 `LICENSE`。
