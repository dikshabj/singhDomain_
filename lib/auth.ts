import api, { authApi } from './api'

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

export async function signupBusinessUser(data: {
  companyName: string
  username: string
  email: string
  password: string
  constitution: string
  website?: string
  referralCode?: string
}) {
  // Use FormData because the backend might expect multipart/form-data for profile pics
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value) formData.append(key, value)
  })
  
  const response = await api.post('/business/sign-up', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function verifyOtp(email: string, otp: number) {
  const response = await api.post('/user/validate-otp', { email, otp })
  return response.data
}

export async function resendOtp(email: string) {
  const response = await api.post('/user/re-generate-link', { email })
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
  const response = await api.post('/user/reset-password-otp', {
    email,
    otp,
    password: newPassword,
    confirmPassword: newPassword,
  })
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

export async function getUserProfile() {
  const response = await authApi.get('/user/get-details/')
  return response.data
}

export async function updateUserProfile(data: any) {
  const response = await authApi.post('/user/update-user', data)
  return response.data
}

export async function updateProfilePic(file: File) {
  const formData = new FormData()
  formData.append('profile', file)
  const response = await authApi.post('/user/update-user', formData)
  return response.data
}

export function updateSavedProfile(newData: any) {
  if (typeof window === 'undefined') return
  const current = getProfile()
  if (current) {
    // Backend returns 'profilePic', but login response might have it as 'pic'
    // We normalize to both to be safe
    const normalizedData = {
      ...newData,
      pic: newData.profilePic || newData.pic,
      profilePic: newData.profilePic || newData.pic
    }
    const updated = { ...current, ...normalizedData }
    localStorage.setItem('profile', JSON.stringify(updated))
    window.dispatchEvent(new Event('profileUpdate'))
  }
}
export async function searchUsers(query: string) {
  const response = await authApi.get(`/user/search-user/${query}`)
  return response.data || []
}

export async function getRecommendedUsers() {
  const response = await authApi.get('/user/search-user')
  return response.data || []
}

export async function followUser(username: string) {
  // Backend uses 'followers' field in update-user to follow someone
  return updateUserProfile({ followers: username })
}

export async function unfollowUser(username: string) {
  // Backend uses 'removeUser' field in update-user to unfollow someone
  return updateUserProfile({ removeUser: username })
}
