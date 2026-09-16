"use strict";

window.M1W_LOCALES = window.M1W_LOCALES || {};

const zhCN = {
  "meta.title": "Metropolis: Roaring Times — 地图演示",
  "meta.description": "《Metropolis: Roaring Times》是一款关于土地、信贷、拍卖与市场时机的纽约历史地产策略游戏。",
  "home.panel.load": "读取",
  "home.panel.config": "设置",
  "home.panel.about": "关于我们",
  "home.rival.title": "选择你的对手",
  "home.rival.intro": "选择一名对手，进入一对一的经济对战。",
  "home.rival.tycoon.description": "重视工业扩张与交通价值。",
  "home.rival.landlady.description": "重视住宅收入与稳健持有。",
  "home.rival.shark.description": "重视廉价土地、流动性与投机机会。",
  "home.rival.start": "开始",

  "rival.tycoon.name": "实业大亨", "rival.tycoon.style": "工业与交通",
  "rival.landlady.name": "房东", "rival.landlady.style": "住宅收入",
  "rival.shark.name": "资本大鳄", "rival.shark.style": "廉价土地与流动性",
  "building.standard_apartment.name": "标准公寓", "building.standard_apartment.short": "公寓",
  "building.factory.name": "工厂", "building.factory.short": "工厂",
  "building.luxury_apartment.name": "豪华公寓", "building.luxury_apartment.short": "豪宅",
  "building.department_store.name": "百货商场", "building.department_store.short": "商场",
  "security.municipal_bonds.name": "市政与铁路债券", "security.municipal_bonds.risk": "低",
  "security.industrial_shares.name": "工业股票组合", "security.industrial_shares.risk": "中高",
  "security.investment_trust.name": "大都会投资信托", "security.investment_trust.risk": "高",

  "news.source.metropolitan_ledger": "《大都会纪事报》",
  "news.source.federal_reserve": "美联储历史档案",
  "news.source.five_borough_gazette": "《五区公报》",
  "news.source.state_sources": "纽约州政府知情人士",
  "news.source.operations_desk": "你的综合操作栏",
  "news.headline.turn_1": "新一轮地产季开启，建筑商争相寻找交通便利的地块。",
  "news.headline.turn_2": "证券信贷随 20 世纪 20 年代末的投资热潮同步扩张。",
  "news.headline.turn_3": "投资信托开始吸引曼哈顿小额投资者的关注。",
  "news.headline.turn_4": "据悉，住宅分区限制正接受积极审议。",
  "news.headline.turn_5": "第二次吹风表明，住宅区内的工业用途即将受到限制。",
  "news.headline.turn_6": "分区法令生效后，各地产机构重新评估混合用途地块。",
  "news.headline.turn_7": "压缩后的调整阶段开始，股票估值大幅下跌。",
  "news.type.historical": "史实", "news.type.fictional": "虚构", "news.type.rumor": "传闻", "news.type.activity": "动态",
  "news.meta": "第 {turn} 回合 · {source}",

  "district.district_inwood.name": "因伍德", "district.district_inwood.label": "因伍德", "district.district_inwood.location": "曼哈顿北部", "district.district_inwood.note": "曼哈顿最北端，丘陵与水道环绕。",
  "district.district_washington_heights.name": "华盛顿高地", "district.district_washington_heights.label": "华盛顿高地", "district.district_washington_heights.location": "曼哈顿上北部", "district.district_washington_heights.note": "位于因伍德与哈莱姆之间的北部高地。",
  "district.district_harlem.name": "哈莱姆", "district.district_harlem.label": "哈莱姆", "district.district_harlem.location": "曼哈顿上城", "district.district_harlem.note": "中央公园以北、横跨曼哈顿岛的上城街区。",
  "district.district_upper_east.name": "上东区", "district.district_upper_east.label": "上东区", "district.district_upper_east.location": "中央公园以东", "district.district_upper_east.note": "中央公园东侧，住宅与文化机构林立。",
  "district.district_upper_west.name": "上西区", "district.district_upper_west.label": "上西区", "district.district_upper_west.location": "中央公园以西", "district.district_upper_west.note": "中央公园西侧，住宅、文化与河岸相接。",
  "district.district_midtown_west.name": "中城西", "district.district_midtown_west.label": "中城西", "district.district_midtown_west.location": "曼哈顿中城西部", "district.district_midtown_west.note": "车站、办公与娱乐交织的中城西部走廊。",
  "district.district_midtown_east.name": "中城东", "district.district_midtown_east.label": "中城东", "district.district_midtown_east.location": "曼哈顿中城东部", "district.district_midtown_east.note": "办公、机构与宏伟大道集中的中城东部。",
  "district.district_chelsea.name": "切尔西", "district.district_chelsea.label": "切尔西", "district.district_chelsea.location": "西区，中城以南", "district.district_chelsea.note": "夹在中城喧闹与乡区街道之间的西区街区。",
  "district.district_west_village.name": "西乡", "district.district_west_village.label": "西乡", "district.district_west_village.location": "下西区", "district.district_west_village.note": "弯曲街道、住宅与邻里生活组成的下西区。",
  "district.district_east_village.name": "东乡", "district.district_east_village.label": "东乡", "district.district_east_village.location": "下东区", "district.district_east_village.note": "乡区东侧街道密集、生活繁忙的街区。",
  "district.district_soho.name": "苏豪区", "district.district_soho.label": "苏豪区", "district.district_soho.location": "曼哈顿下城", "district.district_soho.note": "连接乡区与金融区的铸铁街区。",
  "district.district_financial_district.name": "金融区", "district.district_financial_district.label": "金融区", "district.district_financial_district.location": "曼哈顿南部", "district.district_financial_district.note": "银行、交易所与古老街道挤在曼哈顿南端。",
  "district.location_line": "{location} · 纽约曼哈顿", "district.pending_plots": "暂未挂牌", "district.pending_transit": "暂未评估", "district.pending_prosperity": "—（50.0 至低于 100.0）", "district.note_line": "{note}",

  "plot.runtime_name": "地产地块 {number}", "plot.law_dependent_zone": "开发权随法令变化", "plot.price_tier.cheap": "便宜", "plot.price_tier.medium": "中等", "plot.price_tier.expensive": "昂贵",
  "zone.residential": "住宅", "zone.business": "商业", "zone.unrestricted": "无限制", "zone.public": "公共",
  "owner.player": "你", "owner.ai": "对手", "owner.government": "公共", "owner.market": "已售给市场", "owner.unowned": "可购买",

  "economy.opening": "开局", "economy.prosperity": "繁荣", "economy.overheating": "过热", "economy.adjustment": "调整",
  "plot_mark.sale_pending": "待售", "plot_mark.sold": "已售", "plot_mark.building": "{building}\n施工", "plot_mark.player": "你的", "plot_mark.rival": "对手", "plot_mark.public": "公共",
  "map.hover_lock": "悬停查看街区 · 放大至 500% 及以上可选择地块和地标", "map.selection_locked": "{district} · 已锁定选择", "map.open_file": "{district} · 单击打开街区档案", "map.press_enter": "{district} · 按 Enter 键选择", "map.status": "{count} 个街区", "map.status_runtime": "{districts} 个街区 · {plots} 个地块 · {landmarks} 个地标", "map.open_plot": "{plot} · 单击打开地产档案", "map.open_landmark": "{landmark} · 单击打开历史档案", "map.zoom_for_plot": "放大至 500% 及以上可选择此地块", "map.zoom_for_landmark": "放大至 500% 及以上可查看此历史地标", "map.plot_selected": "{plot} · 已锁定选择", "map.landmark_selected": "{landmark} · 已锁定选择", "map.outside_district": "不属于十二个可玩街区", "map.load_error": "无法载入地图，请检查本地服务器和素材文件。", "map.load_failed": "地图载入失败", "map.unavailable": "地图不可用",
  "entity_file.empty": "地图档案", "entity_file.district": "街区档案", "entity_file.plot": "地产档案", "entity_file.landmark": "历史档案",
  "landmark.content_unavailable": "暂无历史简介。", "landmark.long_unavailable": "暂无历史长文。", "landmark.source": "资料来源：{title}",
  "aria.select_district": "选择{district}", "aria.plot": "{plot}，{owner}，{building}", "aria.landmark": "查看历史地标：{landmark}",

  "reason.zoning_block": "分区法令禁止在住宅用地上新建工厂和百货商场。", "reason.own_empty_plot": "需要先拥有一块空地才能建造。", "reason.sale_pending": "该地产已提交经纪出售。", "reason.already_built": "该地块已经建有建筑。", "reason.no_ap": "本回合已无剩余行动点。", "reason.need_cash": "你需要 {amount} 现金。", "reason.own_developed_property": "需要先拥有已开发地产才能改建。", "reason.higher_cost_only": "只能改建为成本严格更高的建筑。", "reason.select_plot": "请选择地块查看详情。", "reason.sale_settlement": "经纪出售将在第 {turn} 回合开始时以 {amount} 结算。", "reason.public_unavailable": "公共土地不可购买。", "reason.left_market": "该地产结算后已离开可玩市场。", "reason.rival_property": "该地产属于你的对手。", "reason.insufficient_cash": "现金不足；借款必须由你明确操作。", "reason.operational_next_turn": "建筑将在下一回合投入运营。",
  "property.not_for_sale": "不出售", "property.empty_land": "空地", "property.construction_site": "工地", "property.building_suffix": "（施工中）", "property.not_collected": "不再收取", "property.income_per_turn": "{amount} / 回合", "property.buy_plot": "购买地块 · {amount}", "property.redevelop_option": "{building} — 支付 {amount}", "property.redevelop_preview": "新建筑成本 {newCost} − 旧建筑抵扣 {credit} = 实付 {amount}。下一回合投入运营。", "property.sale_final_turn": "最后一回合不能发起经纪出售。", "property.sale_preview": "锁定 {amount}（当前地产价值的 90%），下一回合开始时结算。",
  "rival_condition.cash_strained": "现金紧张", "rival_condition.confident": "信心十足", "rival_condition.pressured": "承受压力", "rival_condition.steady": "稳健",
  "market_message.turn_4": "分区法令辩论已经公布：住宅区可能很快禁止新建工厂和百货商场。", "market_message.turn_5": "第二次分区法令预警：住宅区工业项目面临近期风险。", "market_message.zoning_active": "分区法令已生效：住宅用地不得新建工厂或百货商场。", "market_message.prosperity": "繁荣推高地价和经营收入，投资信托现已开放。", "market_message.opening": "开局市场：土地价格稳定、信贷充足，每一点行动点都很重要。",
  "bank.no_loans": "暂无未偿贷款。", "bank.loan_due": "{amount} 将于第 {turn} 回合结束时到期", "bank.rate": "每回合 {rate}%",
  "stock.locked": "未开放", "stock.change": "本回合 {change}", "stock.opens_prosperity": "繁荣阶段开放", "stock.facts": "风险：{risk} · 你的持仓：{amount}", "stock.buy": "买入", "stock.sell": "卖出",
  "law.active": "住宅分区限制已生效", "law.review": "分区法令审议中", "law.none": "暂无生效限制", "status.ap_available": "剩余 {ap} 点行动点", "status.ready_settle": "可以结算",

  "confirm.buy_plot": "是否以 {amount} 购买{plot}？此操作消耗 1 点行动点。", "confirm.build": "是否花费 {amount} 建造{building}？建筑将在下一回合投入运营。", "confirm.redevelop": "计入旧建筑 120% 残值抵扣后，是否花费 {amount} 将{fromBuilding}改建为{toBuilding}？", "confirm.brokered_sale": "是否将{plot}以 {amount} 提交经纪出售？交易将在下一回合结算，并消耗 1 点行动点。", "confirm.stock_buy": "是否买入 {amount} 的 {ticker}，并支付 {fee} 手续费？", "confirm.stock_sell": "是否卖出 {amount} 的 {ticker}，并支付 {fee} 手续费？", "confirm.borrow": "是否借款 $10k？每回合利率为 {rate}%，本金与累计利息将在第 {turn} 回合结束时到期。", "confirm.repay": "是否最多使用 {amount} 偿还最早的贷款？此操作不消耗行动点。", "confirm.end_turn": "是否结束第 {turn} 回合？经营收入、债务利息和对手行动将进行结算。", "confirm.restart": "是否放弃当前对局并选择新对手？已经保存的对局仍会保留。",
  "toast.property_acquired": "地产购买完成。", "toast.construction_started": "施工已经开始。", "toast.redevelopment_started": "改建已经开始。", "toast.sale_locked": "出售价格已锁定。", "toast.invalid_order": "委托额至少为 $1k，并须以 $1k 为步进。", "toast.instrument_unavailable": "该投资标的尚未开放。", "toast.order_cash": "现金不足以支付委托额与手续费。", "toast.order_holding": "你的持仓小于本次卖出委托额。", "toast.stock_buy_completed": "证券买入委托已完成。", "toast.stock_sell_completed": "证券卖出委托已完成。", "toast.loan_funded": "贷款已经到账，未消耗行动点。", "toast.debt_paid": "还款已完成，未消耗行动点。", "toast.turn_begins": "第 {turn} 回合开始。", "toast.match_saved": "对局已保存在此浏览器中。", "toast.no_save": "未找到已保存的对局。", "toast.save_loaded": "已载入保存的对局。", "toast.legacy_loaded": "旧版存档已迁移并载入。", "toast.invalid_save": "存档无效，未能载入。", "toast.match_started": "与{rival}的对局已经开始。",
  "toast.map_preparing": "曼哈顿地图仍在准备中。",
  "toast.local_server_required": "请通过本地服务器打开游戏： http://127.0.0.1:4174/ 。",
  "result.insolvency": "资不抵债", "result.player_leads": "你领跑曼哈顿", "result.rival_leads": "{rival}领先", "result.tie": "势均力敌", "result.summary_player": "{turns} 回合结束后，你的投资组合守住了优势。", "result.summary_rival": "{turns} 回合结束后，对手的投资组合领先。", "result.bankruptcy_detail": "无法偿还 {amount} 的到期债务。必须在此期限前完成紧急资产出售。",

  "activity.match_entered": "{rival}以相同初始资产进入曼哈顿市场。", "activity.property_purchased": "以 {price} 购买了{plot}。", "activity.construction_started": "在{plot}开始建造{building}。", "activity.redeveloped": "花费 {amount}，将{plot}的{fromBuilding}改建为{toBuilding}。", "activity.sale_locked": "{plot}的经纪出售价格已锁定为 {price}，下一回合结算。", "activity.stock_buy": "买入 {amount} 的 {ticker}；手续费 {fee}。", "activity.stock_sell": "卖出 {amount} 的 {ticker}；手续费 {fee}。", "activity.borrowed": "借入 {amount}，将于第 {dueTurn} 回合结束时到期。", "activity.debt_repaid": "偿还了 {amount} 债务。", "activity.matured_debt_paid": "已支付到期本金与利息 {due}。", "activity.rival_construction": "{rival}在{plot}开始建造{building}。", "activity.rival_purchase": "{rival}以 {price} 购买了{plot}。", "activity.rival_investment": "{rival}向 {ticker} 投资了 {amount}。", "activity.sale_settled": "{plot}的经纪出售以 {price} 完成结算。", "activity.operating_settlement": "经营结算：你获得 {playerIncome}，对手获得 {rivalIncome}。", "activity.zoning_active": "住宅分区限制现已生效。", "activity.legacy_text": "[旧版记录] {text}",
};

