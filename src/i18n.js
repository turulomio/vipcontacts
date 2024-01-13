import {createI18n} from 'vue-i18n'

import json_es from './locales/es.json'





// 2. Create i18n instance with options
const i18n=createI18n({
  globalInjection: true,
  legacy:true,
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  silentFallbackWarn: true,

  silentTranslationWarn: true,

  messages:{
    es:json_es
  }
})

export default i18n