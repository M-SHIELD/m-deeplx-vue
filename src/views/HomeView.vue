<template>
  <div class="container">

    <el-form :model="form" label-width="100px">
      <el-row style="margin-bottom: 20px">
        <el-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
            :placeholder="$t('enterText')"
            v-model="$store.state.tstext"
            @blur="translate"
        >
        </el-input>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-checkbox-button v-model="$store.state.auto_detect">{{ $t('autoDetectButton') }}</el-checkbox-button>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('sourceLanguage') ">
            <el-select v-model="$store.state.source_lang" :placeholder="$t('selectSourceLanguage')">
              <el-option
                  v-for="item in languages"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <!--          <el-form-item >-->
          <el-button style="margin-left: 40px" circle type="primary" icon="el-icon-refresh"
                     @click="swapLanguages"></el-button>
          <!--          </el-form-item>-->
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('targetLanguage') ">
            <el-select v-model="$store.state.target_lang" :placeholder="$t('selectTargetLanguage') ">
              <el-option
                  v-for="(item,index) in languages"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="index<=0"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>


        <el-input
            v-loading="loading"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 8}"
            :placeholder=" $t('translatedText') "
            v-model="result"
            readonly
        >
        </el-input>

      </el-row>
      <div v-if="result.length>0" class="buttons">
        <el-button type="primary" @click="copyOnly">{{ $t('copyOnly') }}</el-button>
        <el-button type="primary" @click="copyAndHide">{{ $t('copyAndHide') }}</el-button>
        <el-button type="primary" @click="copyAndInput">{{ $t('copyAndInput') }}</el-button>
        <!--        <el-button type="primary" @click="saveConfig">{{ $t('saveConfig') }}</el-button>-->
      </div>
    </el-form>
    <!-- Add a tag button in the bottom right corner -->
    <el-button type="primary" circle class="setting-button" icon="el-icon-setting"
               @click="showDrawer = true"></el-button>
    <!-- Add a drawer component that uses the SettingEditor.vue view -->
    <el-drawer
        :title="$t('settingTitle')"
        :visible.sync="showDrawer"
        size="60%"
        direction="rtl"
    >
      <settingEditor></settingEditor>
    </el-drawer>
    <!-- Add a button to capture and translate image -->
    <el-button  type="primary" @click="captureAndTranslate">{{ $t('captureAndTranslate') }}</el-button>
    <el-button  type="primary" @click="loadPictureText">{{ $t('loadPictureText') }}</el-button>
    
    <!-- <div v-if="this.translatedText">
      <p>{{ translatedText }}</p>
    </div> -->
  </div>
</template>

<script>
import store from '@/store'

window.utools.onPluginEnter(({code, type, payload}) => {
  console.log('用户进入插件应用', code, type, payload)
  if (type === "over") {

    store.commit('settstext', payload)
  }
})


// Import the SettingEditor.vue view
import settingEditor from "@/views/SettingEditor.vue";

// Import the Vue constructor
import Vue from "vue";

// Create an event bus instance
export const bus = new Vue();


