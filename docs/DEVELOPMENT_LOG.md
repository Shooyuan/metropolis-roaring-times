# Metropolis: Roaring Times — Development Log

## M1W-HOTFIX-09 — 街区英文地图标签字体与状态色

### 老板决定

- 地图上东乡、西乡、苏豪、切尔西等街区标签改用 `m0_web/assets/fonts/Kings-Regular.ttf`；
- 街区英文名按一个单词一行排布，字号和位置需要尽量填充并留在各自街区边界内；
- 标签默认色为 `#bdb199`；
- 鼠标悬停、键盘聚焦或点击选中该街区时，标签变为 `#4e403e`。

### 本阶段实现

- 新增 `Kings M1W` 字体声明并把地图街区标签切换到该字体；
- 地图本体街区标签固定使用英文地名，避免中文 UI 模式下破坏“一词一行”的地图排版；
- 为 12 个街区建立独立的标签排版表，分别控制位置比例、字号、行距和字距；
- 上东区、上西区等多词街区改为逐词换行；
- 街区 hover、focus、选中状态会同步驱动对应地图标签颜色；
- 自动测试新增字体、颜色、逐词换行和状态同步检查。

### 风险与后续门槛

- 当前排版表基于已导入的 v004 街区边界做近似适配；如果老板后续重画街区几何，需要重新审查并微调每个标签位置；
- 极窄或不规则街区无法只靠字体自动排版保证完美居中，必要时应在 Figma 中增加人工标注锚点或给程序提供老板批准的标签锚点表。

## M1W-HOTFIX-08 — 地标辉光与地块细边框

### 老板决定

- 历史地标不再使用围绕整张图片或父组的红色矩形框；
- 鼠标悬停历史建筑时，只在建筑插画本体上显示红色辉光；
- 点击历史建筑后，该红色辉光保持为选中状态；鼠标移开时，非选中悬停辉光消失；
- 可购买地块边框太粗，改为上一版的 50%。

### 本阶段实现

- M1W 网页地标反馈改为只作用于 `.landmark-artwork` 透明插画；
- 删除旧的 `.landmark-entity.is-selected::after` 矩形外框规则；
- 地块填充描边从 `3px` 降为 `1.5px`，悬停/选中外线从 `7px` 降为 `3.5px`，内线从 `2px` 降为 `1px`；
- 静态测试和运行地图集成测试新增防回归断言，确保旧矩形红框不会返回；
- 项目总纲、产品简报、垂直切片范围、地图美术规范、技术架构、验收标准、地图交付管线和老板审查计划均已同步。

### 风险与后续门槛

- 当前辉光依赖历史地标插画素材的透明背景；如果某个后续素材带有不透明矩形底，辉光会暴露图片边界，需回到素材侧重导透明图；
- 这只是 M1W 地图可读性热修，不代表 U3 最终 UI 状态样式已经冻结。

## M1W-CONTENT-01 — 地标简介与文案定位台

### 老板决定

- 先整理当前 M1W 的历史地标简介和全量文案定位，方便老板后续修改、增加和删除；
- 本阶段只生成内容审查文档，不直接改网页、玩法、UI 布局或语言包文案。

### 本阶段实现

- 新增 `docs/LANDMARK_COPY_DRAFT.md`，覆盖当前运行包中的 52 个历史地标；
- 每个地标记录内容 ID、Figma 源名、英文 Wikipedia 候选来源、来源状态、中文短介绍和中文长介绍草案；
- 新增 `docs/COPY_DECK.md`，把当前 428 条英文/中文文案 key 按界面位置和系统模块归档；
- 文案定位覆盖启动页、新游戏对手弹窗、顶部状态栏、综合操作栏、地图、详情栏、银行、拍卖、股票、法令、确认弹窗、Toast、结算、无障碍文本和旧静态兼容文案。

### 风险与后续门槛

- 15 个地标因为同名建筑、机构名称或 Wikipedia 独立页面不稳定，被标为“待核对”；上线前必须确认具体来源；
- 这些简介尚未写入游戏运行时，需老板审稿后再进入单独实现阶段；
- 当前文案定位表是修改入口，不等同于最终文案审批。

## M1W-HOTFIX-07 — 中文界面字体指定

### 老板决定

- 之后中文标题字体使用 `m0_web/assets/fonts/SourceHanSerifCN-Bold-2.otf`；
- 中文正文、按钮、详情和普通 UI 文字使用 `m0_web/assets/fonts/SourceHanSerifCN-Medium-6.otf`；
- 英文界面继续使用既有 `Inknut Antiqua M1W`，不因中文字体规则变更而改变。

### 本阶段实现

- `localization.css` 切换到老板指定的两份 OTF 文件；
- 中文标题变量 `--zh-title` 指向 Bold，中文正文变量 `--zh-body` 指向 Medium；
- 中文启动页菜单、子面板标题、对手选择弹窗标题、对手名、Start 按钮、游戏主标题、详情标题和回合重点文字统一走中文标题字体；
- 中文普通正文和 UI 文案统一走中文正文字体；
- 推进 CSS 缓存版本号，避免浏览器继续读取旧中文字体规则；
- 更新静态验收合同、资产清单和 UI 文档。

### 风险与后续门槛

- 两份 OTF 合计约 23MB，会增加网页包体；当前先按老板指定执行，公开部署前可再评估是否需要子集化；
- 旧 `m0_web/fonts/*.woff2` 暂不删除，避免误伤历史合版资料；若后续确认不再需要，可单独进入清理阶段。

## M1W-HOTFIX-05 — 启动弹窗贴图恢复与 1000% 地图缩放

### 老板决定

- 对手选择弹窗必须恢复老板提供的纸张面板贴图，不允许出现破图或透明底；
- 地图 `500%` 仍不足以检查细小地块和历史地标，最高缩放提高到 `1000%`。

### 本阶段实现

- 页面从已删除的旧 `assets/cutouts/panel_center_large.png` 路径迁移到现有 `assets/home_png_complete/panel_center_large.png`，启动页子面板、对手选择弹窗和三个对手选项统一使用该素材；
- 固定缩放由九级扩展为十三级：`100/125/156/195/244/305/381/477/500/625/781/977/1000%`；
- `500%` 保留为精细交互起点，`500%—1000%` 均可选择地块和地标，避免扩大上限后反而让原有 `500%` 操作失效；
- 同步更新英/简中提示、项目规格和自动验收合同。

### 风险与后续门槛

