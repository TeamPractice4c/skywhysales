<script setup>
import UserFlightCard from '@/components/user-flight-card.vue'
import useUserStore from '@/stores/user.js'
import useTicketStore from '@/stores/ticket.js'
import { onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const userStore = useUserStore()
const ticketStore = useTicketStore()

onMounted(async () => {
  await ticketStore.getUserTickets(userStore.currentUser.uId)
  if (ticketStore.ticketError) {
    toast.error(ticketStore.ticketError)
  }
})
</script>

<template>
  <div class="user-flights">
    <user-flight-card v-for="el in ticketStore.ticketsList" :flightId="el.tFlight" :ticket="el" />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.user-flights {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
}

.user-flights {
  border: 3px solid var(--color-purple-extralight);
  border-radius: 6px;
  padding: 3px;
}

.user-flights div {
  border-bottom: 2px solid var(--color-purple-extralight);
}

.user-flights div:last-child {
  border-bottom: none;
}
</style>
