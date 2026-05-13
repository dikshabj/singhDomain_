'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Search, ArrowLeft, Send, Image as ImageIcon, User, MoreVertical } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import FloatingBackground from '@/components/FloatingBackground'
import { getConnectionList, Connection, getChatMessages } from '@/lib/message'
import { isLoggedIn, getProfile } from '@/lib/auth'
import socketService from '@/lib/socket'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'

export default function MessagesPage() {
  const router = useRouter()
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedChat, setSelectedChat] = useState<Connection | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isMessagesLoading, setIsMessagesLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login')
      return
    }
    const profile = getProfile()
    if (profile?._id) {
      socketService.connect(profile._id)
    }

    fetchConnections()

    socketService.onMessage((msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socketService.disconnect()
    }
  }, [])

  const fetchConnections = async () => {
    try {
      setIsLoading(true)
      const data = await getConnectionList(0)
      setConnections(data)
    } catch (error) {
      toast.error('Failed to load chats')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChatSelect = async (chat: Connection) => {
    setSelectedChat(chat)
    setIsMessagesLoading(true)
    try {
      const data = await getChatMessages(chat.chatId, 0)
      setMessages(data)
    } catch (error) {
      toast.error('Failed to load messages')
    } finally {
      setIsMessagesLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return
    const profile = getProfile()
    if (!profile?._id) return

    const messageData = {
      userId: selectedChat.modelId, // Receiver
      authId: profile._id, // Sender
      message: newMessage
    }

    socketService.sendMessage(messageData)
    
    // Add to local state immediately for better UX
    const localMsg = {
      content: newMessage,
      creatorId: profile._id,
      creator_timeStamp: 'Just now'
    }
    setMessages(prev => [...prev, localMsg])
    setNewMessage('')
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster position="top-right" />
      <Navbar />
      <FloatingBackground density="low" />

      <section className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)]">
          
          {/* Left Sidebar - Navigation */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <Sidebar />
          </div>

          {/* Chat List */}
          <div className={`col-span-1 lg:col-span-4 glass-card overflow-hidden flex flex-col ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
            <div className="p-4 border-b border-yellow-500/10">
              <h2 className="text-xl font-bold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="w-full bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-500/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : connections.length > 0 ? (
                connections.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className={`w-full p-3 rounded-2xl flex gap-3 transition-all ${selectedChat?.chatId === chat.chatId ? 'bg-yellow-500/10 border border-yellow-500/20' : 'hover:bg-white/5 border border-transparent'}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 shrink-0 overflow-hidden border border-yellow-500/10">
                      {chat.user.pic ? (
                        <img src={chat.user.pic} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-yellow-500 font-bold">
                          {chat.user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold truncate text-sm">@{chat.user.username}</h4>
                        <span className="text-[10px] text-[var(--text-secondary)]">
                          {chat.updatedAt && formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: false }).replace('about ', '')}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black self-center">
                        {chat.unread}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-10 text-[var(--text-secondary)] text-sm">
                  No chats found
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`col-span-1 lg:col-span-5 glass-card overflow-hidden flex flex-col ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-yellow-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedChat(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors lg:hidden"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 overflow-hidden border border-yellow-500/10">
                       {selectedChat.user.pic ? (
                        <img src={selectedChat.user.pic} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-yellow-500 font-bold">
                          {selectedChat.user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">@{selectedChat.user.username}</h4>
                      <p className="text-[10px] text-green-500">Online</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/5 rounded-full text-[var(--text-secondary)]">
                    <MoreVertical size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5">
                  {isMessagesLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.creatorId === selectedChat.modelId ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.creatorId === selectedChat.modelId ? 'bg-[var(--bg-secondary)] border border-yellow-500/10' : 'bg-yellow-500 text-black font-medium'}`}>
                          {msg.content}
                          <div className={`text-[8px] mt-1 ${msg.creatorId === selectedChat.modelId ? 'text-[var(--text-secondary)]' : 'text-black/60'}`}>
                            {msg.creator_timeStamp || 'Just now'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 text-[var(--text-secondary)] text-sm italic">
                      Start a conversation with @{selectedChat.user.username}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-yellow-500/10">
                  <div className="flex gap-2">
                    <button className="p-3 bg-white/5 rounded-xl text-yellow-500 hover:bg-white/10 transition-all">
                      <ImageIcon size={20} />
                    </button>
                    <input 
                      type="text" 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..." 
                      className="flex-1 bg-[var(--bg-secondary)] border border-yellow-500/10 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500/50"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="p-3 bg-yellow-500 rounded-xl text-black font-bold hover:scale-105 transition-all shadow-lg shadow-yellow-500/20"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-500">
                  <Mail size={48} />
                </div>
                <h3 className="text-xl font-bold">Select a message</h3>
                <p className="text-[var(--text-secondary)] text-sm max-w-xs">
                  Choose from your existing conversations or start a new one to begin messaging.
                </p>
                <button className="btn-gold px-8 py-3 rounded-xl font-bold">
                  New Message
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  )
}
