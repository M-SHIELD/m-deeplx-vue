<!-- In your setting.vue view -->
<template>
  <div class="setting-container">

    <!-- Add a form for various settings -->
    <el-form ref="settingsForm" :model="settings" label-width="120px">
      <el-form-item :label="$t('language')">
        <el-select v-model="language" :placeholder="$t('selectLanguage') " @change="changeLanguage">
          <el-option
              v-for="item in i18lgs"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item :label="$t('apiType')">
        <el-select v-model="settings.api_type" :placeholder="$t('selectApiType')">
          <el-option label="DeepLX" value="deeplx"></el-option>
          <el-option label="DeepL Official" value="deepl_official"></el-option>
          <el-option label="DeepSeek" value="deepseek"></el-option>
          <el-option label="Google (API)" value="google_api"></el-option>
          <el-option label="Google (Free)" value="google_free"></el-option>
          <el-option label="OpenAI" value="openai"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        v-if="settings.api_type === 'deeplx'"
        :rules="apiAddressRules" 
        prop="api_address" 
        :label="$t('apiAddress')"
      >
        <el-input v-model="settings.api_address" :placeholder="$t('enterApiAddress')"></el-input>
        <a href="javascript:void(0)" @click="openBrowserLink('https://github.com/OwO-Network/DeepLX')">{{ $t('deeplxApiDocs') }}</a>
      </el-form-item>

      <el-form-item 
        v-if="settings.api_type === 'deepl_official'"
        :rules="apiTokenRules" 
        prop="deepl_api_token" 
        :label="$t('apiToken')"
      >
        <el-input v-model="settings.deepl_api_token" :placeholder="$t('enterApiToken')"></el-input>
        <a href="javascript:void(0)" @click="openBrowserLink('https://www.deepl.com/docs-api')">{{ $t('getDeepLApiToken') }}</a>
      </el-form-item>

      <el-form-item 
        v-if="settings.api_type === 'deepseek'"
        :rules="apiTokenRules" 
        prop="api_token" 
        :label="$t('apiToken')"
      >
        <el-input v-model="settings.api_token" :placeholder="$t('enterApiToken')"></el-input>
        <a href="javascript:void(0)" @click="openBrowserLink('https://platform.deepseek.com/docs')">{{ $t('deepseekApiDocs') }}</a>
      </el-form-item>

      <el-form-item 
        v-if="settings.api_type === 'google_api'"
        :rules="apiKeyRules" 
        prop="api_key" 
        :label="$t('apiKey')"
      >
        <el-input v-model="settings.api_key" :placeholder="$t('enterApiKey')"></el-input>
        <a href="javascript:void(0)" @click="openBrowserLink('https://cloud.google.com/translate/docs')">{{ $t('googleApiDocs') }}</a>
      </el-form-item>

      <!-- Add Google Translate Image API Key setting -->
      <el-form-item 
        :rules="apiKeyRules" 
        prop="google_image_api_key" 
        :label="$t('googleImageApiKey')"
      >
        <el-input v-model="settings.google_image_api_key" :placeholder="$t('enterGoogleImageApiKey')"></el-input>
        <a href="javascript:void(0)" @click="openBrowserLink('https://cloud.google.com/translate/docs')">{{ $t('googleApiDocs') }}</a>
      </el-form-item>

      <!-- Add target language setting for image translation -->
      <el-form-item  :label="$t('imageTargetLanguage')">
        <el-select v-model="settings.image_target_lang" :placeholder="$t('selectTargetLanguage')">
          <el-option label="中文" value="zh"></el-option>
          <el-option label="English" value="en"></el-option>
          <!-- Add more languages as needed -->
        </el-select>
      </el-form-item>

      <template v-if="settings.api_type === 'openai'">
        <el-form-item :label="$t('apiEndpoint')">
          <el-radio-group v-model="settings.openai_endpoint_type">
            <el-radio label="official">{{ $t('officialEndpoint') }}</el-radio>
            <el-radio label="custom">{{ $t('customEndpoint') }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item 
          v-if="settings.openai_endpoint_type === 'custom'"
          :rules="apiAddressRules" 
          prop="openai_api_address" 
          :label="$t('apiAddress')"
        >
          <el-input v-model="settings.openai_api_address" :placeholder="$t('enterApiAddress')"></el-input>
        </el-form-item>

        <el-form-item 
          :rules="apiTokenRules" 
          prop="openai_api_token" 
          :label="$t('apiToken')"
        >
          <el-input v-model="settings.openai_api_token" :placeholder="$t('enterApiToken')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('modelName')">
          <el-select v-model="settings.openai_model_type" :placeholder="$t('selectModel')">
            <el-option label="gpt-3.5-turbo" value="gpt-3.5-turbo"></el-option>
            <el-option label="gpt-4" value="gpt-4"></el-option>
            <el-option label="gpt-4-32k" value="gpt-4-32k"></el-option>
            <el-option label="gpt-4-turbo" value="gpt-4-turbo"></el-option>
            <el-option label="gpt-4-1106-preview" value="gpt-4-1106-preview"></el-option>
            <el-option label="gpt-4-0125-preview" value="gpt-4-0125-preview"></el-option>
            <el-option label="gpt-4-vision-preview" value="gpt-4-vision-preview"></el-option>
            <el-option label="custom" value="custom">{{ $t('customModel') }}</el-option>
          </el-select>
          <el-input 
            v-if="settings.openai_model_type === 'custom'"
            v-model="settings.openai_custom_model" 
            :placeholder="$t('enterCustomModel')"
          ></el-input>
        </el-form-item>
      </template>

      <!-- Add a button to save the settings -->
      <el-button type="primary" @click="saveSettings">{{ $t('saveSettings') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import {bus} from "@/views/HomeView.vue"

export default {
  // Use the i18n instance in your component
  data() {
    return {
      // Add a data property to store the settings
      settings: {
        api_type: "deeplx",
        api_address: "",
        api_token: "",
        api_key: "",
        google_image_api_key: "",
        image_target_lang: "zh",
        openai_endpoint_type: 'official',
        openai_api_address: "https://api.openai.com",
        openai_api_token: "sk-xxxx",
        openai_model_type: "gpt-3.5-turbo",
        openai_custom_model: "gpt-4o-mini",
      },
      language: "zh",
      i18lgs: [
        {value: "zh", label: "中文"},
        {value: "EN", label: "English"},
      ],
      apiAddressRules: [
        {required: true, message: "请输入API地址", trigger: "blur"}
      ],
      apiTokenRules: [
        {required: true, message: "请输入API令牌", trigger: "blur"}
      ],
      apiKeyRules: [
        {required: true, message: "请输入API密钥", trigger: "blur"}
      ],
    };
  },
  methods: {
    // Add a method to save the settings
    saveSettings() {
      this.$refs.settingsForm.validate(valid => {
        if (valid) {
          // 表单验证通过，执行保存设置的逻辑

          window.saveConfig("apiType", this.settings.api_type);
          this.$store.commit("setApiType", this.settings.api_type);

          if (this.settings.api_type === 'deeplx') {
            window.saveConfig("apiAddress", this.settings.api_address);
            this.$store.commit("setapiAddress", this.settings.api_address);
          } else if (this.settings.api_type === 'deepl_official') {
            window.saveConfig("deeplApiToken", this.settings.deepl_api_token);
            this.$store.commit("setDeeplApiToken", this.settings.deepl_api_token);
          } else if (this.settings.api_type === 'deepseek') {
            window.saveConfig("apiToken", this.settings.api_token);
            this.$store.commit("setApiToken", this.settings.api_token);
          } else if (this.settings.api_type === 'google_api') {
            window.saveConfig("apiKey", this.settings.api_key);
            this.$store.commit("setApiKey", this.settings.api_key);
          } else if (this.settings.api_type === 'openai') {
            window.saveConfig("openaiEndpointType", this.settings.openai_endpoint_type);
            if (this.settings.openai_endpoint_type === 'custom') {
              window.saveConfig("openaiApiAddress", this.settings.openai_api_address);
            }
            window.saveConfig("openaiApiToken", this.settings.openai_api_token);
            window.saveConfig("openaiModelType", this.settings.openai_model_type);
            if (this.settings.openai_model_type === 'custom') {
              window.saveConfig("openaiCustomModel", this.settings.openai_custom_model);
            }
            this.$store.commit("setOpenaiEndpointType", this.settings.openai_endpoint_type);
            this.$store.commit("setOpenaiApiAddress", this.settings.openai_api_address);
            this.$store.commit("setOpenaiApiToken", this.settings.openai_api_token);
            this.$store.commit("setOpenaiModelType", this.settings.openai_model_type);
            this.$store.commit("setOpenaiCustomModel", this.settings.openai_custom_model);
          }

          window.saveConfig("language", this.language);
          this.$store.commit("setlanguage", this.language);

          
          window.saveConfig("googleImageApiKey", this.settings.google_image_api_key);
            this.$store.commit("setGoogleImageApiKey", this.settings.google_image_api_key);
            window.saveConfig("imageTargetLang", this.settings.image_target_lang);
            this.$store.commit("setImageTargetLang", this.settings.image_target_lang);

          // console.log("Saving settings:", this.settings);
          this.$message.success(this.$t("settingsSaved"));
          bus.$emit("close-drawer");
        } else {
          // 表单验证不通过，显示错误提示
          this.$message.error(this.$t("settingsSavedapiAddressErrorInfo"));
        }
      });


    },
    changeLanguage(value) {
      this.$i18n.locale = value;
    },
    openBrowserLink(url) {

      window.oepnUrl(url)
    }
  },
  mounted() {
    this.settings.api_address = this.$store.state.api_address

    this.settings.api_type = this.$store.state.api_type // 添加这行来加载保存的API类型
    
    this.settings.api_key = this.$store.state.api_key

    this.settings.api_token = this.$store.state.api_token // 添加这行来加载保存的API令牌

    this.language = this.$store.state.language

    if (this.$store.state.api_type === 'openai') {
      this.settings.openai_endpoint_type = this.$store.state.openai_endpoint_type;
      this.settings.openai_api_address = this.$store.state.openai_api_address;
      this.settings.openai_api_token = this.$store.state.openai_api_token;
      this.settings.openai_model_type = this.$store.state.openai_model_type;
      this.settings.openai_custom_model = this.$store.state.openai_custom_model;
    }

    this.settings.google_image_api_key = this.$store.state.google_image_api_key;
    this.settings.image_target_lang = this.$store.state.image_target_lang;
  }
};
</script>

<style scoped>

.setting-container {
  padding: 20px;
}
</style>