- `1000%` 会放大地图布局盒并增加单次重绘面积，真实浏览器必须验证缩放、平移边界和 SVG 清晰度；
- 旧路径文件的删除属于老板此前已有的工作区改动，本次不擅自把该删除并入提交；新路径素材作为本修复必要输入单独纳入版本控制。

## M1W-MAP-04 — V004 地块与历史地标网页接入

### 老板决定

- 老板批准采用已验收的 v004 轻量运行包，继续升级现有 M1W 制作人网页；
- 本阶段只验证正式几何、LOD、互斥选择和既有地产操作，不进入最终 U3/M2 界面，也不启动 Godot；
- 历史正文必须以后从英文 Wikipedia 单一来源整理并单独审批，本阶段不得编造。

### 本阶段实现

- 网页底图切换到 v004 运行包，加载 12 个街区、30 个老板绘制的可购买地块和 52 个老板放置的历史地标；
- 删除旧 18 地块的运行时依赖，把原 M0.1 的购买、建造、改建、出售、回合、银行、证券和 AI 演示接到 30 个正式地块；
- 固定缩放阶梯更新为 `100/125/156/195/244/305/381/477/500%`；低于 `500%` 以街区浏览为主，精确 `500%` 开放地块选择和地标横幅；
- 历史地标插画始终显示；街区、地块、地标严格互斥选择，点击地图空白清空选择和右侧详情；
- 右侧详情支持街区统计、地块价格层级与地产操作、历史地标待审内容骨架，并保持英/简中共用一套状态和脚本；
- 存档结构升级为 v4，旧 v3 仅列为不可直接恢复的历史键，避免把旧 18 地块状态错误映射到新几何；
- 网页只复制约 17MB 运行素材与 Wikipedia 来源图标，未把 1.2GB 源 ZIP 放入公开目录。

### 风险与后续门槛

- 对手开局地块是为了维持 M1W 1v1 演示而设的临时稳定映射，不是最终平衡；
- 地标短文、长文、逐项 Wikipedia 链接和中文翻译仍未制作；
- 大型交通、繁荣度和法令动态用途仍是待审批数据，不在本阶段伪造；
- 五套开发建筑插画尚未交付，所以地块只显示程序状态标记，不以临时图片冒充正式美术；
- 老板必须在浏览器中审查实际地块、地标、横幅和缩放可读性，批准后才能申请下一阶段。

## MAP-RUNTIME-01 — V004 地图交付轻量化与地价固化

### 老板决定

- 老板授权 Codex 解决 1.2GB 导出包、运行 ID 异常与地价生成问题；
- Figma 的 `cheap | medium | expensive` 不是错误命名，而是老板指定的地块价格层级；
- 精确地价由 Codex 生成，但必须可测试、可复现，不能每次启动改变。

### 本阶段实现

- 原始 ZIP 移出 `m0_web/assets/`，完整归档到 Git 忽略的 `assets/source_handoffs/metropolis_map_v001/`；
- 新增 `tools/map_handoff_processor/`，把重复内嵌 PNG 的地标 SVG 拆成透明 `WebP` 插画和独立横幅 SVG；
- 52 个地标运行 ID 完成规范化，并在清单保留全部源名、源 ID 与图片哈希；
- 30 个地块按北到南、同排西到东编号为 `plot_001`—`plot_030`，不再依赖 Figma 中重复的数字名；
- 按三个批准区间、固定种子、几何路径和 `$500` 步长生成精确基础地价，固化到 `plots.json`；
- 生成接触表、离线对齐页、处理报告、中文老板验收单和 V004 接收报告；
- 运行包约 17MB，相对 1.2GB 源 ZIP 缩减约 98.63%，现有网页未修改。

### 风险与门槛

- 自动测试通过不等于视觉批准；老板必须检查接触表与对齐页后才能接入网页；
- 横幅依赖 `Jacquard 24`，接入前必须解决字体随包交付或替代审批；
- 仓库内现有 `.fig` 快照早于 V004 ZIP，老板仍须保存同步版本的本地副本；
- 历史地标年代适配和百科内容仍属于后续内容阶段。

## TOOL-FIGMA-06 — 历史地标逐项导出性能修复

### 问题与老板决定

- 老板在真实八层 Figma 地图中确认：默认快速模式每次进入 `07_HISTORICAL_LANDMARKS` 都会卡住；
- 图层审查确认每座地标已经使用独立父组，内部标题牌、文字与插画层级合理，卡顿不是由 `title` 或 `Rectangle 6` 等子层名称造成；
- 老板批准优先修复风险，不修改 Figma 原稿和现有网页。

### 本阶段实现

- 快速模式停止把全部含位图地标一次性合成为主画布尺寸的历史地标总 SVG；
- 插件改为按 `07_HISTORICAL_LANDMARKS` 的直接子父组逐项导出到 `landmarks/*.svg`，并逐座显示进度；
- 新增 `handoff/landmarks.json`，保存原始 Figma 名、候选 `snake_case` 稳定 ID、文件路径、相对主画框边界、变换和完整轻量子层级；
- 单座地标失败时记录具体 ID 并继续，其余地标和 ZIP 不被阻断；
- 快速结构树不再复制重型 `vectorNetwork`/`vectorPaths`，也不再重复保存整页图层树；精确几何继续由生产 SVG 保存；
- 原始图片提取范围由整个 Figma 页面收紧到当前主地图和独立 Brand，并继续按图片哈希去重；
- 完整归档模式仍保留历史地标总 SVG、完整重型结构、整图、对齐预览和逐顶层输出。

### 测试与现场门槛

- 静态语法、八层识别、UTF-8、ZIP、快速/完整模式合同和失败降级测试必须通过；
- 使用 100 个模拟地标验证清单数量、唯一文件名、坐标、子图层关系及快速结构不包含重型矢量副本；
- 自动测试不能模拟 Figma 对真实图片执行 `exportAsync` 的内存行为。提交后仍须由老板关闭并重新打开开发插件，再以默认快速模式完成一次真实 ZIP 下载；未通过现场复测前，本修复只算代码完成，不算地图素材验收完成。

## TOOL-FIGMA-05 — 八层大地图快速交付

### 问题与老板决定

- 新增历史地标与可购买地块后，`10334 × 14101` 主画框长期停在“导出完整主画框 SVG”；
- 老板不接受继续等待，批准升级插件并提供不依赖整图合成的替代交付路径。

### 本阶段实现

