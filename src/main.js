import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import i18n from './i18n'
import VueRouter from 'vue-router';

import "echarts";
import ECharts from 'vue-echarts'
Vue.component('v-chart', ECharts)



import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';
Vue.use(VueTelInput);

Vue.use(VueRouter);
Vue.use(Vuex);

import {store} from './store.js'
import About from './components/about';
import Home from './components/Home';
import GroupMembers from './components/GroupMembers';
import PersonView from './components/PersonView';
import PersonLastEditions from './components/PersonLastEditions';
import Settings from './components/Settings';
import Statistics from './components/Statistics';
import TableTypes from './components/TableTypes.vue';




const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/home/`, name: 'home', component: Home },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/about/`, name: 'about', component: About },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/settings/`, name: 'settings', component: Settings },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/statistics/`, name: 'statistics', component: Statistics },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/group/members/`, name: 'group_members', component: GroupMembers },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/person/edit/`, name: 'person_edit', component: PersonView, props: true },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/person/lasteditions/`, name: 'person_last_edited', component: PersonLastEditions },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/administration/types/`, name: 'administration_types', component: TableTypes},
  ]
});

// MIXIN GLOBAL
import {localtime,myheaders,myheaders_noauth, parseResponse,parseResponseError,getLocalStorage,myheaders_formdata} from './functions.js'
import {RulesString,RulesEmail} from './components/reusing/rules.js'

Vue.mixin({
  methods: {
    localtime,
    myheaders,
    myheaders_formdata,
    myheaders_noauth,
    parseResponse,
    parseResponseError,
    getLocalStorage,
    RulesString,
    RulesEmail,
  }
})


const app=new Vue({
  i18n,
  store:store,
  router,
  vuetify,
  render: h => h(App)
})
store.$app = app
app.$mount('#app')

