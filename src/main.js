import Vue from 'vue';
import App from './App.vue';
// import router from './router';
import 'babel-polyfill'

export const eventBus = new Vue()
// 3. 创建 router 实例，然后传 `routes` 配置
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  // router
}).$mount('#app');
