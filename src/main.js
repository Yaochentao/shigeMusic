import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './assets/css/reset.css'
import './assets/iconfont/iconfont.css'

import Axios from 'axios'
Axios.defaults.baseURL = 'http://116.62.124.130:3000';
Vue.prototype.$http = Axios;

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
