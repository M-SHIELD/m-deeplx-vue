# m-deeplx-vue

m-deeplx-vue 是一个基于 Vue.js 的多功能翻译工具,集成了多种翻译 API,为用户提供便捷的翻译服务。

## 特性

- 支持多种翻译 API:
  - DeepLX
  - DeepL 官方 API
  - DeepSeek
  - Google Translate API
  - Google Translate (免费版)
  - OpenAI
- 自动语言检测
- 支持语言切换
- 多语言界面 (中文和英文)
- 集成 uTools 插件功能

## 技术栈

- Vue.js
- Vuex
- Vue Router
- Element UI
- Vue I18n

## 主要功能

1. 文本翻译: 支持多种语言之间的互译。
2. API 设置: 用户可以选择不同的翻译 API 并配置相关参数。
3. 语言自动检测: 能够自动识别输入文本的语言。
4. 复制功能: 支持复制翻译结果,复制并隐藏窗口,以及复制并输入结果。
5. 设置管理: 提供友好的界面来管理各种 API 设置和偏好。

## 截图
![img_3.png](https://www.ake1.com/mkoss/2023-07-13/6e67dc21.png)
![img_4.png](https://www.ake1.com/mkoss/2023-07-13/f7db2c8d.png)

## 安装和使用

1. 克隆仓库:
   ```bash
   git clone https://github.com/your-username/m-deeplx-vue.git
   ```

2. 安装依赖:
   ```bash
   cd m-deeplx-vue
   npm install
   ```

3. 运行开发服务器:
   ```bash
   npm run serve
   ```

4. 构建生产版本:
   ```bash
   npm run build
   ```

## 配置

在使用之前,请确保正确配置了所需的 API 密钥和端点。您可以在应用的设置界面中进行这些配置。

## 贡献

欢迎提交 issues 和 pull requests 来帮助改进这个项目。

## 许可证

[MIT License](LICENSE)
