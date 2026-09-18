# M1W 文案定位总表（内部编辑版）

> 目的：把当前游戏所有可见/半可见文案按界面位置归档，方便修改、增加、删除。本文档是内部文案审查台；最终玩家文案以 `m0_web/` 中的运行时词条为准。

> 红线：任何玩家可见文案都不得出现“老板绘制”“等待批准”“制作人演示”“正式制作输入”等工程身份或审批流程措辞。内部风险和审批记录应写在项目管理文档，不进入游戏界面。

> 主要来源：`m0_web/locales/en-US.js`、`m0_web/locales/zh-CN.js`、`m0_web/index.html` 中由 i18n 管理的静态文本。

## 使用方法

- 想改英文：优先改“英文当前文案”。
- 想改中文：优先改“中文当前文案”。
- 想删某类文案：先看“界面定位”，确认它是否是按钮、弹窗、错误提示或无障碍文本。
- `static.*`：HTML 中直接显示的静态文案及其中文翻译。

## 分区索引

- `activity.*`：动态记录
- `aria.*`：无障碍辅助文案
- `attribute.*`：无障碍属性静态翻译
- `bank.*`：银行/贷款
- `building.*`：建筑名称
- `confirm.*`：确认弹窗
- `district.*`：街区名称、位置与说明
- `economy.*`：经济周期
- `entity_file.*`：右侧详情栏档案标题
- `home.*`：启动页与新游戏弹窗
- `landmark.*`：历史地标详情占位文案
- `law.*`：法令状态
- `map.*`：地图提示、缩放与选择状态
- `market_message.*`：市场简报
- `meta.*`：浏览器元信息
- `news.*`：新闻/投资建议消息
- `owner.*`：业主/归属状态
- `plot.*`：地块名称与价格层级
- `plot_mark.*`：地图地块状态标记
- `property.*`：地产详情与操作文案
- `reason.*`：按钮禁用/不可操作原因
- `result.*`：结算弹窗
- `rival.*`：对手名称与风格
- `rival_condition.*`：对手状态
- `security.*`：证券/股票市场标的
- `static.*`：HTML 静态文案/兼容翻译
- `status.*`：顶部状态栏/结束回合提示
- `stock.*`：股票市场操作
- `toast.*`：短提示 Toast
- `zone.*`：用地/法令区域

## 动态记录（`activity.*`）

- 界面定位：News/Activity 中由系统生成的日志记录。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `activity.borrowed` | Borrowed {amount}; due at the end of turn {dueTurn}. | 借入 {amount}，将于第 {dueTurn} 回合结束时到期。 |  |
| `activity.construction_started` | Started {building} construction on {plot}. | 在{plot}开始建造{building}。 |  |
| `activity.debt_repaid` | Repaid {amount} of debt. | 偿还了 {amount} 债务。 |  |
| `activity.legacy_text` | [Legacy record] {text} | [旧版记录] {text} |  |
| `activity.match_entered` | {rival} enters the Manhattan market on equal starting value. | {rival}以相同初始资产进入曼哈顿市场。 |  |
| `activity.matured_debt_paid` | Paid {due} in matured principal and interest. | 已支付到期本金与利息 {due}。 |  |
| `activity.operating_settlement` | Operating settlement: you {playerIncome}, rival {rivalIncome}. | 经营结算：你获得 {playerIncome}，对手获得 {rivalIncome}。 |  |
| `activity.property_purchased` | Purchased {plot} for {price}. | 以 {price} 购买了{plot}。 |  |
| `activity.redeveloped` | Redeveloped {plot} from {fromBuilding} to {toBuilding} for {amount}. | 花费 {amount}，将{plot}的{fromBuilding}改建为{toBuilding}。 |  |
| `activity.rival_construction` | {rival} began a {building} on {plot}. | {rival}在{plot}开始建造{building}。 |  |
| `activity.rival_investment` | {rival} invested {amount} in {ticker}. | {rival}向 {ticker} 投资了 {amount}。 |  |
| `activity.rival_purchase` | {rival} purchased {plot} for {price}. | {rival}以 {price} 购买了{plot}。 |  |
| `activity.sale_locked` | Brokered sale locked for {plot} at {price}; settlement next turn. | {plot}的经纪出售价格已锁定为 {price}，下一回合结算。 |  |
| `activity.sale_settled` | {plot} brokered sale settled for {price}. | {plot}的经纪出售以 {price} 完成结算。 |  |
| `activity.stock_buy` | Bought {amount} of {ticker}; fee {fee}. | 买入 {amount} 的 {ticker}；手续费 {fee}。 |  |
| `activity.stock_sell` | Sold {amount} of {ticker}; fee {fee}. | 卖出 {amount} 的 {ticker}；手续费 {fee}。 |  |
| `activity.zoning_active` | Residential zoning restrictions are now active. | 住宅分区限制现已生效。 |  |

## 无障碍辅助文案（`aria.*`）

- 界面定位：屏幕阅读器与可访问性文本，玩家通常看不到，但不能乱删。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `aria.landmark` | Inspect historical landmark: {landmark} | 查看历史地标：{landmark} |  |
| `aria.plot` | {plot}, {owner}, {building} | {plot}，{owner}，{building} |  |
| `aria.select_district` | Select {district} | 选择{district} |  |

## 无障碍属性静态翻译（`attribute.*`）

