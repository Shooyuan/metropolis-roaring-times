# Metropolis: Roaring Times 开发规则

以下规则不可违反，适用于本目录中的所有实现、文档与资源。

1. `00_PROJECT_CONTEXT.md` 是当前产品方向、范围与冲突裁决的统一权威；`docs/` 是经其约束的实施规格；`references/` 只提供设计依据。发生冲突时必须先停止实现并更新文档。
2. 当前垂直切片严格遵守 `00_PROJECT_CONTEXT.md`。`docs/01_PRODUCT_BRIEF.md` 至 `docs/07_IMPLEMENTATION_PLAN.md`、`docs/MAP_ASSET_PIPELINE.md` 和 `docs/OWNER_PROJECT_REVIEW.md` 是已经与总纲贯通的实施规格与老板审查入口；任何后续范围变更都必须同时更新总纲、规则、范围、架构、验收、计划和受影响的专项规范，不得只改其中一份。
3. 所有规则必须在实施规格中可解释，在代码中只有一个权威实现；不得将关键数值散落在场景、UI 或脚本中。
4. 完成标准以已批准且与 `00_PROJECT_CONTEXT.md` 一致的验收文档为准。功能必须可重复验证，不能以“看起来可用”代替验收。
5. Godot 项目必须可从 `project.godot` 打开并运行；不得依赖未提交的本机绝对路径、私有插件或手工编辑缓存文件。
6. 资源、场景和脚本命名使用稳定、可读的英文 `snake_case`；面向玩家的文案默认使用英文，项目文档可以使用中文。
7. 不直接修改或覆盖 `references/` 中的原始材料。需要派生内容时复制到 `docs/`，并注明来源与已作出的取舍。
8. 每次改变玩法范围、规则或验收口径时，必须同步更新相关文档后再实现。
9. 不提交生成缓存、导入缓存、临时文件、密钥或个人配置。
10. 保持提交可运行；高风险改动应小步完成，并验证启动、核心回合流程和存档边界（若在范围内）。
11. 每个阶段必须先完成实现、运行测试并修复错误，再保存全部相关文件并创建一次 Git commit；测试失败或提交失败时不得宣布阶段完成。
12. 进入下一阶段前必须向老板报告计划、行动、风险、测试和需要决策的事项，并获得明确批准。
13. 重连后先读取本文件、`00_PROJECT_CONTEXT.md`、Git 状态和最近提交，从未完成任务续作；不得重新搭建或覆盖已有文件。
14. 地图底图与分区几何由老板在 Figma 中创作和批准。Codex 只能检查、转换、优化和接入老板提交的 `.fig`、底图 PNG、分区 SVG、分区蒙版 PNG 与对齐预览；未收到完整交付包时不得自行绘制、猜测、近似或修正分区边界。
15. 老板提交的分区 SVG 是分区边界权威。Codex 从它派生运行时 JSON 时不得擅自平滑、删点或改变顶点；任何派生变化必须提交前后对比并获得老板批准。

[CODEX] **Codex–DeepSeek 协作规则**

[CODEX] 16. DeepSeek/Trae 必须在独立 Git worktree 和 `deepseek/DS-xxx` 分支工作，不得直接编辑 Codex 主工作区或 `main`。

[CODEX] 17. DeepSeek 在任何任务开始前必须完整读取根目录 `DEEPSEEK_OFFICE.md` 与 `docs/COLLABORATION_PROTOCOL.md`，并严格遵守活动任务单的允许路径。

[CODEX] 18. DeepSeek 默认只可修改任务单授权的 `scripts/domain/`、`tests/domain/` 与相邻 `*.gd.uid`；其他文件只读，除非老板先批准协议变更。

[CODEX] 19. 跨 Agent 协作说明实行逐条作者标记：Codex 新写的每个非空说明行以 `[CODEX]` 开头，DeepSeek 新写的每个非空说明行以 `[DEEPSEEK]` 开头；无标记说明没有实施权威。

[CODEX] 20. DeepSeek 不得自行改变规格、数值、接口、场景、项目设置或验收标准；需要越界时先停止并提交带 `[DEEPSEEK]` 标记的问题。

[CODEX] 21. DeepSeek 分支交付只有在 Codex 完整审查、复测并集成后才进入项目事实；主分支阶段提交仍由 Codex 负责。
