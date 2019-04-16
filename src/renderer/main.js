import './utils/promise.fill'
import Vue from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import Stores from 'electron-store'
import VueEvents from 'vue-events'
import { JiraPlugin } from './utils/jira'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.dayjs = Vue.prototype.$dayjs = dayjs
Vue.stores = Vue.prototype.$stores = new Stores()
Vue.config.productionTip = false

Vue.use(VueEvents)
Vue.use(JiraPlugin)
Vue.use(ElementUI, { size: 'small' })

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