- 插件正式识别 `07_HISTORICAL_LANDMARKS` 与 `08_PURCHASABLE_BLOCK_GEOMETRY`，恢复八层并列图层识别；
- 默认“大地图快速交付”跳过完整主画框、对齐合成预览、逐顶层重复 SVG 与 PNG；
- 快速包仍保存完整结构 JSON、纯底图、街区、历史地标、可购买地块、Brand 与原始图片；
- 历史地标插画、横幅和文字可作为同一地标父组的三个子图层，JSON 保存父子关系和坐标，地标 SVG 保留叠放结果；
- “完整归档交付”保留旧的合成与逐层输出，只在确有归档需要时使用。

### 风险与现场门槛

- 本地测试只能验证导出计划、八层识别、ZIP 生成和静态合同，无法替代老板实际 Figma 文件中的导出性能；
- 老板必须重新打开开发插件，以加载修改后的本地代码，并用默认快速模式完成一次 ZIP 下载；
- 未通过真实八层文件现场导出前，不得宣称 Figma 交付阶段最终完成。

## DOC-UI-01 — 新版游戏内 UI 规格冻结

### 老板决定

- 游戏内界面固定为顶部状态、左侧综合操作、中央地图、右侧详情/小地图和右下回合控制五个模块；
- 顶栏显示 Turn、Cash、Debt、Credit Left、Config；对手精确资产隐藏；
- 左栏固定为 News、Bank、Auction House、Stock Market，Investment Advice 并入 News，Game Brief 移入 Config；
- 冰淇淋橡皮管看板娘永久位于 News，使用五张已批准状态图；
- 右侧永久小地图用红框同步主地图视口；地图精细地块、开发建筑、地标横幅和地标/地块命中在精确 `500%` 开放；
- 右下显示日期、经济阶段、3 点行动点状态和 End Turn；未用完行动点的确认可选择以后不再提示；
- 垂直切片固定为 1915 年 6 月至 1917 年 1 月，每回合一个月，第 14 回合对应 1916 年 7 月；
- Config 只包含 Game Brief、Language、Save Game、Load Game、Return to Title，不包含 Audio、Display、Controls；
- 视觉采用 1920 年代纽约 Art Deco 高级酒店语言，只借鉴《Civilization VI》的信息层级，不复制素材；先做 U1 全屏概念、U2 模块样式、U3 组件规格，再另行批准实现。

### 本阶段边界

- 只更新总纲、规则、范围、地图/美术、架构、验收、计划、地图交付和老板审查文档；
- 新增 `IN_GAME_UI_LAYOUT_SPEC.md` 和老板布局的小尺寸审阅图；
- 不修改当前 `m0_web` 页面，不生成新 UI 图，不开始 Godot 或 M2 实现；
- 当前 M1W 五页签界面只作为历史原型保留，不能再作为最终游戏内 UI 权威。

## DOC-MAP-CONTENT-01 — 老板绘制地块与历史地标规则贯通

### 老板决定

- 12 个 Financial District、SoHo、East Village 等区域统一称“街区”；青绿色闭合形状称“地块”；历史建筑与公共设施称“历史地标”；
- 正式地块只来自老板的 `08_PURCHASABLE_BLOCK_GEOMETRY`，数量不预设，Codex 不按道路自动生成地块；
- `07_HISTORICAL_LANDMARKS` 保存老板绘制的历史地标插画与英文横幅；地标长期显示，交互按缩放 LOD 开放；
- 固定缩放扩展为 `100/125/156/195/244/305/381/477/500%`，街区、地块、地标选择严格互斥；
- 街区与地标中英文历史资料只选自 English Wikipedia，中文依据英文条目翻译改写，来源在游戏内弹窗显示；
- 中文地图名继续沿用当前版本，但 West Village 与 East Village 改为“西乡”“东乡”；
- 历史地标玩法影响延期，进入相关阶段前必须再次提醒老板审批。

### 本阶段边界

- 只更新权威文档、审批模板、中文名和老板提交的 `assets/wikipedia-w.svg`；
- 不修改老板 Figma，不接入尚未完成的 07/08 图层，不制作五套开发建筑插画，不改变当前 M1W 地图交互；
- Figma 完成后仍需一键导出并通过新合同验收，才能开始下一接入阶段。

## M1W-I18N-01 — 中英文网页合版

### 老板决定与实现结果

- 老板批准把已认可的英文版和简体中文版立即合并，避免后续 UI 修改需要维护两套结构；
- 网页现只保留一个 `index.html`、一个 `app.js` 和一个布局样式，英文与简体中文分别由语言词典提供；
- 设置弹窗加入语言选择，首次默认英文，切换即时生效并保存偏好；`?lang=zh-CN` 可直接打开中文；
- 语言切换不重置对局、地图选择、缩放、综合操作页签或弹窗状态；
- 活动消息改存稳定翻译键和参数，不把某一种语言的已渲染句子写入新存档；
- 新版本使用统一存档键，旧英文、旧中文和更早存档只作为迁移来源读取，不自动覆盖或删除；
- 原 `zh-CN/` 独立玩法代码与重复布局样式已删除，只保留兼容跳转入口；中文字体移至统一字体目录。

### 验证结果

- JavaScript 四文件语法检查通过；地图/Brand 静态门禁通过；
- 双语静态门禁输出 `M1W_I18N_STATIC_TEST_PASS locales=2 dynamic_keys=241 fonts=2`；
- 真实浏览器英文↔中文双向切换通过，Chelsea、125% 缩放、回合、页签及设置弹窗状态全部保持；
- 语言刷新记忆、`?lang=zh-CN`、旧 `/zh-CN/` 跳转、统一存档往返和中英文辅助标签通过；
- 浏览器控制台无警告或错误；未修改老板地图、Brand 或分区几何。

### 阶段决定

- 合版实现和内部验收完成；本阶段创建独立 Git 提交后停止；
- 等待老板视觉审查和是否进入下一阶段的明确批准；
- 未授权 Godot M1A，也未开始 UI 美术改版或64地块制作。

## M1W-WEB-01 — 制作人地图网页 Demo

### 实现结果

- 从已验收 v003 ZIP 原样派生网页底图与分区 SVG，并复制正式独立 Brand；静态测试锁定三份网页素材与权威源文件的 SHA-256 一致性；
- 保留原 M0.1 的状态栏、综合操作栏、八回合经济、银行、股票、新闻和存档基线；
- 用老板正式地图替换临时曼哈顿轮廓，没有在正式地图上显示或猜测旧18地块；
- 接入12个权威分区的透明命中层、桃色外带/深褐内线、英文标签、点击锁定和右侧英文详情；
- 实现鼠标拖拽、滚轮、按钮、键盘方向键和固定125%倍率缩放，范围为100%至305%，不提供旋转；
- 修复 Safari 将缩放地图先栅格化再放大的清晰度问题：缩放现在改变 SVG 的实际布局尺寸并触发矢量重绘，不再对合成层使用 `transform: scale()`；
- Chelsea 使用老板批准的原始 Figma 矢量网络，未重画边界；
- 旧18地块数据仅保留为不映射地理的 M0 经济测试夹具，AI偏好改按夹具 ID，退役分区语义不再存在于活动代码。

