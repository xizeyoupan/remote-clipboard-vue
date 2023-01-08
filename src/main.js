import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { request } from './utils/http'

const app = createApp(App)
app.config.globalProperties.$http = request
app.use(router).use(ElementPlus).mount('#app')
