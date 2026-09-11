# M1W 中文兼容入口

M1W 已合并为一套双语网页实现。本目录只保留旧链接的兼容入口，访问后会跳转到 `../?lang=zh-CN`。

- 唯一正式入口：`m0_web/index.html`
- 语言切换：网页右上角 `Settings / 设置` 中选择 English 或简体中文
- 默认语言：首次打开为英文；之后记住用户选择
- 中文兼容入口：`m0_web/zh-CN/index.html`
- 共用素材：`m0_web/assets/` 中已批准的 Brand、地图底图和分区几何
- 中文标题字体：`m0_web/assets/fonts/SourceHanSerifCN-Bold-2.otf`
- 中文正文与交互字体：`m0_web/assets/fonts/SourceHanSerifCN-Medium-6.otf`
- 存档：中英文共用同一份对局状态；切换语言不会重置回合、地图或弹窗状态

旧英文和旧中文存档只作为迁移来源保留，新版本加载后会复制为统一存档，不自动删除或覆盖旧键。旧中文 `woff2` 字体子集保留在 `m0_web/fonts/` 作为兼容资料，当前中文界面字体以 `m0_web/assets/fonts/` 中老板指定的 OTF 文件为准。