### 验证结果

- 12区逐项点击、详情对应和选中保持全部通过；
- Chelsea 悬停、可见区域真实坐标点击、锁定、缩放后保持和拖拽后保持通过；
- 固定缩放读数为 `100%`、`125%`、`156%`、`195%`、`244%`、`305%`，滚轮与键盘路径通过；
- 1280×720 和 1600×900 布局通过，综合操作栏五页签回归通过，浏览器控制台无警告或错误；
- 内部浏览器305%实际渲染尺寸验证通过，底图与分区层的 `x/y/width/height` 差值全部为0，Chelsea 选择保持通过；Safari 视觉效果仍由老板刷新后复核；
- 网页静态门禁输出 `M1W_STATIC_TEST_PASS districts=12`；Godot 既有回归输出 `M0G_TESTS_PASS count=4`；
- 详细测试和剩余风险记录在 `M1W_WEB_TEST_REPORT.md`。

### 阶段决定

- M1W 实现与内部测试完成；
- 完成 Git 提交后停止，等待老板视觉验收；
- 未获老板明确批准前不得进入 Godot M1A，也不得创建64个正式地块。

## M1W-INTAKE-03 — Figma 交付包 v003 与正式 Brand 接收

### 老板决定与本阶段动作

- 老板提交 `metropolis_handoff_1786627051152.zip` 与同步更新的 `.fig` 本地副本；
- 老板确认 `district_chelsea` 在 Figma 中检查无视觉问题，批准保留原始矢量网络；M1W 必须专项验证其悬停、点击和选中保持命中范围；
- 老板确认 `assets/00_BRAND.svg` 是独立最终 Brand，并授权 Codex 直接补入标题冒号，不需要把 `00_BRAND` 放回地图 Figma；
- Codex 只修改 Brand 的非地理矢量，没有修改地图或分区几何。

### 验收结果

- ZIP 13 个文件无损，插件 `warnings=[]`，六个顶层图层完整；
- 12 个稳定分区 ID 已全部正确导出，`district_financial_district` 拼写已修复；
- 完整地图、底图、分区、对齐及逐层 SVG 均使用 `viewBox="0 0 10334 14101"`，全部通过 XML 检查；
- 正式底图没有混入分区交互层；
- Brand SVG 合法、透明背景和署名保持不变，标题已显示为 `Metropolis: Roaring Times`；
- 详细校验值和门禁结论记录在 `FIGMA_HANDOFF_INTAKE_V003.md`。

### 阶段决定

- M1W 输入结构门通过；
- `district_chelsea` 不再作为 Figma 返工阻断，但其浏览器命中区域仍是公开风险；
- 完成本阶段测试与 Git 提交后停止，等待老板明确批准开始 M1W 网页开发。

## DOC-MAP-12 — 12 个权威分区正式替代旧六区

### 老板决定

- 正式采用 Figma 中的 12 个曼哈顿分区，替代旧六分区/五玩法区模型；
- 12 个稳定 ID 从 `district_inwood` 到 `district_financial_district`，以 `MAP_ASSET_PIPELINE.md` 为唯一清单；
- Central Park 是公共非分区区域，河对岸陆地是首版非交互背景；
- 各区经济画像仍待后续批准，不自动继承旧五玩法区。

### 规则影响

- 旧 `district_brooklyn_bridgehead` 不再存在，因此原“Brooklyn Bridgehead 地块额外 +10% 地价”规则退出当前生效规格；
- 普通固定交通邻接 `+15%` 地价与建筑收入规则保持不变且不叠加；
- 若以后重新引入桥梁溢价，必须由老板批准明确地块清单，不得按旧分区名暗中恢复。

### Chelsea 修正说明

- 机器检查发现 `district_chelsea` 不是单一以 `Z` 结尾的闭合轮廓，而是 Figma 矢量网络；
- 老板已在 Figma 中人工检查并确认视觉无误，项目不再要求重画或连接该边界；
- Codex 不修改权威几何，改在 M1W 中验证实际悬停、点击和选中保持范围；若失败则报告老板重新裁决。

### 验证结果

- 12 个稳定 ID 权威清单扫描通过，生效规格中没有残留旧六区数量或旧分区 ID；
- 插件 JavaScript 语法、任意尺寸/坐标、UTF-8 和 ZIP 本地测试通过；
- Godot M0G 回归测试在 `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- Git 空白检查通过，老板新 ZIP、`.fig` 和美术素材仍保持未提交。

## M1W-INTAKE-02 — Figma 交付包 v002 复验

### 复验结果

- 新 ZIP 与新 `.fig` 已收到，校验值和逐项证据记录在 `FIGMA_HANDOFF_INTAKE_V002.md`；
- `district_soho` 已从隐藏改为可见，当前正式分区 SVG 已包含全部 12 个 Figma 分区；
- `district_finicial_district` 拼写错误仍存在；
- `district_chelsea` 仍由多个开放子路径组成，没有形成权威闭合轮廓；
- `00_BRAND.svg` 的哈希与 v001 完全相同，正式标题缺少冒号的问题仍存在；
- 老板随后已通过 `DOC-MAP-12` 确认 12 区正式替代旧六区；本条保留为 v002 复验当时的历史状态。

### 阶段决定

- v002 解决一项、保留三项内容阻断；
- Codex 继续不修改老板 Figma 几何，不进入 M1W 网页接入；
- 等待老板完成剩余三项修改；12 区产品裁决随后已由 `DOC-MAP-12` 完成。

### 验证结果

- 新 ZIP 13 个文件通过系统解压校验，全部导出 SVG 通过 XML 合法性检查；
- 插件 JavaScript 语法、任意尺寸/坐标、UTF-8 和 ZIP 本地测试继续通过；
- Godot M0G 回归测试在 `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- Git 空白检查通过，老板新 ZIP、`.fig` 和美术素材保持未提交。

## M1W-INTAKE-01 — Figma 交付包 v001 验收

### 已收交付

