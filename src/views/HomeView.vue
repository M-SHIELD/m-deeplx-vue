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
          <el-checkbox-button v-model="auto_detect">{{ $t('autoDetectButton') }}</el-checkbox-button>
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
            <el-button style="margin-left: 40px" circle type="primary" icon="el-icon-refresh" @click="swapLanguages"></el-button>
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
  </div>
</template>

<script>
import store from '@/store'
// eslint-disable-next-line no-undef
utools.onPluginEnter(({code, type, payload}) => {
  console.log('用户进入插件应用', code, type, payload)
  if (type === "over") {
    // Assign the payload field to the form.text property
    // eslint-disable-next-line no-unused-vars
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
      can_translate: true
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
    tstextStatus() {
      this.translate();  //   需要调用的方法
      //判断是否智能切换
      if (this.auto_detect) {
        this.auto_detect_metion()
      }
    }, apiAddressStatus() {
      this.translate();  //   需要调用的方法
    }, sourceLangStatus() {
      //自动保存
      // eslint-disable-next-line no-undef
      saveConfig("sourceLang", store.state.source_lang)
      this.translate(false);  //   需要调用的方法
    }, targetLangStatus() {
      //自动保存
      // eslint-disable-next-line no-undef
      saveConfig("targetLang", store.state.target_lang)
      this.translate(false);  //   需要调用的方法
    }
  },
  methods: {
    async translate(checkPrev = true) {
      if (!this.can_translate){
        return
      }

      // If the text to be translated is greater than 0, translate it. If the result is the same as the previous one, do not translate
      if (store.state.tstext.length === 0) {
        this.result = ""
        return;
      }

      // If the text is the same as the previous one, do not translate
      if (checkPrev && store.state.tstext === this.prev_text) {
        this.result = this.prev_result; // use the previous result
        return;
      }
      this.loading = true
      this.$set(this.form, "text", store.state.tstext)
      this.$set(this.form, "api_address", store.state.api_address)
      this.$set(this.form, "source_lang", store.state.source_lang)
      this.$set(this.form, "target_lang", store.state.target_lang)

      // Otherwise, call the translation function as usual
      try {
        let response = await fetch(this.form.api_address, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        });

        let data = await response.json();
        if (data.code === 200) {
          this.result = data.data;
          this.loading = false;
          // this.$message.success(this.$t('translationSuccessful'));

          // Update the previous text and result
          this.prev_text = store.state.tstext;
          this.prev_result = this.result;
        } else {
          this.$message.error(this.$t('translationFailed'));
          this.can_translate=false
          setTimeout(() => {
            this.can_translate=true
          }, 1000);
        }
      } catch (error) {
        console.error(error);
        this.$message.error(this.$t('translationFailed'));
        this.can_translate=false
        setTimeout(() => {
          this.can_translate=true
        }, 1000);
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
                let temp = store.state.source_lang
                store.commit("setsourceLanguage", store.state.target_lang);
                store.commit("settargetLanguage", temp);
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
      // eslint-disable-next-line no-undef
      mcopy(this.result)
      this.$message.success(this.$t('copySuccessful'));
    },
    copyAndHide() {
      // eslint-disable-next-line no-undef
      mcopyHide(this.result)
    },
    copyAndInput() {
      // eslint-disable-next-line no-undef
      mcopyHideEnter(this.result)
    },
    saveConfig() {
      // eslint-disable-next-line no-undef
      saveConfig(this.form.api_address);
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
  },
  mounted() {
    function loadSetting() {
      // eslint-disable-next-line no-undef
      let api = getConfig("apiAddress")
      // eslint-disable-next-line no-undef
      let source_lang = getConfig("sourceLang")
      // eslint-disable-next-line no-undef
      let target_lang = getConfig("targetLang")

      store.commit("setapiAddress", api)
      store.commit("setsourceLanguage", source_lang)
      store.commit("settargetLanguage", target_lang)
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

