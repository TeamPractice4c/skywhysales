import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

const useUserStore = defineStore('users', () => {
  const currentUser = ref(null)
  const userError = ref(null)

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
    await axios.post('http://localhost:3000/api/user/register', {
      uId: 0,
      uSurname: user.surname,
      uName: user.name,
      uPatronymic: user.patronymic,
      uEmail: user.email,
      uPassword: user.password,
      uRole: '',
      uPhone: user.phone,
      uBirthdate: user.birthdate,
      uPassportSerial: user.passportSerial,
      uPassportNumber: user.passportNumber,
    })
  }

  return { currentUser, userError, login, register }
})

export default useUserStore
