<script setup>
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import useFlightStore from '@/stores/flight.js'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const flightStore = useFlightStore()
const route = useRoute()
const toast = useToast()

const flightId = Number(route.params.id)

onBeforeMount(async () => {
  if (!flightStore.currentFlight) {
    await flightStore.getFlight(flightId)
    if (flightStore.flightError) {
      toast.error(flightStore.flightError)
    }
  }
})

const flight = computed(() => flightStore.currentFlight)

const formatTime = (date) => format(new Date(date), 'HH:mm', { locale: ru })
const formatDate = (date) => format(new Date(date), 'd MMM', { locale: ru })
const formatDay = (date) => format(new Date(date), 'EEE', { locale: ru }).slice(0, 3)

const duration = computed(() => {
  if (!flight.value) return ''
  const dep = new Date(flight.value.fDepartureTime)
  const arr = new Date(flight.value.fArrivalTime)
  const diff = (arr - dep) / 60000
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return `${h}ч ${m}м в полёте`
})
</script>

<template>
  <div class="flight-detail-page">
    <div class="tariff-card">
      <h3>Условия тарифа</h3>
      <ul>
        <li>
          <span class="check green">Checkmark</span> Ручная кладь 8 кг — 1 шт
          <span class="size">55×23×40 см</span>
        </li>
        <li><span class="cross">Cross</span> Без багажа</li>
        <li><span class="cross">Cross</span> Без обмена</li>
        <li><span class="cross">Cross</span> Без возврата</li>
      </ul>
      <p class="note">Общее количество чемоданов и сумок на всех</p>
    </div>

    <div class="route-card">
      <div class="segment">
        <div class="segment-header">
          <div class="airline">
            <span class="logo">{{ flightStore.currentFlight.fAirline }}</span>
            <span class="duration">{{ duration }}</span>
          </div>
        </div>

        <div class="timeline">
          <div class="point">
            <div class="time">{{ formatTime(flightStore.currentFlight.fDepartureTime) }}</div>
            <div class="airport">{{ flightStore.currentFlight.fDepartureAirport }}</div>
            <div class="date">
              {{ formatDate(flightStore.currentFlight.fDepartureTime) }},
              {{ formatDay(flightStore.currentFlight.fDepartureTime) }}
            </div>
          </div>
          <div class="line">
            <div class="dot"></div>
          </div>
          <div class="point text-right">
            <div class="time">{{ formatTime(flightStore.currentFlight.fArrivalTime) }}</div>
            <div class="airport">{{ flightStore.currentFlight.fArrivalAirport }}</div>
            <div class="date">
              {{ formatDate(flightStore.currentFlight.fArrivalTime) }},
              {{ formatDay(flightStore.currentFlight.fArrivalTime) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="prices-card">
      <div class="price-item best">
        <div class="seller">
          <img src="../assets/icons/logo.svg" alt="Aviasales" class="seller-icon" />
          <span>Напрямую у SkyWhySales</span>
        </div>
        <div class="price-block">
          <span class="price">{{ flightStore.currentFlight.fPrice }} ₽</span>
          <button class="buy-btn primary">Купить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: --font-family-nunito-sans, sans-serif;
}
.flight-detail-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 16px;
}

.tariff-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.tariff-card h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
}
.tariff-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.tariff-card li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 8px;
}
.check {
  font-size: 18px;
}
.green {
  color: #16a34a;
}
.cross {
  color: #dc2626;
  font-size: 16px;
}
.size {
  color: #6b7280;
  font-size: 12px;
}
.note {
  color: #6b7280;
  font-size: 12px;
  margin: 12px 0 8px;
}
.route-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}
.segment {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
}
.segment:last-child {
  border: none;
}
.segment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.airline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.airline .logo {
  color: #dc2626;
  font-weight: 600;
}
.duration {
  color: #6b7280;
}
.timeline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.point {
  flex: 1;
}
.time {
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
}
.airport {
  font-size: 14px;
  color: #374151;
  margin-top: 4px;
}
.date {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}
.line {
  flex: 1;
  height: 1px;
  background: #d1d5db;
  margin: 0 16px;
  position: relative;
}
.line::after {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: white;
  border: 3px solid #9ca3af;
  border-radius: 50%;
}
.text-right {
  text-align: right;
}
.prices-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}
.price-item:last-child {
  border: none;
}
.best {
  border-left: 4px solid #f97316;
  padding-left: 12px;
  margin-left: -16px;
}
.seller {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.seller-icon {
  width: 24px;
  height: 24px;
}
.price-block {
  display: flex;
  align-items: center;
  gap: 12px;
}
.price {
  font-size: 24px;
  font-weight: 700;
}
.buy-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  background: var(--color-purple-blue);
  color: white;
  border: none;
}
</style>