const staticText = {
  "Settings": "设置", "Save": "保存", "Load": "读取", "New Match": "新对局",
  "Turn": "回合", "Economy": "经济阶段", "Cash": "现金", "Debt": "债务", "Credit Left": "剩余授信", "Net Worth": "净资产", "Action Points": "行动点", "Current Action": "当前操作", "End Turn": "结束回合", "Start a match": "开始一局游戏",
  "Operations Desk": "综合操作栏", "Game": "游戏", "Brief": "简报", "Investment": "投资", "Advice": "建议", "Bank": "银行", "Auction": "拍卖", "House": "场", "Stock": "股票", "Market": "市场",
  "Office": "办公室", "Your rubber-hose adviser will report here.": "你的橡皮管风格顾问会在这里提供建议。",
  "Mode": "模式", "1v1": "1v1", "Ruleset": "规则", "Standard": "标准", "Rival": "对手", "Style": "风格", "Condition": "状态", "Rival Worth": "对手净资产", "Current Law": "当前法令", "Objective": "目标", "Lead after turn 8": "第 8 回合结束时领先",
  "Buy and develop property for operating income.": "购买并开发地产，获得经营收入。", "Redevelop upward when a better legal use appears.": "出现更优且合法的用途时，向上改建建筑。", "Use sales, banking and securities to manage liquidity.": "通过出售、银行和证券管理流动性。", "Finish turn 8 with the highest net worth.": "在第 8 回合结束时取得最高净资产。", "Explore 12 districts, 30 purchasable plots and 52 historical landmarks across Manhattan.": "探索曼哈顿的 12 个街区、30 个可购地块与 52 处历史地标。",
  "Market Brief": "市场简报", "Choose a rival to begin.": "选择一名对手开始游戏。", "Historical": "史实", "Fictional": "虚构", "Rumor": "传闻", "Activity": "动态",
  "Credit is available throughout Player Action. Borrowing and repayment cost no action points.": "玩家行动阶段可随时使用授信。借款与还款不消耗行动点。", "Available Credit": "可用授信", "New Loan Rate": "新贷款利率", "Term": "期限", "6 turns": "6 回合", "Borrow $10k": "借款 $10k", "Repay up to $10k": "最多偿还 $10k", "Loan Book": "贷款账簿",
  "No Scheduled Auctions": "暂无计划拍卖", "Auction stories and bidder events are not yet available.": "拍卖故事与竞拍者事件暂未开放。", "Upcoming formats include government land auctions and emergency debt auctions.": "后续拍卖包括政府土地拍卖与紧急债务拍卖。",
  "Each buy or sell uses 1 of the existing 3 action points. Minimum order $1k; fee 1%.": "每次买入或卖出消耗现有 3 点行动点中的 1 点。最低委托额 $1k，手续费 1%。", "Order value": "委托金额", "These baskets are fictional aggregate instruments. Futures, short selling, broker margin and live prices are unavailable.": "这些证券篮子是虚构的综合投资标的，不提供期货、做空、融资融券或实时行情。",
  "Manhattan District Map": "曼哈顿街区地图", "Loading Manhattan…": "正在载入曼哈顿…", "Preparing vector map…": "正在准备矢量地图…", "DRAG TO PAN · SCROLL OR USE CONTROLS TO ZOOM · NO ROTATION": "拖动平移 · 滚轮或按钮缩放 · 不可旋转", "Reset View": "重置视图", "12 districts · 30 plots · 52 landmarks": "12 个街区 · 30 个地块 · 52 个地标", "District hit area": "街区感应区", "Hover border": "悬停边框", "Locked selection": "已锁定选择",
  "Map File": "地图档案", "Select a district, plot or landmark": "请选择街区、地块或历史地标", "Districts are available at every zoom. From 500% to 1500%, plots and landmarks are selectable.": "任何缩放级别都可以选择街区；500% 至 1500% 可选择地块和地标。", "Manhattan, New York": "纽约 · 曼哈顿", "Available Plots": "可购入地块", "Not yet listed": "暂未挂牌", "Your Apartments": "你的公寓", "Your Factories": "你的工厂", "Your Stores": "你的商场", "Major Transit": "大型交通设施", "Not yet assessed": "暂未评估", "Prosperity": "繁荣度", "Map overview": "地图概览", "Map edition: Manhattan v004.": "地图版本：曼哈顿 v004。",
  "Select a plot on the map.": "请在地图上选择地块。", "District": "街区", "Zone": "用途", "Price Tier": "价格层级", "Owner": "业主", "Building": "建筑", "Income": "收入", "Buy Plot": "购买地块", "Build on owned empty land": "在自有空地上建造", "Standard Apartment — $8k": "标准公寓 — $8k", "Factory — $15k": "工厂 — $15k", "Luxury Apartment — $25k": "豪华公寓 — $25k", "Department Store — $30k": "百货商场 — $30k", "Build": "建造", "Redevelop into a higher-cost building": "改建为成本更高的建筑", "Redevelop": "改建", "Brokered Sale": "经纪出售", "Read more": "查看更多", "Source: English Wikipedia": "来源：英文维基百科",
  "Choose Rival": "选择对手", "Choose a rival and enter a one-on-one economic contest.": "选择一名对手，进入一对一的经济对战。", "Tycoon": "实业大亨", "Industrial expansion and transport value.": "重视工业扩张与交通价值。", "Landlady": "房东", "Residential income and steady holdings.": "重视住宅收入与稳健持有。", "Shark": "资本大鳄", "Cheap land, liquidity and opportunism.": "重视廉价土地、流动性与投机机会。", "Continue Saved Match": "继续已保存对局",
  "Three-Minute Walkthrough": "三分钟玩法导览", "Buy land and construct a building; each costs one action point.": "购买土地并建造建筑，两项操作各消耗 1 点行动点。", "Redevelop only into a higher-cost legal building. The old building contributes a 120% upgrade credit, but never pays cash back.": "只能改建为成本更高且符合法令的建筑。旧建筑提供建造费 120% 的升级抵扣，但不会返还现金。", "A brokered sale locks 90% of current property value and settles next turn.": "经纪出售会锁定当前地产价值的 90%，并在下一回合结算。", "Every securities buy or sell costs one action point and a 1% fee.": "每次买入或卖出证券消耗 1 点行动点，并收取 1% 手续费。", "Bank borrowing and repayment cost no action points; loans mature in six turns.": "银行借款和还款不消耗行动点；贷款在 6 回合后到期。", "Highest net worth after turn 8 wins.": "第 8 回合结束时净资产最高者获胜。",
  "Game Settings": "游戏设置", "System": "系统", "Language": "语言", "Motion": "动效", "Follows device preference": "跟随设备偏好", "Browser local storage": "浏览器本地存储", "Match Result": "对局结果", "Match Complete": "对局结束", "Your Net Worth": "你的净资产", "Your Securities": "你的证券资产", "Rival Securities": "对手证券资产", "Choose Another Rival": "选择其他对手"
};

