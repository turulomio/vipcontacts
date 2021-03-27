import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

import VueRouter from 'vue-router';

Vue.use(VueRouter);

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
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
