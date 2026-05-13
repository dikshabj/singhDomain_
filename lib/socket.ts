import { io, Socket } from 'socket.io-client'
import { getProfile } from './auth'

const SOCKET_URL = 'http://localhost:4000'

class SocketService {
  private socket: Socket | null = null

  connect(userId: string) {
    if (this.socket?.connected) return

    this.socket = io(SOCKET_URL, {
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      console.log('Connected to socket server')
      // Authenticate with the user's ID as expected by handleAuthenticate
      this.socket?.emit('authenticate', { uid_from: userId })
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
    })

    this.socket.on('error', (err) => {
      console.error('Socket error:', err)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  sendMessage(data: { userId: string, authId: string, message: string }) {
    if (this.socket) {
      this.socket.emit('message', data)
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('message', callback)
    }
  }
}

const socketService = new SocketService()
export default socketService
