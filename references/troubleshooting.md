# 排查手册

## 自动发现失败 / 没有相机

1. 全局兜底只识别 `window.scene`, `window.camera`, `window.renderer`（以及 THREE/controls）；ESM 顶层 const、闭包、React ref 不在 window。
2. 在场景与 renderer 初始化完、DOM 可挂载后，显式 `createSceneDebugger({scene,camera,renderer,THREE,controls})`。
3. scene 必须是 Scene、camera 必须是 Camera；不要把 canvas 当 renderer。SSR 环境先等客户端挂载。
4. npm/ESM 用 `dist/...mjs`，script 用 `.js`；UMD 不能原生命名 import。修改核心后运行 build。
5. 不扫描全局对象猜测私有场景、不 patch render 捕获场景、不在 production 强行注入。

## 树不见新对象 / 名称错误 / 共享材质修改范围太大

1. 场景树不每帧遍历，这是刻意的性能约束。打开面板或按“刷新场景树”。
2. 清空名称搜索和类型过滤；类型区分大小写是 Three type，名称搜索不区分大小写；祖先作为导航仍可显示。
3. 对象名不唯一会回退 UUID，这是预期；要生成可迁移的源码先用业务稳定唯一名称、再刷新。
4. 材质/纹理按引用去重。共享资源修改会影响所有拥有者；需要隔离请由业务明确 clone/分配资源，再刷新。调试器不擅自 clone GPU 资源。

## 纹理不更新 / 下拉没有新纹理

1. 检查该材质类型是否真的使用此槽位（map、normalMap、envMap 等），目标是否选对材质或 texture。
2. Texture target 修改会 needsUpdate，材质槽替换会 material.needsUpdate 且新 texture.needsUpdate；测试 texture.version 递增，而不要读 needsUpdate（通常是 setter）。
3. 先由应用加载纹理，`debug.registerResource(texture)`，需要纹理独立参数控件时再按刷新；引用不存在会在 loadSnapshot 报 Unresolved resource，不会自动生成空图。
4. repeat 通常需要 wrapS/T=THREE.RepeatWrapping；rotation 是弧度，center 影响旋转。matrixAutoUpdate=false 时业务要维护 texture.matrix。
5. 检查 CORS、image decode、colorSpace、UV/channel、法线图方向、采样器 filter 合法性与版本约束；不同于简单 needsUpdate 的格式/维度变化必须由资源所有者重建。
6. HDR environment/PMREM：0.5.0 起调试器自带素材库（`assets:` 参数，手写 Radiance RGBE 解码 + `PMREMGenerator`），程序化预设仍是零外部文件的兜底；业务自己加载的 HDR 仍由业务维护，不走这条链路，也不把普通色图一键伪装 HDR；不在调试器里加载第二份 Three。

## 阴影不生效 / mapSize 修改后不变

1. renderer.shadowMap.enabled、light.castShadow、物体 castShadow、接收面 receiveShadow 都要启用；灯类型需支持阴影。
2. 检查 shadow.camera near/far/left/right/top/bottom 或 fov 是否覆盖目标；调试器更新 projectionMatrix；业务可临时用 CameraHelper，但助手不得偷偷留在用户场景。
3. bias/normalBias 太大导致阴影消失；radius/PCF/VSM 行为不同；光位置和 target、透明材质、缩放和法线也影响结果。
4. 调试器设置 renderer.shadowMap.needsUpdate，mapSize 另设置 light.shadow.needsUpdate；实际渲染仍需业务下一帧 renderer.render。
5. mapSize 应为设备能力内的 2 的幂（UI 接受正整数，业务负责合理范围）。不要默认生成超大 target。
6. **r187 的非 cube shadow.map** 在 WebGLShadowMap render 中原生 `setSize`，引擎负责 GPU 旧附件处理；调试器自身不 dispose。旧版和 PointLight cube target 可能没有此路径，面板给出兼容性警告；没有真实 WebGL 测试不能宣称所有版本已验证。
7. 如所用引擎确需重建 target，先获得资产所有者明确许可，在应用自己的代码里处理：

```js
// 用户明确同意释放旧 shadow targets 后，在非 render 中间执行；不是调试器默认行为。
const shadow = light.shadow;
const oldMap = shadow.map, oldPass = shadow.mapPass;
shadow.map = null;
shadow.mapPass = null;
if (oldMap) oldMap.dispose();
if (oldPass && oldPass !== oldMap) oldPass.dispose();
shadow.needsUpdate = true;
renderer.shadowMap.needsUpdate = true;
```

