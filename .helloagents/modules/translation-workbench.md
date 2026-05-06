# translation-workbench

## 职责

- 作为主工作台页面，承载文本输入、语言选择、翻译结果展示和结果操作按钮。
- 根据 `api_type` 选择不同翻译引擎，直接向第三方接口发送请求。
- 处理自动语言识别、源/目标语言切换、截图 OCR 翻译和最近一次截图结果回填。
- 在插件通过 `over` 模式进入时接收选中文本，并同步到 Vuex。

## 接口定义

### 公共API
| 函数/方法 | 参数 | 返回值 | 说明 |
|----------|------|--------|------|
| `translate(checkPrev = true)` | `checkPrev: boolean` | `Promise<void>` | 按当前 API 类型执行文本翻译 |
| `auto_detect_metion()` | 无 | `Promise<void>` | 调用第三方语言检测接口并更新源/目标语言 |
| `captureAndTranslate()` | 无 | `Promise<void>` | 触发截图、OCR 和翻译，并更新结果区域 |
| `loadLastTranslation()` | 无 | `void` | 读取上次截图翻译结果并回显 |
| `copyOnly()` / `copyAndHide()` / `copyAndInput()` | 无 | `void` | 调用 preload 暴露的方法处理复制与输入 |

### 数据结构
| 字段 | 类型 | 说明 |
|------|------|------|
| `form` | `object` | 发送给不同翻译接口的请求参数聚合对象 |
| `result` | `string` | 当前文本翻译结果 |
| `translatedText` | `string \| null` | 截图翻译结果展示文本 |
| `loading` | `boolean` | 翻译或截图过程中使用的加载状态 |
| `showDrawer` | `boolean` | 设置抽屉显示状态 |

## 行为规范

### 文本翻译
**条件**: `store.state.tstext` 非空，且当前 `api_type` 配置有效。  
**行为**: 将 Vuex 中的语言、API 地址、Token、模型等字段组装到 `form`，再按引擎分支调用远程接口。  
**结果**: 成功时更新 `result`，失败时通过 Element UI 消息提示报错。

### 自动检测与延迟翻译
**条件**: 文本输入变化，且开启 `auto_detect`。  
**行为**: 先调用语言检测接口更新源语言，再执行翻译；输入变化使用 `setTimeout` 做 400ms 防抖。  
**结果**: 减少重复请求，并尽量根据检测结果自动调整语言对。

### 截图翻译
**条件**: 用户点击截图翻译按钮，且已设置图片翻译 API Key。  
**行为**: 调用 `window.captureAndTranslateImage()`，根据返回结果处理正常翻译、同语种回退和中间语言往返翻译等情况。  
**结果**: 将翻译结果写入 `translatedText` 和 `result`，必要时同步原文到输入框。

### 插件入口文本接管
**条件**: uTools 通过 `over` 模式带入选中文本，或 ZTools 通过全局快捷键上下文传入 `pastedText`。  
**行为**: 在 `window.pluginRuntime.onPluginEnter()` 回调中优先解析宿主传入文本；若 ZTools 未透传文本，则调用兼容层主动复制原窗口选中文本作为回退。  
**结果**: 用户从外部文本进入插件时可直接看到待翻译内容；若原窗口不响应复制或剪贴板读取失败，控制台会输出对应失败原因。

### 截图结果读取
**条件**: 用户点击“加载图片翻译结果”或页面启动时尝试恢复最近一次截图翻译。  
**行为**: 通过 `window.getConfig('img_tred')` 读取统一存储中的截图翻译缓存。  
**结果**: 两个平台都能回显最近一次截图翻译结果。

## 依赖关系

```yaml
依赖:
  - state-store
  - settings-editor
  - utools-runtime
被依赖:
  - router-shell
```
