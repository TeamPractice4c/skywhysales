<script setup>
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import useFlightStore from '@/stores/flight.js'
import useTicketStore from '@/stores/ticket.js'
import useUserStore from '@/stores/user.js'

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  flightId: {
    type: Number,
    required: true,
  },
})

const flightStore = useFlightStore()
const ticketStore = useTicketStore()
const userStore = useUserStore()
const toast = useToast()

const flight = ref(null)

onMounted(async () => {
  flight.value = await flightStore.getFlight(props.flightId)
  if (flightStore.flightError) {
    toast.error(flightStore.flightError)
  }
})

const imageSource = computed(() => `http://localhost:3000/images/${flight.value.airlineImage}`)

const cancelTicket = async () => {
  if (confirm('Вы действительно хотите отменить билет? Это действие нельзя отменить')) {
    props.ticket.tStatus = 'Отменен'
    await ticketStore.changeTicketStatus(props.ticket, userStore.currentUser)
    if (ticketStore.ticketError) {
      toast.error(flightStore.flightError)
    }
  }
}

</script>

<template>
  <div class="user-flight-card" v-if="flight && ticket">
    <img :src="imageSource" alt="" width="40" height="40" />
    <div>
      <p class="primary">{{ flight.fAirline }}</p>
    </div>
    <div>
      <p class="primary">{{ flight.fDepartureAirport }} - {{ flight.fArrivalAirport }}</p>
      <p class="secondary">
        {{
          new Date(flight.fDepartureTime).toLocaleString('ru-RU', {
            dateStyle: 'short',
            timeStyle: 'short',
          })
        }}
        -
        {{
          new Date(flight.fArrivalTime).toLocaleString('ru-RU', {
            dateStyle: 'short',
            timeStyle: 'short',
          })
        }}
      </p>
    </div>
    <div>
      <p class="primary">{{ ticket.tTotalPrice }} ₽</p>
      <p class="secondary">Стоимость билета</p>
    </div>
    <div>
      <p class="primary">{{ ticket.tStatus }}</p>
      <p class="secondary">Статус</p>
    </div>
    <div v-if="ticket.tStatus !== 'Отменен'">
      <button class="btn" type="button" @click="cancelTicket">Отменить</button>
    </div>
    <div v-else>
      <button class="btn btn-disabled" type="button">Отменен</button>
    </div>
  </div>
</template>

<style scoped>
.user-flight-card {
  display: flex;
  flex-direction: row;
  background: white;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding-left: 50px;
}

.user-flight-card div {
  align-self: center;
  height: auto;
  width: 15vw;
}

.btn {
  background: var(--color-purple-blue);
  color: var(--color-grey-100);
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s;
}

.btn-disabled {
  background: var(--color-grey-400);
  color: black;
}

.btn-disabled:hover {
  cursor: default;
}

.user-flight-card p {
  text-align: center;
}

.user-flight-card:hover {
  background: var(--color-purple-white);
}

.user-flight-card img {
  align-self: center;
}

.primary {
  color: var(--color-grey-900);
  text-wrap: nowrap;
}

.secondary {
  color: var(--color-grey-400);
  text-wrap: nowrap;
}
</style>