- 界面定位：HTML aria-label/title 等静态属性翻译。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `attribute.Close help` |  | 关闭玩法说明 |  |
| `attribute.Close selected district` |  | 关闭所选街区 |  |
| `attribute.Close settings` |  | 关闭设置 |  |
| `attribute.Selected map entity file` |  | 地图对象档案 |  |
| `attribute.Future board mascot placeholder` |  | 未来看板玩偶占位区 |  |
| `attribute.Home language` |  | 启动页语言 |  |
| `attribute.Interactive Manhattan map. Drag to pan, use plus and minus to zoom, and select a district for details.` |  | 曼哈顿交互地图。拖动以平移，使用加减按钮缩放，选择街区查看详情。 |  |
| `attribute.Language` |  | 语言 |  |
| `attribute.Main menu` |  | 主菜单 |  |
| `attribute.Main menu actions` |  | 主菜单操作 |  |
| `attribute.Map controls` |  | 地图控制 |  |
| `attribute.Map legend` |  | 地图图例 |  |
| `attribute.Match status` |  | 对局状态 |  |
| `attribute.Metropolis: Roaring Times` |  | Metropolis: Roaring Times |  |
| `attribute.Metropolis: Roaring Times map demo` |  | Metropolis: Roaring Times 地图演示 |  |
| `attribute.Next language` |  | 下一种语言 |  |
| `attribute.Opening menu` |  | 启动菜单 |  |
| `attribute.Operations Desk` |  | 综合操作栏 |  |
| `attribute.Operations pages` |  | 综合操作页面 |  |
| `attribute.Manhattan district map` |  | 曼哈顿街区地图 |  |
| `attribute.Illustrated Manhattan map` |  | 曼哈顿插画地图 |  |
| `attribute.Thirty purchasable plots` |  | 三十个可购地块 |  |
| `attribute.Previous language` |  | 上一种语言 |  |
| `attribute.System actions` |  | 系统操作 |  |
| `attribute.Twelve selectable Manhattan districts` |  | 十二个可选曼哈顿街区 |  |
| `attribute.Zoom in` |  | 放大 |  |
| `attribute.Zoom out` |  | 缩小 |  |

## 银行/贷款（`bank.*`）

- 界面定位：银行页签：贷款、利率、还款和债务到期。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `bank.loan_due` | {amount} due at the end of turn {turn} | {amount} 将于第 {turn} 回合结束时到期 |  |
| `bank.no_loans` | No outstanding loans. | 暂无未偿贷款。 |  |
| `bank.rate` | {rate}% per turn | 每回合 {rate}% |  |

## 建筑名称（`building.*`）

- 界面定位：地块详情栏、建造/改建下拉框、地图地块标记。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `building.department_store.name` | Department Store | 百货商场 |  |
| `building.department_store.short` | STORE | 商场 |  |
| `building.factory.name` | Factory | 工厂 |  |
| `building.factory.short` | FAC | 工厂 |  |
| `building.luxury_apartment.name` | Luxury Apartment | 豪华公寓 |  |
| `building.luxury_apartment.short` | LUX | 豪宅 |  |
| `building.standard_apartment.name` | Standard Apartment | 标准公寓 |  |
| `building.standard_apartment.short` | APT | 公寓 |  |

## 确认弹窗（`confirm.*`）

- 界面定位：所有 `window.confirm` 确认句；后续可改成正式 Art Deco 弹窗。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `confirm.borrow` | Borrow $10,000 at {rate}% interest per turn? Principal plus accrued interest is due at the end of turn {turn}. | 是否借款 $10,000？每回合利率为 {rate}%，本金与累计利息将在第 {turn} 回合结束时到期。 |  |
| `confirm.brokered_sale` | Commit {plot} to a brokered sale for {amount}? It settles next turn and uses 1 action point. | 是否将{plot}以 {amount} 提交经纪出售？交易将在下一回合结算，并消耗 1 点行动点。 |  |
| `confirm.build` | Build {building} for {amount}? It becomes operational next turn. | 是否花费 {amount} 建造{building}？建筑将在下一回合投入运营。 |  |
| `confirm.buy_plot` | Buy {plot} for {amount}? This uses 1 action point. | 是否以 {amount} 购买{plot}？此操作消耗 1 点行动点。 |  |
| `confirm.end_turn` | End turn {turn}? Income, debt interest and the rival action will settle. | 是否结束第 {turn} 回合？经营收入、债务利息和对手行动将进行结算。 |  |
| `confirm.redevelop` | Replace {fromBuilding} with {toBuilding} for {amount} after the 120% residual credit? | 计入旧建筑 120% 残值抵扣后，是否花费 {amount} 将{fromBuilding}改建为{toBuilding}？ |  |
| `confirm.repay` | Apply up to {amount} to the oldest loan? This uses no action point. | 是否最多使用 {amount} 偿还最早的贷款？此操作不消耗行动点。 |  |
| `confirm.restart` | Abandon this match and choose a new rival? Your saved match will remain available. | 是否放弃当前对局并选择新对手？已经保存的对局仍会保留。 |  |
| `confirm.stock_buy` | Buy {amount} of {ticker} plus a {fee} fee? | 是否买入 {amount} 的 {ticker}，并支付 {fee} 手续费？ |  |
| `confirm.stock_sell` | Sell {amount} of {ticker} and pay a {fee} fee? | 是否卖出 {amount} 的 {ticker}，并支付 {fee} 手续费？ |  |

## 街区名称、位置与说明（`district.*`）

