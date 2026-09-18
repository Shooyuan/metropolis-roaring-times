# Metropolis Handoff Exporter 使用说明

这是《Metropolis: Roaring Times》项目专用的本地 Figma 开发插件。它把原本需要手工切换图层、分别导出的工作合并成一次 ZIP 导出。

## 插件保存什么

- 快速模式保存主画框的紧凑图层树、父子关系和图层顺序；完整模式另存当前页面的完整重型矢量结构；
- 每个节点的名称、类型、显示/锁定状态；
- 相对/绝对坐标、尺寸、旋转和变换矩阵；
- 填充、描边、透明度、渐变、混合模式、圆角和效果；
- 文字内容、分段文字样式和矢量路径；
- 当前主地图和独立 Brand 实际使用的原始图片填充，并按图片哈希去重；
- 网页制作需要的纯底图 SVG、分区 SVG、逐地标 SVG、地标坐标清单、可购买地块 SVG，以及可选的完整地图、历史地标总图、对齐预览、PNG、Brand SVG/PNG；
- 选择完整归档模式时，每个顶层图层在同一主画框坐标中的独立 SVG。

插件不会联网，也不会修改项目源文件。导出时会创建临时副本，完成单项导出后立即删除。

## 第一次安装

1. 使用 Figma 桌面版打开地图 `.fig` 文件。
2. 打开菜单 `Plugins → Development → Import plugin from manifest…`。
3. 选择本目录中的 `manifest.json`：

   ```text
   tools/figma_handoff_exporter/manifest.json
   ```

4. 安装后，插件会出现在 `Plugins → Development → Metropolis Handoff Exporter`。

## 每次导出

1. 选中地图最外层主画框；如果八个地图图层直接并列，则选中 `08_PURCHASABLE_BLOCK_GEOMETRY`、`07_HISTORICAL_LANDMARKS`、`06_FRAME`、`05_NON_BUILDING_ORNAMENT`、`04_ROADS`、`03_DISTRICT_GEOMETRY`、`02_COASTLINE` 或 `01_WATER` 中任意一层即可。
2. 插件接受任意实际画布尺寸。没有外层 Frame 时，会按所选 `06_FRAME`/`01_WATER` 或同级地图图层的实际边界和顺序临时建立虚拟主画框，不会改变原稿。
3. 运行 `Metropolis Handoff Exporter`。
4. 确认插件显示实际画布尺寸和地图图层数量。默认选择“大地图快速交付（推荐）”。
5. 点击“一键导出 ZIP”。快速模式不生成最耗时的完整主画框、对齐合成预览和重复的逐顶层 SVG。
6. 将下载的 ZIP 文件放入项目或直接交给 Codex 检查。

不需要手工隐藏图层，不需要分别导出 PNG/SVG，也不需要截图解释位置。

如果插件仍显示“等待识别地图图层”，先关闭插件窗口，再从 `Plugins → Development → Metropolis Handoff Exporter` 重新运行，以载入最新代码。

## ZIP 内容

```text
handoff/
├── figma_document.json
├── landmarks.json
└── export_summary.json
export/
├── metropolis_map_base.svg
├── metropolis_district_geometry.svg
├── metropolis_purchasable_blocks.svg
├── metropolis_brand_logo.svg（Figma 中存在 Brand 时）
├── master_full.svg（仅完整归档模式）
├── metropolis_historical_landmarks.svg（仅完整归档模式）
├── metropolis_map_base.png（仅完整归档模式且主动选择 PNG）
├── metropolis_alignment_preview.svg（仅完整归档模式）
└── metropolis_alignment_preview.png（仅完整归档模式且主动选择 PNG）
landmarks/（快速模式）
├── landmark_st_paul_the_apostle_church.svg
├── landmark_west_side_ymca.svg
└── 每个历史地标父组一个局部 SVG
layers/（仅完整归档模式）
└── 每个顶层图层的全画框 SVG
images/
└── 主地图和独立 Brand 引用的原始图片
README_ZH_CN.txt（中文内容）
```

## 仍需保留 `.fig` 的原因

插件能保存网页接入所需的图层、位置、颜色、矢量、文字和图片信息，但 Figma 插件 API 不提供完整版本历史、评论、分支和所有内部协作元数据。因此 ZIP 是开发交付包，不是 `.fig` 的替代品。每个正式版本仍需使用 `File → Save local copy…` 保存一份本地 `.fig`。

## 当前约定的顶层图层

插件尊重实际 Figma 顺序，不会重排图层。当前项目负责人批准的顺序是：

```text
08_PURCHASABLE_BLOCK_GEOMETRY
07_HISTORICAL_LANDMARKS
06_FRAME
05_NON_BUILDING_ORNAMENT
04_ROADS
03_DISTRICT_GEOMETRY
02_COASTLINE
01_WATER
```

`00_BRAND` 是地图之外的独立素材，可以保留在 Figma 中，也可以像当前项目一样单独交付。地图底图自动隐藏 `03_DISTRICT_GEOMETRY`、`07_HISTORICAL_LANDMARKS`、`08_PURCHASABLE_BLOCK_GEOMETRY` 和可能存在的 `00_BRAND`；三类运行时覆盖层分别导出，因而不会被烘焙到底图中。

## 两种导出模式

- **大地图快速交付（默认、推荐）**：保存紧凑结构 JSON、纯底图、街区、逐地标 SVG、地标坐标清单、可购买地块、Brand 和主地图原始图片；跳过容易让超大画布卡住的整图 SVG、历史地标总 SVG、对齐合成预览、逐顶层重复 SVG 和 PNG。精确矢量几何由各生产 SVG 保存，JSON 不再重复复制重型 `vectorNetwork`/`vectorPaths`。
- **完整归档交付**：生成历史地标总 SVG，并继续生成整图 SVG、对齐预览、完整重型结构；还可生成逐顶层 SVG 和 PNG。只在需要长期归档或人工逐层对照时使用。

历史地标中的插画、横幅和文字可以保持为三个子图层，但每座地标必须置于同一个稳定父级 Group/Frame 内。`handoff/landmarks.json` 保存父子关系、相对主画框坐标、尺寸和变换；对应的局部 SVG 保持该父组内的实际叠放效果。网页以 JSON 坐标放置局部 SVG，不依赖一张超大透明画布。

父组、插画和横幅的推荐命名为：

```text
07_HISTORICAL_LANDMARKS
└── landmark_st_paul_the_apostle_church
    ├── label
    │   ├── label_text
    │   └── label_frame
    └── illustration
```

现有 `st-paul-the-apostle-church`、`title`、具体文字名和 `Rectangle 6` 不会导致卡顿，也不会阻止导出；插件会把父组名规范化为 `landmark_st_paul_the_apostle_church` 一类的运行时候选 ID，并在清单中同时保留原始 Figma 名称。改名只是便于后续检查，最终 ID 仍在接入验收时由项目负责人审批。真正影响速度的是把所有含位图的地标一次性导成主画布尺寸的总 SVG，因此快速模式已经取消该步骤。
