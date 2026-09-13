# M1W 热修测试报告：隐藏历史地标地图横幅

日期：2026-09-13

## 老板决定

- 历史地标贴图位置正确，地块可读性和通用建筑贴图落点正确；
- 历史地标横幅不再继续调整，直接从地图上去掉；
- 浏览器版优先，暂不进入 Godot。

## 实现结果

- `m0_web/app.js` 不再创建 `landmark-label` 图片层；
- 删除 `1250%` 历史地标横幅显示门禁，地图缩放仍保持 `100%—1500%` 十五档；
- `m0_web/styles.css` 删除 `.landmark-label` 运行时样式；
- 历史地标插画、红光 hover/选中、点击命中和右侧 Historical File 名称正文保持可用；
- 横幅 SVG 仍作为 v004 运行素材和来源审计材料留在素材包中，但不参与网页地图渲染；
- 页面提示、双语文案、验收清单和防回归测试同步更新。

## 自动测试

已通过：

```text
node --check m0_web/app.js
node m0_web/tests/m1w_static_test.js
node m0_web/tests/m1w_i18n_static_test.js
node m0_web/tests/map_content_contract_test.js
node m0_web/tests/runtime_map_integration_test.js
git diff --check
```

关键防回归：

- 运行时代码不得恢复 `MAP_LANDMARK_LABEL_ZOOM_STEP` 或 `isLandmarkLabelZoom`；
- 运行时代码不得把 `landmark.label` 渲染进地图 DOM；
- CSS 不得恢复 `.landmark-label`；
- 页面提示不得再承诺 `1250%` 显示历史地标标签。
