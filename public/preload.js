/**
 * 保存键值对配置
 * @param k
 * @param v
 */
window.saveConfig = function (k,v) {
    utools.dbStorage.setItem(k, v)
    console.log(k+":"+utools.dbStorage.getItem(k)+" 保存")
}

/**
 * 读取键值对配置
 * @param k
 * @returns {*} v
 */
window.getConfig = function (k) {
    return utools.dbStorage.getItem(k)
}

// 复制
window.mcopy = function (text) {
    utools.copyText(text)
}


//复制且隐藏
window.mcopyHide = function (text) {
    utools.copyText(text)
    utools.hideMainWindow()

}

//复制且输入
window.mcopyHideEnter = function (text) {
    utools.copyText(text)
    utools.hideMainWindow()
    utools.hideMainWindowTypeString(text)
}

