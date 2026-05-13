import { authApi } from './api'

export interface Notification {
  _id: string
  key: 'Like' | 'Comment' | 'Follow'
  message: string
  read: boolean
  createdAt: string
  user?: {
    username: string
    pic?: string
    fullName?: string
  }
  post?: any
}

export async function getNotifications(page: number = 0): Promise<Notification[]> {
  const response = await authApi.get(`/user/notification/list?pageNumber=${page}`)
  return response.data || []
}

export async function getUnreadCount(): Promise<{ Notification: number; Message: number }> {
  const response = await authApi.get('/user/unread/')
  return response.data || { Notification: 0, Message: 0 }
}
