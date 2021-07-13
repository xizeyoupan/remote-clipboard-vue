import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import { Button, Form, FormItem, Input, Message, Container, Main, Header, Aside, Footer, Row, Col } from 'element-ui'
import http from './utils/http'

Vue.prototype.$http = http;
Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Footer)
Vue.use(Col)
Vue.use(Row)
Vue.prototype.$message = Message


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

