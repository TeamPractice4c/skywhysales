import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SignUpView from '@/views/SignUpView.vue'
import useUserStore from '@/stores/user.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUpView,
    },
    {
      path: '/users/:id',
      name: 'User',
      component: () => import('../views/UserView.vue'),
      meta: { isLoginNeeded: true },
    }
  ],
})



router.beforeEach((to, from) => {
  const userStore = useUserStore()

  if (to.meta.isLoginNeeded && !userStore.currentUser) {
    return { name: 'Home' }
  }

  if (to.meta.isLoginNeeded && !to.path.includes(userStore.currentUser.uId)) {
    return { name: 'Home' }
  }
})

export default router
