// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router'
import routes from './routes'

import Vuebar from 'vuebar';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

import '../assets/fonts/roboto.css';
import '../scss/app.scss';

Vue.config.productionTip = false;

Vue.use(Vuebar);
Vue.use(VueRouter);
Vue.use(hljs.vuePlugin)

const router = new VueRouter({
  base: '/hit-info/info-ws17/Fischertechnik-Software-HMI/data/webIDEwebversion-1.1/',
  routes,
  mode: 'hash'
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
