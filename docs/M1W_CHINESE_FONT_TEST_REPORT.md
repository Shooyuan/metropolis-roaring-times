# M1W 中文字体指定测试报告

## 本阶段目标

将简体中文界面的字体规则改为项目负责人指定文件：

- 中文标题：`m0_web/assets/fonts/SourceHanSerifCN-Bold-2.otf`
- 中文正文：`m0_web/assets/fonts/SourceHanSerifCN-Medium-6.otf`

英文界面继续使用 `Inknut Antiqua M1W`，不改变当前游戏页面、启动页、地图、玩法和布局。

## 实现范围

- 更新 `m0_web/localization.css` 的中文 `@font-face`；
- 推进 `m0_web/index.html` 中 `localization.css` 的缓存版本号；
- 更新中文字体静态测试；
- 更新 UI 规格、地图美术方向、素材清单和开发日志。

## 风险记录

- 两份 Source Han Serif CN OTF 合计约 23MB，会增加网页下载体积；
- 本阶段不做字体子集化，避免偏离项目负责人“使用指定文件”的要求；
- 旧 `m0_web/fonts/*.woff2` 暂时保留，不纳入清理，防止误删历史兼容资料。

## 验收标准

- 指定的 Bold 与 Medium OTF 文件存在，并通过 OpenType 文件头检查；
- 中文标题变量使用 Bold，中文正文变量使用 Medium；
- 英文界面字体规则仍然独立存在；
- 现有 M1W 静态、双语、地图和运行时合同测试通过；
- Git 提交只包含本阶段相关文件。
