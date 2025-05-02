import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import VueApexCharts from "vue3-apexcharts";

import { Quasar, Notify, Loading, Dialog, IconSet } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import Notifications from "@kyvg/vue3-notification";
import quasarIconSet from "quasar/icon-set/material-icons";

import router from "./router";
import { Icon } from "lucide-vue-next";
const app = createApp(App);

app
  .use(Quasar, {
    plugins: {
      Notify,
      Dialog,
      Loading
    },
    config: {
      brand: {
        primary: '#ff6600',
        // secondary: '#1d1d1d',
        accent: '#ffffff',
        dark: '#1d1d1d',
        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037'
      },
    },
    IconSet: quasarIconSet,
  })
  .use(router)
  .use(Notifications)
  .use(createPinia())
  .use(VueApexCharts);

app.mount("#app");
