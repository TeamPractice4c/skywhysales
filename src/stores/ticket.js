import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const useTicketStore = defineStore('tickets', () => {
  const currentTicket = ref(null)
  const ticketError = ref(null)
  const ticketsList = ref([])

  function getError(err) {
    if (!err.response || err.response.status === 502) {
      ticketError.value =
        'SkyWhySales в настоящее время испытывает перебои в работе. Повторите попытку позже.'
      return
    }
    ticketError.value = err.response.data
  }

  const getTickets = async () => {
    await axios
      .get('http://localhost:3000/api/ticket/GetTickets')
      .then((res) => {
        ticketsList.value = Object.keys(res.data).map((key) => {
          return {
            id: key,
            ...res.data[key],
          }
        })
        ticketError.value = null
      })
      .catch((err) => getError(err))
  }

  const getUserTickets = async (userId) => {
    await axios
      .get(`http://localhost:3000/api/ticket/GetUserTickets/${userId}`)
      .then((res) => {
        ticketsList.value = Object.keys(res.data).map((key) => {
          return {
            id: key,
            ...res.data[key],
          }
        })
        ticketError.value = null
      })
      .catch((err) => getError(err))
  }

  const getTicket = async (id) => {
    await axios
      .get(`http://localhost:3000/api/ticket/GetTicket/${id}`)
      .then((res) => {
        currentTicket.value = res.data
        ticketError.value = null
      })
      .catch((err) => getError(err))
  }

  const addTicket = async (ticket) => {
    await axios
      .post('http://localhost:3000/api/ticket/AddTicket', {
        tId: 0,
        tFlight: ticket.flightId,
        tUser: `${ticket.userSurname} ${ticket.userName} ${ticket.userPatronymic}`,
        tBoughtDate: new Date().toISOString().split('T')[0],
        tClass: ticket.class,
        tTotalPrice: ticket.price,
        tStatus: '',
      })
      .then((res) => {
        if (ticketsList.value.length) {
          ticketsList.value.push(res.data)
        }
        ticketError.value = null
      })
      .catch((err) => getError(err))
  }

  const changeTicketStatus = async (ticket, user) => {
    if (user.uRole !== 'Менеджер') {
      ticketError.value = 'Недостаточно прав'
      return
    }

    await axios
      .post('http://localhost:3000/api/ticket/ChangeTicketStatus', ticket)
      .then((res) => {
        if (ticketsList.value.length) {
          const index = ticketsList.value.findIndex((item) => item.id === ticket.id)
          if (index > -1) {
            ticketsList.value[index] = res.data
          }
        }
        ticketError.value = null
      })
      .catch((err) => getError(err))
  }

  return {
    currentTicket,
    ticketError,
    ticketsList,
    getTickets,
    getUserTickets,
    getTicket,
    addTicket,
    changeTicketStatus,
  }
})

export default useTicketStore
