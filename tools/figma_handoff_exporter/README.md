# Metropolis Handoff Exporter 使用说明

这是《Metropolis: Roaring Times》项目专用的本地 Figma 开发插件。它把原本需要手工切换图层、分别导出的工作合并成一次 ZIP 导出。

## 插件保存什么

- 当前页面完整图层树、主画框图层树、父子关系和图层顺序，包括主画框外的 Brand 或参考节点；
- 每个节点的名称、类型、显示/锁定状态；
- 相对/绝对坐标、尺寸、旋转和变换矩阵；
- 填充、描边、透明度、渐变、混合模式、圆角和效果；
- 文字内容、分段文字样式和矢量路径；
- Figma 中使用的原始图片填充；
- 网页制作需要的纯底图 SVG、分区 SVG、历史地标 SVG、可购买地块 SVG，以及可选的完整地图、对齐预览、PNG、Brand SVG/PNG；
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
└── export_summary.json
export/
├── metropolis_map_base.svg
├── metropolis_district_geometry.svg
├── metropolis_historical_landmarks.svg
├── metropolis_purchasable_blocks.svg
├── metropolis_brand_logo.svg（Figma 中存在 Brand 时）
├── master_full.svg（仅完整归档模式）
├── metropolis_map_base.png（仅完整归档模式且主动选择 PNG）
├── metropolis_alignment_preview.svg（仅完整归档模式）
└── metropolis_alignment_preview.png（仅完整归档模式且主动选择 PNG）
layers/（仅完整归档模式）
└── 每个顶层图层的全画框 SVG
images/
└── Figma 图片填充的原始文件
README_ZH_CN.txt（中文内容）
```

## 仍需保留 `.fig` 的原因

插件能保存网页接入所需的图层、位置、颜色、矢量、文字和图片信息，但 Figma 插件 API 不提供完整版本历史、评论、分支和所有内部协作元数据。因此 ZIP 是开发交付包，不是 `.fig` 的替代品。每个正式版本仍需使用 `File → Save local copy…` 保存一份本地 `.fig`。

## 当前约定的顶层图层

插件尊重实际 Figma 顺序，不会重排图层。当前老板批准的顺序是：

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

- **大地图快速交付（默认、推荐）**：保存完整结构 JSON、纯底图、街区、历史地标、可购买地块、Brand 和原始图片；跳过容易让超大画布卡住的整图 SVG、对齐合成预览、逐顶层重复 SVG 和 PNG。
- **完整归档交付**：在快速交付内容之外，继续生成整图 SVG、对齐预览，并可生成逐顶层 SVG 和 PNG。只在需要长期归档或人工逐层对照时使用。

历史地标中的插画、横幅和文字可以保持为三个子图层，但每座地标必须置于同一个稳定父级 Group/Frame 内。结构 JSON 会保存父子关系和精确坐标，历史地标 SVG 会保持实际叠放效果。
