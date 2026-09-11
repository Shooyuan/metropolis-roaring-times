# M1W 热修测试报告：历史地标辉光与地块细边框

日期：2026-09-12

## 本阶段目标

1. 历史地标悬停和选中反馈改为建筑插画本体红色辉光。
2. 不再显示围绕整张图片或父组的红色矩形框。
3. 可购买地块边框厚度降低到上一版的 50%。
4. 把上述规则同步到项目文档和自动验收合同。

## 已修改内容

- `m0_web/styles.css`
  - `.landmark-artwork` 承载悬停、聚焦和选中辉光。
  - 删除旧的 `.landmark-entity.is-selected::after` 矩形框规则。
  - 地块描边减半：`1.5px / 3.5px / 1px`。
- `m0_web/tests/m1w_static_test.js`
  - 新增地标辉光和矩形框禁止回归检查。
  - 新增地块细边框检查。
- `m0_web/tests/runtime_map_integration_test.js`
  - 新增运行地图层面的同类检查。
- 项目文档
  - 已同步项目总纲、产品简报、垂直切片范围、地图美术规范、技术架构、验收标准、地图交付管线、老板审查计划和开发日志。

## 验收标准

- 鼠标悬停历史地标：只看到建筑插画本体红色辉光。
- 鼠标移出未选中地标：辉光消失。
- 点击历史地标：建筑插画本体红色辉光保持。
- 切换选择或点击空白：旧选中辉光清除。
- 不出现围绕整张图片、横幅或父组的红色矩形框。
- 可购买地块边框比上一版明显更细，不遮挡道路和地图细节。

## 风险

辉光效果依赖透明插画素材。如果后续某个历史地标图片带有不透明底色，浏览器只能按图片矩形计算滤镜，仍可能露出矩形感。此类问题应回到素材源文件重导透明图，而不是用程序猜建筑轮廓。

## 自动测试

已通过：

```text
node --check m0_web/app.js
node --check m0_web/locales/en-US.js
node --check m0_web/locales/zh-CN.js
node m0_web/tests/m1w_static_test.js
node m0_web/tests/m1w_i18n_static_test.js
node m0_web/tests/map_content_contract_test.js
node m0_web/tests/runtime_map_integration_test.js
git diff --check
```

关键输出：

```text
M1W_STATIC_TEST_PASS districts=12 map_sha=6c511527a6c2 brand_sha=4255ada51de6
M1W_I18N_STATIC_TEST_PASS locales=2 dynamic_keys=253 fonts=2
MAP_CONTENT_CONTRACT_TEST_PASS layers=8 zoom_steps=15 locales=2
RUNTIME_MAP_INTEGRATION_TEST_PASS plots=30 landmarks=52 zoom=1500 detail_from=500 labels_from=1250 selection=exclusive
```
