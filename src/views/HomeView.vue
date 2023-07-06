<template>
  <div class="container">

    <h3>{{ $t('translationFunction') }}</h3>
    <el-form :model="form" label-width="100px">
      <el-form-item :label="$t('text') ">
        <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 6}"
            :placeholder="$t('enterText')"
            v-model="form.text"
            @blur="translate"
        >
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="6">
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
        </el-col>

        <el-col :span="8">
          <el-form-item :label="$t('sourceLanguage') ">
            <el-select v-model="form.source_lang" :placeholder="$t('selectSourceLanguage')">
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
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-refresh" @click="swapLanguages"></el-button>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('targetLanguage') ">
            <el-select v-model="form.target_lang" :placeholder="$t('selectTargetLanguage') ">
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
        <el-form-item :label="$t('apiAddress') ">
          <el-input v-model="form.api_address" :placeholder="$t('enterApiAddress') "></el-input>
        </el-form-item>
      </el-row>
      <el-row>

        <h3>{{ $t('translationResult') }}</h3>
        <el-input
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 6}"
            :placeholder=" $t('translatedText') "
            v-model="result"
            readonly
        >
        </el-input>

      </el-row>
      <div class="buttons">
        <el-button type="primary" @click="copyOnly">{{ $t('copyOnly') }}</el-button>
        <el-button type="primary" @click="copyAndHide">{{ $t('copyAndHide') }}</el-button>
        <el-button type="primary" @click="copyAndInput">{{ $t('copyAndInput') }}</el-button>
        <el-button type="primary" @click="saveConfig">{{ $t('saveConfig') }}</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
import Clipboard from 'clipboard'

export default {

  data() {
    return {
      form: {
        api_address: "/translate",
        text: "你好",
        source_lang: "auto",
        target_lang: "EN",
      },
      i18lgs: [
        {value: "zh", label: "中文"},
        {value: "EN", label: "English"},
      ],
      result: "",
      language: "zh"
    };
  },
  computed: {
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
  }
  ,
  methods: {
    async translate() {
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
          this.$message.success(this.$t('translationSuccessful'));
        } else {
          this.$message.error(this.$t('translationFailed'));
        }
      } catch (error) {
        console.error(error);
        this.$message.error(this.$t('translationFailed'));
      }
    },
    changeLanguage(value) {
      this.$i18n.locale = value;
    },
    copyOnly() {
      let clipboard = new Clipboard('.buttons', {
        text() {
          return this.result
        }
      });
      clipboard.on('success', () => {
        this.$message.success(this.$t('copied'));
      });
      clipboard.on('error', () => {
        this.$message.error(this.$t('copyFailed'));
      });
    },
    copyAndHide() {
      let clipboard = new Clipboard('.buttons', {
        text() {
          return this.result
        }
      });
      clipboard.on('success', () => {
        this.$message.success(this.$t('copied'));
        this.result = "";
      });
      clipboard.on('error', () => {
        this.$message.error(this.$t('copyFailed'));
      });
    },
    copyAndInput() {
      let clipboard = new Clipboard('.buttons', {
        text() {
          return this.result
        }
      });
      clipboard.on('success', () => {
        this.$message.success(this.$t('copied'));
        this.form.text = this.result;
      });
      clipboard.on('error', () => {
        this.$message.error(this.$t('copyFailed'));
      });
    },
    saveConfig() {
      // eslint-disable-next-line no-undef
      saveConfig(this.form.api_address);
    },
    swapLanguages() {
      let temp = this.form.source_lang;
      console.log(temp)
      if (temp === "auto") {
        this.$message.error(this.$t('autoSwapFailed'));
        return
      }
      this.form.source_lang = this.form.target_lang;
      this.form.target_lang = temp;
    }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    let apiaddr=getConfig()
    if (apiaddr!== undefined&&apiaddr.length>1){
      this.form.api_address=apiaddr
    }



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
</style>