- 收到并只读检查 `metropolis_handoff_1786625270806.zip`、`metropolis_roaring_times_map_v001.fig`、`00_BRAND.svg` 和 `06_FRAME.svg`；
- 原始文件保持未修改、未移动、未提交；SHA-256、大小和检查证据记录在 `FIGMA_HANDOFF_INTAKE_V001.md`；
- ZIP、六层结构、任意尺寸画布、全部 SVG 统一 `viewBox`、正式底图隔离和纯矢量导出通过。

### 阻断项

- `district_soho` 被隐藏，未进入正式分区 SVG；
- `district_finicial_district` 拼写错误；
- `district_chelsea` 权威路径未闭合；
- 独立 Brand 可见标题仍缺少项目已批准的冒号；
- Figma 已有 12 个地理分区，但项目文档仍有旧六分区模型，必须由老板明确裁决后才能贯通修改。

### 阶段决定

- 插件交付结构门通过，但分区几何和 Brand 门未通过；
- Codex 不修正老板几何，不进入 M1W 网页接入；
- 等待老板修正 Figma、保存同版本 `.fig`、重新导出 ZIP，并确认 12 分区是否正式替代旧六区。

### 验证结果

- ZIP 13 个文件全部通过系统解压校验，所有导出 SVG 通过 XML 合法性检查；
- 插件 JavaScript 语法、任意尺寸/坐标、UTF-8 和 ZIP 本地测试继续通过；
- Godot M0G 回归测试在 `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- Git 空白检查通过，老板源文件仍保持未提交状态。

## TOOL-FIGMA-04 — 任意矢量画布与 SVG 优先交付

### 老板决定

- Figma 地图是矢量图，不再限制 `4474 × 5904` 或任何其他固定像素尺寸；
- 插件必须按老板实际画布直接导出，不得因尺寸或缺少地图内 `00_BRAND` 阻止交付；
- `00_BRAND` 继续允许作为地图文件之外的独立项目素材。

### 本阶段实现

- 删除固定宽高的识别、验收和警告逻辑，保留旧主画框名称只用于向后兼容；
- 并列图层模式统一以 `06_FRAME` 为首选实际画布边界、`01_WATER` 为后备，不缩放或改写老板矢量原稿；
- 新增完整地图、正式底图和对齐审查 SVG，结构 JSON 记录实际画布宽高，运行时使用 `x / actual_canvas_width`、`y / actual_canvas_height` 归一化；
- PNG 降级为默认关闭的可选预览；主动开启后，即使栅格化失败也只记录警告，不中断 SVG、JSON 和 ZIP；
- 单个 SVG、逐层 SVG、Brand 或原始图片提取失败时均继续生成其余交付内容，并在包内汇总具体警告；
- 当前地图文件中的六个地图层是有效结构，独立 Brand 不计入地图层数量。

### 风险与验证要求

- SVG 虽可无损缩放，但极复杂矢量仍可能使浏览器解析和绘制变慢；M1W 接入时必须实测加载、缩放和拖拽性能，必要时只优化网页运行副本，不修改老板权威源文件；
- 不限制尺寸不等于允许各层坐标不一致：完整地图、底图、分区和对齐 SVG 的 `viewBox`、原点及结构 JSON 画布宽高仍必须完全一致；
- 老板重新运行插件时应保持 PNG 选项关闭，先完成一次真实矢量 ZIP 导出验收。
- JavaScript 语法、任意尺寸六层识别、坐标变换、无固定尺寸常量、UTF-8、PNG 默认关闭、单项失败继续、ZIP 生成/系统解压和无网络权限检查均通过；
- M0G 回归测试通过，Godot `4.7.1.stable.steam.a13da4feb` 输出 `M0G_TESTS_PASS count=4`；测试环境仍有既有 macOS 系统 CA 读取警告，但不影响项目测试。

## TOOL-FIGMA-03 — Figma 主线程 UTF-8 兼容修复

### 问题与决定

- 真实 Figma 桌面版在开始导出结构 JSON 时报告 `'TextEncoder' is not defined`；
- 原因是插件主线程不是普通浏览器页面，不能假定存在浏览器全局 `TextEncoder`；这与老板的地图图层或素材内容无关；
- 改为插件内置 UTF-8 编码器，避免依赖该浏览器全局对象，继续支持中英文和 emoji 文本。

### 风险与验证

- 插件界面中的 ZIP 生成仍运行在浏览器式 UI 沙箱，保留其原生 `TextEncoder`；本次只替换 Figma 主线程中的不兼容调用；
- 自动测试已在明确没有 `TextEncoder` 的主线程模拟环境中通过，并逐字节对照标准 UTF-8 编码；JavaScript 语法、ZIP 生成、系统解压和无网络权限检查也均通过；
- 当时真实文件被识别为 `10334 × 14101`、6 个顶层图层；该项已由 `TOOL-FIGMA-04` 正式裁决为有效任意尺寸画布和六个地图层，不再产生尺寸或 Brand 缺席警告；
- M0G 回归测试通过，Godot `4.7.1.stable.steam.a13da4feb` 输出 `M0G_TESTS_PASS count=4`；测试环境仍有既有 macOS 系统 CA 读取警告，但不影响项目测试；
- 本阶段仍需老板重新运行插件完成一次真实 ZIP 导出，才能结束现场验收。

## TOOL-FIGMA-02 — 并列 Group 自动识别修复

### 问题与决定

- 老板的七个地图顶层图层是同级 Group，而非被一个外层 Frame 包裹；旧版插件因此无法把已选中的 `06_FRAME` 识别为地图入口；
- 保留老板现有 Figma 图层结构，不要求重新分组或改稿；
- 插件当时改为接受规定顶层图层中的任意一层，并根据同级图层自动建立只用于导出的虚拟主画框；后续 `TOOL-FIGMA-04` 将正式地图层数明确为六层。

### 本阶段实现

- 同时支持正式 `MAP_MASTER_4474x5904` Frame 与并列顶层 Group 两种结构；
- 虚拟主画框最初按固定画布识别；该规则已由 `TOOL-FIGMA-04` 替换为按 `06_FRAME`/`01_WATER` 的实际矢量边界识别，并继续保留各图层的绝对变换、顺序、样式和可见状态；
- 完整 SVG、地图底图、分区 SVG、对齐预览和逐层 SVG 均使用同一虚拟主画框坐标；
- 导出清单增加 `sourceKind`，明确记录本次使用真实 Frame 还是并列图层模式；
- 插件界面和项目交付规范同步更新，不再要求老板为了导出而重构 Figma 原稿。

### 风险与验证

- 虚拟主画框只在导出期间存在，完成单项导出后立即删除；
- 固定尺寸警告属于历史实现，已由 `TOOL-FIGMA-04` 删除；
- 必须在 Figma 桌面版真实文件中再次确认界面显示“并列图层模式”，并完成一次 ZIP 下载，才算现场验收结束。
- JavaScript 语法、并列 Group/正式 Frame 识别、统一画布坐标变换、插件清单无网络权限和 ZIP 生成/系统解压测试均通过；
- M0G 回归测试通过，Godot `4.7.1.stable.steam.a13da4feb` 输出 `M0G_TESTS_PASS count=4`；测试环境仍出现既有 macOS 系统 CA 读取警告，但不影响项目测试。

## TOOL-FIGMA-01 — Figma 一键交付插件与 M1W 网页优先决策

### 老板决定

- 手工隐藏图层、分别导出多个格式过于复杂，需要项目专用 Figma 插件；
- 插件必须尽可能保存图层关系、位置关系、颜色、样式、矢量和原始图片；
- 当前最近目标恢复为制作人浏览器 Demo，先不用 Godot；
- M1W 网页验收前不得启动 Godot M1A。

### 本阶段实现

- 新增 `tools/figma_handoff_exporter/` 本地 Figma 开发插件；
- 一键 ZIP 包含完整图层树 JSON、生产地图 PNG、分区 SVG、对齐预览、独立 Brand、逐层全画框 SVG 和原始图片；
- 插件不联网，仅接受规定名称或 `4474 × 5904` 尺寸的主画框；
- 所有生产导出使用临时副本并在导出后删除，不改写老板原图层；
- 新增中文安装说明和本地 ZIP 结构测试；
- 项目计划新增 M1W，Godot M1A 顺延。

### 风险与限制

- Figma 插件 API 不提供版本历史、评论和所有内部协作元数据，因此仍须保留 `.fig` 本地副本；
- 本阶段只能完成本地静态和 ZIP 测试，必须由老板在 Figma 桌面版导入插件并完成一次真实文件导出验收；
- 超大地图的 PNG、逐层 SVG 和结构 JSON 可能使 ZIP 较大，导出时需等待进度完成。

### 本地验证

- `code.js` JavaScript 语法检查通过；
- Figma `manifest.json` 结构检查通过，网络白名单固定为 `none`；
- ZIP 存储算法测试通过，生成文件可由系统 `unzip` 完整校验和读取；
- 为避免旧版 macOS 解压工具错误显示中文文件名，包内中文说明使用英文文件名 `README_ZH_CN.txt`；
- Git 空白检查和 Markdown 相对链接检查通过；
- 未修改运行代码的 M0G 基线在 Godot `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- 受限测试环境仍产生已知的 macOS 系统 CA 读取警告，但没有项目测试因此失败。

