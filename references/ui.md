# 面板交互（0.6.0 起；0.7.0 增材质切换；0.8.1 增底部复制栏；0.8.2 复制改三级链：同步 execCommand('copy')（用户手势内，覆盖非安全上下文/部分内嵌 iframe）→ 异步 navigator.clipboard.writeText → 全被拦时把内容填入「导出或导入内容」输出框并全选+聚焦+滚动进视野，提示用户按 Ctrl+C；底部大按钮成功闪绿「✓ 已复制 N 字符」、失败闪红「⚠ 请按 Ctrl+C」；0.8.3 命令区增「AI 提示词」按钮，flashCopy 支持多按钮各自恢复文案）

面板只有一层 shadow DOM，样式集中在 `PANEL_CSS`，不污染宿主页面。结构自上而下：

```
[入口按钮 .tsd-launcher]（fixed 左上角，最高 z-index）
└─ section#tsd-panel（fixed，默认右上 372px 宽）
   ├─ .tsd-head        标题栏：logo / 名称 / 版本 / 收起 · 卸载 · 改动 N；可拖拽、双击复位
   ├─ .tsd-tools       展开全部 / 收起全部 / 复位布局
   ├─ details          场景与画面 / 后期处理 / 素材库 / 性能信息（卡片式，箭头指示展开态）
   ├─ 场景树           [刷新场景树] [名称搜索] [类型过滤] + 树节点
   │   └─ 点一行 = 选中该对象（gizmo / 包围盒 / 属性面板一起跟上）+ 相机 480ms 缓动飞过去取景；
   │      当前选中行加 `.on` 高亮，选中来源是画布点选还是下拉都一样。点树时压住 `revealProps`，
   │      面板不会自己滚到顶部。关掉：`setFocusOnSelect(false)`；要瞬移：`setFocusDuration(0)`。
   ├─ 目标下拉         选中目标的统一入口
   ├─ .tsd-tabs        属性 / 材质 两个页签
   ├─ .tsd-pane        属性页：模式按钮 + 聚焦/克隆/删除 + 筛选框 + 字段
   └─ 导出区           JSON 快照 / 赋值代码 / 完整场景 / 恢复 / 复制 / 存读 / 清空
[.tsd-resize]          面板左边缘的宽度拖拽条（独立于 panel，fixed 定位）
```

## 宽度拖拽条

- 位置：面板左边缘外 5px，宽 11px、整条高，`cursor: ew-resize`。
- 拖动：`宽度 = 起始宽 + (起始X - 当前X)`，夹在 **300–820px** 之间（同时不超过视口宽度 - 24）。
- 双击：清掉内联宽度与 localStorage 记录，回到 CSS 默认 372px。
- 记忆：宽度写入 `localStorage['tsd:panel:width']`；读不到（隐私模式 / 禁存储）就静默用默认值。
- 面板已被拖到自定义位置时，改宽会保持左边界；若右侧越界，整体左移而不是把人挤到屏幕外。
- 把手是独立元素而非 panel 子节点：panel 自身 `overflow:auto`，子元素会随内容滚走。拖动标题栏、窗口 resize、开关面板都会调 `syncResizer()` 重新贴合。

## 滑块

`.tsd-slider` 是两行网格：第一行「字段名 + 数字框」，第二行整宽轨道。轨道用自绘样式：

- WebKit 用 `linear-gradient(to right, accent 0 var(--p), track var(--p) 100%)` 表示已填充比例，`--p` 由 `paintRange()` 在每次赋值后更新；
- Firefox 用 `::-moz-range-progress` 自动画进度；
- 拇指 14px 圆形，hover 放大 1.12、按下放大 1.18 并带 6px 光晕。

数字框（`.tsd-num`）可直接键入精确值：键入后先夹到 `[min,max]`，再按**一次完整改动**提交（先 `onInput` 预览、再 `onCommit` 记一条）。滑块拖动过程中只预览不记日志，松手才记，所以一次拖动等于一步撤销。

## 字段名拖拽改值（scrub）

属性页里每个数值字段的**名字**都可以按住左右拖动：

| 操作 | 效果 |
|---|---|
| 单击字段名 | 不拦截，正常点到输入框 |
| 按住左右拖 | 位移超过 3px 后进入 scrub，每像素 0.01 |
| Shift + 拖 | 步长 ×10（0.1/px），快速大幅调整 |
| Alt + 拖 | 步长 ×0.1（0.001/px），精调 |

实现要点：拖动中调用 `preview(id, path, v)` 只写值不记日志（用 `requestAnimationFrame` 合并到每帧一次），松手用 `commitPreview(id, path, v)` 记一条 —— 旧值是拖动开始前的那份，因此整段拖动在改动记录里只占一行、一步撤销即可回原值。

## 属性筛选

属性页顶部有 `input.tsd-filter`（type=search）。输入即按 `label[data-field]` 做子串匹配（大小写不敏感），不匹配的行加 `hidden`。查询串存在 `this.fieldQuery` 上，切换目标后仍保留；清空即恢复全部。

## 手柄模式按钮

选中对象后属性页顶部有一组分段按钮「移动 W / 旋转 E / 缩放 R」，等价于 `setTransformMode()` 与快捷键。当前模式高亮来自 `selection.mode`：

- 点按钮 → `d.setTransformMode(mode)` → `SelectionLayer.setMode()` → 回调 `ui.syncModeButtons()`；
- 按 W/E/R → `SelectionLayer.onKey()` → 同样回调，所以键盘与按钮永远同步。

