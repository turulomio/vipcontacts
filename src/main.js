import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import i18n from './i18n'
import VueRouter from 'vue-router';

import "echarts";
import ECharts from 'vue-echarts'
Vue.component('v-chart', ECharts)

Vue.use(VueRouter);
Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token:null,
        logged:false,
        version: "0.3.0",
        versiondate: new Date(2021, 3, 23, 9, 22),
        apiroot: process.env.VUE_APP_DJANGO_VIPCONTACTS_URL,
        publicPath: process.env.VUE_APP_PUBLIC_PATH,
        catalogs: {
            addresstype: [],
            countries: [],
            persongender: [],
            mailtype: [],
            phonetype: [],
            logtype: [],
            mimetype:[],
        },
        lastsearch: "",
    },
})
import About from './components/about';
import Home from './components/Home';
import GroupMembers from './components/GroupMembers';
import PersonAdd from './components/PersonAdd';
import PersonEdit from './components/PersonEdit';
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
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/person/add/`, name: 'person_add', component: PersonAdd },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/person/edit/`, name: 'person_edit', component: PersonEdit, props: true },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/person/lasteditions/`, name: 'person_last_edited', component: PersonLastEditions },
    { path: `${process.env.VUE_APP_PUBLIC_PATH}/administration/types/`, name: 'administration_types', component: TableTypes},
  ]
});

// MIXIN GLOBAL
import {myheaders,parseResponse,parseResponseError,getLocalStorage,myheaders_formdata} from './functions.js'

Vue.mixin({
  methods: {
    myheaders,
    myheaders_formdata,
    parseResponse,
    parseResponseError,
    getLocalStorage,
  }
})

new Vue({
    i18n,
    store:store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')




