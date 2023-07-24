const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  assetsDir:"static",
  publicPath: './',
  transpileDependencies: true,
  productionSourceMap: false, //打包不生成map
  devServer:{
    port: 8080,
    open: false, //浏览器自启动
    // 配置的代理接口，每改一点，都得重启vue项目。
    // proxy:{ //配置代理
    //   "/translate":{
    //     target:"http://45.94.43.74:8081",  //跨域目标主机，最终请求地址变成 http://localhost:8080/api
    //   },
    // }
  },

  pluginOptions: {
    i18n: {
      locale: undefined,
      fallbackLocale: undefined,
      localeDir: undefined,
      enableInSFC: undefined,
      enableBridge: undefined
    }
  }
})
