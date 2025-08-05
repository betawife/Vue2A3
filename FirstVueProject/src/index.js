// 引入Vue核心库与App组件
import Vue from 'vue'
import App from './App.vue'

// 创建vm实例
new Vue({
  el: '#app',
//  挂载App组件
  render: h => h(App)
})