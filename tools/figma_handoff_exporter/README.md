# Metropolis Handoff Exporter 使用说明

这是《Metropolis: Roaring Times》项目专用的本地 Figma 开发插件。它把原本需要手工切换图层、分别导出的工作合并成一次 ZIP 导出。

## 插件保存什么

- 当前页面完整图层树、主画框图层树、父子关系和图层顺序，包括主画框外的 Brand 或参考节点；
- 每个节点的名称、类型、显示/锁定状态；
- 相对/绝对坐标、尺寸、旋转和变换矩阵；
- 填充、描边、透明度、渐变、混合模式、圆角和效果；
- 文字内容、分段文字样式和矢量路径；
- Figma 中使用的原始图片填充；
- 网页制作需要的地图底图 PNG、分区 SVG、对齐预览 PNG、Brand SVG/PNG；
- 每个顶层图层在同一主画框坐标中的独立 SVG。

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

1. 选中地图最外层主画框。
2. 主画框应命名为 `MAP_MASTER_4474x5904`，尺寸应为 `4474 × 5904`。
3. 运行 `Metropolis Handoff Exporter`。
4. 确认插件显示正确尺寸和顶层图层数量。
5. 点击“一键导出 ZIP”。
6. 将下载的 ZIP 文件放入项目或直接交给 Codex 检查。

不需要手工隐藏图层，不需要分别导出 PNG/SVG，也不需要截图解释位置。

## ZIP 内容

```text
handoff/
├── figma_document.json
└── export_summary.json
export/
├── master_full.svg
├── metropolis_map_base.png
├── metropolis_district_geometry.svg
├── metropolis_alignment_preview.png
├── metropolis_brand_logo.svg
└── metropolis_brand_logo.png
layers/
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
06_FRAME
05_NON_BUILDING_ORNAMENT
04_ROADS
03_DISTRICT_GEOMETRY
02_COASTLINE
01_WATER
00_BRAND
```

地图底图自动隐藏 `03_DISTRICT_GEOMETRY` 和 `00_BRAND`；分区 SVG 只保留 `03_DISTRICT_GEOMETRY`；对齐预览显示分区但隐藏 Brand；Brand 单独导出。
