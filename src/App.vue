<script setup>
import { onMounted } from 'vue'
import useUserStore from '@/stores/user.js'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

onMounted(async () => {
  if (localStorage.getItem('user')) {
    await userStore.login({})
  }
  if (userStore.userError) {
    toast.error(userStore.userError)
  }
})
</script>

<template>
  <div>
    <app-header />
    <router-view />
    <app-footer />
  </div>
</template>

<style scoped></style>