- 界面定位：地图街区标签、右侧街区档案、悬停/选择提示。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `district.district_chelsea.label` | CHELSEA | 切尔西 |  |
| `district.district_chelsea.location` | West Side, south of Midtown | 西区，中城以南 |  |
| `district.district_chelsea.name` | Chelsea | 切尔西 |  |
| `district.district_chelsea.note` | A West Side district between Midtown bustle and Village streets. | 夹在中城喧闹与乡区街道之间的西区街区。 |  |
| `district.district_east_village.label` | EAST\|VILLAGE | 东乡 |  |
| `district.district_east_village.location` | Lower East Side | 下东区 |  |
| `district.district_east_village.name` | East Village | 东乡 |  |
| `district.district_east_village.note` | Dense neighborhood streets on the eastern side of the Village. | 乡区东侧街道密集、生活繁忙的街区。 |  |
| `district.district_financial_district.label` | FINANCIAL\|DISTRICT | 金融区 |  |
| `district.district_financial_district.location` | Southern Manhattan | 曼哈顿南部 |  |
| `district.district_financial_district.name` | Financial District | 金融区 |  |
| `district.district_financial_district.note` | Banks, exchanges and old streets crowd Manhattan’s southern tip. | 银行、交易所与古老街道挤在曼哈顿南端。 |  |
| `district.district_harlem.label` | HARLEM | 哈莱姆 |  |
| `district.district_harlem.location` | Upper Manhattan | 曼哈顿上城 |  |
| `district.district_harlem.name` | Harlem | 哈莱姆 |  |
| `district.district_harlem.note` | The broad uptown district north of Central Park. | 中央公园以北、横跨曼哈顿岛的上城街区。 |  |
| `district.district_inwood.label` | INWOOD | 因伍德 |  |
| `district.district_inwood.location` | Northern Manhattan | 曼哈顿北部 |  |
| `district.district_inwood.name` | Inwood | 因伍德 |  |
| `district.district_inwood.note` | Manhattan’s northern tip, framed by hills and waterways. | 曼哈顿最北端，丘陵与水道环绕。 |  |
| `district.district_midtown_east.label` | MIDTOWN\|EAST | 中城东 |  |
| `district.district_midtown_east.location` | Eastern Midtown | 曼哈顿中城东部 |  |
| `district.district_midtown_east.name` | Midtown East | 中城东 |  |
| `district.district_midtown_east.note` | An eastern Midtown hub of offices, institutions and grand avenues. | 办公、机构与宏伟大道集中的中城东部。 |  |
| `district.district_midtown_west.label` | MIDTOWN\|WEST | 中城西 |  |
| `district.district_midtown_west.location` | Western Midtown | 曼哈顿中城西部 |  |
| `district.district_midtown_west.name` | Midtown West | 中城西 |  |
| `district.district_midtown_west.note` | A busy western Midtown corridor of stations, offices and entertainment. | 车站、办公与娱乐交织的中城西部走廊。 |  |
| `district.district_soho.label` | SOHO | 苏豪区 |  |
| `district.district_soho.location` | Lower Manhattan | 曼哈顿下城 |  |
| `district.district_soho.name` | SoHo | 苏豪区 |  |
| `district.district_soho.note` | A cast-iron crossroads between the Village and the Financial District. | 连接乡区与金融区的铸铁街区。 |  |
| `district.district_upper_east.label` | UPPER EAST\|SIDE | 上东区 |  |
| `district.district_upper_east.location` | East of Central Park | 中央公园以东 |  |
| `district.district_upper_east.name` | Upper East Side | 上东区 |  |
| `district.district_upper_east.note` | Central Park’s eastern neighbor, lined with residences and institutions. | 中央公园东侧，住宅与文化机构林立。 |  |
| `district.district_upper_west.label` | UPPER WEST\|SIDE | 上西区 |  |
| `district.district_upper_west.location` | West of Central Park | 中央公园以西 |  |
| `district.district_upper_west.name` | Upper West Side | 上西区 |  |
| `district.district_upper_west.note` | Central Park’s western neighbor, shaped by homes, culture and the river. | 中央公园西侧，住宅、文化与河岸相接。 |  |
| `district.district_washington_heights.label` | WASHINGTON\|HEIGHTS | 华盛顿高地 |  |
| `district.district_washington_heights.location` | Upper northern Manhattan | 曼哈顿上北部 |  |
| `district.district_washington_heights.name` | Washington Heights | 华盛顿高地 |  |
| `district.district_washington_heights.note` | A high northern stretch between Inwood and Harlem. | 位于因伍德与哈莱姆之间的北部高地。 |  |
| `district.district_west_village.label` | WEST\|VILLAGE | 西乡 |  |
| `district.district_west_village.location` | Lower West Side | 下西区 |  |
| `district.district_west_village.name` | West Village | 西乡 |  |
| `district.district_west_village.note` | Winding streets, residences and neighborhood life on the Lower West Side. | 弯曲街道、住宅与邻里生活组成的下西区。 |  |
| `district.location_line` | {location} · Manhattan, New York | {location} · 纽约曼哈顿 |  |
| `district.note_line` | {note} | {note} |  |
| `district.pending_plots` | Not yet listed | 暂未挂牌 |  |
| `district.pending_prosperity` | — (50.0 to <100.0) | —（50.0 至低于 100.0） |  |
| `district.pending_transit` | Not yet assessed | 暂未评估 |  |

## 经济周期（`economy.*`）

- 界面定位：顶部状态栏 Economy 和市场结算逻辑显示。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `economy.adjustment` | Adjustment | 调整 |  |
| `economy.opening` | Opening | 开局 |  |
| `economy.overheating` | Overheating | 过热 |  |
| `economy.prosperity` | Prosperity | 繁荣 |  |

## 右侧详情栏档案标题（`entity_file.*`）

- 界面定位：右侧详情栏标题，根据当前选择对象切换。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `entity_file.district` | District File | 街区档案 |  |
| `entity_file.empty` | Map File | 地图档案 |  |
| `entity_file.landmark` | Historical File | 历史档案 |  |
| `entity_file.plot` | Property File | 地产档案 |  |

## 启动页与新游戏弹窗（`home.*`）

- 界面定位：启动页右侧菜单、Load/Config/About 子面板、Start A New Game 后的对手选择弹窗。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `home.panel.about` | About Us | 关于我们 |  |
| `home.panel.config` | Config | 设置 |  |
| `home.panel.load` | Load | 读取 |  |
| `home.rival.intro` | Choose a rival and enter a one-on-one economic contest. | 选择一名对手，进入一对一的经济对战。 |  |
| `home.rival.landlady.description` | Residential income and steady holdings. | 重视住宅收入与稳健持有。 |  |
| `home.rival.shark.description` | Cheap land, liquidity and opportunism. | 重视廉价土地、流动性与投机机会。 |  |
| `home.rival.start` | Start | 开始 |  |
| `home.rival.title` | Choose Your Rival | 选择你的对手 |  |
| `home.rival.tycoon.description` | Industrial expansion and transport value. | 重视工业扩张与交通价值。 |  |

