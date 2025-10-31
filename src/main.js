import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import SignInModal from '@/components/sign-in-modal.vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

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

app.mount('#app')
