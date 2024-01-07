import {createApp} from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import i18n from './i18n'

// import * as echarts from "echarts"
import ECharts from 'vue-echarts'

import 'flag-icons/css/flag-icons.min.css'


import VueTelInput from 'vue-tel-input'
import 'vue-tel-input/vue-tel-input.css'

import { router } from './routes'
import { loadFonts } from './plugins/webfontloader'

document.title=import.meta.env.VITE_APP_TITLE

loadFonts()
const app=createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.component('v-chart', ECharts)
app.use(VueTelInput)
app.mount('#app')

