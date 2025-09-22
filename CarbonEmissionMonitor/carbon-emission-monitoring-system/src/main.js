import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible.js'
import mitt from 'mitt' 
// 创建事件总线
export const eventBus = mitt()

const app = createApp(App)
app.use(router)
// 提供事件总线给所有组件
app.provide('eventBus', eventBus)

app.mount('#app')