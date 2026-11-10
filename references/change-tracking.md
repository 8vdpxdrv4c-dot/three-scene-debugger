# 改动、撤销与导出协议

## 改动数据结构

每次有效编辑记录：

```json
{
  "id": 1,
  "objectUuid": "Three UUID 或 renderer/controls/pass 等 target ID",
  "objectName": "对象名或界面标签",
  "propertyPath": "position.x",
  "oldValue": 0,
  "newValue": 2,
  "timestamp": "2026-11-09T03:22:00.000Z",
  "target": "object:uuid",
  "active": true
}
```

`timestamp` 为标准 UTC ISO 数据协议；显示/汇报给用户应转换用户时区，例如此值为北京时间（UTC+8）11:22，不改变原协议。id 为实例内递增序号。`oldValue/newValue` 是独立序列化值，不是用户可变对象；记录内部还有不可枚举 `_target` 与 `_oldRef`（GPU 资源引用），不放入 JSON。更改前后序列化相等不记一条。按对象分组 UI 支持单条撤销；清空记录将当前状态视为新基线，不回滚对象、不清除 localStorage。

## 深拷贝与资源约定

- JSON 递归复制数组与普通对象；保留有限数字/string/boolean/null。拒绝 undefined/function/Symbol/BigInt、循环引用、NaN/Infinity、`__proto__/constructor/prototype` 键，避免 JSON.stringify 的静默丢失。
- 系统标量 Infinity/-Infinity（如 controls 距离上限）使用 `{"$type":"Number","value":"Infinity"}` 等保留，撤销/源码支持；userData 中非有限数字依旧拒绝。NaN 一律拒绝。
- Color 编码 `{"$type":"Color","rgb":[r,g,b]}`，使用线性 RGB，避免 sRGB 往返误差。
- Vector2/3/4、Euler、Quaternion 编码 `{"$type":"Euler","value":[x,y,z,"XYZ"]}` 等。Euler 第四项是 order。
- Fog/FogExp2 编码包含 color 与 near/far/density（非适用字段 null）。
- Texture/Material 编码仅 `{"$type":"Texture","uuid":"..."}`，**不 clone 图片/GPU 资源**；内部保留旧 Texture/Material 原引用用于撤销；`registerResource` 可显式补齐资源表。
- fog/color/vector 恢复创建/复制 typed 值需现有应用的 `THREE` namespace；不导入新 Three。原始 Color UI 编辑无需额外 Three 引入。
- `$type` 是渲染属性值的类型标签；userData 使用属性上下文按普通 JSON 编解码，即使有同名 `$type`/`isTexture` 字段也不会伪装成资源或执行类型恢复。Date/Map/Set/自定义实例明确拒绝，需业务转换成普通 JSON；复杂含函数 userData 应只调其外部业务字段，不把它整包提交。
- 生命周期：撤销引用保存在实例内直至 clearChanges/destroy；资源表保留已发现/注册资源直至 destroy，保证已被替换的资源仍可解析。不会自动 dispose。

## 单条撤销

`debug.undo(id)`：

1. 查有效记录；同 target 相同路径或父子重叠路径有后续有效记录，则报 `Undo conflict`，先撤销新的记录；不允许旧编辑覆盖新编辑。
2. 当前值与此记录 newValue 不同，说明业务/动画/外部代码改动，报冲突，不覆盖外部值。
3. 使用旧 GPU 原引用或深拷贝/类型恢复写回 oldValue；按同一属性规则更新 material/texture.needsUpdate、camera projection、matrix 与 shadow flags。
4. 将记录 active=false。不存在或已撤销记录报错；UI 保留审计行，但不给二次撤销按钮。

调试器没有劫持动画/业务状态；业务每帧重写的属性改动可能立刻被覆盖，且 undo 触发冲突是预期。想回滚整个会话可逆序撤销所有 active 记录，但遇外部冲突必须先人工处理。

## 导出 A：只含最终修改属性的 JSON

