# 素材来源与派生清单

## 地图运行素材 V001

| 字段 | 内容 |
|---|---|
| 源交付 | 项目负责人在 Figma 创作并通过 `Metropolis Handoff Exporter` 导出的 `metropolis_handoff_1788840097378.zip` |
| 源哈希 | `cd9102c32e9162731248f86e732aa067b7e66470b459fbf1bef804ef9b312873` |
| 作者与权利说明 | 地图几何、地标位置与重绘插画由项目负责人提供；项目内部使用，最终公开许可仍由项目负责人负责确认 |
| 派生工具 | `tools/map_handoff_processor/process_handoff.py` |
| 派生目录 | `assets/runtime_map_v001/` |
| 内容 | 1 个底图 SVG、2 个几何 SVG、52 个透明 WebP 插画、52 个横幅 SVG、2 个运行数据 JSON 和审查材料 |
| 处理设置 | Figma 节点宽高 × 4 像素，最长边 2048，WebP quality 92，Lanczos 重采样 |
| 几何策略 | 不平滑、不删点、不移动；共享 `10334 × 14101` 主画布 |
| 审批状态 | 自动校验通过；等待项目负责人视觉审批接触表和对齐页 |

52 个地标的逐项源名、运行 ID、图片哈希、源尺寸、派生尺寸和地图坐标见 `assets/runtime_map_v001/landmarks.json`。30 个地块的源节点、几何哈希、价格层级和固定基础地价见 `assets/runtime_map_v001/plots.json`。

## 通用开发建筑 PNG V001

| 运行时文件 | 项目负责人源文件 | 用途 |
|---|---|---|
| `m0_web/assets/buildings/construction_site.png` | `assets/工地.png` | 地块购买后、建造完成前、改建完成前显示的工地 |
| `m0_web/assets/buildings/standard_apartment.png` | `assets/普通公寓.png` | Standard Apartment 建成后显示 |
| `m0_web/assets/buildings/luxury_apartment.png` | `assets/豪华公寓.png` | Luxury Apartment 建成后显示 |
| `m0_web/assets/buildings/department_store.png` | `assets/商店.png` | Department Store 建成后显示 |
| `m0_web/assets/buildings/factory.png` | `assets/工厂.png` | Factory 建成后显示 |

这五张图由项目负责人上传，原始文件保留在 `assets/`。网页运行时使用英文稳定文件名副本，避免中文路径、浏览器编码和后续 GitHub 部署造成资源引用风险。

## 中文界面字体 V001

| 运行时文件 | 用途 |
|---|---|
| `m0_web/assets/fonts/SourceHanSerifCN-Bold-2.otf` | 简体中文标题、弹窗标题、重要菜单和重点控件 |
| `m0_web/assets/fonts/SourceHanSerifCN-Medium-6.otf` | 简体中文正文、按钮、详情栏、普通 UI 文案 |

这两份 OTF 文件由项目负责人指定为当前中文界面的权威字体。旧 `m0_web/fonts/SourceHanSerifSC-M1W.woff2` 和 `m0_web/fonts/SourceHanSansSC-M1W.woff2` 暂不删除，作为历史合版兼容资料保留；新实现不再把它们作为中文界面首选字体。

## 英文正文字体 V002

| 运行时文件 | 用途 |
|---|---|
| `m0_web/assets/fonts/Adobe-SongTi-Std-L-2.otf` | 英文正文、按钮、普通 UI 文案和弹窗正文 |

这份 OTF 文件由项目负责人指定为当前英文正文字体。装饰性大标题仍可继续使用 `Inknut Antiqua M1W`，以保留既有标题风格。

## 地图街区标签字体 V001

| 运行时文件 | 用途 |
|---|---|
| `m0_web/assets/fonts/Kings-Regular.ttf` | 地图本体上的街区英文地名标签 |

这份 TTF 由项目负责人指定为当前 M1W 地图街区标签字体。地图标签固定使用英文地名，不随界面语言切换；右侧详情栏和无障碍名称继续走本地化文案。
