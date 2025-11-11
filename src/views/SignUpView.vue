<script setup>
import { ref, useTemplateRef } from 'vue'
import useUserStore from '@/stores/user.js'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { ru } from 'date-fns/locale'

const toast = useToast()
const router = useRouter()
const store = useUserStore()
const selectedDate = ref()

const surnameInput = useTemplateRef('surname-input')
const nameInput = useTemplateRef('name-input')
const patronymicInput = useTemplateRef('patronymic-input')
const loginInput = useTemplateRef('login-input')
const passwordInput = useTemplateRef('password-input')
const phoneInput = useTemplateRef('phone-input')
const serialInput = useTemplateRef('serial-input')
const numberInput = useTemplateRef('number-input')

const getValue = (ref) => {
  const el = ref.value
  if (!el) return ''

  if (typeof el.value === 'string') {
    return el.value.trim()
  }

  return ''
}

const signUp = async () => {
  let surname = getValue(surnameInput)
  let name = getValue(nameInput)
  let patronymic = getValue(patronymicInput) ? getValue(patronymicInput) : ''
  let login = getValue(loginInput)
  let password = getValue(passwordInput)
  let phone = getValue(phoneInput)
  let birthdate = selectedDate.value ? selectedDate.value.toISOString().split('T')[0] : null
  let serial = getValue(serialInput)
  let number = getValue(numberInput)

  if (!surname || !name || !login || !password || !phone || !birthdate || !serial || !number) {
    toast.error('Заполните все поля')
    return
  }
  if (!String(login).match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]/)) {
    toast.error('Неверный формат почты')
    return
  }
  if (!String(password).match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)) {
    toast.error('Пароль должен содержать нижний, верхний регистр, число и быть не менее 8 символов')
    return
  }
  const cleaned = phone.replace(/[\s()\-+]/g, '')
  const regex = /^(?:\+7|8|7)?(\d{10})$/
  if (!cleaned.match(regex)) {
    toast.error('Неверный формат номера телефона')
    return
  }

  const yearsPassed = new Date().getFullYear() - selectedDate.value.getFullYear()

  if (yearsPassed < 18) {
    toast.error('Вам должно быть не меньше 18 лет')
    return
  }
  if (isNaN(parseInt(serial))) {
    toast.error('Серия паспорта должен быть числом')
    return
  }
  if (isNaN(parseInt(number))) {
    toast.error('Номер паспорта должен быть числом')
    return
  }
  if (serial.length !== 4) {
    toast.error('Серия паспорта состоит из 4 цифр')
    return
  }
  if (number.length !== 6) {
    toast.error('Номер паспорта состоит из 6 цифр')
    return
  }

  const user = {
    surname: surname,
    name: name,
    patronymic: patronymic ? patronymic : '',
    login: login,
    password: password,
    phone: phone,
    birthdate: birthdate,
    serial: serial,
    number: number,
  }

  await store.register(user)

  if (store.userError) {
    toast.error(store.userError)
    return
  }

  if (store.currentUser) {
    await router.push({ name: 'Home' })
  }
}
</script>

<template>
  <div class="sign-up">
    <h3>Регистрация</h3>
    <input type="text" required placeholder="Введите фамилию" ref="surname-input" />
    <input type="text" required placeholder="Введите имя" ref="name-input" />
    <input type="text" placeholder="Введите отчество" ref="patronymic-input" />
    <input type="text" required placeholder="Введите email" ref="login-input" />
    <input type="password" required placeholder="Введите пароль" ref="password-input" />
    <input type="text" required placeholder="Введите телефон" ref="phone-input" />
    <date-picker
      v-model="selectedDate"
      class="datepicker"
      :time-config="{ enableTimePicker: false }"
      :maxDate="Date.now()"
      :locale="ru"
      placeholder="Введите дату рождения"
    />
    <input
      type="text"
      minlength="4"
      maxlength="4"
      required
      placeholder="Введите серию паспорта"
      ref="serial-input"
    />
    <input
      type="text"
      minlength="6"
      maxlength="6"
      required
      placeholder="Введите номер паспорта"
      ref="number-input"
    />
    <div class="actions">
      <button type="button" class="btn" @click="signUp">Зарегистрироваться</button>
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
.sign-up input {
  color: var(--color-grey-400);
  border: 1px solid #cbd4e6;
  border-radius: 4px;
  font-size: 16px;
  width: 35vw;
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

.sign-up {
  display: flex;
  align-items: center;
  width: 35vw;
  height: auto;
  margin: auto;
  flex-direction: column;
  gap: 10px;
}

.sign-up button {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  height: 5vh;
  font-size: 16px;
  background: var(--color-purple-blue);
  color: white;
}

svg:hover {
  cursor: pointer;
}

.actions {
  display: flex;
  flex-direction: column;
}
</style>