```json
{
  "format": "three-scene-debugger",
  "version": 1,
  "changes": [
    {
      "target": "object:original-uuid",
      "locator": {"kind":"object","uuid":"original-uuid","name":"Hero"},
      "propertyPath": "position.x",
      "newValue": 2
    },
    {
      "target": "material:material-uuid",
      "locator": {"kind":"material","owner":"original-uuid","index":null},
      "propertyPath": "roughness",
      "newValue": 0.2
    }
  ]
}
```

- 每个 target/path 只保留最终编辑，若最终值等于会话基线则移除。父属性与子属性同时编辑时合并到父属性最终 typed 值，避免 fog=null 后还应用 fog.density；以最早 root 基线比较。
- `exportSnapshot()` 返回普通对象，复制时 `JSON.stringify(snapshot,null,2)`；不包含 timestamp/history/oldValue/完整场景/图片数据。
- `loadSnapshot(snapshotOrJSONString)` 验证 format/version/changes、路径白名单与值类型。每条独立应用，返回 `{applied, errors:[{index,message}]}`，**非原子事务**，错误不能静默忽略。成功项继续记入本次会话历史，可撤销。
- 解析顺序：已有 target ID；scene/camera 按显式接入角色；其他 Object3D UUID 不存在时按缓存唯一名称；Material 按 owner UUID（兜底唯一 ownerName）与数组 index；Texture 按父 target/父 locator 与槽位。renderer/controls、Pass/Mixer/Action 注册 ID 需相同上下文。
- 跨重新创建的场景，Object3D 唯一名称可找回；材质拥有者无唯一名称且 UUID 改变、或资源 UUID 未保持时应由应用映射/注册，不能保证任意 JSON 自动迁移到另一场景。目标/资源不存在返回明确错误。
- 需要纹理/环境图先由应用加载/注册再恢复；独立 JSON 不会凭空包含纹理数据。
- 路径只准 `\w+` 点分段，禁 prototype/constructor/__proto__，必须在当前 target 字段白名单。不会对任意传入 JS 执行 eval。
- JSON 导入与代码导出都不自动持久化。仅显式 UI 保存 / `saveSnapshot(name)` 才写 `tsd:snapshot:<name>`。`destroy({clearStorage:true})` 清除 origin 所有此前缀快照，不删其他业务数据。

## 导出 B：可粘贴赋值代码

```js
// 由 exportCode 生成的上下文需已有 scene/camera/renderer/THREE。
{
  const tsdTarget0 = scene.getObjectByName("Hero");
  if (!tsdTarget0) throw new Error("Debugger target missing");
  tsdTarget0.position.x = 2;
  if (tsdTarget0.matrixAutoUpdate) tsdTarget0.updateMatrix();
  tsdTarget0.matrixWorldNeedsUpdate = true;
}
{
  const tsdTarget1 = scene.getObjectByName("Hero").material;
  if (!tsdTarget1) throw new Error("Debugger target missing");
  tsdTarget1.roughness = 0.2;
  tsdTarget1.needsUpdate = true;
}
```

名称定位优先，非唯一/空名称生成：

```js
scene.getObjectByProperty("uuid", "original-uuid") /* empty/duplicate name: UUID fallback */
```

