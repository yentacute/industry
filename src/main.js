import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import AOS from "aos";
import "aos/dist/aos.css";
import i18n from "./i18n";
import store from "./state/store";
import BootstrapVue3 from "bootstrap-vue-3";
import vClickOutside from "click-outside-vue3";
import VueApexCharts from "vue3-apexcharts";

import Maska from "maska";
import { setRouter } from "./router/admin.js";

import { callOptionsMap } from "./common/map/function_map";

import VueFeather from "vue-feather";

import "@/assets/scss/config/default/app.scss";
import "@vueform/slider/themes/default.css";
import "@/assets/scss/mermaid.min.css";

const pinia = createPinia();



// FakeBackend authentication
// import { configureFakeBackend } from './helpers/fake-backend';
// configureFakeBackend();

// Firebase authentication
// import { initFirebaseBackend } from './authUtils';

// const firebaseConfig = {
//     apiKey: process.env.VUE_APP_APIKEY,
//     authDomain: process.env.VUE_APP_AUTHDOMAIN,
//     databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
//     projectId: process.env.VUE_APP_PROJECTId,
//     storageBucket: process.env.VUE_APP_STORAGEBUCKET,
//     messagingSenderId: process.env.VUE_APP_MEASUREMENTID
// };

// initFirebaseBackend(firebaseConfig);

AOS.init({
  easing: "ease-out-back",
  duration: 1000,
});

async function createAppCustome() {
  await callOptionsMap();
  const ROUTERADMIN = await setRouter();
  ROUTERADMIN.forEach((item) => {
    router.addRoute(item);
  });
  createApp(App)
    .use(store)
    .use(router)
    .use(VueApexCharts)
    .use(BootstrapVue3)
    .component(VueFeather.type, VueFeather)
    .use(Maska)
    .use(i18n)
    .use(pinia)
    .use(vClickOutside)
    .mount("#app");
}
createAppCustome();



