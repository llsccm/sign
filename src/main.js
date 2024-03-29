import Vue from 'vue'
import App from './App.vue'

// import store from './store'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

import router from './router'
// import axios from 'axios'

Vue.config.productionTip = false
// Vue.prototype.axios = axios
// Vue.use(ElementUI)

new Vue({
  router,
  // store,
  render: (h) => h(App)
}).$mount('#app')