## 历史地标详情文案（`landmark.*`）

- 界面定位：右侧历史地标详情栏。52 个地标的正式中英文名称、单句短介绍、长介绍和英文维基百科链接集中维护于 `LANDMARK_COPY_DRAFT.md` 与 `m0_web/landmark-content.js`。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `landmark.content_unavailable` | Historical introduction unavailable. | 暂无历史简介。 | 仅在单个地标资料缺失时显示 |
| `landmark.long_unavailable` | Historical article unavailable. | 暂无历史长文。 | 仅在单个地标资料缺失时显示 |
| `landmark.source` | Source: {title} | 资料来源：{title} | `{title}` 当前均指向英文维基百科词条 |

## 法令状态（`law.*`）

- 界面定位：法令状态，影响地块可建类型。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `law.active` | Residential zoning active | 住宅分区限制已生效 |  |
| `law.none` | No active restriction | 暂无生效限制 |  |
| `law.review` | Zoning under review | 分区法令审议中 |  |

## 未分类文案（`map.*`）

- 界面定位：待补充定位。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `map.hover_lock` | Hover a district · Zoom to 500% or above for plots and landmarks | 悬停查看街区 · 放大至 500% 及以上可选择地块和地标 |  |
| `map.landmark_selected` | {landmark} · Selection locked | {landmark} · 已锁定选择 |  |
| `map.load_error` | The map could not be loaded. Check the local server and asset files. | 无法载入地图，请检查本地服务器和素材文件。 |  |
| `map.load_failed` | Map load failed | 地图载入失败 |  |
| `map.open_file` | {district} · Click to open district file | {district} · 单击打开街区档案 |  |
| `map.open_landmark` | {landmark} · Click to open historical file | {landmark} · 单击打开历史档案 |  |
| `map.open_plot` | {plot} · Click to open property file | {plot} · 单击打开地产档案 |  |
| `map.outside_district` | Outside the twelve playable districts | 不属于十二个可玩街区 |  |
| `map.plot_selected` | {plot} · Selection locked | {plot} · 已锁定选择 |  |
| `map.press_enter` | {district} · Press Enter to select | {district} · 按 Enter 键选择 |  |
| `map.selection_locked` | {district} · Selection locked | {district} · 已锁定选择 |  |
| `map.status` | {count} districts | {count} 个街区 |  |
| `map.status_runtime` | {districts} districts · {plots} plots · {landmarks} landmarks | {districts} 个街区 · {plots} 个地块 · {landmarks} 个地标 |  |
| `map.unavailable` | Map unavailable | 地图不可用 |  |
| `map.zoom_for_landmark` | Zoom to 500% or above to inspect this landmark | 放大至 500% 及以上可查看此历史地标 |  |
| `map.zoom_for_plot` | Zoom to 500% or above to select this plot | 放大至 500% 及以上可选择此地块 |  |

## 市场简报（`market_message.*`）

- 界面定位：左侧综合操作栏市场简报。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `market_message.opening` | Opening market: land is stable, credit is broad and every action point matters. | 开局市场：土地价格稳定、信贷充足，每一点行动点都很重要。 |  |
| `market_message.prosperity` | Prosperity lifts land values and operating income. Investment trusts are now available. | 繁荣推高地价和经营收入，投资信托现已开放。 |  |
| `market_message.turn_4` | Zoning debate announced: Residential districts may soon reject new factories and department stores. | 分区法令辩论已经公布：住宅区可能很快禁止新建工厂和百货商场。 |  |
| `market_message.turn_5` | Second zoning warning: industrial residential plans face near-term risk. | 第二次分区法令预警：住宅区工业项目面临近期风险。 |  |
| `market_message.zoning_active` | Zoning is active: no new Factory or Department Store on Residential plots. | 分区法令已生效：住宅用地不得新建工厂或百货商场。 |  |

## 浏览器元信息（`meta.*`）

- 界面定位：`index.html` 的 `<title>` / description；不直接显示在主界面。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `meta.description` | Metropolis: Roaring Times is a historical New York property strategy game about land, credit, auctions and market timing. | 《Metropolis: Roaring Times》是一款关于土地、信贷、拍卖与市场时机的纽约历史地产策略游戏。 |  |
| `meta.title` | Metropolis: Roaring Times — Map Demo | Metropolis: Roaring Times — 地图演示 |  |

## 新闻/投资建议消息（`news.*`）

- 界面定位：左侧综合操作栏 News 页签：来源、类别、标题、回合元信息。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `news.headline.turn_1` | Builders seek well-connected parcels as a new property season opens. | 新一轮地产季开启，建筑商争相寻找交通便利的地块。 |  |
| `news.headline.turn_2` | Security credit expands alongside the late-1920s investment boom. | 证券信贷随 20 世纪 20 年代末的投资热潮同步扩张。 |  |
| `news.headline.turn_3` | Investment trusts draw new attention from small Manhattan investors. | 投资信托开始吸引曼哈顿小额投资者的关注。 |  |
| `news.headline.turn_4` | Residential zoning restrictions are said to be under active review. | 据悉，住宅分区限制正接受积极审议。 |  |
| `news.headline.turn_5` | A second briefing points to imminent limits on industrial residential use. | 第二次吹风表明，住宅区内的工业用途即将受到限制。 |  |
| `news.headline.turn_6` | Property desks reassess mixed-use sites after the zoning order takes effect. | 分区法令生效后，各地产机构重新评估混合用途地块。 |  |
| `news.headline.turn_7` | Equity values fall sharply as the compressed adjustment phase begins. | 压缩后的调整阶段开始，股票估值大幅下跌。 |  |
| `news.meta` | Turn {turn} · {source} | 第 {turn} 回合 · {source} |  |
| `news.source.federal_reserve` | Federal Reserve Historical Record | 美联储历史档案 |  |
| `news.source.five_borough_gazette` | The Five Borough Gazette | 《五区公报》 |  |
| `news.source.metropolitan_ledger` | The Metropolitan Ledger | 《大都会纪事报》 |  |
| `news.source.operations_desk` | Your Operations Desk | 你的综合操作栏 |  |
| `news.source.state_sources` | Sources familiar with the New York State Government | 纽约州政府知情人士 |  |
| `news.type.activity` | Activity | 动态 |  |
| `news.type.fictional` | Fictional | 虚构 |  |
| `news.type.historical` | Historical | 史实 |  |
| `news.type.rumor` | Rumor | 传闻 |  |

