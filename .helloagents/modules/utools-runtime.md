# utools-runtime

## 职责

- 通过 `public/plugin.json` 声明插件入口、关键词、开发地址和平台支持范围，并兼容 ZTools 所需元信息。
- 在 `public/preload.js` 中识别 `window.utools` / `window.ztools`，把浏览器打开、配置存储、复制、模拟输入、截图 OCR 翻译等能力暴露到 `window`。
- 作为 Web 界面与 uTools / ZTools 原生能力之间的统一桥接层。
- 存储截图翻译结果到统一的 `dbStorage`，供主界面回填读取。

## 接口定义

### 公共API
| 函数/方法 | 参数 | 返回值 | 说明 |
|----------|------|--------|------|
| `window.oepnUrl(url)` | `url: string` | `Promise<void>` | 调用默认浏览器打开外部文档链接 |
| `window.saveConfig(k, v)` | `k: string`, `v: any` | `void` | 写入本地配置 |
| `window.getConfig(k)` | `k: string` | `any` | 读取本地配置 |
| `window.pluginRuntime.getPlatform()` | 无 | `string` | 返回当前平台：`utools` / `ztools` / `unknown` |
| `window.pluginRuntime.onPluginEnter(cb)` | `cb: function` | `void` | 统一监听插件进入事件 |
| `window.pluginRuntime.getEnterText(action)` | `action: object` | `string` | 从插件进入事件中提取选中文本，兼容 `payload` 与 `inputState.pastedText` |
| `window.pluginRuntime.resolveEnterText(action)` | `action: object` | `Promise<string>` | 在 ZTools 下额外尝试主动复制原窗口选中文本并回退读取剪贴板 |
| `window.mcopy(text)` | `text: string` | `void` | 复制文本 |
| `window.mcopyHide(text)` | `text: string` | `void` | 复制文本并隐藏主窗口 |
| `window.mcopyHideEnter(text)` | `text: string` | `void` | 复制文本、隐藏主窗口并模拟输入 |
| `window.captureAndTranslateImage(targetLang, googleImageApiKey)` | 目标语言、API Key | `Promise<object>` | 执行截图、OCR 和翻译流程 |

### 数据结构
| 字段 | 类型 | 说明 |
|------|------|------|
| `plugin.json.features` | `array` | 定义插件唤起命令和 `over` 模式配置 |
| `pluginRuntime` | `object` | 双平台统一能力入口 |
| `img_tred` | `object` | 截图翻译缓存结果，存放在统一 `dbStorage` |
| `targetLang` | `string` | 截图翻译目标语言 |
| `originalText` | `string` | OCR 检测出的原始文本 |
| `translatedText` | `string` | 图片翻译结果文本 |

## 行为规范

### 插件清单声明
**条件**: uTools 或 ZTools 读取 `public/plugin.json`。  
**行为**: 以 `dx翻译` 为功能码声明关键词、平台和开发入口地址，并追加 ZTools 所需的 schema 与基础元信息。  
**结果**: 用户可在两个平台中通过命令或选中文本唤起插件。

### 本地配置读写
**条件**: 主界面或设置页调用 `window.saveConfig()` / `window.getConfig()`。  
**行为**: 通过 `pluginRuntime.dbStorage` 统一转发到当前平台的持久化存储实现。  
**结果**: API 配置和界面语言可跨会话保留。

### 截图 OCR 翻译
**条件**: 用户触发截图翻译并提供有效 Google API Key。  
**行为**: 调用统一截图接口截图，使用 Google Vision OCR 检测文字，再调用 Google Translate 翻译，并在特殊情况下处理同语种回退或中间语言翻译。  
**结果**: 返回包含成功状态、源语言、原文和译文的结果对象，并缓存到 `img_tred`。

### 平台别名兼容
**条件**: 插件运行在 ZTools 中。  
**行为**: preload 在检测到 `window.ztools` 时补充 `window.utools` 别名，并在平台识别时优先保留 ZTools 身份，再通过 `pluginRuntime` 暴露统一接口。  
**结果**: 旧业务调用可平滑迁移，新业务统一走兼容层。

### 插件进入文本归一化
**条件**: 插件通过 uTools `over` 模式或 ZTools 全局快捷键上下文被唤起。  
**行为**: 兼容层优先读取 `payload` 字符串，其次回退到 `inputState.pastedText`；若 ZTools 仍未透传文本，则隐藏主窗口、恢复原窗口、模拟系统复制，再读取系统剪贴板或 ZTools 剪贴板历史。  
**结果**: 业务层可统一获取外部文本，而不需要关心宿主平台参数结构差异；若原窗口拒绝复制或系统安全策略阻止剪贴板读取，则会记录失败原因日志。

## 依赖关系

```yaml
依赖: []
被依赖:
  - app-bootstrap
  - translation-workbench
  - settings-editor
```
