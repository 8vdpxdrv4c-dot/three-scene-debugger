# 验证记录与复现

## 0.8.4 真实宿主复测（2026-11-10，Windows）

在独立测试台 `E:\3D项目制作\three-skill-test` 建了 3 个架构不同的 Three.js 单页宿主（ESM+importmap / UMD 全局 / 多文件模块+动画+材质数组），另加一个 Three r168 旧版宿主。Chrome headless + SwiftShader，CDP 驱动：

- 运行时 **63/63 通过**：A 15、B 15、C 18、素材/HDR/窄屏 7、r168 7；页面 JS 异常 0。
- 触发覆盖 **8/14 → 14/14**：补了性能、点选拖拽/场景编辑、单页 demo 三类触发词。

发现并修复：

1. **r169+ TransformControls 崩溃**：`new TransformControls()` 返回的是 `Controls` 而不是 `Object3D`，`g.userData` 为 undefined，`selectObject()` 直接抛 `TypeError`。`SelectionLayer.ensureGizmo()` 改为 `typeof g.getHelper === 'function' ? g.getHelper() : g`；`visible` 与 `scene.add` 用 helper，`attach/setMode/detach` 仍用 controls；`destroy()` 移除 helper 并 dispose controls。r168 旧路径已回归。
2. **素材库异步竞态**：manifest 尚未加载完时 `setEnvironment('hdr:…')` 抛 `Unknown environment preset`，`applyAssetTexture()` 抛 `未知素材贴图`。`AssetLibrary.texture()/env()` 先 `await this.ready`；`SceneDebugger.setEnvironment()` 对 `hdr:` 前缀等待 `assets.ready` 后重试。
3. **description 触发词缺失**：FPS/draw call/三角形/显存、点选与拖拽手柄/加光源/克隆/删除/聚焦/截图、单页 HTML/静态 demo 宿主。

复现见测试台 `README.md`。仍未创建真实 `WebGLRenderer` 之外的 GPU 视觉断言；SwiftShader 只能证明链路与 DOM 行为。

## 本次仓库复核（2026-11-09）

- Linux，Node.js **v22.23.4**，npm **10.9.9**。
- 外部目录 `/tmp/tsd-test/node_modules` 里的真实 **three 0.187.0 / revision 187**、**jsdom 31.0.0**、**playwright 1.65.0**。仓库内没有 `node_modules`。
- Headless **Google Chrome 156.0.8078.47**，启动参数含 `--disable-gpu`。Playwright 只访问本进程 `127.0.0.1` fixture。
- `node tests/runtime.cjs`：**20 组通过**。场景对象、材质、纹理、相机、灯、AnimationMixer 是真实 Three；renderer 是带 `info` / `shadowMap` / `getPixelRatio` 的 stub。输出里 `webgl` 与 `visual` 都是 `NOT TESTED`。
- `node tests/browser.cjs`：**7 项 headless DOM 通过**（Shadow DOM 控件、数值 change、JSON 导出、名称搜索、代码输出、UMD/ESM 共存、destroy 清理）。没有 pageerror。同样没有 WebGL / 画面验证。
- `node tests/cli.cjs`：**11 组通过**，只用 Node 标准库。覆盖共享目录默认安装、六个文档中的 agent 的项目/全局路径、重复 agent、未知 agent、非 TTY、`--target`、已有目录拒绝、幂等、`--force`、符号链接和系统路径，以及 `npm pack` tarball 的真实 npx。默认安装不会创建 `.claude`。安装结果目录没有 `node_modules`。包版本 0.2.0。另一次手动 npx 观察到 npm 把 peer `three` 放进 npx 缓存，没有放进 Skill 目录。
- `node scripts/build.cjs` 重新生成的 UMD 与 `scripts/three-scene-debugger.js` 字节相同，ESM 与提交的 dist 字节相同。
- **没有 GPU 渲染验证，不能宣称阴影、纹理上传或后处理画面正确。**

复现：

```sh
npm test
mkdir -p /tmp/tsd-test
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --prefix /tmp/tsd-test three@0.187.0 jsdom@31.0.0 playwright@1.65.0
TSD_TEST_DEPS=/tmp/tsd-test/node_modules node tests/runtime.cjs
TSD_TEST_DEPS=/tmp/tsd-test/node_modules CHROME_BIN=/usr/bin/google-chrome node tests/browser.cjs
```

`npm test` 只跑安装器。`test:runtime` / `test:browser` 依赖上面的外部包，这些测试文件会随 Skill 复制，但 three、jsdom、playwright 不是本包依赖。`require('three')` 的 CommonJS deprecation warning 是测试导入方式，不是功能失败。

安装器测试会检查 `SKILL.md` 文件名大写、frontmatter `name: three-scene-debugger`、正文少于 500 行，以及 `references/`、`scripts/`、`dist/`、`tests/` 相对路径在安装结果里存在。

## 原先交付记录（2026-11-09，北京时间 UTC+8，Node v24.22.1）

- Linux box，Node.js **v24.22.1**。
- npm 安装的真实 **three 0.187.0 / revision 187**；**jsdom 31.0.0**。
- **Playwright 1.65.0**，`/usr/bin/google-chrome` headless，浏览器 **156.0.8078.47**。
- 依赖仅装在临时 `/workspace/tsd-test/node_modules`，交付目录没有 node_modules、没有引用第二份 Three 的运行时依赖。
- Playwright 仅访问本进程本地 HTTP fixture，程序化 DOM 断言，不操作桌面、不使用用户账号。

