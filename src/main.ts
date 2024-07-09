import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

const app = createApp(App)

app.use(createPinia())

const i18n = createI18n({
  legacy: false,
  locale: window.navigator.language,
  fallbackLocale: 'en',
  messages: { en, ru }
})
app.use(i18n)

app.mount('#app')

document.querySelector('html')?.setAttribute('lang', window.navigator.language)
document.title = i18n.global.t('title')