## 业主/归属状态（`owner.*`）

- 界面定位：地块业主状态与地图/详情展示。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `owner.ai` | Rival | 对手 |  |
| `owner.government` | Public | 公共 |  |
| `owner.market` | Sold to market | 已售给市场 |  |
| `owner.player` | You | 你 |  |
| `owner.unowned` | Available | 可购买 |  |

## 地块名称与价格层级（`plot.*`）

- 界面定位：右侧地产档案、地图价格/状态标记。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `plot.law_dependent_zone` | Law-dependent development rights | 开发权随法令变化 |  |
| `plot.price_tier.cheap` | Affordable | 便宜 |  |
| `plot.price_tier.expensive` | Premium | 昂贵 |  |
| `plot.price_tier.medium` | Standard | 中等 |  |
| `plot.runtime_name` | Property Parcel {number} | 地产地块 {number} |  |

## 未分类文案（`plot_mark.*`）

- 界面定位：待补充定位。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `plot_mark.building` | {building}<br>BUILD | {building}<br>施工 |  |
| `plot_mark.player` | YOU | 你的 |  |
| `plot_mark.public` | PUBLIC | 公共 |  |
| `plot_mark.rival` | RIVAL | 对手 |  |
| `plot_mark.sale_pending` | SALE<br>PENDING | 待售 |  |
| `plot_mark.sold` | SOLD | 已售 |  |

## 地产详情与操作文案（`property.*`）

- 界面定位：买地、建造、改建、出售、收益与地块状态。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `property.building_suffix` |  (Building) | （施工中） |  |
| `property.buy_plot` | Buy Plot · {amount} | 购买地块 · {amount} |  |
| `property.construction_site` | Construction site | 工地 |  |
| `property.empty_land` | Empty land | 空地 |  |
| `property.income_per_turn` | {amount} / turn | {amount} / 回合 |  |
| `property.not_collected` | Not collected | 不再收取 |  |
| `property.not_for_sale` | Not for sale | 不出售 |  |
| `property.redevelop_option` | {building} — pay {amount} | {building} — 支付 {amount} |  |
| `property.redevelop_preview` | {newCost} new cost − {credit} old-building credit = {amount}. Operational next turn. | 新建筑成本 {newCost} − 旧建筑抵扣 {credit} = 实付 {amount}。下一回合投入运营。 |  |
| `property.sale_final_turn` | Brokered sales cannot begin on the final turn. | 最后一回合不能发起经纪出售。 |  |
| `property.sale_preview` | Lock {amount} (90% of current property value); settle at the start of next turn. | 锁定 {amount}（当前地产价值的 90%），下一回合开始时结算。 |  |

## 按钮禁用/不可操作原因（`reason.*`）

- 界面定位：右侧地产操作按钮不可用时显示的原因。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `reason.already_built` | This plot already has a building. | 该地块已经建有建筑。 |  |
| `reason.higher_cost_only` | Redevelopment must move to a strictly higher-cost building. | 只能改建为成本严格更高的建筑。 |  |
| `reason.insufficient_cash` | Insufficient cash. Borrowing is always explicit. | 现金不足；借款必须由你明确操作。 |  |
| `reason.left_market` | This property has left the playable market after settlement. | 该地产结算后已离开可玩市场。 |  |
| `reason.need_cash` | You need {amount} cash. | 你需要 {amount} 现金。 |  |
| `reason.no_ap` | No action points remain this turn. | 本回合已无剩余行动点。 |  |
| `reason.operational_next_turn` | Construction becomes operational next turn. | 建筑将在下一回合投入运营。 |  |
| `reason.own_developed_property` | Own a developed property before redevelopment. | 需要先拥有已开发地产才能改建。 |  |
| `reason.own_empty_plot` | Own an empty plot before building. | 需要先拥有一块空地才能建造。 |  |
| `reason.public_unavailable` | Public land is not available for purchase. | 公共土地不可购买。 |  |
| `reason.rival_property` | This property belongs to your rival. | 该地产属于你的对手。 |  |
| `reason.sale_pending` | This property is already committed to a brokered sale. | 该地产已提交经纪出售。 |  |
| `reason.sale_settlement` | Brokered sale settles for {amount} at the start of turn {turn}. | 经纪出售将在第 {turn} 回合开始时以 {amount} 结算。 |  |
| `reason.select_plot` | Select a plot to inspect it. | 请选择地块查看详情。 |  |
| `reason.zoning_block` | The zoning rule blocks new factories and stores on Residential plots. | 分区法令禁止在住宅用地上新建工厂和百货商场。 |  |

## 结算弹窗（`result.*`）