## M1A-BRAND-D — Brand 标题、署名与独立导出决策

### 老板决定

- 正式 Brand 必须使用完整标题 `Metropolis: Roaring Times`，保留冒号；
- 公开保留署名 `designed and drawn by GatChive`；
- Brand 从地图底图拆出，作为独立素材导出和运行时放置；
- Figma 地图顶层遮挡顺序以老板批准的 `06_FRAME`、`05_NON_BUILDING_ORNAMENT`、`04_ROADS`、`03_DISTRICT_GEOMETRY`、`02_COASTLINE`、`01_WATER`、`00_BRAND` 为准。

### 已收素材的只读检查

- `00_BRAND.svg` 是合法 SVG，画框 `2450 × 2538`，透明背景正常，文字已转矢量路径；
- 文件包含一张 `2280 × 930` 的内嵌 PNG、11 个蒙版和 3 个滤镜，正式 Godot Web 接入前仍需进行 SVG/透明 PNG 视觉对照；
- 当前导出标题缺少冒号，底部约有 `88 px` 透明余量，因此仍等待老板从 Figma 重新导出修正版；
- 本次文档决策阶段不修改、移动或提交老板的 `.fig` 和 SVG 源素材。

### 验证结果

- Git 空白检查与 Markdown 相对链接检查通过；
- 标题、署名、独立 Brand 和老板批准的七层遮挡顺序已同步到总纲、产品、美术、验收、计划与素材流程；
- 未修改代码的 M0G 基线在 Godot `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- 受限测试环境仍产生已知的 macOS 系统 CA 读取警告，但没有项目测试因此失败。

## DOC-L0 — 老板审查文档语言纠偏

### 问题

- 项目把“面向英语玩家”错误扩大成了“开发文档使用英文”；
- 老板当前需要审查的地图交付规范使用英文，导致审查成本和误解风险上升；
- `01_PRODUCT_BRIEF.md` 至 `07_IMPLEMENTATION_PLAN.md` 等历史权威规格也仍以英文为主。

### 本阶段纠正

- 将 `MAP_ASSET_PIPELINE.md` 完整改为中文，同时原样保留尺寸、颜色、文件名、Figma 页面/图层名、公式和稳定分区 ID；
- 明确 `OWNER_PROJECT_REVIEW.md` 是中文老板审查入口，并清理非必要英文管理用语；
- 在总纲和 `AGENTS.md` 中冻结语言边界：玩家内容英文，老板审查与团队实施文档中文，稳定技术标识保留英文；
- 新增 `DOCUMENT_LANGUAGE_MIGRATION.md`，把其余英文规格分成四个受控翻译批次；
- 本阶段不改变玩法、数值、代码和 M1A 地图门禁。

### 当前门禁

完成静态检查、Godot 基线测试和独立 Git 提交后停止。老板决定后续优先完成全部文档中文化，还是将翻译批次与后续里程碑交替安排；未获批准前不开始 M1A。

### 验证结果

- `git diff --check` 通过；
- Markdown 相对链接检查通过；
- 地图规范翻译前后的反引号技术标识完整性检查通过；
- `4474 × 5904`、宽高比、SVG 画框、文件名、坐标公式和七种技术色的定向常量检查通过；
- 三份当前老板审查/语言治理文档均以中文字符为主；
- 未发现旧的“项目文档可以使用中文”宽松规则残留；
- 未修改代码的 M0G 基线在 Godot `4.7.1.stable.steam.a13da4feb` 下通过，输出 `M0G_TESTS_PASS count=4`；
- 受限测试环境仍产生已知的 macOS 系统 CA 读取警告，但没有项目测试因此失败。

## M1A-F — Owner-Authored Figma Handoff Correction

### Management Failure Report

- Codex incorrectly treated the absence of owner district assets as permission to draw provisional district polygons and present them as an M1A visual candidate;
- the owner rejected that interpretation and confirmed that both the production base and district geometry will be submitted from the owner's Figma work;
- the incorrect M1A implementation, preview scene, test data and screenshots were never committed and were removed completely;
- the verified M0G runtime remains the implementation baseline.

### Corrected Authority

- the owner authors and approves one `4474 × 5904` Figma master containing the production base and district vectors;
- the required delivery contains `.fig`, base PNG, authoritative district SVG, district-mask PNG, alignment preview and owner notes;
- Codex may preserve, validate, convert and integrate the package but may not invent, redraw, smooth, simplify or silently repair district geometry;
- missing or invalid assets stop M1A and are reported to the owner;
- the owner-facing management sequence and decision gates are recorded in `OWNER_PROJECT_REVIEW.md`.

### Current Gate

This is a documentation and process-correction stage. After its tests and Git commit, work pauses for owner review. Actual M1A remains blocked on both owner approval of this process and receipt of the minimum Figma delivery package.

### Verification

- `git diff --check` passes;
- Markdown relative-link validation passes;
- acceptance-test heading IDs contain no duplicates;
- targeted authority/count scans confirm the active documents consistently define owner-authored Figma geometry, five gameplay groupings and six separate district vectors;
- the rejected provisional M1A data, scene, scripts, notes and tests are absent;
- the unchanged M0G headless suite passes with `M0G_TESTS_PASS count=4` under Godot `4.7.1.stable.steam.a13da4feb`;
- Godot emits the known non-blocking macOS system-CA access warning in the restricted test environment; no project test fails because of it.

## M1A-D — Map Foundation and LOD Specification Correction (Superseded in Part)

> Historical note: the interaction/LOD decisions remain active, but any wording that allowed Codex to establish map composition or district geometry is superseded by M1A-F and `MAP_ASSET_PIPELINE.md`.

### Owner Decision and Corrective Action

- the owner rejected the unapproved freehand/programmatic Manhattan composition and required development to proceed from the supplied 1939 reference as an art and spatial guide;
- the rejected M1A implementation was never committed and has been removed in full, restoring the verified M0G runtime shell;
- the historical image is reference material only; under the superseding M1A-F decision, the owner reconstructs the production map in named Figma layers and Codex has no authority to substitute generated art or geometry;
- district/plot geometry, interaction borders, building anchors and gameplay overlays remain independent structured data in normalized map coordinates;
- the Godot editor's standard 4.7 project metadata update is preserved as an editor-generated compatibility change;
- newly supplied reference files remain untouched and untracked until provenance and asset intake are reviewed.

### Specification Decisions Incorporated

- map texture resolution is independent from map-space geometry, but every revision must preserve an approved crop, aspect ratio and registration landmarks;
- districts use closed vector polygons, not raster border colors, for hit testing and selection;
- hover shows an indicative `border_peach`/`ink_primary` border; click locks the border and opens the district detail page until another selection or explicit close;
- near-zoom plot/building targets take priority over their underlying district;
- far and middle zoom hide all individual public/private building illustrations and display the exact ordered district summary;
- all public and private building illustrations appear at the same owner-approved near-zoom threshold;
- district prosperity combines human and active-AI development, ranges from `50.0` to strictly below `100.0`, and displays one decimal place;
- the prosperity formula, weights, English labels/bands and precise LOD threshold remain future owner approval gates.

### Verification and Next Gate

- all active product, rules, scope, art, architecture, acceptance and implementation-plan documents are synchronized through this correction;
- the new asset handoff contract is recorded in `MAP_ASSET_PIPELINE.md`;
- Markdown relative-link validation, duplicate acceptance-ID detection, Git whitespace checks and targeted legacy-wording scans pass;
- the unchanged M0G headless suite passes with `M0G_TESTS_PASS count=4` under Godot `4.7.1.stable.steam.a13da4feb`;
- the unchanged M0G native scene starts with `M0G_RUNTIME_READY` and a successful `user://` persistence increment when run with normal local permissions;
- the next implementation gate is governed by M1A-F: first receive and validate the owner-authored Figma package, then integrate an exact district overlay. Codex may not create substitute geography.

