import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tstext: "",
        api_address: "",
        source_lang: "auto",
        target_lang: "ZH",
        language: "zh",
        auto_detect: true,
        api_key: "",
        openai_api_address: "https://api.openai.com/v1",
        openai_api_token: "",
        openai_model: "gpt-3.5-turbo",
        openai_custom_model: "",
        openai_endpoint_type: 'official',
        openai_model_type: 'gpt-3.5-turbo',
        deepl_api_token: "",
        translated_image_text: "",
        google_image_api_key: "", // Add this line
        image_target_lang: "zh", // 修改这里
        // target_lang: "zh", // Add this line
    },
    getters: {},
    mutations: {
        settstext(state, text) {
            state.tstext = text;
        },
        setapiAddress(state, address) {
            state.api_address = address;
        },
        setsourceLanguage(state, source_lang) {
            state.source_lang = source_lang;
        },
        settargetLanguage(state, target_lang) {
            state.target_lang = target_lang;
        },
        setlanguage(state, language) {
            state.language = language;
        },
        setautodetect(state, auto_detect) {
            state.auto_detect = auto_detect;
        },
        setApiType(state, api_type) {
            state.api_type = api_type;
        },
        setApiToken(state, api_token) {
            state.api_token = api_token;
        },
        setApiKey(state, api_key) {
            state.api_key = api_key;
        },
        setOpenaiApiAddress(state, address) {
            state.openai_api_address = address;
        },
        setOpenaiApiToken(state, token) {
            state.openai_api_token = token;
        },
        setOpenaiModel(state, model) {
            state.openai_model = model;
        },
        setOpenaiCustomModel(state, model) {
            state.openai_custom_model = model;
        },
        setOpenaiEndpointType(state, type) {
            state.openai_endpoint_type = type;
        },
        setOpenaiModelType(state, type) {
            state.openai_model_type = type;
        },
        setDeeplApiToken(state, token) {
            state.deepl_api_token = token;
        },
        setTranslatedImageText(state, text) {
            state.translated_image_text = text;
        },
        setGoogleImageApiKey(state, key) {
            state.google_image_api_key = key;
        },
        setImageTargetLang(state, lang) { // 添加这个突变
            state.image_target_lang = lang;
        },
        setTargetLang(state, lang) {
            state.target_lang = lang;
        },
    },
    actions: {},
    modules: {}
})
