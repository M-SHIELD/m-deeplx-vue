# 模块索引

> 通过此文件快速定位模块文档

## 模块清单

| 模块 | 职责 | 状态 | 文档 |
|------|------|------|------|
| `app-bootstrap` | 初始化 Vue 应用、Element UI、I18n 和根实例挂载 | ✅ | [app-bootstrap.md](./app-bootstrap.md) |
| `translation-workbench` | 承载文本翻译、截图翻译、复制输出和主工作台交互 | 🚧 | [translation-workbench.md](./translation-workbench.md) |
| `settings-editor` | 管理翻译引擎、API 参数、模型设置和语言切换 | 🚧 | [settings-editor.md](./settings-editor.md) |
| `state-store` | 保存全局翻译状态与配置字段，并提供 mutation 更新入口 | ✅ | [state-store.md](./state-store.md) |
| `router-shell` | 维护应用路由和单页壳结构 | ✅ | [router-shell.md](./router-shell.md) |
| `utools-runtime` | 提供插件清单、preload 桥接、截图 OCR 与本地存储能力 | 🚧 | [utools-runtime.md](./utools-runtime.md) |

## 模块依赖关系

```text
app-bootstrap → router-shell → translation-workbench
app-bootstrap → state-store
app-bootstrap → utools-runtime
translation-workbench → settings-editor
translation-workbench → state-store
translation-workbench → utools-runtime
settings-editor → state-store
settings-editor → utools-runtime
```

## 状态说明
- ✅ 稳定
- 🚧 开发中
- 📝 规划中
