<!-- In your setting.vue view -->
<template>
  <div class="setting-container">
    <!-- Add a form for various settings -->
    <el-form :model="settings" label-width="120px">
      <el-form-item :label="$t('apiType')">
        <el-select v-model="settings.api_type" :placeholder="$t('selectApiType')">
          <el-option label="AI" value="ai"></el-option>
          <el-option label="DeepLX" value="deeplx"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('apiAddress')">
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
      }
    };
  },
  methods: {
    // Add a method to save the settings
    saveSettings() {
      // You can use your own logic here, such as calling an API or using localStorage
      // eslint-disable-next-line no-undef
      saveConfig("apiAddress",this.settings.api_address)
      this.$store.commit("setapiAddress",this.settings.api_address)

      // console.log("Saving settings:", this.settings);
      this.$message.success(this.$t("settingsSaved"));
      bus.$emit("close-drawer");
    }
  },
  mounted() {
    this.settings.api_address=this.$store.state.api_address
  }
};
</script>

<style scoped>

.setting-container {
  padding: 20px;
}
</style>
