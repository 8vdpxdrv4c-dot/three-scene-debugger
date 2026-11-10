# 素材库（HDR 环境 / PBR 贴图）

`assets/` 里是一批可直接用的 CC0 素材：4 个 HDR 天空盒 + 1 个 LDR 环境 + 8 套 PBR 贴图。面板的「素材库」折叠区会把它们列成缩略图网格，点一下就能套到场景或当前选中的材质上。

## 目录与清单

```
assets/
├── manifest.json          索引（唯一需要被代码读的文件）
├── CREDITS.md             来源与许可
├── hdr/                   4 个 .hdr（Radiance RGBE）+ 1 个 .jpg
├── textures/<套装>/       每套 diff / nor / rough / arm 四张
└── thumbs/                与清单条目对应的缩略图
```

`manifest.json`：

```json
{
  "hdr": [
    { "id": "brown_photostudio_02", "label": "摄影棚",
      "file": "hdr/brown_photostudio_02.hdr", "format": "hdr",
      "thumb": "thumbs/hdr_brown_photostudio_02.jpg", "credit": "Poly Haven · CC0" }
  ],
  "textures": [
    { "id": "red_brick_03", "label": "红砖墙",
      "files": { "diff": "textures/red_brick_03/red_brick_03_diff_1k.jpg",
                 "nor":  "textures/red_brick_03/red_brick_03_nor_1k.jpg",
                 "rough":"textures/red_brick_03/red_brick_03_rough_1k.jpg",
                 "arm":  "textures/red_brick_03/red_brick_03_arm_1k.jpg" },
      "thumb": "thumbs/tex_red_brick_03.jpg", "credit": "Poly Haven · CC0" }
  ]
}
```

- 路径都相对 `manifest.json` 所在目录，前端用 `new URL(rel, new URL(base, document.baseURI))` 解析，所以 `assets` 参数可以写相对路径，也可以是 CDN 绝对地址。
- `hdr[].file` 是单文件；`textures[].files` 是槽位字典。写新条目时别把两种混用。
- 缩略图可为 `null`，面板会退化成文字按钮。

## 接入

```js
sceneDebug = createSceneDebugger({
  scene, camera, renderer, THREE,
  assets: './assets/',        // 目录（末尾带斜杠）。不传 = 只用程序化环境
});
```

- `assets` 不传：`assets.status === 'disabled'`，环境下拉只有 6 个程序化预设，面板不显示素材网格。
- 传了：`status` 走 `loading → ready`，失败是 `error` 并把原因写进 `assets.error`，面板照常可用（只是没有素材）。
- 加载是**懒**的：`manifest.json` 先取，HDR / 贴图要等你真的点选某个条目才 `fetch`。22 MB 素材不会在首屏全下载。
- HDR 解码后经 `PMREMGenerator.fromEquirectangular` 转成 `scene.environment` 用的纹理；生成的 PMREM 目标由调试器持有，`destroy()` 释放，**不会** dispose 素材文件对应的原始纹理缓存以外的东西。

## 环境贴图

```js
sceneDebug.setEnvironment('hdr:venice_sunset');   // 素材库条目，id 前缀 hdr:
sceneDebug.setEnvironment('sunset');              // 程序化预设
sceneDebug.setEnvironment('none');                // 还原接入前的 environment/background
sceneDebug.setEnvBackground(false);               // 只用环境光照，不要天空盒当背景
```

程序化预设：`studio`（工作室柔光）、`sunset`（黄昏）、`night`（夜空）、`white`、`gray`、`none`。它们用 `DataTexture` + `PMREMGenerator` 现场生成，零外部文件，适合离线环境或不想分发素材的场景。

切到 `none` 会恢复接入前捕获的 `scene.environment` / `scene.background`。第一次切换时捕获，之后一直用这份原值。

## 材质贴图

```js
sceneDebug.applyAssetTexture('object:<uuid>', 'map', 'red_brick_03', 'diff');
sceneDebug.applyAssetTexture('material:<uuid>', 'normalMap', 'red_brick_03', 'nor');
```

- `kind` 取 `diff` / `nor` / `rough` / `arm`。
- 目标可以是对象或材质。传对象时自动回落到它的材质目标（贴图槽位挂在材质上，不在对象上）。
- 传 `'material.map'` 这类带前缀的路径也能识别，会自动剥掉 `material.`。
- **arm 贴图的通道约定**：`aoMap → channel 0`、`roughnessMap → channel 1`、`metalnessMap → channel 2`。这是 glTF 的习惯，`meshStandardMaterial` 正好对得上；如果你把 `arm` 塞进别的槽位，记得自己搬通道。
- 同一文件的 `diff` / `nor` 等会被缓存复用，反复赋值不会重复解码。

## 加自己的素材

1. 把文件放进 `assets/` 下的子目录（建议按套装建一层）。
2. 在 `manifest.json` 里加条目，`id` 唯一、`label` 是给人看的名字、`credit` 写来源与许可。
3. 生成 1:1 或 `160×90` 的缩略图放进 `thumbs/`，路径写进 `thumb`。
4. HDR 必须是 **Radiance RGBE**（`.hdr`）。EXR 目前不支持——解析器只实现了 RGBE。

## HDR 解析的坑

`parseHDR()` 是手写的，没用 `RGBELoader`。Radiance 的 new-style RLE 里，**每个扫描行是 4 个通道各自一条 RLE 流**（不是像素交错），run 只带 1 字节样本，literal 带 `code` 字节。按「像素交错」去读，第 3 个像素之后整行就错位，表现为：解码不报错，但图是斜的、颜色乱掉、或者直接「像素数据不完整」。

解码正确的硬校验是：**消费的字节数恰好等于文件字节数**。`assets/` 里 4 个 HDR 都用这条校验过（`consumed === total`）。加了新 HDR 之后，先跑一次这个校验再进面板。

另外 `DataTexture` 的行序是自下而上，写入时要 `dst = ((height - 1 - y) * width + x) * 4`，纹理设 `flipY = false`，否则天空盒上下颠倒。

## 素材体积

`assets/` 共约 22 MB。它是**可选**的：不发素材、或用 `assets: null`，功能面只少了「素材网格」和 HDR 天空盒，程序化环境、后期、点选、导出全都在。分发到体积敏感的场景时，把 `assets/` 从技能包里摘掉即可，代码不会因此报错（`status` 会停在 `disabled`）。

素材均为 CC0（Poly Haven / three.js examples），明细见 `assets/CREDITS.md`。
