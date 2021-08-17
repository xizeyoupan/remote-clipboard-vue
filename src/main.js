import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import {
    Image,
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Main,
    Header,
    Aside,
    Footer,
    Row,
    Col,
    ButtonGroup,
    MessageBox,
} from 'element-ui'
import {request} from './utils/http'

Vue.prototype.$http = request;
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
Vue.use(Image)
Vue.use(ButtonGroup)
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})

