import { authApi } from './api'

export interface Connection {
  _id: string
  modelId: string
  chatId: string
  updatedAt: string
  user: {
    _id: string
    username: string
    pic?: string
    fullName?: string
    accountType: string
  }
  lastMessage?: {
    content: string
    creatorId: string
    createdAt: string
    key: string
  }
  unread: number
}

export async function getConnectionList(page: number = 0): Promise<Connection[]> {
  const response = await authApi.get(`/connection/list?pageNumber=${page}`)
  return response.data || []
}

export async function getChatMessages(chatId: string, page: number = 0) {
  const response = await authApi.get(`/chats/?chatId=${chatId}&pageNumber=${page}`)
  return response.data || []
}

export async function searchMessagingUsers(query: string) {
  const response = await authApi.get(`/messaging/search/?query=${query}`)
  return response.data || []
}
