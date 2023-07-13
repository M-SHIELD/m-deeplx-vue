import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/element.js'

Vue.config.productionTip = false


import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
    en: {
        translationFunction: 'Translation Function',
        language: 'Display Language',
        selectLanguage: 'Select language',
        text: 'Text to be translated',
        enterText: 'Enter text to be translated',
        apiAddress: 'API Address',
        enterApiAddress: 'Enter API address',
        sourceLanguage: 'Source Language',
        selectSourceLanguage: 'Select source language',
        targetLanguage: 'Target Language',
        selectTargetLanguage: 'Select target language',
        translationResult: 'Translation Result',
        translatedText: 'Translated text',
        translationSuccessful: "Translation successful",
        translationFailed: "Translation failed",
        copyOnly: "Copy only",
        copyAndHide: "Copy and hide",
        copyAndInput: "Copy and input",
        autoSwapFailed: "auto Swap Failed",
        saveConfig: "save Config",
        copySuccessful: "copy Successful",
        apiType: 'API Type',
        selectApiType: 'Select API type',
        apiToken: 'API Token',
        enterApiToken: 'Enter API token',
        saveSettings: 'Save Settings',
        settingsSaved: 'Settings saved',
        settingTitle: 'setting edit',
        autoDetectButton: 'auto Detect',
        settingsSavedapiAddressErrorInfo: 'settings Saved apiAddress Error Info',
        "auto": "Auto detect",
        "German": "German",
        "English": "English",
        "Spanish": "Spanish",
        "French": "French",
        "Italian": "Italian",
        "Japanese": "Japanese",
        "Dutch": "Dutch",
        "Polish": "Polish",
        "Portuguese": "Portuguese",
        "Russian": "Russian",
        "Chinese": "Chinese",
        "Bulgarian": "Bulgarian",
        "Czech": "Czech",
        "Danish": "Danish",
        "Greek": "Greek",
        "Estonian": "Estonian",
        "Finnish": "Finnish",
        "Hungarian": "Hungarian",
        "Lithuanian": "Lithuanian",
        "Latvian": "Latvian",
        "Romanian": "Romanian",
        "Slovak": "Slovak",
        "Slovenian": "Slovenian",
        "Swedish": "Swedish"
    },
    zh: {
        translationFunction: '翻译功能',
        language: '显示语言',
        selectLanguage: '选择语言',
        text: '待翻译文本',
        enterText: '输入要翻译的内容',
        apiAddress: 'API地址',
        enterApiAddress: '输入API地址',
        sourceLanguage: '源语言',
        selectSourceLanguage: '选择源语言',
        targetLanguage: '目标语言',
        selectTargetLanguage: '选择目标语言',
        translationResult: '翻译结果',
        translatedText: '翻译结果',
        translationSuccessful: "翻译成功",
        translationFailed: "翻译失败",
        copyOnly: "仅复制",
        copyAndHide: "复制并隐藏",
        copyAndInput: "复制并输入",
        autoSwapFailed: "自动检测的模式不能切换",
        saveConfig: "保存配置(API地址)",
        copySuccessful: "复制成功",
        apiType: 'API类型',
        selectApiType: '选择API类型',
        apiToken: 'API令牌',
        enterApiToken: '输入API令牌',
        saveSettings: '保存设置',
        settingsSaved: '设置已保存',
        settingTitle: '编辑设置',
        autoDetectButton: '智能识别',
        settingsSavedapiAddressErrorInfo: '请填写正确的API地址',
        "auto": "自动检测",
        "German": "德语",
        "English": "英语",
        "Spanish": "西班牙语",
        "French": "法语",
        "Italian": "意大利语",
        "Japanese": "日语",
        "Dutch": "荷兰语",
        "Polish": "波兰语",
        "Portuguese": "葡萄牙语",
        "Russian": "俄语",
        "Chinese": "中文",
        "Bulgarian": "保加利亚语",
        "Czech": "捷克语",
        "Danish": "丹麦语",
        "Greek": "希腊语",
        "Estonian": "爱沙尼亚语",
        "Finnish": "芬兰语",
        "Hungarian": "匈牙利语",
        "Lithuanian": "立陶宛语",
        "Latvian": "拉脱维亚语",
        "Romanian": "罗马尼亚语",
        "Slovak": "斯洛伐克语",
        "Slovenian": "斯洛文尼亚语",
        "Swedish": "瑞典语"
    }
}
// eslint-disable-next-line no-undef
let language = getConfig("language")
store.commit("setlanguage", language)
const i18n = new VueI18n({
    locale: store.state.language, // set locale
    messages, // set locale messages
})


new Vue({
    store,
    router,
    i18n,
    render: h => h(App)
}).$mount('#app')
