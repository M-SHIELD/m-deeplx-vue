window.saveConfig = function (api) {
    utools.dbStorage.setItem("api", api)
    console.log(utools.dbStorage.getItem("api")+" 保存")
}


window.getConfig = function () {
    return utools.dbStorage.getItem("api")
}
