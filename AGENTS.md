# Metropolis: Roaring Times 开发规则

以下规则不可违反，适用于本目录中的所有实现、文档与资源。

1. `00_PROJECT_CONTEXT.md` 是当前产品方向、范围与冲突裁决的统一权威；`docs/` 是经其约束的实施规格；`references/` 只提供设计依据。发生冲突时必须先停止实现并更新文档。
2. 当前垂直切片严格遵守 `00_PROJECT_CONTEXT.md`。`docs/01_PRODUCT_BRIEF.md` 至 `docs/07_IMPLEMENTATION_PLAN.md`、`docs/MAP_ASSET_PIPELINE.md`、`docs/IN_GAME_UI_LAYOUT_SPEC.md` 和 `docs/OWNER_PROJECT_REVIEW.md` 是已经与总纲贯通的实施规格与老板审查入口；`docs/DOCUMENT_LANGUAGE_MIGRATION.md` 管理历史英文文档的受控中文化。任何后续范围变更都必须同时更新总纲、规则、范围、架构、验收、计划和受影响的专项规范，不得只改其中一份；翻译不得被当作改变规则的机会。
3. 所有规则必须在实施规格中可解释，在代码中只有一个权威实现；不得将关键数值散落在场景、UI 或脚本中。
4. 完成标准以已批准且与 `00_PROJECT_CONTEXT.md` 一致的验收文档为准。功能必须可重复验证，不能以“看起来可用”代替验收。
5. Godot 项目必须可从 `project.godot` 打开并运行；不得依赖未提交的本机绝对路径、私有插件或手工编辑缓存文件。
6. 资源、场景、脚本、内容 ID 和必须稳定匹配的技术字段使用英文 `snake_case`；面向玩家的界面、新闻、事件、角色对话和系统文案默认使用英文；面向老板审查和团队实施的项目文档必须以中文为主，仅保留产品名、软件名、文件名、代码标识、固定图层名和需要核对的玩家英文原文。不得再把“玩家使用英文”扩大解释为“开发文档使用英文”。
7. 不直接修改或覆盖 `references/` 中的原始材料。需要派生内容时复制到 `docs/`，并注明来源与已作出的取舍。
8. 每次改变玩法范围、规则或验收口径时，必须同步更新相关文档后再实现。
9. 不提交生成缓存、导入缓存、临时文件、密钥或个人配置。
10. 保持提交可运行；高风险改动应小步完成，并验证启动、核心回合流程和存档边界（若在范围内）。
11. 每个阶段必须先完成实现、运行测试并修复错误，再保存全部相关文件并创建一次 Git commit；测试失败或提交失败时不得宣布阶段完成。
12. 进入下一阶段前必须向老板报告计划、行动、风险、测试和需要决策的事项，并获得明确批准。
13. 重连后先读取本文件、`00_PROJECT_CONTEXT.md`、Git 状态和最近提交，从未完成任务续作；不得重新搭建或覆盖已有文件。
14. 地图底图、分区几何、可购买地块几何与历史地标位置均由老板在 Figma 中创作和批准。Codex 只能检查、转换、优化和接入老板提交的 `.fig`、结构 JSON、各层 SVG、对齐 SVG 与可选预览；未收到完整交付包时不得自行绘制、猜测、近似或修正这些地理内容。
15. 老板提交的 `03_DISTRICT_GEOMETRY`、`07_HISTORICAL_LANDMARKS` 与 `08_PURCHASABLE_BLOCK_GEOMETRY` 是各自几何和位置的权威。Codex 派生运行时数据时不得擅自平滑、删点、改变顶点、移动地标或补画地块；任何派生变化必须提交前后对比并获得老板批准。可购买地块数量不预设，只以老板实际绘制并批准的闭合地块为准。

[CODEX] **Codex–DeepSeek 协作规则**

[CODEX] 16. DeepSeek/Trae 必须在独立 Git worktree 和 `deepseek/DS-xxx` 分支工作，不得直接编辑 Codex 主工作区或 `main`。

[CODEX] 17. DeepSeek 在任何任务开始前必须完整读取根目录 `DEEPSEEK_OFFICE.md` 与 `docs/COLLABORATION_PROTOCOL.md`，并严格遵守活动任务单的允许路径。

[CODEX] 18. DeepSeek 默认只可修改任务单授权的 `scripts/domain/`、`tests/domain/` 与相邻 `*.gd.uid`；其他文件只读，除非老板先批准协议变更。

[CODEX] 19. 跨 Agent 协作说明实行逐条作者标记：Codex 新写的每个非空说明行以 `[CODEX]` 开头，DeepSeek 新写的每个非空说明行以 `[DEEPSEEK]` 开头；无标记说明没有实施权威。

[CODEX] 20. DeepSeek 不得自行改变规格、数值、接口、场景、项目设置或验收标准；需要越界时先停止并提交带 `[DEEPSEEK]` 标记的问题。

[CODEX] 21. DeepSeek 分支交付只有在 Codex 完整审查、复测并集成后才进入项目事实；主分支阶段提交仍由 Codex 负责。

22. 首版权威分区集合固定为老板批准的 12 个曼哈顿分区：`district_inwood`、`district_washington_heights`、`district_harlem`、`district_upper_east`、`district_upper_west`、`district_midtown_west`、`district_midtown_east`、`district_chelsea`、`district_west_village`、`district_east_village`、`district_soho`、`district_financial_district`。旧六分区/五玩法区模型和 `district_brooklyn_bridgehead` 不得重新引入；各区经济画像仍须老板另行批准。

23. 地图实体术语固定为：上述 12 个区域叫“街区（district）”；老板在 `08_PURCHASABLE_BLOCK_GEOMETRY` 中绘制的青绿色闭合形状叫“地块（plot）”；`07_HISTORICAL_LANDMARKS` 中的历史建筑、桥梁、教堂、车站、纪念物、广场、公园和公共设施叫“历史地标（landmark）”。三类实体的选择严格互斥，不得混称。

24. 最终游戏内界面严格遵守 `docs/IN_GAME_UI_LAYOUT_SPEC.md` 的五模块、左侧四页签、永久小地图、右下回合控制、Config 内容与垂直切片日历。旧 M1W 五页签网页是历史原型，不得再作为最终界面权威。

25. 新版界面必须按 `U1` 全屏概念、`U2` 模块/弹窗样式板、`U3` 组件实现规格依次审批、测试和提交；老板批准 U3 并另行授权前，不得修改现有网页或开始 M2 实现。
