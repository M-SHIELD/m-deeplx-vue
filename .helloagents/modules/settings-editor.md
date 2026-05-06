# settings-editor

## 职责

- 提供设置抽屉表单，用于配置翻译引擎、接口地址、Token、OpenAI 模型和界面语言。
- 根据所选引擎动态展示不同表单项，并把设置写入本地存储和 Vuex。
- 提供文档链接跳转能力，帮助用户打开外部 API 文档页面。
- 保存截图翻译相关设置，包括 Google 图片 API Key 和图片翻译目标语言。

## 接口定义

### 公共API
| 函数/方法 | 参数 | 返回值 | 说明 |
|----------|------|--------|------|
| `saveSettings()` | 无 | `void` | 校验表单后写入本地配置并同步 Vuex |
| `changeLanguage(value)` | `value: string` | `void` | 切换当前 i18n locale |
| `openBrowserLink(url)` | `url: string` | `void` | 通过 preload 打开外部文档链接 |

### 数据结构
| 字段 | 类型 | 说明 |
|------|------|------|
| `settings.api_type` | `string` | 当前翻译引擎类型 |
| `settings.api_address` | `string` | DeepLX 或自定义 OpenAI 端点 |
| `settings.api_token` | `string` | DeepSeek 等引擎令牌 |
| `settings.api_key` | `string` | Google Translate API Key |
| `settings.google_image_api_key` | `string` | Google Vision / 图片翻译 API Key |
| `settings.openai_model_type` | `string` | OpenAI 模型类型或 `custom` |
| `settings.openai_custom_model` | `string` | 自定义模型名 |
| `language` | `string` | 当前界面语言 |

## 行为规范

### 动态表单切换
**条件**: 用户切换 `api_type`。  
**行为**: 根据引擎类型展示对应的地址、Token、API Key 或模型配置区域。  
**结果**: 用户仅看到当前引擎需要填写的关键参数。

### 设置保存
**条件**: 用户点击保存按钮，且表单校验通过。  
**行为**: 把当前设置写入 `window.saveConfig()`，再提交对应 Vuex mutation，并通过事件总线关闭抽屉。  
**结果**: 主界面后续翻译请求立即使用最新配置。

### 语言切换
**条件**: 用户在设置中切换显示语言。  
**行为**: 更新本地配置、Vuex `language`，并直接设置 `this.$i18n.locale`。  
**结果**: 界面文案即时切换。

## 依赖关系

```yaml
依赖:
  - state-store
  - utools-runtime
被依赖:
  - translation-workbench
```