Object.assign(staticText, {
  "Start A New Game": "开始新游戏",
  "Config": "设置",
  "About Us": "关于我们",
  "◀ esc": "◀ esc",
  "No saved match was found.": "未找到已保存的对局。",
  "A historical New York property strategy game about land, credit, auctions and market timing.": "一款关于土地、信贷、拍卖与市场时机的纽约历史地产策略游戏。",
  "Explore Manhattan, develop property, manage credit and outmaneuver a rival across the market cycle.": "探索曼哈顿、开发地产、管理信贷，并在市场周期中胜过对手。",
  "Buy land, raise buildings, manage debt and outmaneuver a rival across roaring Manhattan.": "购买土地，兴建楼宇，管理债务，在喧腾的曼哈顿市场中击败对手。",
  "Manhattan contains 30 purchasable plots and 52 historical landmarks. Prosperity and transit effects are not yet active.": "曼哈顿包含 30 个可购地块与 52 处历史地标；繁荣度与交通效果暂未启用。",
  "Districts are available at every zoom. From 500% to 1500%, plots and landmarks are selectable.": "任何缩放级别都可以选择街区；500% 至 1500% 可选择地块和地标。",
  "Map edition: Manhattan v004.": "地图版本：曼哈顿 v004。"
});

for (const [source, translation] of Object.entries(staticText)) zhCN[`static.${source}`] = translation;
zhCN["static.Market.2"] = "市值";
zhCN["static.Save.2"] = "存档";

