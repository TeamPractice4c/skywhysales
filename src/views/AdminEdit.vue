<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import useFlightStore from '@/stores/flight.js'
import useAirlineStore from '@/stores/airline.js'
import useAirportStore from '@/stores/airport.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const flightStore = useFlightStore()
const airlineStore = useAirlineStore()
const airportStore = useAirportStore()

const entity = computed(() => route.params.entity)
const id = computed(() => route.params.id)
const isNew = computed(() => id.value === 'new')

const form = ref({})
const loading = ref(false)

const fieldsConfig = {
  flight: [
    { key: 'fDepartureAirport', label: 'Аэропорт отправления', type: 'text' },
    { key: 'fArrivalAirport', label: 'Аэропорт прибытия', type: 'text' },
    { key: 'fDepartureTime', label: 'Дата и время вылета', type: 'datetime-local' },
    { key: 'fArrivalTime', label: 'Время прилёта', type: 'time' },
    { key: 'fAirline', label: 'Авиакомпания (название)', type: 'text' },
    { key: 'fPrice', label: 'Цена (₽)', type: 'number', step: '100' },
    { key: 'fSeatsCount', label: 'Количество мест', type: 'number' },
  ],
  airline: [
    { key: 'alName', label: 'Название авиакомпании', type: 'text' },
    { key: 'alEmail', label: 'Email', type: 'email' },
  ],
  airport: [
    { key: 'apCity', label: 'Город', type: 'text' },
    { key: 'apName', label: 'Название аэропорта', type: 'text' },
    { key: 'apCountry', label: 'Страна', type: 'text' },
    { key: 'apStreet', label: 'Улица', type: 'text' },
    { key: 'apBuilding', label: 'Номер дома', type: 'text' },
  ],
}

const fields = computed(() => fieldsConfig[entity.value] || [])

const loadEntity = async () => {
  if (isNew.value) {
    form.value = {}
    return
  }

  loading.value = true
  try {
    let data
    switch (entity.value) {
      case 'flight':
        data = await flightStore.getFlightById(id.value)
        break
      case 'airline':
        data = await airlineStore.getAirlineById(id.value)
        break
      case 'airport':
        data = await airportStore.getAirportById(id.value)
        break
      default:
        toast.error('Неизвестная сущность')
        router.back()
        return
    }

    if (!data) {
      toast.error('Объект не найден')
      router.back()
      return
    }

    form.value = { ...data }
  } catch (err) {
    toast.error('Ошибка загрузки данных')
    console.error(err)
  } finally {
    loading.value = false
  }
}

const save = async () => {
  if (loading.value) return
  loading.value = true

  try {
    let success = false
    switch (entity.value) {
      case 'flight':
        if (isNew.value) {
          success = await flightStore.createFlight(form.value)
        } else {
          success = await flightStore.updateFlight(id.value, form.value)
        }
        break
      case 'airline':
        if (isNew.value) {
          success = await airlineStore.createAirline(form.value)
        } else {
          success = await airlineStore.updateAirline(id.value, form.value)
        }
        break
      case 'airport':
        if (isNew.value) {
          success = await airportStore.createAirport(form.value)
        } else {
          success = await airportStore.updateAirport(id.value, form.value)
        }
        break
    }

    if (success) {
      toast.success(isNew.value ? 'Создано успешно!' : 'Обновлено успешно!')
      router.back()
    } else {
      toast.error('Ошибка при сохранении')
    }
  } catch (err) {
    toast.error('Ошибка сервера')
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!fieldsConfig[entity.value]) {
    toast.error('Неподдерживаемая сущность')
    router.back()
    return
  }
  loadEntity()
})

watch([entity, id], () => {
  loadEntity()
})
</script>

<template>
  <div class="edit-page">
    <div class="edit-container">
      <div class="edit-header">
        <h2>
          {{ isNew ? 'Добавление' : 'Редактирование' }}
          {{
            entity === 'flight'
              ? 'рейса'
              : entity === 'airline'
                ? 'авиакомпании'
                : entity === 'airport'
                  ? 'аэропорта'
                  : ''
          }}
        </h2>
        <button @click="router.back()" class="back-btn">Назад</button>
      </div>

      <form @submit.prevent="save" class="edit-form" v-if="fields.length">
        <div class="form-grid">
          <div v-for="field in fields" :key="field.key" class="form-group">
            <label :for="field.key">{{ field.label }}</label>
            <input
              :id="field.key"
              :type="field.type"
              :step="field.step"
              v-model="form.value[field.key]"
              required
              :disabled="loading"
            />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="router.back()" :disabled="loading">Отмена</button>
          <button type="submit" class="primary" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </form>

      <div v-else class="loading">Загрузка...</div>
    </div>
  </div>
</template>

<style scoped>
.edit-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 32px;
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.edit-header {
  padding: 24px 32px;
  background: var(--color-purple-blue);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.edit-form {
  padding: 32px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #34495e;
  font-weight: 600;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--color-grey-200);
  border-radius: 6px;
  font-size: 16px;
  transition: border 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-purple-blue);
  box-shadow: 0 0 0 3px rgba(120, 108, 255, 0.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.form-actions button {
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.form-actions button:first-child {
  background: #e0e0e0;
  color: #34495e;
}

.form-actions button:first-child:hover {
  background: #d0d0d0;
}

.form-actions .primary {
  background: var(--color-purple-blue);
  color: white;
}

.form-actions .primary:hover {
  background: #635bff;
}

.form-actions .primary:disabled {
  background: #a0a0ff;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 60px;
  color: var(--color-grey-400);
  font-size: 18px;
}
</style>
