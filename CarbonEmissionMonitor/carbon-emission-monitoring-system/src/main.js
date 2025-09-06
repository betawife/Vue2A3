import { createApp } from 'vue'
import App from './App.vue'
import 'lib-flexible/flexible.js'
import mitt from 'mitt'

const app = createApp(App)
app.mount('#app')
const eventBus = mitt(); // 创建全局事件
export default eventBus;
