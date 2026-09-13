# M1W 热修测试报告：地标横幅、hover 白底与地图交互性能

日期：2026-09-13

## 老板反馈

- 地块可读性正确；
- 通用建筑贴图落点正确；
- 历史地标贴图已经接入，位置正确；
- 历史地标横幅太小，看不清；
- 鼠标悬停历史地标时仍会显示按钮边框和白色底图，玩家观感很差；
- 拖动地图、点击地标和点击地块时明显卡顿；
- 暂不进入 Godot，先修浏览器版。

## 诊断

1. 历史地标 DOM 使用 `button.landmark-entity` 承载点击与键盘访问。全局 `button:hover:not(:disabled)` 样式会给所有按钮加浅色背景、outline、阴影和按压位移；该规则 specificity 高于旧 `.landmark-entity` 基础样式，导致地标 hover 时出现白色底图和边框感。
2. 历史地标横幅只做了轻微缩放，`1250%—1500%` 下仍不够清楚。
3. 地图拖动期间，每次 `pointermove` 都立即调用 `applyMapView()`，同时进行 pan 边界布局读取和 transform 写入；在 52 个绝对定位地标、SVG 街区/地块和 hover 过渡共同存在时容易产生卡顿。

## 实现结果

- 地标按钮新增 `button.landmark-entity:hover:not(:disabled)` 等高 specificity 覆盖，强制保持透明背景、无 outline、无 box-shadow、无 transform、无系统外观；
- 历史地标横幅从 `scale(1.12, 1.04)` 放大到 `scale(2.2, 1.9)`，并增加浅色文字阴影以提高可读性；
- 地图拖动改为 `requestAnimationFrame` 节流：`pointermove` 只更新 pan 值并排队下一帧刷新；
- 拖动开始时缓存舞台尺寸和 pan 边界，拖动过程中不再每次读取 `offsetWidth/clientWidth` 做布局计算；
- 拖动时临时关闭地标红光、街区/地块描边和相关 transition，减少重绘压力；
- 推进 `index.html` 中 `styles.css` 与 `app.js` cachebuster 到 `m1w-perf1`。

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

- 地图拖动必须通过 `requestAnimationFrame` 节流；
- 地图拖动必须缓存 pan 边界；
- 地标按钮必须覆盖全局按钮 hover 背景和 outline；
- 地标横幅必须放大；
- 地标仍使用独立红光遮罩，不恢复旧矩形框或对原图加滤镜。

## 浏览器复查

本地验证地址：`http://127.0.0.1:4174/`

复查结果：

- 页面加载 `app.js?v=m1w-perf1` 与 `styles.css?v=m1w-perf1`；
- 运行时地标数量为 52；
- 地标按钮计算样式为透明背景、无 outline、无 box-shadow、无 transform；
- 地标横幅 transform 为 `matrix(2.2, 0, 0, 1.9, ...)`；
- 浏览器控制台无 warning/error。

## 仍需老板确认

- 放大后的历史地标横幅是否足够可读；
- 新 hover 状态是否彻底消除白底/边框观感；
- 地图拖动和点击地标/地块的体感是否已经流畅。