调试器不把这些只读/内部 target 纳入普通属性记录，也不承诺撤销 GPU dispose；主动 mapSize 改动本身有记录和可撤销数值。没有用户许可不要执行上述资源释放。

## 面板被遮挡 / 按钮不可点 / 太小

1. 默认 ShadowRoot 隔离 CSS，fixed 位置、z-index=2147483647。检查宿主 container 是否在 hidden/transform/overflow/低层叠上下文中；优先 document.body。
2. fullscreen 顶层/模态 dialog 会高于普通 z-index；将 container 显式设到 fullscreen 元素/dialog 内，或退出全屏。别偷偷修改用户的全屏状态。
3. CSP 可能禁止内联 style；配置开发期样式策略或由项目审核增加 nonce/外部样式。此单文件版本不冒称兼容所有 strict CSP。
4. 代码中使用 textContent，不把 name/userData 插入 innerHTML；字符串不执行。Clipboard API 需要 HTTPS/localhost 及权限，否则手动选中输出复制。
5. 任意数字输入使用 Three 常量数值；如不知值，在控制台查当前应用 THREE.RepeatWrapping/ACESFilmicToneMapping 等，不复制其他版本常量表。

## 相机/材质每帧跳回 / FPS 不准

1. 业务动画、AnimationMixer、OrbitControls、React props 可以每帧覆盖你刚编辑的状态；调试器不接管这些所有权。先明确暂停对应业务更新，或调整 controls.target/action 权重。
2. lookAt 在父变换或 controls 下效果受坐标语义影响；lookAt 是目标世界坐标，rotation 是局部 Euler，单位是弧度。
3. 不调用 tick 时 FPS=null；仅在用户真实帧完成后 tick 一次，timestamp 单位毫秒且单调递增。面板 RAF 不当成 FPS。停止应用后显示末次样本而非实时零。
4. renderer.info 默认每次 render 重置，多 Pass 场景当前 calls/triangles 未必是完整帧总和；由业务配置 info.autoReset，调试器不偷偷改。
5. 显存值仅缓存范围/CPU 数据基础层估算，不包含完整 GPU 资源、mips、compression、driver、render targets；不要拿它做精确 GPU profiling。

## 后期处理：黑屏 / 画面发白 / 没有泛光

1. **整屏黑**：先看 `renderer.getRenderTarget()`。调试器检测到宿主正渲染到自己的 RT 时会直接转调原函数（否则会把中间结果画到屏幕），如果宿主那条路径本身没画东西，你看到的就是宿主的画面，不是调试器的锅。
2. **只有一层纯色**：多半是合成通道的 `#include <colorspace_fragment>` 被改动或 `toneMapped` 被设成 false，导致线性值直接进屏幕。合成通道必须 `toneMapped: true`，阈值/模糊通道必须 `false`。
3. **画面发白或发灰**：双重色调映射。宿主自己接了 `EffectComposer` 并在末尾又做了一次 toneMapping/encoding 时，把调试器的 `enabled` 关掉，或删掉其中一层。
4. **没有泛光**：`bloom.threshold` 是**线性 HDR 亮度**，不是 sRGB 0–1。场景里没有超过阈值的像素就不会有泛光；先把阈值压到 0.2–0.4 验证链路，再按需要调回去。
5. **泛光过糊**：`bloom.radius` 控制参与合成的模糊层跨度，配合 `bloom.strength` 一起降；只降 strength 会得到「很淡但很糊」的结果。
6. **WebGL1 边缘很硬**：4x MSAA 走 `samples: 4`，只在 WebGL2 可用。没有 MSAA 时只能靠提高 `pixelRatioCap` 或后处理锐化补偿。
7. **HDR 泛光发平**：`HalfFloatType` 需要 `EXT_color_buffer_float` / `EXT_color_buffer_half_float`。都拿不到时 RT 退回 8 位，超过 1.0 的亮度在 RT 里已被截断，泛光自然没有层次。
8. **draw call 突然变成 1**：你读的是 `renderer.info.render`。开启后期后它只统计最后那趟合成，用 `getStats()` 取内部保存的场景那一趟。
9. 不要改回 `copyFramebufferToTexture` 抓帧的方案。实测 r160 + WebGL2 + SwiftShader 下，该调用在真实渲染回调内持续报 `GL_INVALID_VALUE: glCopyTexSubImage2D: Offset overflows texture dimensions`，同一调用在渲染回调外却返回 0——不稳定且无法可靠规避。

