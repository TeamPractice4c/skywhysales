<script setup>
import useFlightStore from '@/stores/flight.js'
import useAirlineStore from '@/stores/airline.js'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useToast } from 'vue-toastification'
import { ru } from 'date-fns/locale'
import { useRoute, useRouter } from 'vue-router'
import FlightCard from '@/components/flight-card.vue'

const toast = useToast()
const flightStore = useFlightStore()
const airlineStore = useAirlineStore()

const dates = ref()
const fromInput = useTemplateRef('from-input')
const toInput = useTemplateRef('to-input')

const route = useRoute()
const router = useRouter()

const searchParams = ref({
  countryFrom: '',
  countryTo: '',
  startDate: null,
  endDate: null,
})

const toFlight = (id) => {
  router.push({ name: 'Flight', params: { id } })
}

const search = async (params) => {
  if (!params) {
    toast.error('Гандон')
    return
  }
  await flightStore.searchFlights(
    params.countryFrom,
    params.countryTo,
    params.startDate,
    params.endDate,
  )
}

onMounted(async () => {
  if (route.query) {
    searchParams.value.countryFrom = route.query.countryFrom
    searchParams.value.countryTo = route.query.countryTo
    searchParams.value.startDate = new Date(route.query.startDate)
    searchParams.value.endDate = new Date(route.query.endDate)

    await search(searchParams.value)
  } else {
    if (!flightStore.flightsList.length) {
      await flightStore.getFlights()
    }
  }
  if (flightStore.flightError) {
    toast.error(flightStore.flightError)
  }

  if (!airlineStore.airlinesList.length) {
    await airlineStore.getAirlines()
  }
  if (airlineStore.airlineError) {
    toast.error(airlineStore.airlineError)
  }
})

const searchFlights = async () => {
  const from = fromInput.value
  const to = toInput.value

  if (!from.value || !to.value || !dates.value) {
    toast.error('Заполните все поля')
  }

  if (!dates.value) {
    toast.error('Выберите сроки')
    return
  }
  const startDate = dates.value[0]
  const endDate = dates.value[1]

  if (from.value === to.value) {
    toast.error('Страна отправления и страна прибытия не могут быть одинаковы')
    return
  }

  if (!endDate) {
    toast.error('Выберите дату прибытия')
    return
  }

  if (startDate === endDate) {
    toast.error('Сроки не могут быть одинаковы')
    return
  }

  searchParams.countryFrom = from.value
  searchParams.countryTo = to.value
  searchParams.startDate = startDate.toLocaleDateString('ru-RU')
  searchParams.endDate = endDate.toLocaleDateString('ru-RU')

  await search(searchParams)
}
</script>

<template>
  <div class="flights">
    <div class="search-filters">
      <input
        list="countries"
        name="departure"
        id="departure"
        placeholder="Откуда?"
        ref="from-input"
      />
      <input list="countries" name="arrival" id="arrival" placeholder="Куда?" ref="to-input" />
      <date-picker
        v-model="dates"
        class="datepicker"
        name="dates"
        id="dates"
        range
        :time-config="{ enableTimePicker: false }"
        :min-date="Date.now()"
        :locale="ru"
        placeholder="Сроки полета"
      />
      <button type="button" @click="searchFlights">Найти</button>
      <datalist id="countries">
        <option value="Азербайджан" />
        <option value="Алжир" />
        <option value="Армения" />
        <option value="Бахрейн" />
        <option value="Беларусь" />
        <option value="Венесуэла" />
        <option value="Израиль" />
        <option value="Индия" />
        <option value="Ирак" />
        <option value="Казахстан" />
        <option value="Катар" />
        <option value="Киргизия" />
        <option value="Марокко" />
        <option value="Монголия" />
        <option value="ОАЭ" />
        <option value="Россия" />
        <option value="Сербия" />
        <option value="Сирия" />
        <option value="Таджикистан" />
        <option value="Туркменистан" />
        <option value="Турция" />
        <option value="Узбекистан" />
      </datalist>
    </div>
    <div class="additional-filters">
      <p class="additional-filter">Максимальная стоимость</p>
      <p class="additional-filter">авиакомпании</p>
      <p class="additional-filter">класс обслуживания</p>
    </div>
    <p style="color: var(--color-grey-600)">
      Выберите рейс <span style="color: var(--color-purple-blue)">вылета</span>
    </p>
    <div class="output">
      <div class="flights-output">
        <flight-card v-for="el in flightStore.flightsList" @click="toFlight(el.fId)" :flight="el" />
      </div>
      <button class="search-all" type="button">Посмотреть все</button>
    </div>
  </div>
</template>

<style>
input:focus {
  outline: none;
}

input::-webkit-calendar-picker-indicator {
  display: none !important;
}

.search-filters input {
  color: #7c8db0;
  border: 1px solid #cbd4e6;
  border-radius: 4px;
  font-size: 16px;
  min-width: 20vw;
  height: 5vh;
  padding-left: 40px;
}

.search-filters div {
  min-width: 20vw;
  height: 5vh;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.flights {
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 16px;
}

.search-filters {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: auto;
  border-radius: 6px;
}

.search-filters button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  height: 5vh;
  font-size: 16px;
  background: var(--color-purple-blue);
  color: white;
}

.search-filters button:hover {
  cursor: pointer;
}

.additional-filters {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.additional-filter {
  color: var(--color-grey-900);
}

.output {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: auto;
}

.flights-output {
  border: 3px solid var(--color-purple-extralight);
  border-radius: 6px;
  padding: 3px;
}

.flights-output div {
  border-bottom: 2px solid var(--color-purple-extralight);
}

.flights-output div:last-child {
  border-bottom: none;
}

.search-all {
  align-self: flex-end;
  background: white;
  color: var(--color-purple-blue);
  border: 1px solid var(--color-purple-blue);
  border-radius: 4px;
  padding: 20px;
  font-size: 18px;
}

.search-all:hover {
  cursor: pointer;
}

.datepicker {
  width: 15vw;
}
</style>
