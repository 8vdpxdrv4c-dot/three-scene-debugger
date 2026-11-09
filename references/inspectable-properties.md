# 可调试属性对照表

控件通过存在性/类型检查动态生成。数字是 number 输入、布尔是 checkbox、Color 是颜色输入；枚举当前以 Three 常量的**数值/字符串**输入，不依赖某一 Three 版本内建枚举。不存在的属性不会伪造。Object3D 字段、材质、纹理和扩展各是独立 target，下拉切换；材质数组逐项建索引，共享引用去重。

## Object3D

| 属性路径 | 控件/语义 | 更新行为 |
|---|---|---|
| `position.x/y/z` | 世界单位、局部坐标 | 更新局部矩阵与 matrixWorldNeedsUpdate |
| `rotation.x/y/z`, `rotation.order` | **弧度**，order 为 XYZ/YZX/ZXY/XZY/YXZ/ZYX | Euler 保持与 quaternion 联动；whole `rotation` 只供原子 lookAt API |
| `scale.x/y/z` | 局部比例 | 同上；负数可翻转法线方向 |
| `visible`, `castShadow`, `receiveShadow` | 布尔 | 即时运行态，阴影还要开启 renderer/light |
| `renderOrder` | 数字 | 不改变父子层级 |
| `frustumCulled`, `matrixAutoUpdate` | 布尔 | 调整变换时即使 matrixAutoUpdate=false 也明确更新局部矩阵，不偷偷切换此标志 |
| `userData` | JSON textarea，change 时解析提交 | 不写内部元数据；函数/循环/unsafe key 不接受 |

不提供编辑 name/uuid/type/parent/children、原型方法和私有渲染缓存。新增/删除/重命名业务对象后手动刷新树，避免每帧 traverse。InstancedMesh 逐实例矩阵、骨骼、morph 轨道、任意自定义 shader 结构不是通用 Object3D 字段；扩展或业务工具另行处理。

## Material（按类型存在性动态生成）

| 组 | 属性 |
|---|---|
| 颜色/PBR | `color`, `roughness`, `metalness`, `emissive`, `emissiveIntensity`, `envMapIntensity` |
| 透明/绘制 | `opacity`, `transparent`, `side`, `wireframe`, `wireframeLinewidth`, `flatShading`, `vertexColors`, `alphaTest`, `alphaHash`, `depthTest`, `depthWrite`, `blending`, `dithering`, `premultipliedAlpha`, `toneMapped` |
| Phong/specular | `shininess`, `specular`, `specularIntensity`, `specularColor`, `reflectivity`, `refractionRatio` |
| Physical | `clearcoat`, `clearcoatRoughness`, `transmission`, `thickness`, `ior`, `attenuationDistance`, `attenuationColor`, `sheen`, `sheenColor`, `sheenRoughness`, `anisotropy`, `anisotropyRotation`, `dispersion` |
| 映射参数 | `normalScale.x/y`, `bumpScale`, `displacementScale`, `displacementBias`, `lightMapIntensity`, `aoMapIntensity` |
| 多边形偏移 | `polygonOffset`, `polygonOffsetFactor`, `polygonOffsetUnits` |
| 纹理槽 | 所有现有可枚举的 `map`、`*Map`、`matcap`、`gradientMap`，值为 Texture 或 null 时：已缓存 Texture 下拉替换/null |

除上表外，还反射当前材质公开自有的有限 number、boolean、Color、Vector2/3/4（排除身份字段、私有字段、方法，例如 combine、depthPacking、normalMapType、colorWrite、forceSinglePass、alphaToCoverage）。不会把 isMaterial/id/version 当可调参数。

每次材质编辑设 `material.needsUpdate=true`（简单但可能触发重新编译）；替换纹理亦设新 `texture.needsUpdate=true`，保留旧纹理引用供撤销。不会复制/加载另一份 GPU 纹理。纹理来源为场景材质、background/environment、`registerResource(texture)`；加载外部图像由应用 `TextureLoader` 或现有资产管理器负责，再注册并刷新。不会自动跨网络导入外部资源或 dispose 被替换资源。

