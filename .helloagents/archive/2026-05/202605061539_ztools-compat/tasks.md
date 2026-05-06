# 任务清单: ztools-compat

> **@status:** completed | 2026-05-06 15:52

```yaml
@feature: ztools-compat
@created: 2026-05-06
@status: completed
@mode: R2
```

## 进度概览

| 完成 | 失败 | 跳过 | 总数 |
|------|------|------|------|
| 5 | 0 | 0 | 5 |

---

## 任务列表

### 1. 方案与运行时梳理

- [√] 1.1 在 `public/preload.js`、`src/views/HomeView.vue`、`public/plugin.json`、ZTools 上游文档/源码范围内完成兼容点梳理
  - 预期变更: 明确双平台 API 对照、清单字段差异和必须改造的调用点
  - 完成标准: 能列出本轮改造涉及的运行时能力和文件范围，并据此执行后续任务
  - 验证方式: 人工核对方案包 `proposal.md` 与检索结果
  - depends_on: []

### 2. 运行时兼容层

- [√] 2.1 在 `public/preload.js` 中实现 uTools/ZTools 统一桥接与兼容别名
  - 预期变更: 增加平台识别、统一存储/通知/截图/复制/输入/外链打开/生命周期能力，兼容 `window.utools` 与 `window.ztools`
  - 完成标准: 现有业务层在两个平台下都能通过统一桥接访问核心能力
  - 验证方式: 代码审查 + 关键接口全文检索
  - depends_on: [1.1]

### 3. 业务层接入

- [√] 3.1 在 `src/views/HomeView.vue` 中移除对 `window.utools.dbStorage` 的直接依赖，改为统一桥接调用
  - 预期变更: 截图翻译结果读取、插件进入事件接管等逻辑改走兼容层
  - 完成标准: 视图层不再把 `window.utools` 当作唯一平台入口
  - 验证方式: `rg -n "window\\.utools" src/views/HomeView.vue`
  - depends_on: [2.1]

- [√] 3.2 在类型声明文件中补充双平台运行时全局定义
  - 预期变更: 为 `window.utools`、`window.ztools`、桥接方法提供最小可维护类型
  - 完成标准: 项目内运行时全局接口具备统一入口说明
  - 验证方式: 代码审查
  - depends_on: [2.1]

### 4. 插件清单与验收

- [√] 4.1 在 `public/plugin.json` 中补齐 ZTools 兼容字段并保留现有开发配置
  - 预期变更: 增加 `$schema`、`title`、`description`、`author` 等元信息，确保 ZTools 可识别
  - 完成标准: 清单文件同时满足当前项目和 ZTools 的基本装载要求
  - 验证方式: 人工核对字段 + 代码审查
  - depends_on: [1.1]

- [√] 4.2 执行 `npm run lint` 并同步知识库文档
  - 预期变更: 修正静态问题，更新 `.helloagents` 中运行时相关模块说明和变更记录
  - 完成标准: 知识库已同步，`npm run lint` 通过
  - 验证方式: `npm ci` + `npm run lint` + 文件检查
  - depends_on: [3.1, 3.2, 4.1]

---

## 执行日志

| 时间 | 任务 | 状态 | 备注 |
|------|------|------|------|
| 2026-05-06 15:39 | 方案包创建 | completed | 已生成 `202605061539_ztools-compat` |
| 2026-05-06 15:47 | 1.1 | completed | 已完成本地代码与 ZTools 上游源码对照 |
| 2026-05-06 15:52 | 2.1 | completed | `public/preload.js` 已加入双平台桥接与别名兼容 |
| 2026-05-06 15:53 | 3.1/3.2/4.1 | completed | 视图层接入统一桥接，补充运行时类型，更新插件清单 |
| 2026-05-06 15:55 | 4.2 | completed | 已安装依赖并通过 `npm run lint`，知识库同步完成 |

---

## 执行备注

> 记录执行过程中的重要说明、决策变更、风险提示等

- ZTools 自带主 preload，并允许插件追加 `plugin.json.preload`。因此本轮以“插件 preload 兼容桥接”为主，不需要改动平台本身。
- ZTools 源码确认支持 `dbStorage`、`copyText`、`screenCapture`、`hideMainWindowTypeString`、`shellOpenExternal`、`onPluginEnter`、`onPluginReady`，可覆盖本项目主要运行时依赖。
- 为完成自动化验收，本轮已执行 `npm ci` 安装依赖；安装后 `npm run lint` 通过。
