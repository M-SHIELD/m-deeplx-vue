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
        }
    },
    actions: {},
    modules: {}
})
