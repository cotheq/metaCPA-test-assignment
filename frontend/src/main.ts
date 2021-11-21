import Vue from "vue";
import Maska from "maska";
import App from "./App.vue";
import store from "./store";
import vuetify from "./plugins/vuetify";

import VueCompositionAPI from "@vue/composition-api";

Vue.use(VueCompositionAPI);
Vue.use(Maska);
Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

