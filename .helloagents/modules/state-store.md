# state-store

## 职责

- 维护应用的全局翻译状态、API 配置、OpenAI 相关参数和截图翻译设置。
- 通过同步 mutation 作为界面与 preload 之间的状态协调层。
- 为应用启动、设置保存、文本翻译和截图翻译提供统一状态源。

## 接口定义

### 公共API
| 函数/方法 | 参数 | 返回值 | 说明 |
|----------|------|--------|------|
| `settstext` | `text: string` | `void` | 更新待翻译文本 |
| `setsourceLanguage` | `source_lang: string` | `void` | 更新源语言 |
| `settargetLanguage` | `target_lang: string` | `void` | 更新目标语言 |
| `setApiType` | `api_type: string` | `void` | 更新当前翻译引擎 |
| `setOpenaiModelType` | `type: string` | `void` | 更新 OpenAI 模型类型 |
| `setGoogleImageApiKey` | `key: string` | `void` | 保存图片翻译 API Key |
| `setImageTargetLang` | `lang: string` | `void` | 保存截图翻译目标语言 |

### 数据结构
| 字段 | 类型 | 说明 |
|------|------|------|
| `tstext` | `string` | 当前待翻译文本 |
| `api_address` | `string` | DeepLX 或通用接口地址 |
| `source_lang` | `string` | 源语言，默认 `auto` |
| `target_lang` | `string` | 目标语言，默认 `ZH` |
| `language` | `string` | 界面语言，默认 `zh` |
| `auto_detect` | `boolean` | 是否自动检测源语言 |
| `api_type` | `string` | 当前翻译引擎类型 |
| `openai_api_address` | `string` | OpenAI API 根地址 |
| `openai_api_token` | `string` | OpenAI API Token |
| `openai_model_type` | `string` | OpenAI 模型选择 |
| `google_image_api_key` | `string` | Google 图片/OCR API Key |
| `image_target_lang` | `string` | 截图翻译目标语言 |

## 行为规范

### 启动态恢复
**条件**: `main.js` 或 `HomeView.vue` 调用 `window.getConfig()` 读取本地配置。  
**行为**: 通过对应 mutation 将配置写入 Vuex。  
**结果**: 页面刷新或重新打开插件后能恢复上次的配置状态。

### 翻译前参数拼装
**条件**: 主界面执行 `translate()`。  
**行为**: 视图层从 store 读取语言、引擎和凭据字段并构造请求。  
**结果**: 不同翻译分支共享同一状态来源。

### 设置变更同步
**条件**: 设置面板保存成功。  
**行为**: 立即更新对应 state 字段，不依赖重新加载页面。  
**结果**: 用户保存后可直接使用新引擎或新凭据继续翻译。

## 依赖关系

```yaml
依赖: []
被依赖:
  - app-bootstrap
  - translation-workbench
  - settings-editor
```
