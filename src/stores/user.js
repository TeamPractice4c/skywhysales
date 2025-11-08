import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const useUserStore = defineStore('users', () => {
  const currentUser = ref(null)
  const userError = ref(null)
  const usersList = ref([])

  async function login(user) {
    await axios
      .postForm(
        'http://localhost:3000/api/user/auth',
        {
          login: user.login,
          password: user.password,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'text/plain',
          },
        },
      )
      .then((res) => {
        currentUser.value = res.data
      })
      .catch((err) => {
        userError.value = err.response.data
      })
  }

  async function register(user) {
    await axios
      .post('http://localhost:3000/api/User/Register', {
        uId: 0,
        uSurname: user.surname,
        uName: user.name,
        uPatronymic: user.patronymic,
        uEmail: user.login,
        uPassword: user.password,
        uRole: '',
        uPhone: user.phone,
        uBirthdate: user.birthdate,
        uPassportSerial: user.serial,
        uPassportNumber: user.number,
      })
      .then((res) => {
        currentUser.value = res.data
        userError.value = null
      })
      .catch((err) => {
        userError.value = err.response.data
        if (err.response?.data?.errors) {
          console.log('Validation errors:', err.response.data.errors)
        }
      })
  }

  async function getUsers() {
    await axios
      .get('http://localhost:3000/api/User/GetUsers')
      .then((res) => {
        usersList.value = Object.keys(res.data).map(key => {
          return {
            id: key,
            ...res.data[key],
          }
        })
      })
  }

  async function getUser(userId) {
    await axios
      .get(`http://localhost:3000/api/User/GetUser/${userId}`)
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        userError.value = err.response.data
      })
  }

  async function editUser(user) {
    await axios.post('http://localhost:3000/api/User/EditUser', user)
    .then((res) => {
      if (currentUser.value && currentUser.value.uRole !== 'Менеджер') {
        currentUser.value = res.data
      }
      else if (usersList.value.length && currentUser.value.uRole === 'Менеджер') {
        const index = usersList.value.findIndex((u) => u.uId === user.uId)
        if (index > -1) {
          usersList.value[index] = res.data
        }
      }
    })
      .catch((err) => {
        userError.value = err.response.data
      })
  }

  async function deleteUser(userId) {
    if (currentUser.value.uRole !== 'Менеджер') {
      userError.value = 'Недостаточно прав'
      return
    }
    await axios
      .delete(`http://localhost:3000/api/User/DeleteUser/${userId}`)
      .then(() => {
        const index = usersList.value.findIndex((u) => u.uId === userId)
        if (index > -1) {
          usersList.value.slice(index, 1)
        }
      })
      .catch((err) => {
        userError.value = err.response.data
      })
  }

  return { currentUser, userError, login, register, getUsers, getUser, editUser, deleteUser }
})

export default useUserStore
