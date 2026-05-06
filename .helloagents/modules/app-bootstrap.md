# app-bootstrap

## 职责

- 在 `src/main.js` 中注册 `Element UI` 和 `VueI18n`。
- 从 preload 提供的 `window.getConfig()` 读取界面语言和图片翻译目标语言，并写入 Vuex。
- 创建根级 `i18n` 实例、注入 `store` 与 `router`，最后挂载 `App.vue`。
- 提供项目级国际化消息表，当前中英文文案直接内联在入口文件中。

## 接口定义

### 公共API
| 函数/方法 | 参数 | 返回值 | 说明 |
|----------|------|--------|------|
| `window.getConfig(key)` | `key: string` | `any` | 从 preload 读取本地持久化配置 |
| `store.commit('setlanguage', language)` | `language: string` | `void` | 初始化界面语言 |
| `store.commit('setImageTargetLang', lang)` | `lang: string` | `void` | 初始化截图翻译目标语言 |
| `new Vue({...}).$mount('#app')` | 应用配置对象 | `Vue` 实例 | 创建并挂载根实例 |

### 数据结构
| 字段 | 类型 | 说明 |
|------|------|------|
| `messages.en` | `object` | 英文界面文案集合 |
| `messages.zh` | `object` | 中文界面文案集合 |
| `locale` | `string` | 当前界面语言，来自 `store.state.language` |

## 行为规范

### 应用启动
**条件**: `window.getConfig` 可用，`store` 与 `router` 已导入。  
**行为**: 读取本地配置，提交到 Vuex，创建 `VueI18n` 实例并挂载应用。  
**结果**: 首页按用户上次保存的语言与截图翻译配置启动。

### 文案注册
**条件**: 应用初始化阶段。  
**行为**: 在 `main.js` 内联注册中英文消息对象。  
**结果**: `HomeView.vue` 与 `SettingEditor.vue` 可直接通过 `$t()` 渲染文案。

## 依赖关系

```yaml
依赖:
  - state-store
  - router-shell
  - utools-runtime
被依赖:
  - translation-workbench
  - settings-editor
```
