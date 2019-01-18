// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router'
import routes from './routes'

import Vuebar from 'vuebar';
import HighlightJS from './directives/highlightjs';
import 'highlight.js/styles/atom-one-dark.css';

import '../assets/fonts/roboto.css';
import '../scss/app.scss';

Vue.config.productionTip = false;

Vue.use(HighlightJS);
Vue.use(Vuebar);
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history'
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
