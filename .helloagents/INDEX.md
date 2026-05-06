# m-deeplx-vue 知识库

> 本文件是当前项目知识库的入口，供后续任务快速定位代码、模块和历史方案。

## 快速导航

| 需要了解 | 读取文件 |
|---------|---------|
| 项目概况、技术栈、开发约定 | [context.md](context.md) |
| 模块索引 | [modules/_index.md](modules/_index.md) |
| 某个模块的职责和接口 | [modules/{模块名}.md](modules/{模块名}.md) |
| 项目变更历史 | [CHANGELOG.md](CHANGELOG.md) |
| 历史方案索引 | [archive/_index.md](archive/_index.md) |
| 当前待执行的方案 | [plan/](plan/) |

## 模块关键词索引

> AI 读取此表即可判断哪些模块与当前需求相关，按需深读。

| 模块 | 关键词 | 摘要 |
|------|--------|------|
| `app-bootstrap` | Vue 启动, i18n, Element UI, 根挂载 | 负责应用初始化、国际化注册和根实例挂载 |
| `translation-workbench` | 文本翻译, OCR, 复制, 截图, 主界面 | 主翻译界面，承载文本翻译、截图翻译和结果操作 |
| `settings-editor` | 设置抽屉, API 配置, 模型设置, 语言切换 | 配置翻译引擎、API 密钥、OpenAI 模型和界面语言 |
| `state-store` | Vuex, 全局状态, mutation, 配置缓存 | 管理翻译参数、接口配置和截图翻译状态 |
| `router-shell` | Vue Router, 首页路由, 应用壳 | 当前仅维护单页路由入口和页面壳结构 |
| `utools-runtime` | preload, plugin.json, window.utools, 本地存储 | 提供 uTools 插件清单、预加载桥接能力和截图/OCR运行时 |

## 知识库状态

```yaml
kb_version: v2.4.0
最后更新: 2026-05-06 15:12
模块数量: 6
待执行方案: 0
```

## 读取指引

```yaml
启动任务:
  1. 读取本文件获取导航
  2. 读取 context.md 获取项目上下文
  3. 检查 plan/ 是否有进行中方案包

任务相关:
  - 涉及主界面翻译流程: 读取 modules/translation-workbench.md
  - 涉及配置和参数持久化: 读取 modules/settings-editor.md + modules/state-store.md
  - 涉及 uTools 插件集成或截图翻译: 读取 modules/utools-runtime.md
  - 涉及启动流程或多语言文案: 读取 modules/app-bootstrap.md
```
