<script setup>
import useFlightStore from '@/stores/flight.js'
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { ru } from 'date-fns/locale'
import FlightCard from '@/components/flight-card.vue'
import { useRoute, useRouter } from 'vue-router'
import flight from '@/stores/flight.js'

const toast = useToast()
const flightStore = useFlightStore()

const router = useRouter()

const props = defineProps({
  id: Number
})

onMounted(async () => {
  await flightStore.getFlight(props.id)
  if (flightStore.flightError){
    toast.error(flightStore.flightError)
  }
})

flightStore.currentFlight

</script>
<template></template>

<style scoped></style>
