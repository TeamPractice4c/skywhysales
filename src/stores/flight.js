import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import moment from 'moment'

const useFlightStore = defineStore('flights', () => {
  const currentFlight = ref(null)
  const flightError = ref(null)
  const flightsList = ref([])

  function getError(err) {
    if (!err.response || err.response.status === 502) {
      flightError.value =
        'SkyWhySales в настоящее время испытывает перебои в работе. Повторите попытку позже.'
      return
    }
    flightError.value = err.response.data
  }

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
        flightError.value = null
      })
      .catch((err) => getError(err))
  }

  const getFlight = async (id) => {
    await axios
      .get(`http://localhost:3000/api/flight/GetFlight/${id}`)
      .then((res) => {
        currentFlight.value = res.data
        flightError.value = null
      })
      .catch((err) => getError(err))
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
        flightError.value = null
      })
      .catch((err) => getError(err))
  }

  const editFlight = async (flight) => {
    await axios
      .post(`http://localhost:3000/api/flight/EditFlight`, flight)
      .then((res) => {
        const index = flightsList.value.findIndex((f) => f.fId === flight.fId)
        if (index > -1) {
          flightsList.value[index] = res.data
        }
        flightError.value = null
      })
      .catch((err) => getError(err))
  }

  const searchFlights = async (from, to, start, end) => {
    await axios
      .post('http://localhost:3000/api/flight/SearchFlights', {
        cityFrom: from,
        cityTo: to,
        startDate: moment(start).add(5, 'h').toDate().toISOString().split('T')[0],
        endDate: moment(end).add(5, 'h').toDate().toISOString().split('T')[0],
      })
      .then(async (res) => {
        flightsList.value = Object.keys(res.data).map((key) => {
          return {
            id: key,
            ...res.data[key],
          }
        })
      })
      .catch((err) => getError(err))
  }

  const clearFlights = () => {
    flightsList.value = []
  }

  return {
    currentFlight,
    flightError,
    flightsList,
    getFlights,
    getFlight,
    addFlight,
    editFlight,
    searchFlights,
    clearFlights,
  }
})

export default useFlightStore
