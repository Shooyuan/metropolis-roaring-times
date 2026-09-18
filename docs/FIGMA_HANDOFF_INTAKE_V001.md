# 《Metropolis: Roaring Times》Figma 交付包 v001 验收报告

> 历史记录：本报告已由 `FIGMA_HANDOFF_INTAKE_V003.md` 取代，以下结论只描述 v001 当时状态。

> 验收日期：2026-08-13
>
> 验收阶段：M1W 输入门，仅检查，不修改项目负责人源文件
>
> 当前结论：**交付工具与统一画布通过；分区几何和 Brand 尚有阻断项，暂不进入网页接入。**

## 一、收到的项目负责人原始文件

| 文件 | 大小 | SHA-256 |
|---|---:|---|
| `assets/metropolis_handoff_1786625270806.zip` | 约 21 MB | `01493f2aee38f44c05b31a935fec9ff2bf37686bdb1c1271181235f5408c38fc` |
| `assets/metropolis_roaring_times_map_v001.fig` | 约 2.3 MB | `3e3fbd6434d3aa14577eaae33ce3fa52daca4efff9a22983980245ac35208374` |
| `assets/00_BRAND.svg` | 约 4.1 MB | `fb1d59f6522e8be7e92dab87d849c4f839baa5b81318239c5e10bd4e96ea7981` |
| `assets/06_FRAME.svg` | 约 122 KB | `bf841764a97fd2bd1e89c355c9ac87415b074091532317782041da387200b2aa` |

上述文件保持原样，Codex 没有移动、覆盖、重画或提交这些二进制/美术源文件。

## 二、通过项

| 检查项 | 结果 | 证据 |
|---|---|---|
| ZIP 完整性 | 通过 | 13 个文件均通过系统解压校验，无损坏项 |
| 插件警告 | 通过 | `export_summary.json` 中 `warnings` 为空 |
| 任意尺寸矢量画布 | 通过 | 实际画布为 `10334 × 14101`，不受固定像素尺寸限制 |
| `.fig` 与交付画布登记 | 通过 | `.fig` 的文件名、画布宽高及绝对坐标与 `figma_document.json` 一致 |
| 六个地图顶层图层 | 通过 | `01_WATER`、`02_COASTLINE`、`03_DISTRICT_GEOMETRY`、`04_ROADS`、`05_NON_BUILDING_ORNAMENT`、`06_FRAME` 全部存在 |
| 四份主要 SVG 注册 | 通过 | 完整地图、底图、分区和对齐 SVG 均为 `viewBox="0 0 10334 14101"` |
| 六份逐层 SVG 注册 | 通过 | 六份逐层 SVG 使用同一 `viewBox`，可按统一坐标叠加 |
| SVG 格式 | 通过 | 所有导出 SVG 均为合法 XML |
| 正式底图隔离 | 通过 | `metropolis_map_base.svg` 不包含任何 `district_*` 图层 |
| 纯矢量交付 | 通过 | 包内 `imageCount` 为 `0`，未发现脚本或外部网络资源 |
| PNG 缺席 | 通过 | 项目负责人按要求保持 PNG 预览关闭；不影响 SVG 主交付 |
| 独立 Brand 流程 | 通过 | Brand 不在地图六层中，使用独立 `00_BRAND.svg` 交付 |

## 三、必须修正的阻断项

### B-01：SoHo 分区被隐藏，正式分区 SVG 缺失

- 结构 JSON 中存在 `district_soho`，但其 `visible` 为 `false`；
- 正式分区 SVG、完整地图 SVG 和对齐 SVG 都只有 11 个分区 ID，不包含 `district_soho`；
- 因此网页无法为 SoHo 建立可靠的悬停、点击和详情区域。

项目负责人在 Figma 中需要做：展开 `03_DISTRICT_GEOMETRY`，打开 `district_soho` 的眼睛图标并保持可见，然后重新导出。

### B-02：Financial District 技术 ID 拼写错误

- 当前名称：`district_finicial_district`；
- 应改为：`district_financial_district`；
- 错误名称同时进入结构 JSON 和正式分区 SVG，若直接接入会形成长期存档与数据 ID 债务。

项目负责人在 Figma 中需要做：只修改图层名称，不移动或改变形状。

### B-03：Chelsea 权威矢量路径未闭合

- `district_chelsea` 有一条矢量路径；
- 结构 JSON 中该路径末尾没有闭合命令，其余当前可见单路径分区均已闭合；
- 开放路径不能直接作为稳定的填充、碰撞和点击多边形权威来源。

项目负责人在 Figma 中需要做：进入矢量编辑，连接 Chelsea 的首尾节点，使轮廓真正闭合；不要仅依赖填充视觉上自动封口。

### B-04：独立 Brand 标题缺少已批准的冒号

- 当前可见标题为 `Metropolis Roaring Times`；
- 项目已批准的正式标题为 `Metropolis: Roaring Times`；
- 当前 `00_BRAND.svg` 因此不能作为最终正式 Brand 接入 M1W。

项目负责人在 Figma 中需要做：在 `Metropolis` 后加入冒号，重新导出独立透明 Brand SVG。

## 四、需要项目负责人明确裁决的文档冲突

当前 Figma 中共有以下 12 个地理分区节点：

```text
district_inwood
district_washington_heights
district_harlem
district_upper_east
district_upper_west
district_midtown_west
district_midtown_east
district_chelsea
district_west_village
district_east_village
district_soho
district_financial_district（修正后）
```

但现有项目交付规范仍保留早期六分区模型。Codex 不应擅自把 12 个地理分区合并回六区，也不应在没有项目负责人确认时将 12 区直接写成最终游戏数据。

项目负责人已于 2026-08-13 正式确认：以上 12 个分区替代旧六分区，作为 M1W 和后续游戏的权威分区集合。本报告保留原始冲突记录用于追溯。

## 五、非阻断风险

- `03_DISTRICT_GEOMETRY` 的 12 个分区使用相近紫色；程序可依靠稳定 ID 区分，所以不构成技术阻断，但网页接入时必须验证相邻边界点击不会串区；
- SVG 可无损缩放，但地图线条和滤镜较复杂。M1W 必须在 Chrome 实测初次加载、拖拽、固定倍率缩放和内存，必要时只优化网页运行副本；
- 当前 `.fig` 是 2026-08-12 的本地快照。项目负责人完成上述修正后，必须再次执行 `File → Save local copy…`，使新的 `.fig` 与新 ZIP 成为同一修订版。

## 六、重新交付的最短步骤

1. 显示 `district_soho`；
2. 将 `district_finicial_district` 改为 `district_financial_district`；
3. 真正闭合 `district_chelsea`；
4. 将 Brand 标题改为 `Metropolis: Roaring Times`；
5. 保存新的本地 `.fig`；
6. 重新运行插件，保持 PNG 预览关闭，导出新 ZIP；
7. 将新 `.fig`、新 ZIP 和新 `00_BRAND.svg` 放入 `assets/`，把路径告诉 Codex。

## 七、阶段门禁结论

- `DOC-007B` 插件导出结构：**通过**；
- `DOC-007A` 权威分区几何：**未通过**；
- Brand 标题验收：**未通过**；
- M1W 网页地图接入授权：**暂不进入**，等待项目负责人修正并确认 12 分区裁决。
