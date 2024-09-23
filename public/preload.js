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

/**
 * 截图并上传到谷歌图片翻译API
 * @returns {Promise<void>}
 */
window.captureAndTranslateImage = async function (targetLang, googleImageApiKey) {
    if (!googleImageApiKey) {
        window.utools.showNotification("请先设置谷歌图片API密钥");
        return;
    }

    // 调用 uTools 截图功能
    window.utools.screenCapture(async (base64Str) => {
        if (!base64Str) {
            console.error("截图失败");
            return;
        }

        // 去掉前缀 `data:image/png;base64,`
        const base64Data = base64Str.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

        // 上传到谷歌图片翻译API
        try {
            const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${googleImageApiKey}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requests: [
                        {
                            image: {
                                content: base64Data
                            },
                            features: [
                                {
                                    type: "TEXT_DETECTION"
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();
            if (data.responses && data.responses[0].fullTextAnnotation) {
                const detectedText = data.responses[0].fullTextAnnotation.text;

                // 翻译检测到的文本
                const translateResponse = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleImageApiKey}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        q: detectedText,
                        target: targetLang,
                        format: 'text'
                    })
                });

                const translateData = await translateResponse.json();
                if (translateData.data && translateData.data.translations) {
                    window.utools.showNotification("翻译成功");
                    window.utools.dbStorage.setItem("img_tred", 
                    {
                        success: true,
                        translatedText: translateData.data.translations[0].translatedText,
                        detectedSourceLanguage: translateData.data.translations[0].detectedSourceLanguage
                    });
                    return ;
                } else {
                    throw new Error("翻译失败");
                }
            } else {
                throw new Error("文本检测失败");
            }
        } catch (error) {
            console.error("翻译失败", error);
            window.utools.showNotification("翻译失败: " + error.message);
            return {
                success: false,
                error: error.message
            };
        }
    });
}

window.utools.onPluginReady(() => {
  loadSetting();
});