- 界面定位：20 回合结束或破产后的结果弹窗。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `result.bankruptcy_detail` | A matured debt of {amount} could not be paid. Emergency asset sales must be arranged before this deadline. | 无法偿还 {amount} 的到期债务。必须在此期限前完成紧急资产出售。 |  |
| `result.insolvency` | Insolvency | 资不抵债 |  |
| `result.player_leads` | You Lead Manhattan | 你领跑曼哈顿 |  |
| `result.rival_leads` | {rival} Leads | {rival}领先 |  |
| `result.summary_player` | After {turns} turns, your portfolio held its ground. | {turns} 回合结束后，你的投资组合守住了优势。 |  |
| `result.summary_rival` | After {turns} turns, the rival portfolio finished ahead. | {turns} 回合结束后，对手的投资组合领先。 |  |
| `result.tie` | Dead Heat | 势均力敌 |  |

## 对手名称与风格（`rival.*`）

- 界面定位：对手选择弹窗、Game Brief/对手资料、新闻动态和结算。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `rival.landlady.name` | Landlady | 房东 |  |
| `rival.landlady.style` | Residential income | 住宅收入 |  |
| `rival.shark.name` | Shark | 资本大鳄 |  |
| `rival.shark.style` | Cheap land & liquidity | 廉价土地与流动性 |  |
| `rival.tycoon.name` | Tycoon | 实业大亨 |  |
| `rival.tycoon.style` | Industry & transport | 工业与交通 |  |

## 对手状态（`rival_condition.*`）

- 界面定位：综合操作栏 Game/Brief 或对手摘要里的状态。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `rival_condition.cash_strained` | Cash strained | 现金紧张 |  |
| `rival_condition.confident` | Confident | 信心十足 |  |
| `rival_condition.pressured` | Pressured | 承受压力 |  |
| `rival_condition.steady` | Steady | 稳健 |  |

## 证券/股票市场标的（`security.*`）

- 界面定位：股票市场页签中的证券篮子名称与风险等级。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `security.industrial_shares.name` | Industrial Shares Basket | 工业股票组合 |  |
| `security.industrial_shares.risk` | Medium–High | 中高 |  |
| `security.investment_trust.name` | Metropolitan Investment Trust | 大都会投资信托 |  |
| `security.investment_trust.risk` | High | 高 |  |
| `security.municipal_bonds.name` | Municipal & Railroad Bonds | 市政与铁路债券 |  |
| `security.municipal_bonds.risk` | Low | 低 |  |

## HTML 静态文案/兼容翻译（`static.*`）

