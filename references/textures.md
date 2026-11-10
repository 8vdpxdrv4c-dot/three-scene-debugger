# 自制贴图库（程序化）

`assets/` 里的 PBR 贴图是 CC0 照片素材，需要联网下载、整目录约 22 MB。**自制贴图库不依赖任何图片文件**：12 套材质在浏览器里用噪声函数算出来，同步生成**基础色 / 法线 / 粗糙度**三张 `DataTexture`，因此断网、缺 `assets/`、甚至整个素材目录被摘掉时依然可用。

```js
sceneDebug.listTexturePresets();                 // 12 条，含 id/label/hint/kinds
sceneDebug.presetTexture('oak', 'nor', 512);     // 直接拿一张 THREE.DataTexture
sceneDebug.applyTexturePreset(mesh.uuid, 'oak', {                     // 整套三通道
  slots: ['map', 'normalMap', 'roughnessMap'], repeat: 4, size: 512
});
```

## 12 套预设

| id | 名称 | 归类 | 高度权重 `bump` | 主要构成 |
|---|---|---|---|---|
| `oak` | 橡木地板 | 木材 · 室内 | 2.0 | 沿 v 拉伸的 fbm 木纹 + 板缝 + 逐板色差 |
| `brick` | 红砖墙 | 砌体 · 建筑 | 2.6 | 砖块 Worley 格 + 灰缝下沉 + 砖面噪声 |
| `concrete` | 清水混凝土 | 水泥 · 建筑 | 1.3 | 多尺度 fbm + 稀疏气孔 |
| `marble` | 大理石 | 石材 · 抛光 | 1.0 | 周期相位距离成脉 + 软化 + 低频淡出 |
| `brushed` | 拉丝金属 | 金属 · 工业 | 0.7 | 单向细纹 + 低频明暗带 |
| `hex` | 六角釉砖 | 瓷砖 · 卫浴 | 2.2 | 周期六角格 + 砖面釉面起伏 |
| `cobble` | 石板路 | 石材 · 户外 | 2.8 | Worley 石块 + 石缝 + 每块倾斜 |
| `leather` | 荔枝纹皮革 | 皮革 · 软装 | 1.9 | 密集 Worley 峰 + 细纹叠加 |
| `linen` | 亚麻布 | 织物 · 软装 | 2.4 | 经纬线 + 逐线厚度抖动 |
| `sand` | 沙地波纹 | 自然 · 地形 | 1.9 | 风纹（非对称脊）+ 颗粒 |
| `rust` | 锈蚀铁板 | 金属 · 做旧 | 2.0 | 双层噪声锈斑 + 深浅锈色分层 |
| `terrazzo` | 水磨石 | 石材 · 地面 | 1.0 | 骨料颗粒（按 id 取色）+ 水泥底 |

`bump` 是法线强度的基准值，生成时再乘 `size/256` —— 512px 图的坡度和 256px 图在同样物理尺度上一致，不会因为提高分辨率就把法线压平。

## 三个通道怎么来的

每个生成器签名统一为 `(n, H, A, R)`，一次算完写进三个 `Float32Array`：

- `H` 高度（`n²`），只用于求梯度
- `A` 反照率（`n²·3`，0–1 线性）
- `R` 粗糙度（`n²`，0–1 标量）

然后一次性打包成三张 `Uint8Array(n²·4)`：

| 通道 | 来源 | `colorSpace` | 用途 |
|---|---|---|---|
| `diff` | `A` | `SRGBColorSpace` | `map` / `emissiveMap` |
| `nor` | `H` 的 Sobel 梯度 | `LinearSRGBColorSpace` | `normalMap` / `bumpMap` |
| `rough` | `R` 灰阶 | `LinearSRGBColorSpace` | `roughnessMap` / `metalnessMap` / `aoMap` |

`bake(id, size)` 用 `id|size` 做键，三通道只算一次；`texture()` 再用 `id|kind|size` 缓存 `DataTexture`。所以整套写入三个槽位只跑一遍生成器。

## 法线方向为什么取负

`DataTexture` 默认 `flipY = false`，纹理第 0 行贴到 v=0 一侧，行号增大等于 v 增大。用 3×3 Sobel 求梯度后法线是：

```js
const nx = -gx * 0.125 * k;
const ny = -gy * 0.125 * k;   // 负号不能去掉
const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
nor[o]     = (nx * inv * 0.5 + 0.5) * 255;
nor[o + 1] = (ny * inv * 0.5 + 0.5) * 255;
nor[o + 2] = (inv * 0.5 + 0.5) * 255;
```

去掉负号不会报错，只会把凸起渲染成凹陷 —— 砖缝看着像凸起来的砖，越调越怪。这个符号是用真实渲染判定过的：把一张砖法线贴到球上，比较上下半坡的亮度，结论是 `ny = -gy`。**别凭直觉改回正号。**

`0.125` 是 Sobel 核归一化（`(1+2+1)*2 = 8`），`k` 里已经含了 `size/256`，所以分辨率变化不需要另调系数。

## 无缝平铺的数学约束

要正方形贴图沿 u、v 单向平铺都无接缝，`(1,0)` 与 `(0,1)` 两个方向都必须是噪声格矢量的整数倍。

