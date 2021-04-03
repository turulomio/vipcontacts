import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import i18n from './i18n'

Vue.config.productionTip = false

import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(Vuex);
  
export const store = new Vuex.Store({
  state: {
    token:null,
    logged:false,
    apiroot: "http://192.168.1.100:8001",
    catalogs: {
        addresstype: [],
        countries: [],
        persongender: [],
        mailtype: [],
        phonetype: [],
        logtype: [],
    },
  },
})
import About from './components/about';
import Home from './components/Home';
import PersonAdd from './components/PersonAdd';
import PersonEdit from './components/PersonEdit';

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
    { path: '/person/add', name: 'person_add', component: PersonAdd },
    { path: '/person/edit/', name: 'person_edit', component: PersonEdit, props: true },
  ]
});


new Vue({
    i18n,
    store:store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')