- 导出时只用树缓存，不 scene.traverse。对象改名/增删后手动刷新；粘贴的代码在用户执行时当然需要定位对象。跨场景 UUID 必须仍存在或手工改成稳定名称。
- camera 是树外独立相机时用 `camera`；scene 本身用 `scene`，渲染器用 `renderer`。controls 需同名变量 `controls`，后处理 `composer.passes[index]`；多 mixer/action 用 `mixers[index]` 与 `actions[mixerIndex][actionIndex]` 数组。这些数组由宿主提供，不是调试器偷偷创建的全局变量。
- 共享材质/纹理只导出一次，通过缓存中第一个拥有者 `.material[index].map` 等稳定路径；若该拥有者被移除需先刷新或手工换稳定路径。Object3D 的 name 发生更改只刷新缓存，不自动改源码。
- Color 值使用 `new THREE.Color().setRGB(...)`；稳定的 color/vector 字段用 `.copy()`，background Color 用直接赋值以支持原始值 null；Fog 用 `new THREE.Fog(...)`。
- GPU 资源赋值代码内有 `tsdResource(uuid)`，扫描执行时场景资源；可提供 `debugResources={"uuid": texture}` 处理外部/脱离场景资源，缺失直接抛错，不生成“无效占位纹理”。
- 代码含必要 needsUpdate、camera.updateProjectionMatrix、shadow flags、controls.update 与虚拟 pixelRatio setter。不负责 asset loading、render loop、shadow target 所有权重建。
- 同一词法作用域重复粘贴完整代码会遇到 `const tsdResource` 重声明：删掉上一份或把每份整体包在独立 `{ ... }` 块中。输出为可信应用用户主动选择粘贴，不自动执行第三方代码。

## 导出 C：改动日志与 Markdown 清单（0.3.1）

面板「改动 N」区块把每条记录渲染成 `对象 · 参数 · 旧值 → 新值`，支持三种复制粒度：单条（点行）、按对象（组右上「复制组」）、全部（0.8.1 起由面板底部吸底大按钮「复制修改提示词」承担，旧「复制全部 Markdown」按钮已移除；条内的「复制全部代码」仍在）。底部按钮复制的是 `exportPrompt()`：在 `exportChangeMarkdown()` 的输出前加一段给 agent 的指令前言（改了几处、只看最终值、代码块可直接执行、`tsd` 指调试器实例），粘贴即用；无未应用改动时按钮禁用。同时每条改动会 `console.info` 一行，`logChanges: false` 可关。

同一对象同一属性被反复修改时，**复制与导出只输出最终状态**：旧值取该属性第一次改动的值，新值取最后一次的值，多步折成一行；首尾相同的（改了又改回去）直接省略，不计入条数。面板里的逐步记录仍完整保留，每步照旧可单独 `undo()`；被后续改动覆盖的行会标「已被覆盖」，点行复制拿到的也是该属性的最终一行。`exportSnapshot()` / `exportCode()` 本来就是最终态语义，行为不变。

````markdown
# three-scene-debugger 改动（2 处）

## Cube_2
```js
const target = scene.getObjectByName("Cube_2");
```
- `position`：(-1.1, 0.75, 1.5) → (-0.497, 0.324, 1.298)

## Cube_2 的材质（MeshStandardMaterial）
```js
const target = scene.getObjectByName("Cube_2").material;
```
- `color`：#f0a94b → #22d3ee
````

约定：

- `oldValue/newValue` 存 packed 值（`{$type:'Vector3'|...}`），Markdown 里再格式化；Color 会从线性分量反算回 sRGB `#rrggbb`，不要直接拿 `r/g/b` 当十六进制。
- 拖拽 gizmo 结束按 `position` / `rotation` / `scale` 整组记录一次（Euler 的第四位是 order 字符串，比较时不能做数值减法），`undo()` 会用 `resolve` + `.copy()` 回滚。
- 场景/画面类改动没有 three 对象，`target` 是 `editor:env` / `editor:lights`，`oldText/newText` 直接是人类可读值；它们不进入 `exportSnapshot()`（快照只含可恢复的属性路径），只在 Markdown 与面板日志里出现。
- 滑块类参数用 `preview()` 实时写值，`commitPreview()` 才落一条记录；这样拖动过程中不会产生几十条中间记录。
- 「复制全部代码」仍然走 `exportCode()`（最终态赋值代码），与 Markdown 清单互为补充：前者可直接粘贴，后者便于人或 agent 对照修改。

## 导出 D：材质切换（0.7.0）

换材质不是「改一个属性」，所以记录里同时带 `materialSwap`（类型、槽位、是否搬运参数、是否同步共用对象）与 `expr`：

