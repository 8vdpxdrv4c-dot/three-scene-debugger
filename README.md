# three-scene-debugger

Development-only Three.js scene inspector，同时是仓库根目录可发现的 Agent Skill。面板在浏览器里检查场景树并导出调参结果；命令行安装器只把 Skill 文件复制到目标目录。

## 不是 npm registry 包

这个仓库没有执行 `npm publish`。下面两条都**不能**从 npm registry 安装：

- `npm install three-scene-debugger`
- `npx three-scene-debugger`

`npx` 在这里的作用是运行安装器，不是把浏览器调试器当成命令启动。安装器不执行项目脚本、不读取密钥、不打开网络，也不往 Skill 目录安装 Three.js。

## 安装 Agent Skill

默认分支包含本包之后，在项目目录执行：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
```

| 方式 | 结果 |
|---|---|
| 上面的命令 | 当前项目 `.claude/skills/three-scene-debugger/`，目录里直接有 `SKILL.md` |
| 加上 `--global` | `~/.claude/skills/three-scene-debugger/` |
| `--target <目录>` | `<目录>` 本身就是 Skill 根。路径按字面解析，不会展开 `~` |
| `--help` / `--version` | 只打印说明或版本，不写文件 |

`--global` 和 `--target` 不能同时用。已存在的非空目录不会被静默覆盖。文件与这次发布完全相同时，再次执行直接成功且不改写文件。内容不同时必须显式加 `--force`；`--force` 只替换本 Skill 清单里的普通文件，不删除无关文件，也不替换或跟随符号链接。目标路径上的符号链接、逃出目标目录的路径、以及系统目录会被拒绝。

仓库根目录的 `SKILL.md` 符合按目录发现 Skill 的布局（例如 `npx skills add 8vdpxdrv4c-dot/three-scene-debugger` 会看到根目录这份 Skill）。本仓库不依赖、也不调用那个第三方 CLI。

在默认分支更新前，`github:8vdpxdrv4c-dot/three-scene-debugger` 仍指向只有 README 的 `main`，上面的安装命令还不会装到本 Skill。合并后再用默认分支说明符。

## 实测

2026-11-09，Node v22.23.4 / npm 10.9.9。

本地 tarball（`npm pack` 后）退出码 0：

```sh
npx --yes --package=./three-scene-debugger-0.1.0.tgz three-scene-debugger install --target <dir>
npx --yes --package=./three-scene-debugger-0.1.0.tgz three-scene-debugger --version
```

`--version` 打印 `three-scene-debugger 0.1.0`。

GitHub 上本次分支也退出码 0。包只有一个 bin，所以短命令会直接跑这个安装器：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger#cursor/publish-skill-installer-b048 three-scene-debugger install --target <dir>
npx --yes github:8vdpxdrv4c-dot/three-scene-debugger#cursor/publish-skill-installer-b048 --version
npx --yes github:8vdpxdrv4c-dot/three-scene-debugger#cursor/publish-skill-installer-b048 install --target <dir>
```

短命令不带 `install` 时，`--help` 和 `--version` 只打印信息，不写文件。这几条都是安装器，不是浏览器调试器。

不带分支的默认说明符实测失败（退出码 254）：`main` 没有 `package.json`，npm 报 `ENOENT`。合并到默认分支之后，下面两条才会装到本包：

```sh
npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
npx --yes github:8vdpxdrv4c-dot/three-scene-debugger --version
```

裸 `npx three-scene-debugger` 没有测到可用的 registry 包，也不要这样写。GitHub npx 同样会把 peer `three` 放进 npx 缓存，不放进 `--target` 目录。

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

根目录就是 Skill：`SKILL.md` 保持大写，正文少于 500 行。`scripts/three-scene-debugger.js` 是唯一核心源文件；`node scripts/build.cjs` 用 Node 标准库生成 `dist/three-scene-debugger.mjs`（命名导出）和 UMD 副本。安装器会连同 `references/`、`dist/`、`scripts/`、`tests/` 和 `bin/` 一起复制。

Node.js `>=18`。安装器本身没有运行时依赖。

## 验证范围

`tests/runtime.cjs` 在真实 Three 对象上检查行为，renderer 是测试 stub。`tests/browser.cjs` 用 headless Chrome 做 DOM 断言，并关闭 GPU。两处都**没有**创建真实 WebGLRenderer，不能据此声称阴影、纹理上传或画面已经过 GPU 验证。记录见 `tests/README.md`。

```sh
npm test                  # 安装器，无额外依赖
npm run test:runtime      # 需要外部 three 与 jsdom，见 tests/README.md
npm run test:browser      # 另外需要 playwright 和 Chrome
```

## 许可

MIT，见 `LICENSE`。