export default {
  components: {
    settingEditor
  },
  data() {
    return {
      form: {
        api_address: "/translate",
        source_lang: "auto",
        target_lang: "EN",
      },
      result: "",
      prev_text: "", // store the previous text
      prev_result: "", // store the previous result
      loading: false,
      showDrawer: false,
      auto_detect: false,
      can_translate: true,
      timeoutId: null,
      translatedImage: null,
      translatedText: null
    };
  },
  computed: {
    tstextStatus() {  //  计算属性
      return this.$store.state.tstext; //  Vuex 中定义的属性
    },
    apiAddressStatus() {  //  计算属性
      return this.$store.state.api_address; //  Vuex 中定义的属性
    },
    sourceLangStatus() {  //  计算属性
      return this.$store.state.source_lang; //  Vuex 中定义的属性
    },
    targetLangStatus() {  //  计算属性
      return this.$store.state.target_lang; //  Vuex 中定义的属性
    },
    autoDetect(){
      return this.$store.state.auto_detect;
    },
    languages() {
      return [
        {value: "auto", label: this.$t("auto")},
        {value: "DE", label: this.$t("German")},
        {value: "EN", label: this.$t("English")},
        {value: "ES", label: this.$t("Spanish")},
        {value: "FR", label: this.$t("French")},
        {value: "IT", label: this.$t("Italian")},
        {value: "JA", label: this.$t("Japanese")},
        {value: "NL", label: this.$t("Dutch")},
        {value: "PL", label: this.$t("Polish")},
        {value: "PT", label: this.$t("Portuguese")},
        {value: "RU", label: this.$t("Russian")},
        {value: "ZH", label: this.$t("Chinese")},
        {value: "BG", label: this.$t("Bulgarian")},
        {value: "CS", label: this.$t("Czech")},
        {value: "DA", label: this.$t("Danish")},
        {value: "EL", label: this.$t("Greek")},
        {value: "ET", label: this.$t("Estonian")},
        {value: "FI", label: this.$t("Finnish")},
        {value: "HU", label: this.$t("Hungarian")},
        {value: "LT", label: this.$t("Lithuanian")},
        {value: "LV", label: this.$t("Latvian")},
        {value: "RO", label: this.$t("Romanian")},
        {value: "SK", label: this.$t("Slovak")},
        {value: "SL", label: this.$t("Slovenian")},
        {value: "SV", label: this.$t("Swedish")}
      ];
    }
  },
  watch: {
    async tstextStatus() {
      this.loading = true
      // 清除之前的延迟调用
      clearTimeout(this.timeoutId);

      // 设置新的延迟调用
      this.timeoutId = setTimeout(async () => {
        // 需要调用的方法
        // 判断是否智能切换
        if (this.$store.state.auto_detect) {
          await this.auto_detect_metion();
          await this.translate();
        } else {
          await this.translate();
        }
        this.loading = false;
      }, 400);
    },
    apiAddressStatus() {
      this.translate();  //   需要调用的方法
    },
    sourceLangStatus() {
      //自动保存
      window.saveConfig("sourceLang", store.state.source_lang)
      this.translate(false);  //   需要调用的方法
    },
    targetLangStatus() {
      //自动保存

      window.saveConfig("targetLang", store.state.target_lang)
      this.translate(false);  //   需要调用的方法
    },
    autoDetect(){
      window.saveConfig("autoDetect", store.state.auto_detect)
    },
    translatedText() {
      this.forceUpdate(); // 当 translatedText 变化时强制刷新
    }
  },
  methods: {
    async translate(checkPrev = true) {
      if (!this.can_translate) {
        return
      }

      if (store.state.tstext.length === 0) {
        this.result = ""
        return;
      }

      if (checkPrev && store.state.tstext === this.prev_text) {
        this.result = this.prev_result;
        return;
      }
      this.loading = true

      this.$set(this.form, "text", store.state.tstext)
      this.$set(this.form, "api_address", store.state.api_address)
      this.$set(this.form, "source_lang", store.state.source_lang)
      this.$set(this.form, "target_lang", store.state.target_lang)
      this.$set(this.form, "api_type", store.state.api_type)
      this.$set(this.form, "api_token", store.state.api_token)
      this.$set(this.form, "api_key", store.state.api_key)
      this.$set(this.form, "openai_api_address", store.state.openai_api_address)
      this.$set(this.form, "openai_api_token", store.state.openai_api_token)
      this.$set(this.form, "openai_model", store.state.openai_model)
      this.$set(this.form, "openai_custom_model", store.state.openai_custom_model)
      this.$set(this.form, "deepl_api_token", store.state.deepl_api_token)

      try {
        let response;
        if (this.form.api_type === 'deeplx') {
          response = await fetch(this.form.api_address, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.form)
          });
        } else if (this.form.api_type === 'deepseek') {
          const prompt = `Translate the following text from ${this.form.source_lang} to ${this.form.target_lang}:\n\n${this.form.text}\n\nTranslation:`;
          response = await fetch('https://api.deepseek.com/chat/completions', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.form.api_token}`
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [
                {role: "system", content: "You are a professional translator."},
                {role: "user", content: prompt}
              ],
              temperature: 0.3,
              max_tokens: 2000
            })
          });
        } else if (this.form.api_type === 'google_api') {
          response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.form.api_key}`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              q: this.form.text,
              source: this.form.source_lang,
              target: this.form.target_lang,
              format: 'text'
            })
          });
        } else if (this.form.api_type === 'google_free') {
          // 使用免费的谷歌翻译API
          response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${this.form.source_lang}&tl=${this.form.target_lang}&dt=t&q=${encodeURIComponent(this.form.text)}`);
        } else if (this.form.api_type === 'openai') {
          
          const model = this.form.openai_custom_model || this.form.openai_model;
          const prompt = `Translate the following text from ${this.form.source_lang} to ${this.form.target_lang}:\n\n${this.form.text}\n\nTranslation:`;
          response = await fetch(`${this.form.openai_api_address}/v1/chat/completions`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.form.openai_api_token}`
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {role: "system", content: "You are a professional translator."},
                {role: "user", content: prompt}
              ],
              temperature: 0.3,
              max_tokens: 1000
            })
          });
        } else if (this.form.api_type === 'deepl_official') {
          response = await fetch('https://api-free.deepl.com/v2/translate', {
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `DeepL-Auth-Key ${this.form.deepl_api_token}`
            },
            body: new URLSearchParams({
              text: this.form.text,
              source_lang: this.form.source_lang,
              target_lang: this.form.target_lang
            })
          });
        }

        let data = await response.json();
        if (this.form.api_type === 'deeplx' && data.code === 200) {
          this.result = data.data;
        } else if (this.form.api_type === 'deepseek' && data.choices && data.choices.length > 0) {
          this.result = data.choices[0].message.content.trim();
        } else if (this.form.api_type === 'google_api' && data.data && data.data.translations) {
          this.result = data.data.translations[0].translatedText;
        } else if (this.form.api_type === 'google_free' && data[0] && data[0][0] && data[0][0][0]) {
          this.result = data[0][0][0];
        } else if (this.form.api_type === 'openai' && data.choices && data.choices.length > 0) {
          this.result = data.choices[0].message.content.trim();
        } else if (this.form.api_type === 'deepl_official' && data.translations && data.translations.length > 0) {
          this.result = data.translations[0].text;
        } else {
          throw new Error('Translation failed');
        }

        this.loading = false;
        this.prev_text = store.state.tstext;
        this.prev_result = this.result;
      } catch (error) {
        console.error(error);
        this.$message.error(this.$t('translationFailed'));
        this.can_translate = false;
        setTimeout(() => {
          this.can_translate = true;
        }, 1000);
      } finally {
        this.loading = false;
      }
    },
    async auto_detect_metion() {
      await fetch("https://api.edenai.run/v2/translation/language_detection", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzgwYzlhZGQtYzlkOS00NjVkLWE3MWEtZGU0OTc1NDVhZDUxIiwidHlwZSI6ImFwaV90b2tlbiJ9.IJJI9CtRUeANKdpzE5eynkB3QbE0a13LOpiVzuTGyDM",
          "content-type": "application/json"
        },
        body: JSON.stringify({
          "response_as_dict": true,
          "attributes_as_list": false,
          "show_original_response": false,
          "providers": "amazon",
          "text": store.state.tstext
        })
      })
          .then(response => response.json())
          .then(data => {
            // 处理响应数据
            if (data.amazon.status === "success" && data.amazon.items.length > 0) {
              const language = (data.amazon.items[0].language).toUpperCase();
              // 根据语言类型设置源语言和目标语言
              if (language === store.state.target_lang) {
                if (store.state.source_lang === "auto") {
                  store.commit("setsourceLanguage", language);
                } else {
                  let temp = store.state.source_lang;
                  store.commit("setsourceLanguage", store.state.target_lang);
                  store.commit("settargetLanguage", temp);
                }
              } else {
                store.commit("setsourceLanguage", language);
              }
            }
          })
          .catch(error => {
            console.error(error);
            // Delay for 1 second before retrying the translation

          });
    },
    copyOnly() {

      window.mcopy(this.result)
      this.$message.success(this.$t('copySuccessful'));
    },
    copyAndHide() {

      window.mcopyHide(this.result)
    },
    copyAndInput() {

      window.mcopyHideEnter(this.result)
    },
    saveConfig() {

      window.saveConfig(this.form.api_address);
    },
    swapLanguages() {
      let temp = store.state.source_lang;
      // console.log(temp)
      if (temp === "auto") {
        this.$message.error(this.$t('autoSwapFailed'));
        return
      }
      store.commit("setsourceLanguage", store.state.target_lang)
      store.commit("settargetLanguage", temp)
    },
    loadPictureText(){
      const result = window.utools.dbStorage.getItem("img_tred");
        if (result && result.success) {
          // 输出result
          this.translatedText = result.translatedText;
          this.result = result.translatedText;
            this.$message.success(`翻译成功，源语言: ${result.detectedSourceLanguage}`);
            this.forceUpdate(); // 强制刷新
        } else {
            this.$message.error(result ? result.error : "翻译失败");
        }
    },
    async captureAndTranslate() {
        const targetLang = this.$store.state.image_target_lang;
        const googleImageApiKey = this.$store.state.google_image_api_key;
        await window.captureAndTranslateImage(targetLang, googleImageApiKey);
        
    },
    forceUpdate() {
      this.$forceUpdate();
    }
  },
  mounted() {
    function loadSetting() {
      let api_type = window.getConfig("apiType")
      let api_address = window.getConfig("apiAddress")
      let api_token = window.getConfig("apiToken")
      let api_key = window.getConfig("apiKey")
      let source_lang = window.getConfig("sourceLang")
      let target_lang = window.getConfig("targetLang")
      let auto_detect = window.getConfig("autoDetect")
      let openai_endpoint_type = window.getConfig("openaiEndpointType")
      let openai_api_address = window.getConfig("openaiApiAddress")
      let openai_api_token = window.getConfig("openaiApiToken")
      let openai_model_type = window.getConfig("openaiModelType")
      let openai_custom_model = window.getConfig("openaiCustomModel")
      let deepl_api_token = window.getConfig("deeplApiToken")
      let google_image_api_key = window.getConfig("googleImageApiKey")
      let image_target_lang = window.getConfig("imageTargetLang")

      store.commit("setApiType", api_type)
      store.commit("setapiAddress", api_address)
      store.commit("setApiToken", api_token)
      store.commit("setApiKey", api_key)
      store.commit("setsourceLanguage", source_lang)
      store.commit("settargetLanguage", target_lang)
      store.commit("setautodetect", auto_detect)
      store.commit("setOpenaiEndpointType", openai_endpoint_type)
      store.commit("setOpenaiApiAddress", openai_api_address)
      store.commit("setOpenaiApiToken", openai_api_token)
      store.commit("setOpenaiModelType", openai_model_type)
      store.commit("setOpenaiCustomModel", openai_custom_model)
      store.commit("setDeeplApiToken", deepl_api_token)
      store.commit("setGoogleImageApiKey", google_image_api_key)
      store.commit("setImageTargetLang", image_target_lang)
    }

    loadSetting();


    // this.form.api_address = apiaddr
    // Listen for the close-drawer event from the event bus
    bus.$on("close-drawer", () => {
      // Set the showDrawer property to false
      this.showDrawer = false;
    });

  }
};


</script>

<style scoped>

.container {
  width: 700px;
  margin: 0 auto;
}

.buttons {
  width: 700px;
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 10px;

}

.setting-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
</style>

