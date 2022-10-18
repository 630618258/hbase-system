import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import gets from '@/axios/gets'
import posts from '@/axios/posts'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)


// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

axios.defaults.headers["Content-Type"] = "application/json";


//使用axios
Vue.prototype.axios = axios
//axios携带token
// 添加请求拦截器，在请求头中加token
axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('token')) {
            config.headers.token = localStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });


// axios.defaults.baseURL = 'http://192.168.3.184:8081'
axios.defaults.baseURL = 'http://192.168.10.118:8081'
Vue.prototype.axios = axios
Vue.prototype.gets = gets
Vue.prototype.posts = posts

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
