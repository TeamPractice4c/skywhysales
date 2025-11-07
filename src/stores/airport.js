import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const useAirportStore = defineStore('airport', () => {
  const currentAirport = ref(null)
  const airportError = ref(null)
  const airportsList = ref([])

  const getAirports = async () => {
    await axios
      .get('http://localhost:3000/api/airport/GetAirports')
      .then((res) => {
        airportsList.value = Object.keys(res.data).map((key) => {
          return {
            id: key,
            ...res.data[key],
          }
        })
      })
      .catch((err) => {
        airportError.value = err.response.data
      })
  }

  const getAirport = async (id) => {
    await axios
      .get(`http://localhost:3000/api/airport/GetAirport/${id}`)
      .then((res) => {
        currentAirport.value = res.data
      })
      .catch((err) => {
        airportError.value = err.response.data
      })
  }

  const addAirport = async (airport) => {
    await axios
      .post(`http://localhost:3000/api/airport/AddAirport`, {
        apId: 0,
        apName: airport.name,
        apCountry: airport.country,
        apCity: airport.city,
        apStreet: airport.street,
        apBuilding: airport.building,
      })
      .then(async (res) => {
        if (airportsList.value.length) {
          airportsList.value.push(res.data)
        } else {
          await getAirports()
        }
      })
  }

  const editAirport = async (airport) => {
    await axios
      .post(`http://localhost:3000/api/airport/EditAirport`, airport)
      .then((res) => {
        const index = airportsList.value.findIndex((ap) => ap.apId === airport.apId)
        if (index > -1) {
          airportsList.value[index] = res.data
        }
      })
      .catch((err) => {
        airportError.value = err.response.data
      })
  }

  const deleteAirport = async (airportId) => {
    await axios.delete(`http://localhost:3000/api/airport/DeleteAirport/${airportId}`).then(() => {
      const index = airportsList.value.findIndex((ap) => ap.apId === airportId)
      if (index > -1) {
        airportsList.value.slice(index, 1)
      }
    })
      .catch((err) => {
        airportError.value = err.response.data
      })
  }

  return {
    currentAirport,
    airportError,
    airportsList,
    getAirports,
    getAirport,
    addAirport,
    editAirport,
    deleteAirport,
  }
})

export default useAirportStore