## 材质切换（0.7.0）

材质页顶部有三件东西，顺序固定：

```
材质类型   [ MeshPhysicalMaterial · PBR 物理            ▾ ]   ← 整行，独占一行
[✓] 保留参数与贴图      [ ] 同步共用该材质的 3 个对象
材质 MeshPhysicalMaterial
```

- 下拉选项来自 `getMaterialTypes()`，按对象种类过滤：`Mesh` → 10 种 Mesh 材质，`Line` → LineBasic/LineDashed，`Points` → PointsMaterial，`Sprite` → SpriteMaterial。`ShaderMaterial` / `RawShaderMaterial` 需要有效着色器源码，故意不提供。
- 「保留参数与贴图」对应 `opts.copy`，默认开：把颜色、贴图、透明度、双面、粗糙度/金属度等搬过去（`MATERIAL_COPY_PROPS`）。关掉就得到一个全新默认材质（例如颜色回到白）。
- 共用材质时多出「同步共用该材质的 N 个对象」（`opts.spread`）：同一个材质实例被 3 个网格用着时，只换当前物体等于把它从共享里拆出来，勾选则 3 个一起换。取消勾选是默认行为。
- 下拉里当前类型不在候选里（例如应用自定义材质子类）时，会补一条 `XxxMaterial（当前，不可换）` 占位，避免 `select.value` 落空显示空白。
- 直接选中材质目标（targets 下拉里的 `material:xxx`）时，材质页同样显示这一组控件；它按 `locator.owner` + `locator.index` 作用到承载对象与对应槽位，换完目标会自动落到承载对象上（旧材质目标随 uuid 消失）。

实现注意：

1. 换材质用 `resyncAfterMaterial(o)`（`inspector.rebuild()` + `ui.syncTargets()` + `ui.inspect()`），**不要**调 `this.refresh()`：后者会重建整棵场景树，把用户展开的层级全部折叠。
2. `ui.syncTargets()` 只重填目标下拉并保留当前值；`refresh()` 现在是 `syncTargets()` + 树 + inspect。
3. 新增下拉若在 `label` 里，注意 `label>span{flex:1}` 会把 select 挤到右侧；要让下拉独占一行，给 select 加 `flex:1 1 100%`（`.tsd-type-row` 就是这么做的，同时把 `max-width` 放开，否则 `MeshStandardMaterial · PBR 标准` 会被截断）。

## 快捷键

| 键 | 作用 | 生效条件 |
|---|---|---|
| W / E / R | 切换拖拽手柄为移动 / 旋转 / 缩放 | 面板打开且有选中对象，焦点不在 input/select/textarea |
| Esc | 取消选中 | 同上 |

Esc 在 0.6.0 只清选中、不关面板：关闭面板请点标题栏「收起」或入口按钮，避免与宿主自己的 Esc 语义打架。

## 底部固定复制栏（0.8.1）

- 面板最后一个元素是 `.tsd-copybar`：`position:sticky;bottom:0`，内容再长也始终吸在面板可视底部，里面是全宽大按钮「复制修改提示词」（`button.tsd-copyall`，渐变蓝底白字、hover 上浮、无改动时禁用灰）。
- 按钮文案随改动数联动（「复制修改提示词（N 处）」），`changes()` 每次重建日志时同步禁用态与计数。
- 命令区「AI 提示词」（紫色高亮）调用 `aiPrompt()`：把场景概览、当前选中对象的全部字段、定位代码块、以及尚未应用的改动打包成完整提示词，写入输出框并走三级复制链；与底部大按钮的 `exportPrompt()`（只含改动清单）互补。
- 点击复制 `exportPrompt()`：给 agent 的指令前言 + 完整 Markdown 改动清单。因此 `section` 的 `padding` 是 `0 16px 0`——**底部内边距由 copybar 自己提供**，别把 `padding-bottom` 加回 `section`，否则吸底时下方会漏出一条空缝。

## 视觉与主题

- 颜色全部走 CSS 变量（`--accent` `--field` `--track` `--shadow` …），`@media (prefers-color-scheme: dark)` 下整组替换；`color-scheme` 同步，让原生控件（滚动条、下拉）跟随。
- 滚动条：`scrollbar-width: thin` + WebKit 自定义拇指（默认 3px 内缩，hover 变宽变深），面板 `overscroll-behavior: contain`，滚到底不带动宿主页面。
- 数值显示：属性输入框最多 4 位小数（`fmtDigits`），避免 `1.0555429404422666` 这种长串；数字框的上下箭头在 CSS 里隐藏，需要微调时用 scrub 或键盘 ↑↓。

## 改样式时的注意事项

1. **不要给 `section` 设 `display`**：`hidden` 属性靠默认 `display:none` 生效，一旦设了 `display:flex/grid` 面板就关不掉。
2. `label` 是 flex、`.tsd-slider` 覆写为 grid；给属性行加 `hidden` 时必须保留 `label[hidden]{display:none}`，否则筛选无效。
3. `.tsd-head` 是 sticky，`scroll-padding-top` 要 ≥ 标题栏高度，否则 `scrollIntoView` 会把内容顶到标题栏下面。
4. 新增按钮不要放进 `.tsd-head-actions`，那里只有「收起/卸载/改动」三个；工具类入口放 `.tsd-tools`，目标操作放 `.tsd-actions`。
5. 任何给 `window` / `document` 加的监听都必须走 `this.on(...)`：`destroy()` 统一摘除，`removeListenersWithin()` 只处理 Node 后代，非 Node 监听器会一直保留到销毁。
