import { authApi } from './api'

export interface EventAttendee {
  _id: string
  userId: string
  walletAddress?: string
  username?: string
  pic?: string
  price?: number
  ticket?: number
  transactionHash?: string
  date?: string
  orderId?: string
}

export interface Event {
  _id: string
  name: string
  description: string
  photo?: string
  userID: string
  blockChain: string
  sellingStatus: 'For sale' | 'Sold Out' | 'Expired'
  price: number
  totalTickets: number
  ticketsAvailable: number
  venue: string
  eventDateTime: string
  category?: string
  location?: string
  createAddress: string
  createdAt: string
  soldTo: EventAttendee[]
  userTicketCount?: number
}

export async function getAllEvents(): Promise<Event[]> {
  const response = await authApi.get('/events/getAllEvents/')
  // Handle backend object structure { events: [...] } or direct array
  if (response.data && response.data.events) return response.data.events
  return Array.isArray(response.data) ? response.data : []
}

export async function getEventsList(page: number = 1): Promise<Event[]> {
  const response = await authApi.get(`/events/list/?pageNumber=${page - 1}`)
  return Array.isArray(response.data) ? response.data : []
}

export async function getEventById(eventId: string): Promise<Event | null> {
  const response = await authApi.get(`/event/geteventsbyid2/${eventId}`) // Use Id2 as it's more complete
  return response.data || null
}

export async function createEvent(formData: FormData) {
  const response = await authApi.post('/events/create/', formData)
  return response.data
}

export async function buyEventTicket(eventID: string, ticket: number, price: number) {
  const response = await authApi.post('/events/buy/', { 
    eventID, 
    ticket, 
    price,
    transactionHash: "OFFLINE_PAYMENT" // Placeholder for now since we haven't integrated the wallet yet
  })
  return response.data
}

export async function buyFreeTicket(eventId: string, ticketQuantity: number) {
  const response = await authApi.post('/events/buyFreeTicket/', { eventId, ticketQuantity })
  return response.data
}

export async function searchEvents(query: string): Promise<Event[]> {
  const response = await authApi.get(`/events/search/${query}`)
  return Array.isArray(response.data) ? response.data : []
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
  const response = await authApi.get(`/events/category/${category}`)
  return Array.isArray(response.data) ? response.data : []
}

export async function getEventsByLocation(location: string): Promise<Event[]> {
  const response = await authApi.get(`/events/location/${location}`)
  return Array.isArray(response.data) ? response.data : []
}

export async function getMyEvents(): Promise<Event[]> {
  const response = await authApi.get('/events/list/user/')
  if (response.data && response.data.data) return response.data.data
  return Array.isArray(response.data) ? response.data : []
}

export async function getPurchasedEvents(): Promise<Event[]> {
  const response = await authApi.get('/events/purchase/')
  return Array.isArray(response.data) ? response.data : []
}

export async function getPastEvents(): Promise<Event[]> {
  const response = await authApi.get('/events/pastEvents/')
  if (response.data && response.data.data) return response.data.data
  return Array.isArray(response.data) ? response.data : []
}

export async function getTodayEvents(): Promise<Event[]> {
  const response = await authApi.get('/events/todayEvents/')
  if (response.data && response.data.data) return response.data.data
  return Array.isArray(response.data) ? response.data : []
}

export async function getUpcomingEvents(): Promise<Event[]> {
  const response = await authApi.get('/events/upcomingEvents/')
  if (response.data && response.data.data) return response.data.data
  return Array.isArray(response.data) ? response.data : []
}

export async function deactiveEvent(eventID: string) {
  const response = await authApi.post('/events/deactiveEvent/', { eventID })
  return response.data
}

export async function activeEvent(eventID: string) {
  const response = await authApi.post('/events/activeevent/', { eventID })
  return response.data
}

export async function deleteEvent(eventID: string) {
  const response = await authApi.delete('/events/deleteevent/', { data: { eventID } })
  return response.data
}

export async function updateEvent(formData: FormData) {
  const response = await authApi.post('/events/update/', formData)
  return response.data
}

export async function createBuyEventIntent(totalAmount: number, eventId: string, ticketQuantity: number) {
  const response = await authApi.post('/events/createBuyEventIntent/', {
    totalAmount,
    eventId,
    ticketQuantity,
    return_url: window.location.origin + `/events?payment=success&eventId=${eventId}`,
    cancel_url: window.location.origin + '/events?payment=cancel'
  })
  return response.data
}

export async function captureEventPayment(orderId: string, eventId: string) {
  const response = await authApi.post('/events/captureEventPayment/', { orderId, eventId })
  return response.data
}

export async function getEventAnalytics(eventId: string) {
  const response = await authApi.get(`/events/getAnalyticsByEventId/${eventId}`)
  return response.data
}

export async function getUserAnalytics() {
  const response = await authApi.get('/events/getAnalyticsByUser')
  return response.data
}

export async function sendEmailToAttendees(eventId: string, subject: string, message: string) {
  const response = await authApi.post('/events/setmails', { eventId, subject, message })
  return response.data
}

export async function verifyTicket(eventId: string, ticketId: string) {
  const response = await authApi.get(`/events/verifyTickets/${eventId}/${ticketId}`)
  return response.data
}
