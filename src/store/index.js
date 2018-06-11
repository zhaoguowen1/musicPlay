// 入口文件

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// logger插件（Vuex 自带日志插件）
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 设置调试工具(建议开发模式中使用)
const debug = process.env.NODE_ENV !== 'production'

// 注册Vuex工厂
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, // 严格模式
  plugins: debug ? [createLogger()] : [] // 调试日志
})