import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 引入store文件
import store from './store'
import fastclick from 'fastclick'
import Vuelazyload from 'vue-lazyload'

import 'common/stylus/index.styl'

// 设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

fastclick.attach(document.body)

Vue.use(Vuelazyload, {
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 初始化vuex
  render: h => h(App)
})
