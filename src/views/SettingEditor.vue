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
          <el-option label="DeepSeek" value="deepseek"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item 
        v-if="settings.api_type === 'deeplx'"
        :rules="apiAddressRules" 
        prop="api_address" 
        :label="$t('apiAddress')"
      >
        <el-input v-model="settings.api_address" :placeholder="$t('enterApiAddress')"></el-input>
        <a href="javascript:void(0)"
           @click="openBrowserLink('https://obs.ake1.com/编程/如何创建deeplx代理服务器/')"
           target="_blank">查看API部署教程</a>
      </el-form-item>

      <el-form-item 
        v-if="settings.api_type === 'deepseek'"
        :rules="apiTokenRules" 
        prop="api_token" 
        :label="$t('apiToken')"
      >
        <el-input v-model="settings.api_token" :placeholder="$t('enterApiToken')"></el-input>
      </el-form-item>
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
        api_token: ""
      },
      language: "zh",
      i18lgs: [
        {value: "zh", label: "中文"},
        {value: "EN", label: "English"},
      ],
      apiAddressRules: [
        {required: true, message: "请输入API地址", trigger: "blur"},
        {pattern: /^https?:\/\/.*\/translate$/, message: "API地址格式不正确", trigger: "blur"}
      ],
      apiTokenRules: [
        {required: true, message: "请输入API令牌", trigger: "blur"}
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
          } else if (this.settings.api_type === 'deepseek') {
            window.saveConfig("apiToken", this.settings.api_token);
            this.$store.commit("setApiToken", this.settings.api_token);
          }

          window.saveConfig("language", this.language);
          this.$store.commit("setlanguage", this.language);

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

    this.settings.api_token = this.$store.state.api_token // 添加这行来加载保存的API令牌

    this.language = this.$store.state.language

  }
};
</script>

<style scoped>

.setting-container {
  padding: 20px;
}
</style>
