import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from "pinia"

import { Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import Notifications from '@kyvg/vue3-notification'

import router from './router'
const app = createApp(App)

app.use(Quasar, {
  plugins: {}
})
.use(router)
.use(Notifications)
.use(createPinia());

app.mount('#app')
