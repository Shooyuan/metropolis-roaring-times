# M1W 热修测试报告：历史地标辉光与地块细边框

日期：2026-09-12

## 本阶段目标

1. 历史地标悬停和选中反馈改为建筑插画本体红色辉光。
2. 不再显示围绕整张图片或父组的红色矩形框。
3. 可购买地块边框厚度降低到上一版的 50%。
4. 把上述规则同步到项目文档和自动验收合同。
5. 2026-09-12 追加修正：地标不再对原始建筑图使用 CSS `drop-shadow`；程序先清理地标插画中的低透明残渣、浅色矩形底和淡边框，再为每座地标生成独立透明红光遮罩图，悬停和选中时只显示红光层。

## 已修改内容

- `m0_web/styles.css`
  - `.landmark-glow` 承载悬停、聚焦和选中辉光。
  - 删除旧的 `.landmark-entity.is-selected::after` 矩形框规则。
  - 原始 `.landmark-artwork` 不再被滤镜提亮、染色或投影。
  - 地块描边减半：`1.5px / 3.5px / 1px`。
- `tools/map_handoff_processor/build_landmark_glow_assets.py`
  - 清理每张历史地标插画的低透明底纹、浅色矩形底和淡边框。
  - 使用清理前的完整主体轮廓生成外圈透明红光遮罩，避免建筑内部被红光填满。
- `m0_web/assets/runtime_map_v001/glow/`
  - 新增 52 张网页运行时红光 PNG。
- `assets/runtime_map_v001/glow/`
  - 新增 52 张项目运行包红光 PNG。
- `m0_web/tests/m1w_static_test.js`
  - 新增地标辉光和矩形框禁止回归检查。
  - 新增地块细边框检查。
- `m0_web/tests/runtime_map_integration_test.js`
  - 新增运行地图层面的同类检查。
- 项目文档
  - 已同步项目总纲、产品简报、垂直切片范围、地图美术规范、技术架构、验收标准、地图交付管线、项目负责人审查计划和开发日志。

## 验收标准

- 鼠标悬停历史地标：显示独立透明红光遮罩，原始建筑图不整体发亮。
- 鼠标移出未选中地标：辉光消失。
- 点击历史地标：独立红光遮罩保持。
- 切换选择或点击空白：旧选中辉光清除。
- 不出现围绕整张图片、横幅或父组的红色矩形框。
- 桥梁类长条线稿和带浅色底噪的地标不再因为原图低透明底纹而形成整块矩形红雾。
- 可购买地块边框比上一版明显更细，不遮挡道路和地图细节。

## 风险

红光遮罩是运行时派生素材，必须随历史地标插画一起重新生成。如果项目负责人后续重导 Figma 地标包或替换任一地标插画，需要重新运行 `tools/map_handoff_processor/build_landmark_glow_assets.py`，否则红光遮罩会和新插画不匹配。

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
