# router-shell

## 职责

- 在 `src/router/index.js` 中声明应用路由。
- 通过 `App.vue` 的 `<router-view>` 把当前路由页面渲染到根壳中。
- 维持当前项目的单页面入口结构。

## 接口定义

### 公共API
| 函数/方法 | 参数 | 返回值 | 说明 |
|----------|------|--------|------|
| `new VueRouter({ routes })` | `routes: RouteConfig[]` | `VueRouter` | 创建路由实例 |
| `routes[0]` | `/` | `HomeView` | 将首页绑定到翻译工作台 |

### 数据结构
| 字段 | 类型 | 说明 |
|------|------|------|
| `path` | `string` | 路由路径，当前仅 `/` |
| `name` | `string` | 路由名，当前为 `home` |
| `component` | `VueComponent` | 关联的页面组件，当前为 `HomeView` |

## 行为规范

### 首页加载
**条件**: 应用启动并挂载路由。  
**行为**: 访问根路径 `/` 时加载 `HomeView.vue`。  
**结果**: 用户打开插件即进入翻译工作台。

### 应用壳渲染
**条件**: `App.vue` 被挂载。  
**行为**: 仅渲染一个 `router-view` 作为页面内容出口。  
**结果**: 当前项目保持轻量级单页结构，便于后续扩展更多页面。

## 依赖关系

```yaml
依赖:
  - translation-workbench
被依赖:
  - app-bootstrap
```
