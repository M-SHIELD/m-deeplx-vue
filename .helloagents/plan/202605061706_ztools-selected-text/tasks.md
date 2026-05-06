# 任务清单: ztools-selected-text

```yaml
@feature: ztools-selected-text
@created: 2026-05-06
@status: completed
@mode: R2
```

## 进度概览

| 完成 | 失败 | 跳过 | 总数 |
|------|------|------|------|
| 3 | 0 | 0 | 3 |

---

## 任务列表

### 1. 进入事件兼容

- [√] 1.1 在 `public/preload.js` 中实现插件进入文本的统一提取逻辑
  - 预期变更: 新增从 `payload` 与 `inputState.pastedText` 回退提取文本的方法
  - 完成标准: 兼容层能给业务层返回可靠的进入文本
  - 验证方式: 代码审查
  - depends_on: []

### 2. 业务层接入

- [√] 2.1 在 `src/views/HomeView.vue` 中改为使用统一提取后的进入文本
  - 预期变更: 不再只依赖 `type === 'over'`，而是识别兼容层给出的文本结果
  - 完成标准: 非空选中文本进入时会写入 `store.state.tstext`
  - 验证方式: 代码审查 + 关键逻辑检索
  - depends_on: [1.1]

### 3. 验收与同步

- [√] 3.1 执行 `npm run lint` 并同步知识库
  - 预期变更: 完成静态验收并补充运行时模块文档/变更记录
  - 完成标准: lint 通过，知识库反映修复内容
  - 验证方式: `npm run lint` + 文件检查
  - depends_on: [2.1]

---

## 执行日志

| 时间 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 2026-05-06 17:06 | 方案包创建 | completed | 已生成 `202605061706_ztools-selected-text` |
| 2026-05-06 17:07 | 1.1 / 2.1 | completed | 已兼容 `payload` 与 `inputState.pastedText` 两种进入文本来源 |
| 2026-05-06 17:08 | 3.1 | completed | `npm run lint` 通过，知识库已同步 |
| 2026-05-06 17:25 | 追加修复 | completed | 用户反馈复制/选中两条链路均失败后，改为 ZTools 下主动恢复原窗口、模拟复制并读取剪贴板 |
| 2026-05-06 17:30 | 平台识别修复 | completed | 修正 `window.utools` 兼容别名导致 ZTools 被误判为 uTools 的问题 |

---

## 执行备注

- ZTools 快捷键启动参数由宿主构造，文本可能不在 `payload` 顶层，而在 `inputState.pastedText`。
- ZTools “全局快捷键直启插件”链路不会像超级面板那样主动模拟复制；插件侧现在补齐了类似策略：隐藏主窗口、恢复原窗口、模拟复制、读取剪贴板、再显示主窗口。
- 若原窗口不响应 `Ctrl+C` / `Command+C` 或系统禁止剪贴板读取，兼容层会输出 `[PluginRuntime][Enter]` 失败原因日志。
