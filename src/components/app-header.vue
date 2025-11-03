<script setup>
import useUserStore from '@/stores/user.js'
import { ref } from 'vue'

const store = useUserStore()

const showAuth = ref(false)

const closeModal = () => {
  showAuth.value = false
}
</script>

<template>
  <div class="header">
    <router-link to="/">
      <img style="justify-self: flex-start" src="../assets/icons/logo.svg" alt="" />
    </router-link>
    <div class="header-actions">
      <p class="action">Полеты</p>
      <p class="action" v-if="store.currentUser">Мои полеты</p>
      <p class="action" v-else @click="showAuth = true">Войти</p>
      <p class="action" v-if="store.currentUser">Мой аккаунт</p>
      <button type="button" class="action action-btn" v-else>Зарегистрироваться</button>
    </div>
    <teleport to="body">
      <sign-in ref="modal" :show="showAuth" @close="closeModal"></sign-in>
    </teleport>
  </div>
</template>

<style scoped>
@font-face {
  font-family: 'Nunito-sans';
  src: url('../assets/fonts/NunitoSans.ttf');
}

* {
  font-family: 'Nunito-sans', sans-serif;
}
.header {
  display: flex;
  flex-direction: row;
  height: 5vh;
  align-items: center;
  justify-content: space-between;
  padding: 24px 8px;
  background: white;
}
.header-actions {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.action {
  color: #7c8db0;
}
.action:hover {
  cursor: pointer;
}
.action-btn {
  background: #605dec;
  color: #fafafa;
  border: none;
  border-radius: 4px;
}
</style>