- 界面定位：`zh-CN.js` 里为 HTML 直接显示文本准备的翻译映射。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `static.12 districts · 30 plots · 52 landmarks` |  | 12 个街区 · 30 个地块 · 52 个地标 |  |
| `static.1v1` |  | 1v1 |  |
| `static.6 turns` |  | 6 回合 |  |
| `static.A brokered sale locks 90% of current property value and settles next turn.` |  | 经纪出售会锁定当前地产价值的 90%，并在下一回合结算。 |  |
| `static.A historical New York property strategy game about land, credit, auctions and market timing.` |  | 一款关于土地、信贷、拍卖与市场时机的纽约历史地产策略游戏。 |  |
| `static.About Us` |  | 关于我们 |  |
| `static.Action Points` |  | 行动点 |  |
| `static.Activity` |  | 动态 |  |
| `static.Advice` |  | 建议 |  |
| `static.Auction` |  | 拍卖 |  |
| `static.Auction stories and bidder events are not yet available.` |  | 拍卖故事与竞拍者事件暂未开放。 |  |
| `static.Available Credit` |  | 可用授信 |  |
| `static.Available Plots` |  | 可购入地块 |  |
| `static.Bank` |  | 银行 |  |
| `static.Bank borrowing and repayment cost no action points; loans mature in six turns.` |  | 银行借款和还款不消耗行动点；贷款在 6 回合后到期。 |  |
| `static.Office` |  | 办公室 |  |
| `static.Borrow $10,000` |  | 借款 $10,000 |  |
| `static.Brief` |  | 简报 |  |
| `static.Brokered Sale` |  | 经纪出售 |  |
| `static.Browser local storage` |  | 浏览器本地存储 |  |
| `static.Build` |  | 建造 |  |
| `static.Build on owned empty land` |  | 在自有空地上建造 |  |
| `static.Building` |  | 建筑 |  |
| `static.Buy Plot` |  | 购买地块 |  |
| `static.Buy and develop property for operating income.` |  | 购买并开发地产，获得经营收入。 |  |
| `static.Buy land and construct a building; each costs one action point.` |  | 购买土地并建造建筑，两项操作各消耗 1 点行动点。 |  |
| `static.Cash` |  | 现金 |  |
| `static.Cheap land, liquidity and opportunism.` |  | 重视廉价土地、流动性与投机机会。 |  |
| `static.Choose Another Rival` |  | 选择其他对手 |  |
| `static.Choose Rival` |  | 选择对手 |  |
| `static.Choose a rival to begin.` |  | 选择一名对手开始游戏。 |  |
| `static.Choose a rival and enter a one-on-one economic contest.` |  | 选择一名对手，进入一对一的经济对战。 |  |
| `static.Condition` |  | 状态 |  |
| `static.Config` |  | 设置 |  |
| `static.Continue Saved Match` |  | 继续已保存对局 |  |
| `static.Credit Left` |  | 剩余授信 |  |
| `static.Credit is available throughout Player Action. Borrowing and repayment cost no action points.` |  | 玩家行动阶段可随时使用授信。借款与还款不消耗行动点。 |  |
| `static.Current Action` |  | 当前操作 |  |
| `static.Current Law` |  | 当前法令 |  |
| `static.DRAG TO PAN · SCROLL OR USE CONTROLS TO ZOOM · NO ROTATION` |  | 拖动平移 · 滚轮或按钮缩放 · 不可旋转 |  |
| `static.Debt` |  | 债务 |  |
| `static.Department Store — $30,000` |  | 百货商场 — $30,000 |  |
| `static.District` |  | 街区 |  |
| `static.District hit area` |  | 街区感应区 |  |
| `static.Districts are available at every zoom. From 500% to 1500%, plots and landmarks are selectable.` |  | 任何缩放级别都可以选择街区；500% 至 1500% 可选择地块和地标。 |  |
| `static.Each buy or sell uses 1 of the existing 3 action points. Minimum order $1,000; fee 1%.` |  | 每次买入或卖出消耗现有 3 点行动点中的 1 点。最低委托额 $1,000，手续费 1%。 |  |
| `static.Economy` |  | 经济阶段 |  |
| `static.End Turn` |  | 结束回合 |  |
| `static.Every securities buy or sell costs one action point and a 1% fee.` |  | 每次买入或卖出证券消耗 1 点行动点，并收取 1% 手续费。 |  |
| `static.Factory — $15,000` |  | 工厂 — $15,000 |  |
| `static.Fictional` |  | 虚构 |  |
| `static.Finish turn 30 with the highest net worth.` |  | 在第 30 回合结束时取得最高净资产。 |  |
| `static.Follows device preference` |  | 跟随设备偏好 |  |
| `static.Game` |  | 游戏 |  |
| `static.Highest net worth after turn 30 wins.` |  | 第 30 回合结束时净资产最高者获胜。 |  |
| `static.Historical` |  | 史实 |  |
| `static.House` |  | 场 |  |
| `static.Hover border` |  | 悬停边框 |  |
| `static.How to Play` |  | 玩法说明 |  |
| `static.How to Play.2` |  | 怎么玩 |  |
| `static.Income` |  | 收入 |  |
| `static.Industrial expansion and transport value.` |  | 重视工业扩张与交通价值。 |  |
| `static.Investment` |  | 投资 |  |
| `static.Landlady` |  | 房东 |  |
| `static.Language` |  | 语言 |  |
| `static.Lead after turn 30` |  | 第 30 回合结束时领先 |  |
| `static.Load` |  | 读取 |  |
| `static.Loading Manhattan…` |  | 正在载入曼哈顿… |  |
| `static.Loan Book` |  | 贷款账簿 |  |
| `static.Locked selection` |  | 已锁定选择 |  |
| `static.Luxury Apartment — $25,000` |  | 豪华公寓 — $25,000 |  |
| `static.NEW YORK PROPERTY EXCHANGE · MANHATTAN EDITION` |  | 纽约地产交易所 · 曼哈顿版 |  |
| `static.Map overview` |  | 地图概览 |  |
| `static.Major Transit` |  | 大型交通设施 |  |
| `static.Manhattan District Map` |  | 曼哈顿街区地图 |  |
| `static.Manhattan, New York` |  | 纽约 · 曼哈顿 |  |
| `static.Map File` |  | 地图档案 |  |
| `static.Market` |  | 市场 |  |
| `static.Market Brief` |  | 市场简报 |  |
| `static.Market.2` |  | 市值 |  |
| `static.Match Complete` |  | 对局结束 |  |
| `static.Mode` |  | 模式 |  |
| `static.Motion` |  | 动效 |  |
| `static.Net Worth` |  | 净资产 |  |
| `static.New Loan Rate` |  | 新贷款利率 |  |
| `static.New Match` |  | 新对局 |  |
| `static.New York Property Strategy · Pre-Alpha` |  | 纽约地产策略 · PRE-ALPHA |  |
| `static.No Scheduled Auctions` |  | 暂无计划拍卖 |  |
| `static.No saved match was found.` |  | 未找到已保存的对局。 |  |
| `static.Objective` |  | 目标 |  |
| `static.Operations Desk` |  | 综合操作栏 |  |
| `static.Order value` |  | 委托金额 |  |
| `static.Owner` |  | 业主 |  |
| `static.Not yet listed` |  | 暂未挂牌 |  |
| `static.Not yet assessed` |  | 暂未评估 |  |
| `static.Upcoming formats include government land auctions and emergency debt auctions.` |  | 后续拍卖包括政府土地拍卖与紧急债务拍卖。 |  |
| `static.Preparing vector map…` |  | 正在准备矢量地图… |  |
| `static.Price Tier` |  | 价格层级 |  |
| `static.Prosperity` |  | 繁荣度 |  |
| `static.Match Result` |  | 对局结果 |  |
| `static.Game Settings` |  | 游戏设置 |  |
| `static.These baskets are fictional aggregate instruments. Futures, short selling, broker margin and live prices are unavailable.` |  | 这些证券篮子是虚构的综合投资标的，不提供期货、做空、融资融券或实时行情。 |  |
| `static.Read more` |  | 查看更多 |  |
| `static.Redevelop` |  | 改建 |  |
| `static.Redevelop into a higher-cost building` |  | 改建为成本更高的建筑 |  |
| `static.Redevelop only into a higher-cost legal building. The old building contributes a 120% upgrade credit, but never pays cash back.` |  | 只能改建为成本更高且符合法令的建筑。旧建筑提供建造费 120% 的升级抵扣，但不会返还现金。 |  |
| `static.Redevelop upward when a better legal use appears.` |  | 出现更优且合法的用途时，向上改建建筑。 |  |
| `static.Repay up to $10,000` |  | 最多偿还 $10,000 |  |
| `static.Your rubber-hose adviser will report here.` |  | 你的橡皮管风格顾问会在这里提供建议。 |  |
| `static.Reset View` |  | 重置视图 |  |
| `static.Residential income and steady holdings.` |  | 重视住宅收入与稳健持有。 |  |
| `static.Rival` |  | 对手 |  |
| `static.Rival Securities` |  | 对手证券资产 |  |
| `static.Rival Worth` |  | 对手净资产 |  |
| `static.Ruleset` |  | 规则 |  |
| `static.Rumor` |  | 传闻 |  |
| `static.Save` |  | 保存 |  |
| `static.Save.2` |  | 存档 |  |
| `static.Select a district, plot or landmark` |  | 请选择街区、地块或历史地标 |  |
| `static.Select a plot on the map.` |  | 请在地图上选择地块。 |  |
| `static.Settings` |  | 设置 |  |
| `static.Shark` |  | 资本大鳄 |  |
| `static.Source: English Wikipedia` |  | 来源：英文维基百科 |  |
| `static.Map edition: Manhattan v004.` |  | 地图版本：曼哈顿 v004。 |  |
| `static.Standard` |  | 标准 |  |
| `static.Standard Apartment — $8,000` |  | 标准公寓 — $8,000 |  |
| `static.Start A New Game` |  | 开始新游戏 |  |
| `static.Start a match` |  | 开始一局游戏 |  |
| `static.Stock` |  | 股票 |  |
| `static.Style` |  | 风格 |  |
| `static.System` |  | 系统 |  |
| `static.Term` |  | 期限 |  |
| `static.Manhattan contains 30 purchasable plots and 52 historical landmarks. Prosperity and transit effects are not yet active.` |  | 曼哈顿包含 30 个可购地块与 52 处历史地标；繁荣度与交通效果暂未启用。 |  |
| `static.Explore 12 districts, 30 purchasable plots and 52 historical landmarks across Manhattan.` |  | 探索曼哈顿的 12 个街区、30 个可购地块与 52 处历史地标。 |  |
| `static.Explore Manhattan, develop property, manage credit and outmaneuver a rival across the market cycle.` |  | 探索曼哈顿、开发地产、管理信贷，并在市场周期中胜过对手。 |  |
| `static.Three-Minute Walkthrough` |  | 三分钟玩法导览 |  |
| `static.Turn` |  | 回合 |  |
| `static.Tycoon` |  | 实业大亨 |  |
| `static.Use sales, banking and securities to manage liquidity.` |  | 通过出售、银行和证券管理流动性。 |  |
| `static.Your Apartments` |  | 你的公寓 |  |
| `static.Your Factories` |  | 你的工厂 |  |
| `static.Your Net Worth` |  | 你的净资产 |  |
| `static.Your Securities` |  | 你的证券资产 |  |
| `static.Your Stores` |  | 你的商场 |  |
| `static.Zone` |  | 用途 |  |
| `static.◀ esc` |  | ◀ esc |  |