## 点选不到 / 点到光源而不是物体

1. **不可见对象不参与拾取**。`Raycaster` 本身不检查 `visible`，调试器在遍历时手动跳过 `visible === false` 的子树。自己写拾取逻辑时要补这一步，否则会点到看不见的东西。
2. **真实几何优先于 Helper**。光源/阴影 helper 是半透明代理 Mesh，经常正好挡在几何体前面（半球光的大球心在原点，会吞掉地板中央的每一次点击）。调试器做两趟：先在真实几何里取最近命中，整条射线都没打到实物时才允许选中代理。
3. `Light` 被选中时高亮框会隐藏（灯的包围盒没有意义），这是预期；手感上「点了没框」通常说明点到的是灯，不是网格。
4. 点选只在面板打开时生效；关闭面板会清空选中。坐标要落在 canvas 上——面板固定占住屏幕右侧一条，压住的地方点不到场景。
5. 屏幕半径只有几个像素的目标（远处行星、细线）建议先用场景树选中，别指望用鼠标点：坐标取整就能让射线擦过去。

## 撤销冲突 / 快照恢复失败 / 代码不能直接运行

1. 先撤销同路径/父子路径后续记录；如果外部业务值已经变化，冲突报错是在保护新值，不要绕过检测覆盖。
2. JSON 必须是本 skill 的 version=1 snapshot，不是 scene.toJSON 存档。loadSnapshot 会部分成功，必须检查 errors，不假装是事务。
3. 类型恢复注入同一 THREE；Texture UUID 不在资源表就先加载/注册；换了场景重建 UUID 的材质/纹理可能要手工映射。Object3D 仅在名称唯一时可 fallback。
4. 自定义非 JSON userData 不保证序列化；循环/函数/Infinity/不安全 key 会明确拒绝。不要偷偷删用户数据让导出看似成功。
5. 赋值代码依赖 scene/camera/renderer/THREE；扩展需 controls/composer/mixers/actions，外部纹理可用 debugResources。名字重复/空名字回退原 UUID；迁移代码应换稳定唯一名。
6. 重复粘贴完整代码请分别套 `{ ... }`，避免 helper const 重声明。不要把导出代码交给第三方 eval；测试里 eval 仅运行本地可信生成物。

## destroy 后事件/内存残留

1. 确认调用当前实例 destroy；多实例各清自身面板/RAF/监听；保留其他实例不是泄漏。
2. 保存旧输入 DOM 引用后 dispatch change 应不再修改场景；检查 DOM host 数量、RAF 队列、对象引用字段置 null。
3. 应用自己的 `debug.tick` 回调仍在循环中：0.5.0 起 `tick()` 在销毁后**静默返回**，不再抛 `Debugger destroyed`（宿主循环写 `dbg.tick(now)` 时，抛错会中断整帧、连业务相机动画一起挂掉）。但把应用持有的引用置空仍是好习惯：`debug = undefined; ... debug?.tick(now)`，也让 GC 早点收回闭包。
4. 默认没有 monkey patch。若第三方自行 patch render/prototype，按其所有权保存精确原引用再还原；不能把新 wrapper 当原引用去“还原”。
5. 最后一个 UMD 实例只在 namespace 仍是本库引用时删除它；别人的全局值不能删除；ESM 不设全局。不创建 window.debug 等实例变量。
6. Storage 为支持二次 destroy(clearStorage) 有意保留；只清此前缀，clearStorage 会影响同 origin 其他本库实例快照。用户编辑后的对象状态不自动恢复、资源不 dispose，不是泄漏证明。
7. 最后检查生产构建：DEV 动态导入应被静态剪枝；搜索导出 namespace/面板文字、浏览器 network 无调试 chunk、DOM 无面板。devDependency 本身不能保证剔除。

## 已实测范围与官方依据

自动测试记录在 `tests/README.md`。实际 WebGL/GPU 视觉、浏览器跨平台、旧版本矩阵未验证时必须明确标注，不以 jsdom 的 renderer stub 代替真实 WebGL 结论。

参考：
- https://threejs.org/docs/pages/WebGLRenderer.html
- https://threejs.org/docs/pages/Texture.html
- https://threejs.org/docs/pages/LightShadow.html
- https://threejs.org/manual/pages/shadows.html

本地安装 r187 的 `src/renderers/webgl/WebGLShadowMap.js` 可核对非 cube target resize 分支；是源码核对而非 GPU 渲染验证。