````markdown
## Studio_Hero
```js
const target = scene.getObjectByName("Studio_Hero");
tsd.setMaterial(target, "MeshPhysicalMaterial", {"slot":1,"spread":true});
```
- `material[1]`：MeshStandardMaterial → MeshPhysicalMaterial（同步 2 个对象）
````

`changeLine()` 看到 `materialSwap` 就直接拼 `tsd.setMaterial(...)`，**不再**退化成 `// old → new` 注释。`collapse()` 必须一并复制 `materialSwap/api/expr` 三个字段，否则多步改动合并后导出会丢信息（这是加该功能时踩过的坑）。

`setMaterial` 的记录走 `recordCustom()`，因此：

- 面板里显示为一条 `material` 改动，点「撤销」恢复**原材质实例**（不是新建一个同参数的）；
- 不进 `exportSnapshot()`（快照只含可恢复的属性路径），与加光源/克隆/删除这些结构操作一致；
- 新旧材质都不 dispose：旧材质可能仍被别的对象引用，新材质可能马上又被换掉。

## 导出 E：自制贴图库（0.8.0）

一次写入可能同时改 `map` / `normalMap` / `roughnessMap`，但**只记一条**改动 —— 三个槽位同属一次「贴一套材质」的意图，拆成三条撤销要按三次。

````markdown
## Studio_Ground
```js
const target = scene.getObjectByName("Studio_Ground");
tsd.applyTexturePreset(target, "brick", {"slots":["map","normalMap","roughnessMap"],"size":256,"repeat":6});
```
- `map + normalMap + roughnessMap`：null → 红砖墙 · 整套 3 通道 · 平铺 6 · 256px
````

记录里带 `texPreset: {id, slots, kind, size, repeat}` 与 `expr`，`changeLine()` 见到它就拼 `tsd.applyTexturePreset(...)`：

- `kind` 只在显式指定通道时出现（面板「基础色/法线/粗糙度」页签会传，`整套` 传 `null`）；缺省时回放按 `TEX_SLOT_KIND` 推通道，与被记录的那次写入一致。
- `size` 只在非 256 时出现，`repeat` 只在 `!== 1` 时出现 —— 避免把默认值写进导出，造成「看起来改了很多」的噪音。
- `slots` 一定写出：只写 `normalMap` 的那次不能回放成整套，否则粘贴后材质会多出两张没被记录的贴图。
- `oldText` 用 `shortTexture()`：有 `userData.tsdPreset` / `tsdAsset` 时显示「橡木地板·法线」这类人类可读名，没有就回落 `<texture uuid8>`，不打印整张纹理对象。

`collapse()` 会一并复制 `texPreset/texAsset`，末条覆盖时两者互斥删除 —— 同一目标先贴素材包、再贴自制贴图，最终只应导出后面那次。

`exportSnapshot()` / `exportChangeMarkdown()` **不含**这类动作（它们不是可恢复的属性路径）；但 `exportCode()` 末尾单独扫一遍 `materialSwap` / `texPreset` / `texAsset` 三类记录补进代码块。这段扫描不能删：自定义动作本来就没有快照条目，漏了它导出的代码会「什么都没写」。

`undo` 恢复的是**原纹理实例**（多数是 `null`），不是重新生成一张空图 —— 否则撤销后材质上会挂着一张看不见的占位纹理，导出快照时还会被当成真实贴图。

## 完整场景存档（独立兜底）

`exportFullSceneJSON()` **只**调用 `scene.toJSON()`，与主快照/赋值代码分离；返回原始对象，必要时自行 JSON.stringify。它不是 renderer、controls、Pass、Mixer 的完整备份；自定义 Shader/函数/onBeforeRender/外部图像/循环 userData/插件类不保证可序列化。Three 抛错如实上浮到 UI，不吞错、不偷偷移除字段；请先在资产所有者处构建可序列化副本。完整存档与 loadSnapshot 协议不兼容，需宿主 Three.ObjectLoader 或业务加载器处理。
