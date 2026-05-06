# 变更日志

## [Unreleased]

- **[utools-runtime]**: 新增 uTools / ZTools 双平台运行时桥接，统一插件进入事件、存储、截图、复制、输入与通知调用 — by yinjianm
  - 方案: [202605061539_ztools-compat](plan/202605061539_ztools-compat/)
- **[translation-workbench]**: 主界面改为通过统一桥接读取插件进入事件与截图翻译缓存，移除视图层对 `window.utools` 的直接依赖 — by yinjianm
  - 方案: [202605061539_ztools-compat](plan/202605061539_ztools-compat/)
- **[plugin-manifest]**: `plugin.json` 补齐 ZTools schema 与元信息字段，保留原有开发入口与功能声明 — by yinjianm
  - 方案: [202605061539_ztools-compat](plan/202605061539_ztools-compat/)

## [0.1.0] - 2026-05-06

### 新增
- **[project-baseline]**: 建立当前项目基线快照，覆盖多引擎文本翻译、截图 OCR 翻译、设置管理和 uTools 运行时集成
  - 方案: 无（`~init` 初始化知识库）