`side`: `THREE.FrontSide/BackSide/DoubleSide`；`blending`: Three blending 常量。默认 Infinity（如 attenuationDistance）在原生 number 输入中可能显示为空；可改为有限数字，撤销能恢复 Infinity。特定边界属性的 Infinity 使用 tagged JSON 保持可序列化。ShaderMaterial 任意 uniforms **不在**通用材质字段表内；后处理 Pass uniforms 有专门安全枚举。

## Texture

| 属性 | 控件与注意 |
|---|---|
| `wrapS`, `wrapT` | 数字常量：RepeatWrapping / ClampToEdgeWrapping / MirroredRepeatWrapping |
| `repeat.x/y`, `offset.x/y`, `center.x/y` | 数字；repeat 非 1 通常要 RepeatWrapping |
| `rotation` | 弧度，围绕 center |
| `magFilter`, `minFilter` | Three filter 数值；Nearest/Linear 及 mipmap variants，mag 不能用 mipmap filter |
| `anisotropy`, `channel` | 数字；GPU 上限请查 renderer.capabilities |
| `generateMipmaps`, `flipY`, `matrixAutoUpdate` | 布尔 |
| `colorSpace` | 字符串：例如 `srgb`、`srgb-linear`、空字符串；颜色图通常 sRGB，法线/粗糙度等通常 NoColorSpace |

更新设置 `needsUpdate=true`；matrixAutoUpdate 开启时调 `updateMatrix()`。纹理维度/格式/type 等生命周期约束不伪装成可任意修改字段。不同 Three 版本采样器变化可能需要资产所有者重建纹理；调试器不替你释放用户资源。纹理分享给多个材质时修改作用于全部拥有者，快照只记录一个去重 texture target。

## Light

| 类型 | 属性 |
|---|---|
| 所有 Light（存在才显示） | `color`, `intensity`；继承所有 Object3D 字段 |
| Point/Spot | `distance`, `decay`, `power` |
| Spot | `angle`, `penumbra`（弧度/0..1，范围由用户负责） |
| RectAreaLight | `width`, `height`, `power`（如存在）；不支持原生 shadow map |
| 有 shadow 的 Light | `shadow.bias`, `shadow.normalBias`, `shadow.radius`, `shadow.blurSamples`, `shadow.autoUpdate`, `shadow.mapSize.x/y` |
| Directional shadow.camera | `left/right/top/bottom/near/far/zoom` |
| Spot/Point shadow.camera | 按存在性暴露 `near/far/fov/aspect/zoom`，引擎可能根据灯的 angle/distance 重算 |

改变 shadow.camera 立即 `updateProjectionMatrix()`；阴影相关编辑标记 renderer.shadowMap.needsUpdate，mapSize 标记 shadow.needsUpdate。mapSize 只接受正整数，推荐 2 的幂，不超过设备上限。**不会直接 dispose 已有 map/mapPass**；r187 引擎下一帧自动 resize 非 cube target，旧版与 PointLight cube target 需按 troubleshooting 由资产所有者明确失效/释放。这个版本/所有权限制在面板警告显示，不假装已做跨版本 GPU 清理。

## Camera

| 类型 | 属性 |
|---|---|
| 所有 Camera | 继承 position/rotation/scale；lookAt x,y,z 三坐标按钮，按一次原子 Euler 改动记录 |
| PerspectiveCamera | `fov`, `near`, `far`, `aspect`, `zoom`, `focus`, `filmGauge`, `filmOffset` |
| OrthographicCamera | `left`, `right`, `top`, `bottom`, `near`, `far`, `zoom` |
| OrbitControls（显式 controls 或 window.controls） | `enabled`, `enableDamping`, `dampingFactor`, `minDistance/maxDistance`, `minZoom/maxZoom`, `minPolarAngle/maxPolarAngle`, `minAzimuthAngle/maxAzimuthAngle`, `enableZoom/Rotate/Pan`, `autoRotate`, `autoRotateSpeed`, `zoomSpeed`, `rotateSpeed`, `panSpeed`, `screenSpacePanning`, `target.x/y/z` |

