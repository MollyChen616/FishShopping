import Vue from 'vue'
import App from './App'
import api from './common/utils/config.js'
import http from './common/utils/http.js'
import filter from './common/utils/filter.js'
import util from './common/utils/util.js'
import urlqs from './common/utils/urlqs.js'
import './common/utils/getui.js'

Vue.config.productionTip = false
Vue.prototype.api = api
Vue.prototype.http = http
Vue.prototype.$filter = filter
Vue.prototype.$util = util
Vue.prototype.$qs = urlqs

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
