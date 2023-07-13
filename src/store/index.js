import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tstext: "",
        api_address: "",
        source_lang: "",
        target_lang: "",
        language: "",
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
        }
    },
    actions: {},
    modules: {}
})