相机字段修改即更新投影矩阵；编辑 controls 时调 update()。应用每帧 controls.update 可能覆盖相机 rotation/lookAt，调 target 或暂时 disable controls。UI 中 Infinity 上限可改为有限值；API 对 maxDistance/maxZoom/minAzimuthAngle/maxAzimuthAngle/repetitions/attenuationDistance 支持 Infinity（快照使用 Number 标签），NaN 一律拒绝。

## Scene

| 属性 | 说明 |
|---|---|
| `background` | null / Color（嵌套色板） / 已注册 Texture；类型切换不修改资源本身 |
| `environment` | null / 已注册 Texture；HDR/EXR 与 PMREM 由应用准备 |
| `fog` | null / Fog / FogExp2 类型选择；创建类型需要注入 THREE |
| `fog.color`, `fog.near/far` 或 `fog.density` | 对应类型动态出现；API 切换 fog 后也立即更新可编辑字段 |
| `backgroundBlurriness`, `backgroundIntensity`, `environmentIntensity` | 若存在则数字 |
| `backgroundRotation.x/y/z`, `environmentRotation.x/y/z` | 若存在则 Euler 弧度 |

## Renderer

| 属性 | 说明 |
|---|---|
| `toneMapping` | 数值常量 NoToneMapping/Linear/Reinhard/Cineon/ACESFilmic/AgX/Neutral 等，取决版本 |
| `toneMappingExposure` | 数字 |
| `outputColorSpace` | 字符串；已有项目的色彩管理方案优先 |
| `shadowMap.enabled`, `shadowMap.type`, `shadowMap.autoUpdate` | 布尔/数值，编辑标记 needsUpdate |
| `pixelRatio` | 虚拟路径经 getPixelRatio/setPixelRatio 生效，限制不超过创建时 pixelRatioCap（默认 2） |

不会改变 renderer.info.autoReset，不 patch renderer.render，不重建 canvas/context。面板 draw calls/triangles 是引擎**最近一次 info**，多 Pass 统计是否累计由应用自己配置；不会声称为整帧精确累计。

## 可选扩展与性能

| 扩展 | 暴露内容/限制 |
|---|---|
| registerPostProcessing(composer) | 各 Pass 可枚举且公开的有限 number/boolean/Color/Vector2/3/4；`uniforms.<name>.value` 及最多 3 层安全嵌套；如 enabled/strength/radius/threshold。未知对象、函数、GPU target、私有字段不编辑 |
| registerAnimationMixer(mixer, actions?) | mixer 的公开有限数字/布尔，如 time/timeScale；每个 action 的 weight/timeScale/paused/enabled/loop/repetitions/clampWhenFinished/zeroSlopeAtStart/End（存在且类型适配）；不自动 play/stop，不创建 clip |
| FPS | 用户循环 tick 样本最近最多 120 帧；独立 RAF 仅更新 UI，不代表 render FPS |
| draw calls/triangles、memory 个数 | renderer.info 当前值；无 info 时为 0 |
| geometryBytesLowerBound | 缓存几何 attributes/index 的已知底层数据字节、buffer 去重，是下界估算，非 GPU 显存 |
| textureBaseBytesEstimate | CPU image.data 字节或 width*height*4 基础层估算；不含 mipmaps/cubemap faces/compression/render targets/driver 开销，非精确/保证下界的 GPU 数值 |

所有缓存只在打开面板/手动刷新构建场景树；性能采样遍历的是缓存集合，不 scene.traverse。新对象/新纹理应显式刷新。任意“所有影响渲染”的外部状态（GL 扩展、DOM/CSS、业务 shader/插件私有参数、节点材质图）不能由通用反射完整控制；本表是该实现明确支持的边界，禁止声称无所不能。
