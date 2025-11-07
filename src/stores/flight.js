import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const useFlightStore = defineStore('flights', () => {
  const currentFlight = ref(null)
  const flightError = ref(null)
  const flightsList = ref([])

  const getFlights = async () => {
    await axios
      .get('http://localhost:3000/api/flight/GetFlights')
      .then((res) => {
        flightsList.value = Object.keys(res.data).map((key) => {
          return {
            id: key,
            ...res.data[key],
          }
        })
      })
      .catch((err) => {
        flightError.value = err.response.data
      })
  }

  const getFlight = async (id) => {
    await axios
      .get(`http://localhost:3000/api/flight/GetFlight/${id}`)
      .then((res) => {
        currentFlight.value = res.data
      })
      .catch((err) => {
        flightError.value = err.response.data
      })
  }

  const addFlight = async (flight) => {
    await axios
      .post(`http://localhost:3000/api/flight/AddFlight`, {
        fId: 0,
        fAirline: flight.airline,
        fDepartureAirport: flight.departureAirport,
        fArrivalAirport: flight.arrivalAirport,
        fDepartureTime: flight.departureTime,
        fArrivalTime: flight.arrivalTime,
        fSeatsCount: flight.seatsCount,
        fPrice: flight.price,
      })
      .then(async (res) => {
        if (flightsList.value.length) {
          flightsList.value.push(res.data)
        } else {
          await getFlights()
        }
      })
      .catch((err) => {
        flightError.value = err.response.data
      })
  }

  const editFlight = async (flight) => {
    await axios
      .post(`http://localhost:3000/api/flight/EditFlight`, flight)
      .then((res) => {
        const index = flightsList.value.findIndex((f) => f.fId === flight.fId)
        if (index > -1) {
          flightsList.value[index] = res.data
        }
      })
      .catch((err) => {
        flightError.value = err.response.data
      })
  }

  return { currentFlight, flightError, flightsList, getFlights, getFlight, addFlight, editFlight }
})

export default useFlightStore