- `vnoise2(x, y, px, py, seed)` 的格点数 `px / py` 取整数，格点索引对 `px` 取模，于是 `x=0` 与 `x=1` 落在同一格点上，天然首尾相接。
- `fbm2` 每层频率翻倍时，周期也同步翻倍（`px * 2^oct`），否则高频层会先破周期。
- `worley(u, v, cells, seed)` 的格点用取模，9 邻域搜索跨越边界时取相邻格心，所以 Worley 也是周期的。
- 六角格最容易错：`R0 = 1/12` 时 `(0,1)` 不是格矢量，平铺出直线缝。正确的是 `R0 = 1/9`、横向缩放 `SX = 5√3/9`，此时 `(1,0)` 恰好是 5 个格矢量、`(0,1)` 是 6 行 3 列；格心颜色改用格心坐标上的周期噪声，避免砖块被边界切断。

回归用「接缝比」自动判定：取相邻列（行）的像素差，跨边界那一条与内部平均值的比值应接近 0，实测四个方向都是 `0.00`。任何新增图案都要过这一关，靠肉眼看 256px 图是看不出来的。

## 尺寸、平铺与内存

| 参数 | 范围 | 默认 | 说明 |
|---|---|---|---|
| `size` | 64–1024（`clampSize`） | 256 | 面板提供 128 / 256 / 512 / 1024 |
| `repeat` | API 1–16，面板 1–8 | 1 | 只写 `texture.repeat`，不改几何 UV |

`repeat !== 1` 时**必须 clone**：缓存里的那张纹理是全局共用的，直接改它的 `repeat` 会污染所有用到同一预设的其他材质。所以 `applyTexturePreset` 走的是 `tex.clone()` + `repeat.set()`，缓存纹理恒为 `repeat = 1`。回归断言 `used=2 / cached=1 / shared=false` 就是锁这条。

一张 512px 的三通道贴图约占 `512*512*4*3 ≈ 3 MB` 显存（含 mipmap 约 4 MB）。1024px 单套接近 16 MB，面板里给的最大档就到这里；`destroy()` 会 `dispose()` 所有缓存纹理与缩略图，不碰用户自己的纹理。

## 缩略图

缩略图不是把大图缩放的：`thumb(id, kind, 96)` 用**同一个生成器**在 96px 上重算一遍，再 `putImageData` 到 canvas、`toDataURL('image/jpeg', 0.86)`。这样缩略图的纹路密度与最终贴图一致，不会出现「预览很细、贴上去很糊」。全程内存里的 data URL，不产生任何网络请求，也不写 `assets/`。

法线页签的缩略图是真正的法线图（紫蓝底），不是基础色的灰度版 —— 页签切换时 `thumb(id, 'nor')` 换的是通道参数。

## 面板里的贴图库

材质页「贴图」小节每行是「缩略图 + 名称 + 选择…」，点任意一行打开抽屉；抽屉里也可以从「贴图库…」按钮整体进入。

- 四个页签：**基础色 / 法线 / 粗糙度 / 整套**。从某个槽位点进来会落在对应通道上，从材质页整体进来默认「整套」。
- 抽屉分三段：自制贴图库（12 套）、素材包（`assets/` 里的 PBR 贴图，缺通道时标「缺此通道」）、场景已有贴图（可复用它处已在用的纹理）+「无」（清空该槽）。
- 底部是平铺（1–8）与尺寸（128/256/512/1024）两个控件，作用于接下来点击的那次写入。
- 点缩略图即写入并自动关闭抽屉；`Esc` 或点遮罩关闭，不改任何东西。

## 槽位与通道的映射

自制贴图库只有三路通道，**不能沿用素材库的 `ASSET_SLOT_KIND`**（那张表里 `aoMap` / `metalnessMap` 指向 `arm`，即素材包里打好的 AO/Rough/Metal 三合一图）。用错表的后果不是报错：`TextureStudio.texture()` 对未知 `kind` 静默回落成 `diff`，于是一张彩色图被写进金属度槽位，渲染结果只是「看起来有点怪」。

内部用 `TEX_SLOT_KIND` 单独映射：

```js
const TEX_SLOT_KIND = {
  map: 'diff', normalMap: 'nor', bumpMap: 'nor', roughnessMap: 'rough',
  aoMap: 'rough', metalnessMap: 'rough'
};
```

显式传 `opts.kind`（`'diff' | 'nor' | 'rough'`）优先于这张表。往没有对应通道的槽位写（例如 `emissiveMap`）不会报错，会拿到基础色 —— 需要区分时自己传 `kind`。

## 导出

一次写入记一条改动，可撤销，导出成一行可执行调用：

```js
const target = scene.getObjectByName("Studio_Ground");
tsd.applyTexturePreset(target, "brick", {"slots":["map","normalMap","roughnessMap"],"size":256,"repeat":6});
```

- `repeat` 只在 `!== 1` 时写进参数，`size` 只在非默认时写，避免噪音参数。
- `kind` 只在显式指定时出现；缺省时回放会用同一张 `TEX_SLOT_KIND` 表推出同样的通道，结果一致。
- 它在 `exportSnapshot()` / `exportChangeMarkdown()` 里**不出现**（快照只含可恢复的属性路径），但会出现在 `exportCode()` 与改动日志里 —— `exportCode()` 末尾有一段专门扫 `texPreset` / `texAsset` / `materialSwap` 记录，这三类动作都没有快照条目。

撤销恢复的是**原纹理实例**（通常是 `null`），不是「再生成一张空图」。
