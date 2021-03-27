import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(Vuex);

var mem={
    token:null,
  };
export const store = new Vuex.Store({
  state: {
    user: "user",
    pass: "pass",
  },
})
import About from './components/about';
import Home from './components/views/home';
import HelloWorld from './components/HelloWorld';

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Home },
    { path: '/helloworld', component: HelloWorld },
    { path: '/about', component: About },
  ]
});


new Vue({
    store:store,
    router,
    data: mem,
    vuetify,
    render: h => h(App)
}).$mount('#app')
