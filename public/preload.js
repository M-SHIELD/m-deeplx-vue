/**
 * 打开默认浏览器加载指定连接
 * @param url 链接
 * @returns {Promise<void>}
 */
window.oepnUrl = async function (url) {

    window.utools.shellOpenExternal(url)
}


/**
 * 保存键值对配置
 * @param k
 * @param v
 */
window.saveConfig = function (k,v) {
    window.utools.dbStorage.setItem(k, v)
    console.log(k+":"+window.utools.dbStorage.getItem(k)+" 保存")
}

/**
 * 读取键值对配置
 * @param k
 * @returns {*} v
 */
window.getConfig = function (k) {
    return window.utools.dbStorage.getItem(k)
}

// 复制
window.mcopy = function (text) {
    window.utools.copyText(text)
}


//复制且隐藏
window.mcopyHide = function (text) {
    window.utools.copyText(text)
    window.utools.hideMainWindow()

}

//复制且输入
window.mcopyHideEnter = function (text) {
    window.utools.copyText(text)
    window.utools.hideMainWindow()
    window.utools.hideMainWindowTypeString(text)
}

window.utools.onPluginReady(() => {
  loadSetting();
});
