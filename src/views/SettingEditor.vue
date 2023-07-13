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
          <el-option label="AI" value="ai"></el-option>
          <el-option label="DeepLX" value="deeplx"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :rules="apiAddressRules" prop="api_address" :label="$t('apiAddress')">
        <el-input v-model="settings.api_address" :placeholder="$t('enterApiAddress')"></el-input>
      </el-form-item>

      <el-form-item :label="$t('apiToken')">
        <el-input v-model="settings.api_token" :placeholder="$t('enterApiToken')"></el-input>
      </el-form-item>
      <!-- Add a button to save the settings -->
      <el-button type="primary" @click="saveSettings">{{$t('saveSettings')}}</el-button>
    </el-form>
  </div>
</template>

<script>
import { bus } from "@/views/HomeView.vue"
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
        { required: true, message: "请输入API地址", trigger: "blur" },
        { pattern: /^https?:\/\/.*\/translate$/, message: "API地址格式不正确", trigger: "blur" }
      ],
    };
  },
  methods: {
    // Add a method to save the settings
    saveSettings() {
      this.$refs.settingsForm.validate(valid => {
        if (valid) {
          // 表单验证通过，执行保存设置的逻辑
          // eslint-disable-next-line no-undef
          saveConfig("apiAddress", this.settings.api_address);
          this.$store.commit("setapiAddress", this.settings.api_address);

          // eslint-disable-next-line no-undef
          saveConfig("language",this.language)
          this.$store.commit("setlanguage",this.language)

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
  },
  mounted() {
    this.settings.api_address=this.$store.state.api_address

    this.language=this.$store.state.language

  }
};
</script>

<style scoped>

.setting-container {
  padding: 20px;
}
</style>
