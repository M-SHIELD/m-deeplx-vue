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
    <!-- 智能截图翻译按钮 -->
    <el-button type="primary" @click="captureAndTranslate" :loading="loading">{{ $t('captureAndTranslate') }}</el-button>
    <el-button type="primary" @click="simulateInput">{{ $t('simulateInput') }}</el-button>
    <el-button type="primary" @click="loadLastTranslation">{{ $t('loadPictureText') }}</el-button>
    
    <!-- 显示翻译结果区域 -->
    <div v-if="translatedText" style="margin-top: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; background-color: #f9f9f9;">
      <h3>{{ $t('translationResult') }}:</h3>
      <p>{{ translatedText }}</p>
    </div>
  </div>
</template>

<script>
import store from '@/store'

if (window.pluginRuntime && typeof window.pluginRuntime.onPluginEnter === 'function') {
  window.pluginRuntime.onPluginEnter(({code, type, payload}) => {
    console.log('用户进入插件应用', code, type, payload)
    if (type === "over") {
      store.commit('settstext', payload)
    }
  })
}


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
      this.$set(this.form, "openai_model_type", store.state.openai_model_type)
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
          
          let model;
          if (this.form.openai_model_type === 'custom') {
            model = this.form.openai_custom_model;
          } else {
            model = this.form.openai_model_type;
          }
          
          const prompt = `Translate the following text from ${this.form.source_lang} to ${this.form.target_lang}. Maintain the exact same formatting, including paragraphs, line breaks, and punctuation:\n\n${this.form.text}`;
          response = await fetch(`${this.form.openai_api_address}/v1/chat/completions`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.form.openai_api_token}`
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {role: "system", content: "You are a professional translator. Translate the text accurately while preserving the exact original format, including paragraphs, line breaks, and punctuation. Only return the translated text without any additional explanations or metadata."},
                {role: "user", content: prompt}
              ],
              temperature: 0.2,
              max_tokens: 2000
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
        } else if (this.form.api_type === 'google_free' && data[0]) {
          // 处理谷歌免费翻译API的响应
          let translatedText = '';
          // 将多个翻译片段拼接在一起以保留格式
          for (let i = 0; i < data[0].length; i++) {
            if (data[0][i][0]) {
              translatedText += data[0][i][0];
            }
          }
          this.result = translatedText;
        } else if (this.form.api_type === 'openai' && data.choices && data.choices.length > 0) {
          // 移除可能的前缀，如"Translation:"
          let translatedText = data.choices[0].message.content.trim();
          if (translatedText.startsWith("Translation:")) {
            translatedText = translatedText.substring("Translation:".length).trim();
          }
          this.result = translatedText;
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
    simulateInput() {
      // 直接调用utools的输入功能，将输入框内容输出
      if (this.$store.state.tstext && this.$store.state.tstext.length > 0) {
        window.mcopyHideEnter(this.$store.state.tstext);
        this.$message.success(this.$t('inputSuccessful'));
      } else {
        this.$message.warning(this.$t('noInputText'));
      }
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
      const result = window.getConfig("img_tred");
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
        let targetLang = this.$store.state.image_target_lang;
        const googleImageApiKey = this.$store.state.google_image_api_key;
        
        // 清空之前的翻译结果
        this.translatedText = null;
        this.result = "";
        
        // 如果没有设置目标语言，则使用翻译功能的目标语言
        if (!targetLang) {
            targetLang = this.$store.state.target_lang.toLowerCase();
            if (targetLang === "auto") {
                // 如果目标语言是自动检测，则默认使用英语
                targetLang = "en";
            }
        }
        
        this.loading = true;
        try {
            // 等待截图翻译完成并获取结果
            console.log("开始截图翻译，目标语言:", targetLang);
            const result = await window.captureAndTranslateImage(targetLang, googleImageApiKey);
            console.log("截图翻译结果:", JSON.stringify(result));
            
            if (result && result.success) {
                // 确保translatedText不为空
                if (!result.translatedText || result.translatedText.trim() === "") {
                    console.error("翻译结果为空字符串");
                    this.$message.error(this.$t('translationFailed') + ": 翻译结果为空");
                    return;
                }
                
                // 直接显示翻译结果
                console.log("设置翻译文本:", result.translatedText);
                this.translatedText = result.translatedText;
                this.result = result.translatedText;
                console.log("设置翻译结果后的状态:", {
                    translatedText: this.translatedText,
                    result: this.result
                });
                
                // 根据翻译情况显示不同的提示
                if (result.isRoundTripTranslation) {
                    // 如果是通过中介语言回译的情况
                    this.$message.success(`${this.$t('translationSuccessful')} (${this.$t('viaIntermediateLanguage')}), ${this.$t('sourceLanguage')}: ${result.detectedSourceLanguage}`);
                    console.log("中介翻译中间文本:", result.intermediateText);
                } else if (result.translationFallback) {
                    // 如果翻译回退到显示原文
                    this.$message.info(this.$t('sameLanguageDetected'));
                } else if (result.detectedSourceLanguage && 
                    ((result.detectedSourceLanguage === targetLang) || 
                    (result.detectedSourceLanguage.startsWith("zh") && targetLang.startsWith("zh")) ||
                    (result.detectedSourceLanguage.startsWith("en") && targetLang.startsWith("en")))) {
                    this.$message.info(this.$t('sameLanguageDetected'));
                } else {
                    this.$message.success(`${this.$t('translationSuccessful')}, ${this.$t('sourceLanguage')}: ${result.detectedSourceLanguage}`);
                }
                
                // 如果原文不为空且与当前输入文本不同，将原文设置到输入框
                if (result.originalText && this.$store.state.tstext !== result.originalText) {
                    this.$store.commit('settstext', result.originalText);
                }
                
                // 强制刷新组件
                this.$nextTick(() => {
                    console.log("强制刷新前的状态:", {
                        translatedText: this.translatedText,
                        result: this.result
                    });
                    this.forceUpdate();
                    console.log("强制刷新后的状态");
                });
            } else {
                // 显示详细的错误信息
                let errorMsg = result ? result.error : this.$t('translationFailed');
                
                if (result && result.apiResponse) {
                    console.error("API错误详情:", result.apiResponse);
                    errorMsg += " - API错误"; 
                }
                
                this.$message.error(errorMsg);
                
                // 如果有原始文本，仍然显示它
                if (result && result.originalText) {
                    this.$store.commit('settstext', result.originalText);
                }
            }
        } catch (error) {
            console.error("截图翻译出错:", error);
            this.$message.error("截图翻译出错: " + (error.message || error));
        } finally {
            this.loading = false;
        }
    },
    forceUpdate() {
      console.log("强制刷新组件");
      this.$forceUpdate();
    },
    loadLastTranslation() {
      try {
        const result = window.getConfig("img_tred");
        console.log("加载翻译结果:", result);
        
        if (result && result.success) {
          // 输出result
          console.log("设置翻译文本:", result.translatedText);
          this.translatedText = result.translatedText;
          this.result = result.translatedText;
          
          if (result.isRoundTripTranslation) {
            this.$message.success(`${this.$t('translationSuccessful')} (${this.$t('viaIntermediateLanguage')}), ${this.$t('sourceLanguage')}: ${result.detectedSourceLanguage}`);
          } else if (result.translationFallback) {
            this.$message.info(this.$t('sameLanguageDetected'));
          } else {
            this.$message.success(`${this.$t('translationSuccessful')}, ${this.$t('sourceLanguage')}: ${result.detectedSourceLanguage}`);
          }
          
          // 强制刷新组件
          this.$nextTick(() => {
            this.forceUpdate();
          });
        } else {
          this.$message.error(result ? result.error : this.$t('translationFailed'));
        }
      } catch (error) {
        console.error("加载翻译结果失败:", error);
        this.$message.error(this.$t('translationFailed') + ": " + error.message);
      }
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

    // 尝试加载最近一次的截图翻译结果
    try {
      const lastResult = window.getConfig("img_tred");
      console.log("加载最近一次翻译结果:", lastResult);
      if (lastResult && lastResult.success && lastResult.translatedText) {
        this.translatedText = lastResult.translatedText;
        this.result = lastResult.translatedText;
        console.log("已加载最近一次翻译结果");
      }
    } catch (error) {
      console.error("加载最近一次翻译结果失败:", error);
    }

    // this.form.api_address = apiaddr
    // Listen for the close-drawer event from the event bus
    bus.$on("close-drawer", () => {
      // Set the showDrawer property to false
      this.showDrawer = false;
    });

  },
  updated() {
    // 当组件更新后，检查翻译结果状态
    console.log("组件已更新，当前状态:", {
      translatedText: this.translatedText,
      result: this.result
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

