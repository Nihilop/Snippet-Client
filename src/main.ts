import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import { createI18n } from 'vue-i18n'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import Markdown from 'vue3-markdown-it'
import 'highlight.js/styles/monokai.css'
import CountryFlag from 'vue-country-flag-next'
const french = require('./locales/fr.json')
const english = require('./locales/en.json')
// NOTE : For add any languages, link by a const the language stored in locales folder and add it in messages below
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr: french,
    en: english
  }
})

Axios.interceptors.response.use(
  (response: any) => {
    return response
  }, function (error: any) {
    console.log(error.response.data)
    const { response: { status, data } } = error
    if (status === 401) {
      store.dispatch('auth/logout')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(store)
app.use(router)
app.use(i18n)
app.component('Markdown', Markdown)
app.component('country-flag', CountryFlag)
app.mount('#app')
