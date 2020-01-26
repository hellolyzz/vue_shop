import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入树形table组件
import TreeTable from 'vue-table-with-tree-grid'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 引入阿里图标库
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过 this.$http 发起 axios 请求
Vue.prototype.$http = axios
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

// 全局注册组件
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
