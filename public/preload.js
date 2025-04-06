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
 * @returns {Promise<object>} 包含翻译结果的对象
 */
window.captureAndTranslateImage = async function (targetLang, googleImageApiKey) {
    if (!googleImageApiKey) {
        window.utools.showNotification("请先设置谷歌图片API密钥");
        return { success: false, error: "请先设置谷歌图片API密钥" };
    }

    // 创建一个Promise来封装截图和翻译过程
    return new Promise((resolve) => {
        // 调用 uTools 截图功能
        window.utools.screenCapture(async (base64Str) => {
            if (!base64Str) {
                console.error("截图失败");
                resolve({ success: false, error: "截图失败" });
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
                    
                    // 检测原文语言
                    let detectedLanguage = "";
                    if (data.responses[0].fullTextAnnotation.pages && 
                        data.responses[0].fullTextAnnotation.pages[0].property && 
                        data.responses[0].fullTextAnnotation.pages[0].property.detectedLanguages && 
                        data.responses[0].fullTextAnnotation.pages[0].property.detectedLanguages.length > 0) {
                        detectedLanguage = data.responses[0].fullTextAnnotation.pages[0].property.detectedLanguages[0].languageCode;
                    }
                    
                    // 转换和标准化检测到的语言代码
                    let sourceLanguage = detectedLanguage.toLowerCase();
                    let targetLangLower = targetLang.toLowerCase();
                    
                    // 标准化语言代码（处理zh, zh-cn, zh-tw等情况）
                    if (sourceLanguage.startsWith("zh")) {
                        sourceLanguage = "zh-CN";
                    }
                    if (targetLangLower.startsWith("zh")) {
                        targetLangLower = "zh";
                    }
                    
                    // 对于英文，统一为"en"
                    if (sourceLanguage.startsWith("en")) {
                        sourceLanguage = "en";
                    }
                    if (targetLangLower.startsWith("en")) {
                        targetLangLower = "en";
                    }
                    
                    // 如果检测到的语言与目标语言相同或相似
                    const isSameLanguage = (sourceLanguage === targetLangLower) || 
                                          (sourceLanguage.startsWith("zh") && targetLangLower.startsWith("zh")) ||
                                          (sourceLanguage === "en" && targetLangLower === "en");
                    
                    // 保存原始检测到的语言代码
                    const originalDetectedLanguage = detectedLanguage || sourceLanguage;
                    
                    // 如果源语言和目标语言相同，尝试通过英文作为中介进行翻译
                    if (isSameLanguage) {
                        try {
                            // 如果源语言不是英语，先翻译成英语
                            let intermediateText = detectedText;
                            let finalTargetLang = targetLang;
                            
                            if (sourceLanguage !== "en") {
                                // 先翻译成英语
                                const enTranslateResponse = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleImageApiKey}`, {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        q: [detectedText], // 确保q是数组格式
                                        target: "en",
                                        format: 'text'
                                    })
                                });
                                
                                // 日志记录中介翻译步骤1请求信息
                                console.log("中介翻译(步骤1)请求:", {
                                    target: "en",
                                    textLength: detectedText.length,
                                    textSnippet: detectedText.substring(0, 50) + (detectedText.length > 50 ? "..." : "")
                                });
                                
                                const enTranslateData = await enTranslateResponse.json();
                                console.log("中介翻译(步骤1)响应:", JSON.stringify(enTranslateData));
                                
                                if (enTranslateData.data && enTranslateData.data.translations && enTranslateData.data.translations.length > 0) {
                                    intermediateText = enTranslateData.data.translations[0].translatedText;
                                    console.log("中介翻译(英文)结果:", intermediateText);
                                    
                                    // 再从英语翻译回原始语言
                                    const backTranslateResponse = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleImageApiKey}`, {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            q: [intermediateText], // 确保q是数组格式
                                            target: targetLang,
                                            format: 'text'
                                        })
                                    });
                                    
                                    // 日志记录中介翻译步骤2请求信息
                                    console.log("中介翻译(步骤2)请求:", {
                                        target: targetLang,
                                        textLength: intermediateText.length,
                                        textSnippet: intermediateText.substring(0, 50) + (intermediateText.length > 50 ? "..." : "")
                                    });
                                    
                                    const backTranslateData = await backTranslateResponse.json();
                                    console.log("中介翻译(步骤2)响应:", JSON.stringify(backTranslateData));
                                    
                                    if (backTranslateData.data && backTranslateData.data.translations && backTranslateData.data.translations.length > 0) {
                                        const finalText = backTranslateData.data.translations[0].translatedText;
                                        console.log("中介翻译(最终)结果:", finalText);
                                        
                                        if (finalText && finalText.trim() !== "") {
                                            const result = {
                                                success: true,
                                                translatedText: finalText,
                                                detectedSourceLanguage: originalDetectedLanguage,
                                                originalText: detectedText,
                                                isRoundTripTranslation: true,
                                                intermediateText: intermediateText
                                            };
                                            
                                            window.utools.dbStorage.setItem("img_tred", result);
                                            window.utools.showNotification("通过英语作为中介进行了翻译");
                                            resolve(result);
                                            return;
                                        } else {
                                            console.error("中介翻译结果为空");
                                        }
                                    } else {
                                        console.error("中介翻译(步骤2)失败:", backTranslateData);
                                    }
                                } else {
                                    console.error("中介翻译(步骤1)失败:", enTranslateData);
                                }
                                
                                // 如果中介翻译失败，回退到直接显示原文
                                console.log("中介翻译失败，回退到显示原文");
                                const result = {
                                    success: true,
                                    translatedText: detectedText,
                                    detectedSourceLanguage: originalDetectedLanguage,
                                    originalText: detectedText,
                                    translationFallback: true
                                };
                                
                                window.utools.dbStorage.setItem("img_tred", result);
                                window.utools.showNotification("检测到文本与目标语言相同，显示原文");
                                resolve(result);
                                return;
                            } else {
                                // 如果源语言是英语，但目标语言也是英语，直接返回
                                const result = {
                                    success: true,
                                    translatedText: detectedText,
                                    detectedSourceLanguage: originalDetectedLanguage,
                                    originalText: detectedText
                                };
                                
                                window.utools.dbStorage.setItem("img_tred", result);
                                window.utools.showNotification("检测到文本与目标语言相同，显示原文");
                                resolve(result);
                                return;
                            }
                        } catch (error) {
                            console.error("中介翻译失败:", error);
                            // 如果中介翻译失败，回退到直接显示原文
                            const result = {
                                success: true,
                                translatedText: detectedText,
                                detectedSourceLanguage: originalDetectedLanguage,
                                originalText: detectedText
                            };
                            
                            window.utools.dbStorage.setItem("img_tred", result);
                            window.utools.showNotification("检测到文本与目标语言相同，显示原文");
                            resolve(result);
                            return;
                        }
                    }

                    // 翻译检测到的文本
                    const translateResponse = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${googleImageApiKey}`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            q: [detectedText], // 确保q是数组格式
                            target: targetLang,
                            format: 'text'
                        })
                    });

                    // 输出调试信息到控制台
                    console.log("翻译API请求:", {
                        url: `https://translation.googleapis.com/language/translate/v2?key=${googleImageApiKey.substring(0, 10)}...`,
                        body: {
                            q: [detectedText.substring(0, 100) + (detectedText.length > 100 ? "..." : "")],
                            target: targetLang,
                            format: 'text'
                        }
                    });

                    const rawResponse = await translateResponse.text();
                    console.log("原始翻译API响应:", rawResponse);
                    
                    let translateData;
                    try {
                        translateData = JSON.parse(rawResponse);
                        console.log("解析后的翻译API响应:", JSON.stringify(translateData));
                    } catch (error) {
                        console.error("解析翻译API响应失败:", error);
                        resolve({
                            success: false,
                            error: "解析API响应失败",
                            originalText: detectedText,
                            rawResponse: rawResponse
                        });
                        return;
                    }

                    if (translateData.data && translateData.data.translations && translateData.data.translations.length > 0) {
                        const translatedText = translateData.data.translations[0].translatedText;
                        console.log("翻译结果:", translatedText);
                        
                        // 确保翻译文本不为空
                        if (!translatedText || translatedText.trim() === "") {
                            console.error("翻译结果为空");
                            resolve({
                                success: false,
                                error: "翻译结果为空",
                                originalText: detectedText,
                                apiResponse: translateData
                            });
                            return;
                        }
                        
                        const result = {
                            success: true,
                            translatedText: translatedText,
                            detectedSourceLanguage: translateData.data.translations[0].detectedSourceLanguage || originalDetectedLanguage,
                            originalText: detectedText
                        };
                        
                        console.log("准备返回最终结果:", JSON.stringify(result));
                        
                        // 存储结果以供后续使用
                        try {
                            window.utools.dbStorage.setItem("img_tred", result);
                            console.log("结果已保存到数据库");
                        } catch (error) {
                            console.error("保存结果到数据库失败:", error);
                        }
                        
                        window.utools.showNotification("翻译成功");
                        
                        // 直接在控制台打印最终返回的结果，便于调试
                        console.log("最终返回的结果:", JSON.stringify(result));
                        
                        // 返回结果
                        resolve(result);
                    } else {
                        console.error("翻译API返回无效结果:", translateData);
                        const error = { 
                            success: false, 
                            error: "翻译失败: API返回无效结果",
                            originalText: detectedText,
                            apiResponse: translateData
                        };
                        resolve(error);
                    }
                } else {
                    const error = { success: false, error: "文本检测失败" };
                    resolve(error);
                    throw new Error("文本检测失败");
                }
            } catch (error) {
                console.error("翻译失败", error);
                window.utools.showNotification("翻译失败: " + error.message);
                resolve({
                    success: false,
                    error: error.message
                });
            }
        });
    });
}

window.utools.onPluginReady(() => {
  loadSetting();
});
