import axios from 'axios'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.singhcoin.io'

// Public axios instance (no auth)
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Authenticated axios instance (attaches token from localStorage)
export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

authApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const profile = localStorage.getItem('profile')
    if (profile) {
      try {
        const parsed = JSON.parse(profile)
        const token = parsed?.Token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch {}
    }
  }
  return config
})

export default api
