# M1W 玩家文案正式化测试报告

## 阶段目标

1. 将 52 个历史地标的短介绍统一为“建筑名，单句描述”；
2. 将用户认可的中文长介绍录入网页，并提供对应英文正文与逐项英文 Wikipedia 链接；
3. 把 `COPY_DECK.md` 中用户修改的中文贯通到英文、HTML、双语词典和项目状态文档；
4. 禁止玩家界面出现内部制作、审批或工程身份措辞。

## 实现结果

- `docs/LANDMARK_COPY_DRAFT.md`：52 个中文短介绍与长介绍的权威审稿文件；
- `m0_web/landmark-content.js`：52 个地标的 EN/ZH 名称、短介绍、长介绍、来源标题与 URL；
- `scripts/sync_landmark_copy_from_draft.js`：中文草案到运行时的可重复同步与数量校验；
- `m0_web/app.js`：右侧历史档案根据当前语言显示正式内容与逐项来源；
- `docs/COPY_DECK.md`：记录当前玩家文案的界面位置、中英文内容及编辑入口；
- `m0_web/index.html` 与双语词典：首页、对手选择、拍卖、地图、街区说明、设置和结果文案均改为玩家视角。

## 自动验证

- `node m0_web/tests/m1w_i18n_static_test.js`：通过，2 个语言包、254 个动态 key；
- `node m0_web/tests/m1w_static_test.js`：通过，原有首页、地图、字体和交互合同未回退；
- `node m0_web/tests/map_content_contract_test.js`：通过，8 个地图层、15 个缩放级别、2 个语言包；
- `node m0_web/tests/runtime_map_integration_test.js`：通过，30 个地块、52 个地标与 52 组双语正文一一对应；
- `node scripts/sync_landmark_copy_from_draft.js`：通过，识别并校验 52 条草案；
- `git diff --check`：通过，无空白错误。

运行地图测试还会拒绝 `owner-authored`、`owner-approved`、`owner approval`、`producer demo`、`项目负责人绘制`、`制作人地图演示` 等措辞重新进入玩家 HTML、语言包或历史正文。

## 浏览器验收

- 从启动页新建游戏、选择 Tycoon 并进入 1v1 对局：通过；
- 将地图放大至 500% 并选中布鲁克林大桥：英文名称、单句短介绍、展开长介绍与逐项 Wikipedia 来源均正确显示；
- 在游戏设置中切换至简体中文：同一地标即时显示“布鲁克林大桥，老牌的跨河明星。”及已审定中文长介绍；
- 语言切换、右侧历史档案与已有新游戏初始化状态没有回退。

## 未关闭风险

1. 15 个地标的“待核对”只表示内部史料身份/年代风险；正文已可在 M1W 中显示，但正式公开发布前仍应核实。
2. Wikipedia 来源当前通过新标签页打开；长期规格中的游戏内来源弹窗尚未实现。
3. 本阶段没有修改数值平衡、繁荣度、交通效果、地图几何或 Godot 项目。