## M0G — Godot Environment and Minimum Runtime

### Owner Decisions and Collaboration Boundary

- the owner approved resuming Godot work after the M0.1W Web prototype;
- the owner chose the Steam installation of Godot rather than a Codex-managed download;
- Codex remains project manager, integration owner and sole writer to the main worktree;
- DeepSeek receives a separate detached worktree and may edit only an explicitly assigned domain task packet;
- `DEEPSEEK_OFFICE.md`, `docs/COLLABORATION_PROTOCOL.md` and the corresponding `AGENTS.md` rules were committed as `0885c3f`;
- no DeepSeek task is active during M0G.

### Delivered Scope

- verified the Steam Godot executable as `4.7.1.stable.steam.a13da4feb`;
- verified matching Steam-bundled Web templates, including single-thread release/debug templates;
- confirmed that no Godot MCP capability is exposed in the current Codex tool surface and retained files plus CLI as the authoritative path;
- set the project display name and main scene to `Metropolis: Roaring Times`;
- retained the Compatibility renderer and added a single-thread Web export preset;
- added a minimal English runtime shell that visibly distinguishes native/Web startup and increments a `user://` persistence probe;
- added the first headless test runner with four configuration/resource assertions and an isolated intentional-failure mode;
- excluded generated Web output, reference material, prototype files and tests from the release package where applicable;
- recorded environment findings in `MCP_CAPABILITIES.md`.

### Verification Performed

- passing headless run printed `M0G_TESTS_PASS count=4` and exited `0`;
- isolated intentional failure printed `M0G_TESTS_FAIL count=1` and exited `1`;
- native headless startup printed `M0G_RUNTIME_READY` and persisted visit counts `1`, then `2`;
- release Web export generated HTML, JavaScript, WASM and PCK files with the Steam-bundled template;
- the HTTP-served build started in a real browser with Godot 4.7.1, Compatibility/WebGL 2 and a single-thread Emscripten configuration;
- browser console contained the expected runtime-ready record and no blocking error;
- browser persistence incremented from visit `1` to visit `2` after reload.

### Remaining Risks and Next Gate

