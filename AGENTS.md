# Metropolis: Roaring Times 开发规则

以下规则不可违反，适用于本目录中的所有实现、文档与资源。

1. `00_PROJECT_CONTEXT.md` 是当前产品方向、范围与冲突裁决的统一权威；`docs/` 是经其约束的实施规格；`references/` 只提供设计依据。发生冲突时必须先停止实现并更新文档。
2. 当前垂直切片严格遵守 `00_PROJECT_CONTEXT.md`。`docs/01_PRODUCT_BRIEF.md` 至 `docs/07_IMPLEMENTATION_PLAN.md`、`docs/MAP_ASSET_PIPELINE.md`、`docs/IN_GAME_UI_LAYOUT_SPEC.md` 和 `docs/OWNER_PROJECT_REVIEW.md` 是已经与总纲贯通的实施规格与项目负责人审查入口；`docs/DOCUMENT_LANGUAGE_MIGRATION.md` 管理历史英文文档的受控中文化。任何后续范围变更都必须同时更新总纲、规则、范围、架构、验收、计划和受影响的专项规范，不得只改其中一份；翻译不得被当作改变规则的机会。
3. 所有规则必须在实施规格中可解释，在代码中只有一个权威实现；不得将关键数值散落在场景、UI 或脚本中。
4. 完成标准以已批准且与 `00_PROJECT_CONTEXT.md` 一致的验收文档为准。功能必须可重复验证，不能以“看起来可用”代替验收。
5. Godot 项目必须可从 `project.godot` 打开并运行；不得依赖未提交的本机绝对路径、私有插件或手工编辑缓存文件。
6. 资源、场景、脚本、内容 ID 和必须稳定匹配的技术字段使用英文 `snake_case`；面向玩家的界面、新闻、事件、角色对话和系统文案默认使用英文；面向项目负责人审查和团队实施的项目文档必须以中文为主，仅保留产品名、软件名、文件名、代码标识、固定图层名和需要核对的玩家英文原文。不得再把“玩家使用英文”扩大解释为“开发文档使用英文”。
7. 不直接修改或覆盖 `references/` 中的原始材料。需要派生内容时复制到 `docs/`，并注明来源与已作出的取舍。
8. 每次改变玩法范围、规则或验收口径时，必须同步更新相关文档后再实现。
9. 不提交生成缓存、导入缓存、临时文件、密钥或个人配置。
10. 保持提交可运行；高风险改动应小步完成，并验证启动、核心回合流程和存档边界（若在范围内）。
11. 每个阶段必须先完成实现、运行测试并修复错误，再保存全部相关文件并创建一次 Git commit；测试失败或提交失败时不得宣布阶段完成。
12. 进入下一阶段前必须向项目负责人报告计划、行动、风险、测试和需要决策的事项，并获得明确批准。
13. 重连后先读取本文件、`00_PROJECT_CONTEXT.md`、Git 状态和最近提交，从未完成任务续作；不得重新搭建或覆盖已有文件。
14. 地图底图、分区几何、可购买地块几何与历史地标位置均由项目负责人在 Figma 中创作和批准。Codex 只能检查、转换、优化和接入项目负责人提交的 `.fig`、结构 JSON、各层 SVG、对齐 SVG 与可选预览；未收到完整交付包时不得自行绘制、猜测、近似或修正这些地理内容。
15. 项目负责人提交的 `03_DISTRICT_GEOMETRY`、`07_HISTORICAL_LANDMARKS` 与 `08_PURCHASABLE_BLOCK_GEOMETRY` 是各自几何和位置的权威。Codex 派生运行时数据时不得擅自平滑、删点、改变顶点、移动地标或补画地块；任何派生变化必须提交前后对比并获得项目负责人批准。可购买地块数量不预设，只以项目负责人实际绘制并批准的闭合地块为准。

[TRAE] **Trae 实施代理规则（2026-09-17 项目负责人批准，取代旧 Codex–DeepSeek 协作规则）**

[TRAE] 16. Trae 直接在主工作区 `/Users/shuubun/roaring times/roaring-age` 的 `main` 分支工作，可编辑全部项目文件；不再要求独立 worktree 或 `deepseek/DS-xxx` 分支。

[TRAE] 17. Trae 在任何任务开始前必须完整读取 `AGENTS.md`、`00_PROJECT_CONTEXT.md`、`docs/COLLABORATION_PROTOCOL_REVISION_2026-09-17.md`、`DEEPSEEK_OFFICE.md` 与 Git 状态。

[TRAE] 18. 项目负责人在 Figma 创作的街区、地块、历史地标几何与位置是唯一权威；Trae 只可校验、转换、优化与接入，不得自行绘制、猜测、平滑、删点、移动或补画。

[TRAE] 19. 协作说明实行逐条作者标记：Trae 新写的非空行以 `[TRAE]` 开头；既有 `[CODEX]`、`[DEEPSEEK]` 标记按原文保留；无标记说明没有实施权威。

[TRAE] 20. Trae 不得自行改变玩法范围、规则、数值、接口、场景、项目设置或验收标准；需要变更时先同步更新总纲与受影响规格，经项目负责人批准后再实现。

[TRAE] 21. Trae 可执行阶段提交并合入 `main`，但须先完成测试、修复并保存；阶段完成仍需向项目负责人报告证据与风险并获批后再进入下一阶段。

22. 首版权威分区集合固定为项目负责人批准的 12 个曼哈顿分区：`district_inwood`、`district_washington_heights`、`district_harlem`、`district_upper_east`、`district_upper_west`、`district_midtown_west`、`district_midtown_east`、`district_chelsea`、`district_west_village`、`district_east_village`、`district_soho`、`district_financial_district`。旧六分区/五玩法区模型和 `district_brooklyn_bridgehead` 不得重新引入；各区经济画像仍须项目负责人另行批准。

23. 地图实体术语固定为：上述 12 个区域叫“街区（district）”；项目负责人在 `08_PURCHASABLE_BLOCK_GEOMETRY` 中绘制的青绿色闭合形状叫“地块（plot）”；`07_HISTORICAL_LANDMARKS` 中的历史建筑、桥梁、教堂、车站、纪念物、广场、公园和公共设施叫“历史地标（landmark）”。三类实体的选择严格互斥，不得混称。

24. 最终游戏内界面严格遵守 `docs/IN_GAME_UI_LAYOUT_SPEC.md` 的五模块、左侧四页签、永久小地图、右下回合控制、Config 内容与垂直切片日历。旧 M1W 五页签网页是历史原型，不得再作为最终界面权威。

25. 新版界面必须按 `U1` 全屏概念、`U2` 模块/弹窗样式板、`U3` 组件实现规格依次审批、测试和提交；项目负责人批准 U3 并另行授权前，不得修改现有网页或开始 M2 实现。

26. `08_PURCHASABLE_BLOCK_GEOMETRY` 中的 `cheap`、`medium`、`expensive` 是项目负责人指定的地块初始价格层级。Codex 按地理顺序自动生成稳定地块 ID，并在批准区间内以固定种子生成可复现的精确基础地价；不得把 Figma 子层数字当运行时 ID，也不得在每局开始时重新随机价格。
