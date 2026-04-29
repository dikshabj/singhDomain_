import api from './api'

export interface LoginResponse {
  Token: string
  email: string
  name?: string
  [key: string]: any
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/user/login', { email, password })
  return response.data
}

export async function signupUser(username: string, email: string, password: string, confirmPassword: string) {
  const response = await api.post('/user/sign-up', { username, email, password, confirmPassword })
  return response.data
}

export async function verifyOtp(email: string, otp: number) {
  const response = await api.post('/user/validate-otp', { email, otp })
  return response.data
}

export async function googleLogin(access_token: string) {
  const response = await api.post('/user/google/login', { access_token })
  return response.data
}

export async function forgotPassword(email: string) {
  const response = await api.get(`/user/forget-password/${email}`)
  return response.data
}

export async function resetPassword(email: string, otp: number, newPassword: string) {
  const response = await api.post('/user/reset-password-otp', { email, otp, newPassword })
  return response.data
}

export function saveProfile(data: LoginResponse) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('profile', JSON.stringify(data))
  }
}

export function saveEmail(email: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('email', JSON.stringify({ email }))
  }
}

export function getSavedEmail(): string | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem('email')
  if (!data) return null
  try {
    return JSON.parse(data)?.email || null
  } catch {
    return null
  }
}

export function getProfile(): LoginResponse | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem('profile')
  if (!data || data === 'undefined' || data === 'null') return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function clearProfile() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('profile')
    localStorage.removeItem('cart')
  }
}

export function isLoggedIn(): boolean {
  const profile = getProfile()
  return !!profile?.Token
}