- this is an environment shell only; it contains no production map, rules loop, final interface or art;
- the current browser proof covers the available in-app browser surface, not the full Chrome/Safari release matrix reserved for M9;
- future Steam engine updates may change the executable or templates and require the M0G smoke checks to be rerun;
- M1A map composition is not authorized until the owner reviews this completed stage and explicitly approves the next gate.

## M0.1W — Web Graybox Economic and Interface Revision

### Delivered Scope

- changed the playable title to `Metropolis: Roaring Times`;
- replaced the old Investor Brief and bottom command deck with the five-page Operations Desk and top status-bar `End Turn`;
- separated Game Brief, Investment Advice, Bank, Auction House and Stock Market into independently scrolling pages in the approved order;
- added the non-conversational placeholder for the future rubber-hose board mascot;
- applied the approved opening land bands and building gross-income/maintenance tuning;
- implemented strictly upward redevelopment using `max(0, new_cost - 120% × old_original_cost)` with one-turn activation;
- implemented one-action-point brokered sales that lock 90% of property market value and settle at the next turn boundary;
- implemented bonds, industrial shares and a fictional investment trust with deterministic prices, $1,000 order steps, 1% fees and one existing action point per buy/sell;
- included securities in both participants' net worth and result breakdown;
- added classified Historical, Fictional, Rumor and Activity records without inventing real newspaper attribution;
- retained zero-action-point borrowing/repayment, three total action points, zoning and the eight-turn result;
- added v2 local-save state and migration from the original M0 v1 save.

### Verification Performed

- JavaScript syntax, static page/script ID matching and Git whitespace checks;
- local HTTP load and full browser startup;
- exact tab order, top-bar `End Turn` and absence of a fixed bottom action bar;
- purchase, next-turn construction activation and approved operating income;
- Standard Apartment to Factory redevelopment for exactly `$5,400`, with no same/lower-cost option;
- securities buy and sell, 1% fee, action-point consumption and deterministic revaluation;
- bank borrowing and repayment without action-point consumption;
- brokered-sale lock, action-point consumption, next-turn settlement and sold-state transfer;
- Investment Advice classifications and exact approved New York State government-rumor source wording;
- turn-six Residential zoning rejection;
- save, intervening transaction and exact visible-state restoration;
- final-turn brokered-sale rejection and legal eight-turn result;
- visual review at a compact `1280×720` viewport with no document-level overflow.

### Remaining Prototype Risks

- This prototype deliberately uses the simplified M0 maturity-failure result; production bank takeover and emergency auction remain later Godot work.
- Auction stories and bidder behavior still require owner approval and are not represented as working content.
- The 18-plot/eight-turn deterministic tuning demonstrates decisions but does not validate the production 64-plot/20-turn balance.
- Final map interaction, final art, portraits, audio and production accessibility remain unstarted. The minimal Godot environment shell is now established by M0G.

### Next Gate

M0.1W was completed in commit `baef8ea`; the owner later approved and started M0G.

## M0.1D — Economic Loop and Interface Specification Sync

### Owner Decisions Incorporated

- player-facing title changed to `Metropolis: Roaring Times`;
- the left-side system container is named the Integrated Operations Panel and uses tabs in exact order: `Game Brief`, `Investment Advice`, `Bank`, `Auction House`, `Stock Market`;
- `Game Brief` is an independent page and reserves space for a future rubber-hose-style conversational board mascot;
- no fixed bottom action toolbar; `End Turn` moves to the top status bar;
- redevelopment uses `max(0, new_cost - 120% × old_original_cost)`, only for strictly higher original-cost targets and never pays a negative difference;
- ordinary brokered sale consumes one action point, locks 90% of current market value and settles next turn;
- the stock market contains bonds, shares and an investment trust, while futures and broker margin remain deferred;
- every securities buy/sell consumes one of the existing three action points; no separate financial-order resource is added;
- Investment Advice distinguishes verified historical reporting, fictional city news, New York State government rumors and ledger activity.

### Risk Control

The owner supplied the 120% redevelopment credit. Project management added the strictly-higher-cost target rule and zero-payout floor to prevent downgrade or repeat-conversion cash generation while preserving the approved formula. This safeguard was accepted for and implemented in M0.1W.

### Documentation Scope

The root authority, product brief, game rules, vertical-slice scope, art/UI direction, technical architecture, acceptance tests, implementation plan, development log, prototype README and reference-directory README were synchronized before code changes. The original PRD and map reference files remain unchanged.

### Next Gate

Completed in commit `0cd57f4`; the owner then approved M0.1W implementation.

## M0W — Standalone Web Graybox

### Decision

The owner postponed Godot M0 and requested an immediate plain Web gameplay prototype for investor explanation.

### Delivered Scope

- standalone dependency-free HTML/CSS/JavaScript page;
- visible `M0 WEB GRAYBOX — NOT FINAL ART OR BALANCE` status;
- 18 representative irregular plots and eight compressed turns;
- Tycoon, Landlady and Shark rival selection with equal displayed starting value;
- property inspection, purchase and four building choices;
- three action points, one-turn construction delay and operating settlement;
- explicit borrowing, repayment, locked prototype rate and maturity failure;
- four compressed economy phases;
- zoning warnings and a turn-six Residential construction restriction;
- deterministic rival purchase/build action;
- ledger, restart, local save/load and net-worth result;
- compact `1366×768` investor presentation layout.

### Verification Performed

- JavaScript syntax check;
- Markdown and Git whitespace checks;
- local HTTP load;
- all three rivals start with equal displayed net worth;
- purchase deducts cash and one action point once;
- construction deducts cost/action point and activates next turn;
- loan confirmation, deposit, credit reduction and repayment;
- rapid double-click purchase commits once;
- turn settlement and rival action;
- manual save, state change and exact visible restoration;
- full eight-turn result;
- zoning prevents new Factory construction on a Residential plot from turn six;
- `1366×768` visual inspection with map and command deck in the first viewport;
- browser console contains no warning/error after the tested paths.

### Known Prototype Limits

- This code is not reused by the production Godot project.
- Values and AI heuristics are demonstration tuning, not final balance.
- M0W has 18 plots/eight turns rather than the then-planned 64-plot/20-turn production target; the later owner-authored map contract removed the fixed plot count.
- Auction is intentionally absent because story/bidder content requires owner approval.
- Debt maturity uses a simplified bankruptcy result and does not implement production asset disposition.
- Map pan/zoom, final art, portraits, audio, production save schema and final accessibility work are not included.
- Save data is local to the current browser/site storage.

### Superseded Next Gate

The original M0W review led to the M0.1D decisions above. M0.1W and M0G were subsequently approved and implemented in sequence.