## 实测结果

`node tests/runtime.cjs`：**20 组通过**。

1. 初始化/重新打开/手动刷新之外无场景 traverse；tick FPS 与独立 UI RAF 分开。
2. Object3D 修改、深拷贝、原子 lookAt、旧记录不能覆盖新记录。
3. 真实材质/Color、共享资源、纹理 version 增量、替换和撤销原引用。
4. Perspective/Orthographic/shadow.camera 实际投影矩阵变化；pixelRatio cap、controls.update。
5. 原型污染路径/JSON key、无效 typed 值/非普通 JSON 实例拒绝。
6. 快照最终属性合并、回到基线移除、typed Color 恢复、资源缺失明确错误。
7. FogExp2 UI 类型切换和 density。
8. Pass/uniform 参数、真实 AnimationMixer/action weight/timeScale/paused。
9. 可执行赋值代码：唯一名、空/重名 UUID、材质/纹理、renderer/controls/Pass/action；使用 Function 执行本地可信输出并断言结果。
10. 重叠 fog 父子编辑合并、先子后父的根基线消除。
11. background Color→Texture→null、颜色控件、代码可在初始 background=null 执行。
12. matrixAutoUpdate=false 时变换生效；新纹理 needsUpdate。
13. 外部更新撤销冲突；Infinity 距离边界编辑、tagged JSON、恢复和代码。
14. jsdom 原生 change/search/filter/export 事件真实改变 Three 对象及输出。
15. scene.toJSON 独立存档；opt-in localStorage 前缀。
16. destroy：DOM、精确事件监听、RAF、对象引用、幂等 clearStorage、用户资源不 dispose、多实例隔离、无 Three 原型 patch。
17. CommonJS、AMD、UMD 浏览器全局、真正 ESM named import；重复载入不覆写已有全局。
18. UMD namespace 引用计数清理、多实例与外来全局保护。
19. 场景/相机角色、唯一命名 Object3D、材质/纹理父 locator 跨重建 UUID 恢复。
20. userData 中 `$type/isTexture/isColor` 等标签式 JSON 字段保持普通数据，无 needsUpdate 元数据副作用，支持快照/撤销/代码往返。

`node tests/browser.cjs`：**7 项 headless Chrome DOM 检查通过**：真实 Shadow DOM 控件、数值 change、JSON 导出、名称搜索、代码输出、UMD/ESM 共存、destroy 后旧 DOM 事件/host/global 清理。无 pageerror。经典 script fixture 必须以 UTF-8 提供（已修复测试服务器 charset；首次 fixture 编码错误导致中文 role 定位失败，修复后通过，不掩盖试验过程）。

另外验证：源 UMD、dist UMD、dist ESM `node --check`；构建 dist UMD 与核心完全相同。构建使用 Node 标准库，不需 bundler。

## 明确未验证

**没有创建真实 WebGLRenderer/上下文，没有 GPU 渲染/视觉人工验证。** renderer 为带 info/shadowMap/getPixelRatio/setPixelRatio 的测试 stub；相机、矩阵、材质、纹理、灯、mixer 是真实 Three 对象。headless Chrome 也只做 DOM 验证（启动时 disable-gpu），不能据此宣称 GPU 阴影/纹理上传/后处理画面正确。

未覆盖浏览器全版本、WebGPU、旧 Three 各版、PointLight cube shadow target 重建、真实资产网络/CORS、strict CSP、真实项目生产构建 tree-shaking。r187 的 shadow target resize 只做源码核对；旧版需资源所有者处理。内存值不是精确 GPU profiler。

## 可复现命令

在任意临时目录安装依赖，不要放交付目录：

```sh
mkdir -p /tmp/tsd-test
npm install --prefix /tmp/tsd-test three@0.187.0 jsdom@31.0.0 playwright@1.65.0
cd /path/to/three-scene-debugger
node scripts/build.cjs
node --check scripts/three-scene-debugger.js
node --check dist/three-scene-debugger.js
node --check dist/three-scene-debugger.mjs
TSD_TEST_DEPS=/tmp/tsd-test/node_modules node tests/runtime.cjs
TSD_TEST_DEPS=/tmp/tsd-test/node_modules CHROME_BIN=/usr/bin/google-chrome node tests/browser.cjs
```

无系统 Chrome 时可按 Playwright 官方流程安装 Chromium 并把 CHROME_BIN 指向可执行文件。测试包中 `require('three')` 会出现 Three 的 CommonJS deprecation warning，这是测试导入方式警告，不是功能失败；宿主推荐 ESM。安装版本未来不存在/变化时如实记录替代版本，不伪造测试通过。

## 生产部署前人工清单

- 只在应用现有循环 tick 一次，HMR/卸载先 destroy 并置空业务引用。
- 用真实 renderer 检查颜色空间、材质重编译、不同灯与 shadow.mapSize、纹理采样、camera/controls、后处理和动画画面。
- DEV 分支关闭后检查生产构建产物/network/DOM 无调试器。
- 安装此 skill 后确认 `SKILL.md` 为大写、frontmatter name/description 正确、正文少于 500 行。仓库里的 `tests/cli.cjs` 会检查这些约束；生产构建剔除仍要人工看真实产物。