Object.assign(zhCN, {
  "attribute.Opening menu": "启动菜单", "attribute.Main menu": "主菜单", "attribute.Main menu actions": "主菜单操作", "attribute.Metropolis: Roaring Times": "Metropolis: Roaring Times", "attribute.Home language": "启动页语言", "attribute.Previous language": "上一种语言", "attribute.Next language": "下一种语言", "attribute.System actions": "系统操作", "attribute.Match status": "对局状态", "attribute.Operations Desk": "综合操作栏", "attribute.Operations pages": "综合操作页面", "attribute.Future board mascot placeholder": "未来看板玩偶占位区",
  "attribute.Manhattan district map": "曼哈顿街区地图", "attribute.Interactive Manhattan map. Drag to pan, use plus and minus to zoom, and select a district for details.": "曼哈顿交互地图。拖动以平移，使用加减按钮缩放，选择街区查看详情。", "attribute.Illustrated Manhattan map": "曼哈顿插画地图", "attribute.Twelve selectable Manhattan districts": "十二个可选曼哈顿街区", "attribute.Thirty purchasable plots": "三十个可购地块", "attribute.Map controls": "地图控制", "attribute.Zoom out": "缩小", "attribute.Zoom in": "放大", "attribute.Map legend": "地图图例", "attribute.Selected map entity file": "地图对象档案", "attribute.Close selected district": "关闭所选街区", "attribute.Close help": "关闭玩法说明", "attribute.Close settings": "关闭设置", "attribute.Language": "语言", "attribute.Metropolis: Roaring Times map demo": "Metropolis: Roaring Times 地图演示"
});

window.M1W_LOCALES["zh-CN"] = zhCN;
