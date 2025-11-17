<script setup>
import { ref, useTemplateRef } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { ru } from 'date-fns/locale'

const toast = useToast()

const router = useRouter()

const dates = ref()
const fromInput = useTemplateRef('from-input')
const toInput = useTemplateRef('to-input')

const searchFlights = () => {
  const from = fromInput.value
  const to = toInput.value

  if (!from.value || !to.value || !dates.value) {
    toast.error('Заполните все поля')
    return
  }

  if (from.value === to.value) {
    toast.error('Города не могут быть одинаковыми')
    return
  }

  if (!dates.value) {
    toast.error('Выберите сроки')
    return
  }
  const startDate = dates.value[0]
  const endDate = dates.value[1]

  if (!endDate) {
    toast.error('Выберите дату прибытия')
    return
  }

  if (startDate === endDate) {
    toast.error('Сроки не могут быть одинаковы')
    return
  }

  const searchProps = {
    cityFrom: from.value,
    cityTo: to.value,
    startDate: startDate.toLocaleDateString('en-US'),
    endDate: endDate.toLocaleDateString('en-US'),
  }

  router.push({
    name: 'Flights',
    query: {
      cityFrom: searchProps.cityFrom,
      cityTo: searchProps.cityTo,
      startDate: searchProps.startDate,
      endDate: searchProps.endDate,
    },
  })
}
</script>

<template>
  <div>
    <div class="search">
      <h1 class="slogan"><span>Больше чем</span> <br /><span>простая поездка</span></h1>
      <div class="search-options">
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
          placeholder="Сроки вылета"
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

.search-options input {
  color: var(--color-grey-400);
  border: 1px solid #cbd4e6;
  border-radius: 4px;
  font-size: 16px;
  height: 5vh;
  padding-left: 40px;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.search-filters button:hover {
  cursor: pointer;
}

.search {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url(../assets/images/mainbg.png);
  width: auto;
  height: 100vh;
  padding: 24px;
  gap: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.slogan {
  font-size: 96px;
  line-height: 90px;
  text-align: center;
  background: url('../assets/images/sloganmask.png') no-repeat;
  background-clip: text;
  font-weight: bold;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.search-options {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 24px;
  z-index: 0;
  width: auto;
}

.search-options button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  height: 5vh;
  font-size: 16px;
  background: var(--color-purple-blue);
  color: white;
}

.search-options button:hover {
  cursor: pointer;
}

.datepicker {
  width: 20vw;
}
</style>