## 顶部状态栏/结束回合提示（`status.*`）

- 界面定位：顶部状态栏、行动点和 End Turn 提示。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `status.ap_available` | {ap} AP available | 剩余 {ap} 点行动点 |  |
| `status.ready_settle` | Ready to settle | 可以结算 |  |

## 股票市场操作（`stock.*`）

- 界面定位：股票市场页签：价格、涨跌、买卖按钮和持仓。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `stock.buy` | Buy | 买入 |  |
| `stock.change` | {change} this turn | 本回合 {change} |  |
| `stock.facts` | Risk {risk} · Your holding {amount} | 风险：{risk} · 你的持仓：{amount} |  |
| `stock.locked` | LOCKED | 未开放 |  |
| `stock.opens_prosperity` | Opens in Prosperity | 繁荣阶段开放 |  |
| `stock.sell` | Sell | 卖出 |  |

## 短提示 Toast（`toast.*`）

- 界面定位：右下/浮层短提示，表示操作完成或失败。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `toast.construction_started` | Construction started. | 施工已经开始。 |  |
| `toast.debt_paid` | Debt payment applied. No action point used. | 还款已完成，未消耗行动点。 |  |
| `toast.instrument_unavailable` | This instrument is not available yet. | 该投资标的尚未开放。 |  |
| `toast.invalid_order` | Use an order value of at least $1,000 in $1,000 steps. | 委托额至少为 $1,000，并须以 $1,000 为步进。 |  |
| `toast.invalid_save` | The saved match is invalid and was not loaded. | 存档无效，未能载入。 |  |
| `toast.legacy_loaded` | Older saved match migrated and loaded. | 旧版存档已迁移并载入。 |  |
| `toast.loan_funded` | Loan funded. No action point used. | 贷款已经到账，未消耗行动点。 |  |
| `toast.map_preparing` | The Manhattan map is still being prepared. | 曼哈顿地图仍在准备中。 |  |
| `toast.match_saved` | Match saved in this browser. | 对局已保存在此浏览器中。 |  |
| `toast.match_started` | Match started against {rival}. | 与{rival}的对局已经开始。 |  |
| `toast.no_save` | No saved match was found. | 未找到已保存的对局。 |  |
| `toast.order_cash` | Insufficient cash for the order and fee. | 现金不足以支付委托额与手续费。 |  |
| `toast.order_holding` | Your holding is smaller than this sell order. | 你的持仓小于本次卖出委托额。 |  |
| `toast.property_acquired` | Property acquired. | 地产购买完成。 |  |
| `toast.redevelopment_started` | Redevelopment started. | 改建已经开始。 |  |
| `toast.sale_locked` | Sale price locked. | 出售价格已锁定。 |  |
| `toast.save_loaded` | Saved match loaded. | 已载入保存的对局。 |  |
| `toast.stock_buy_completed` | Securities buy order completed. | 证券买入委托已完成。 |  |
| `toast.stock_sell_completed` | Securities sell order completed. | 证券卖出委托已完成。 |  |
| `toast.turn_begins` | Turn {turn} begins. | 第 {turn} 回合开始。 |  |

## 用地/法令区域（`zone.*`）

- 界面定位：地块详情的开发权/用途说明。

| Key | 英文当前文案 | 中文当前文案 | 修改备注 |
|---|---|---|---|
| `zone.business` | Business | 商业 |  |
| `zone.public` | Public | 公共 |  |
| `zone.residential` | Residential | 住宅 |  |
| `zone.unrestricted` | Unrestricted | 无限制 |  |
