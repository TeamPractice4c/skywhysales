import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const useUserStore = defineStore('users', () => {
  const currentUser = ref(null)
  const userError = ref(null)
  const usersList = ref([])

  function getError(err) {
    if (err.statusCode === 502) {
      userError.value = 'SkyWhySales в настоящее время испытывает перебои в работе.'
      return
    }
    userError.value = err.response.data
  }
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
      .catch((err) => getError(err))
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
      .catch((err) => getError(err))
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
      .catch((err) => getError(err))
  }

  async function getUser(userId) {
    await axios
      .get(`http://localhost:3000/api/User/GetUser/${userId}`)
      .then((res) => {
        return res.data
      })
      .catch((err) => getError(err))
  }

  async function editUser(user) {
    await axios.post('http://localhost:3000/api/User/EditUser', user)
      .then((res) => {
        currentUser.value = res.data
        userError.value = null
      })
      .catch((err) => getError(err))
  }

  async function deleteUser(userId) {
    if (currentUser.value.uId !== userId && currentUser.value.uRole !== 'Менеджер') {
      userError.value = 'Недостаточно прав'
      return
    }
    await axios
      .delete(`http://localhost:3000/api/User/DeleteUser/${userId}`)
      .then(() => {
        if (usersList.value.length > 0) {
          const index = usersList.value.findIndex((u) => u.uId === userId)
          if (index > -1) {
            usersList.value.slice(index, 1)
          }
        }
        if (currentUser.value.uId === userId) {
          currentUser.value = null
        }
      })
      .catch((err) => getError(err))
  }

  function logout() {
    currentUser.value = null
  }

  return { currentUser, userError, login, register, getUsers, getUser, editUser, deleteUser, logout }
})

export default useUserStore
