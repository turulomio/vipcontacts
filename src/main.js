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
    logged:false
  },
})
import About from './components/about';
import Home from './components/views/home';
import PersonAdd from './components/PersonAdd';

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/person/add', component: PersonAdd },
  ]
});


new Vue({
    i18n,
    store:store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
