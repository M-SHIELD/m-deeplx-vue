# 变更提案: ztools-selected-text

## 元信息
```yaml
类型: 修复
方案类型: implementation
优先级: P1
状态: 已确认
创建: 2026-05-06
```

---

## 1. 需求

### 背景
在 uTools 中，选中文本后唤起插件会把文本直接带入翻译输入框；但在 ZTools 中，设置全局快捷键 `Ctrl+Space` 后，选中文本不会自动进入输入框，导致双平台行为不一致。

### 目标
- 修复 ZTools 下全局快捷键唤起时，选中文本不能自动进入输入框的问题。
- 保持 uTools 现有 `over` 模式行为不变。
- 将插件进入事件中的文本提取逻辑统一到兼容层，避免后续再分散处理。

### 约束条件
```yaml
兼容性约束:
  - 不破坏 uTools 既有行为
  - 兼容 ZTools 的 PluginEnter 参数结构（payload/type/inputState）
业务约束:
  - 仅修复选中文本进入输入框链路，不改动翻译核心业务
```

### 验收标准
- [ ] uTools 中通过选中文本唤起插件，输入框仍能自动带入文本
- [ ] ZTools 中通过 `Ctrl+Space` 唤起插件，若存在选中文本，则输入框自动带入文本
- [ ] `npm run lint` 通过

---

## 2. 方案

### 技术方案
- 在 `public/preload.js` 中新增统一的插件进入事件文本归一化逻辑。
- 优先从 `payload` 直接读取字符串，其次回退读取 `payload.inputState.pastedText` 或 `action.inputState.pastedText`。
- 在 `src/views/HomeView.vue` 中使用归一化后的文本，而不是只认 `type === 'over'`。

### 影响范围
```yaml
涉及模块:
  - utools-runtime: 增加 PluginEnter 文本提取兼容逻辑
  - translation-workbench: 主界面接收兼容后的进入文本
预计变更文件: 2-4
```

### 风险评估
| 风险 | 等级 | 应对 |
|------|------|------|
| ZTools 在不同唤起路径下的 payload 结构不完全一致 | 中 | 按“直接 payload → inputState.pastedText”多层回退解析 |
| 放宽条件后误把普通空搜索也写入输入框 | 低 | 仅在提取到非空字符串时提交到 store |

### 方案取舍
```yaml
唯一方案理由: 根因是插件进入参数结构兼容不完整，最小修复就是把文本提取统一前移到兼容层
放弃的替代路径:
  - 仅在 HomeView 针对 ZTools 加平台分支: 逻辑分散，后续难维护
  - 修改 plugin.json 指令类型: 不能覆盖 ZTools 全局快捷键直启链路
回滚边界: 仅涉及 preload 兼容方法和 HomeView 的进入事件处理
```

---

## 3. 核心场景

### 场景: ZTools 快捷键唤起带入选中文本
**模块**: `translation-workbench`  
**条件**: 用户在外部应用选中文本，通过 `Ctrl+Space` 唤起 ZTools 并进入插件。  
**行为**: 插件进入事件从 `payload` 或 `inputState.pastedText` 提取文本，并写入 `store.state.tstext`。  
**结果**: 输入框自动显示选中文本。

---

## 4. 技术决策

### ztools-selected-text#D001: 统一在兼容层解析插件进入文本
**日期**: 2026-05-06  
**状态**: ✅采纳  
**背景**: 当前只处理 `type === 'over'`，无法覆盖 ZTools 快捷键直启时的参数结构。  
**选项分析**:
| 选项 | 优点 | 缺点 |
|------|------|------|
| A: 兼容层统一解析 | 逻辑集中，uTools/ZTools 共用 | 需要稍微扩展 preload 能力 |
| B: 视图层按平台分支判断 | 上手快 | 容易继续扩散平台分支 |
**决策**: 选择方案 A  
**理由**: 运行时差异应由兼容层兜底，而不是业务层持续感知。  
**影响**: `public/preload.js`、`src/views/HomeView.vue`

---

## 5. 验证策略

```yaml
verifyMode: review-first
reviewerFocus:
  - 插件进入事件文本提取是否覆盖 payload 与 inputState.pastedText
  - uTools 原有 over 模式是否仍兼容
testerFocus:
  - npm run lint
  - 手动验证 ZTools / uTools 的选中文本唤起
uiValidation: none
riskBoundary:
  - 不改动翻译请求逻辑
  - 不修改截图、复制、设置存储链路
```
