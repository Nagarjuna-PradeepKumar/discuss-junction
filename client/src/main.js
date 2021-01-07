import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "./plugins/axios";
import io from "socket.io-client";
import Cookies from "universal-cookie";
const cookies = new Cookies();

Vue.prototype.$connectSocketio = async function() {
  Vue.prototype.$socket = io.connect("https://discussjunction.herokuapp.com", {
    query: {
      token: cookies.get("token"),
    },
  });
};

Vue.prototype.$disconnectSocketio = async function() {
  if (this.$socket) this.$socket.disconnect();
};

Vue.config.productionTip = false;
Vue.use(axios);
new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
