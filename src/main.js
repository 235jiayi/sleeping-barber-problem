import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./reset.css";
import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";
import animate from "animate.css";

Vue.use(animate);
Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
