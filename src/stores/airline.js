import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const useAirlineStore = defineStore('airlines', () => {
  const currentAirline = ref(null)
  const airlineError = ref(null)
  const airlinesList = ref([])

  const getAirlines = async () => {
    await axios
      .get('http://localhost:3000/api/airline/GetAirlines')
      .then((res) => {
        airlinesList.value = Object.keys(res.data).map((key) => {
          return {
            id: key,
            ...res.data[key],
          }
        })
      })
      .catch((err) => {
        airlineError.value = err.response.data
      })
  }

  const getAirline = async (id) => {
    await axios
      .get(`http://localhost:3000/api/airline/GetAirline/${id}`)
      .then((res) => {
        currentAirline.value = res.data
      })
      .catch((err) => {
        airlineError.value = err.response.data
      })
  }

  const addAirline = async (airline) => {
    await axios
      .post(`http://localhost:3000/api/airline/AddAirline`, {
        alId: 0,
        alName: airline.name,
        alEmail: airline.email,
      })
      .then(async (res) => {
        if (airlinesList.value.length) {
          airlinesList.value.push(res.data)
        } else {
          await getAirlines()
        }
      })
      .catch((err) => {
        airlineError.value = err.response.data
      })
  }

  const editAirline = async (airline) => {
    await axios
      .post(`http://localhost:3000/api/airline/EditAirline`, airline)
      .then(async (res) => {
        const index = airlinesList.value.findIndex((al) => al.alId === airline.alId)
        if (index > -1) {
          airlinesList.value[index] = res.data
        }
      })
      .catch((err) => {
        airlineError.value = err.response.data
      })
  }

  const deleteAirline = async (airlineId) => {
    await axios
      .delete(`http://localhost:3000/api/airline/DeleteAirline/${airlineId}`)
      .then(() => {
        const index = airlinesList.value.findIndex((al) => al.apId === airlineId)
        if (index > -1) {
          airlinesList.value.slice(index, 1)
        }
      })
      .catch((err) => {
        airlineError.value = err.response.data
      })
  }

  return {
    currentAirline,
    airlineError,
    airlinesList,
    getAirlines,
    getAirline,
    addAirline,
    editAirline,
    deleteAirline,
  }
})

export default useAirlineStore
