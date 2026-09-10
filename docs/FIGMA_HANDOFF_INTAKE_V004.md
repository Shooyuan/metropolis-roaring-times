# Figma 地图交付验收 V004

> 验收日期：2026-09-08
> 状态：结构与自动校验通过，等待老板视觉审批后才能接入网页或 Godot。

## 1. 源交付

| 项目 | 结果 |
|---|---|
| 源文件 | `metropolis_handoff_1788840097378.zip` |
| 归档位置 | `assets/source_handoffs/metropolis_map_v001/`（Git 忽略，不公开上传） |
| SHA-256 | `cd9102c32e9162731248f86e732aa067b7e66470b459fbf1bef804ef9b312873` |
| 文件大小 | 1,258,748,423 bytes |
| 导出模式 | `fast` |
| 插件警告 | 0 |
| 主画布 | `10334 × 14101` |

源 ZIP 不损坏、不删除。它很大的原因不是 52 个地标本身不可用，而是每个地标 PNG 同时出现在 `images/` 和对应 SVG 的 Base64 内嵌数据中，产生约 538MB 的重复。

## 2. 内容清点

- 顶层图层：8 个，名称和顺序符合当前合同；
- 街区：12 个权威街区；
- 历史地标：52 个，清单、SVG、原始图片和坐标一一对应；
- 可购买地块：30 个闭合路径；
- 价格层级：`cheap` 5 个、`medium` 23 个、`expensive` 2 个；
- 所有地标和地块边界均在主画布内。

## 3. 已解决的问题

1. 用 `tools/map_handoff_processor/` 将地标 SVG 中的重复内嵌 PNG 拆出，生成透明 `WebP` 和独立横幅 SVG；运行包约 17MB，相对源 ZIP 缩减约 98.63%。
2. 清除 `_transparent`、连续下划线和标点造成的 ID 异常，例如 `landmark_manhattan_bridge_transparent` 改为 `landmark_manhattan_bridge`，同时在数据中保留源名追溯。
3. 不信任 Figma 子层的重复数字；按北到南、同排西到东生成 `plot_001`—`plot_030`。
4. 按老板确认保留三个 Figma 价格父组，并在批准区间内按固定种子、几何路径和 `$500` 步长生成精确基础地价。结果已固化，不会每局变化。

## 4. 派生交付

`assets/runtime_map_v001/` 包含：

- 正式底图、街区几何、带稳定 ID 的地块几何；
- `landmarks.json`、`plots.json`；
- 52 个透明 `WebP` 插画和 52 个横幅 SVG；
- `processing_report.json`；
- `review/landmark_contact_sheet.webp`；
- `review/alignment_review.html`；
- `OWNER_REVIEW_ZH_CN.md`。

## 5. 剩余风险与审批门

- 横幅仍声明 `Jacquard 24` 字体；正式网页接入前必须随项目提供该字体或由老板批准替代。
- 仓库内现有 `.fig` 快照修改日期早于本次 ZIP；老板仍须从当前 Figma 文件保存一份与 `v004` 同步的新版本化 `.fig`，否则 ZIP 只能证明导出结果，不能替代可编辑源版本。
- 本次没有修改现有网页，也没有实现地块交互。
- 老板必须检查接触表的图像质量与离线对齐页的位置。视觉未批准前不得进入接入阶段。
