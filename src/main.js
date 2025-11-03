import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import SignInModal from '@/components/sign-in-modal.vue'
import AppHeader from '@/components/app-header.vue'

const toastOptions = {
  transition: 'Vue-Toastification__fade',
  maxToasts: 1,
  newestOnTop: true,
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter((t) => t.type === toast.type).length !== 0) {
      return false
    }
    return toast
  },
}

const app = createApp(App).use(createPinia()).use(router).use(Toast, toastOptions)

app.component('sign-in', SignInModal)
app.component('header-top', AppHeader)

app.mount('#app')
