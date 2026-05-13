'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, TrendingUp, Users, DollarSign, PieChart, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Event, getEventAnalytics } from '@/lib/event'
import toast from 'react-hot-toast'

interface AnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
}

export default function AnalyticsModal({ isOpen, onClose, event }: AnalyticsModalProps) {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (isOpen && event) {
      fetchAnalytics()
    }
  }, [isOpen, event])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await getEventAnalytics(event!._id)
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        setStats(response) // Fallback for different API formats
      }
    } catch (error) {
      toast.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!event || !event.soldTo || event.soldTo.length === 0) {
      toast.error('No attendees to export')
      return
    }

    const headers = ['Username', 'User ID', 'Wallet Address', 'Order ID', 'Tickets', 'Price Paid', 'Date']
    const csvContent = [
      headers.join(','),
      ...event.soldTo.map(attendee => [
        `"${attendee.username || 'Anonymous'}"`,
        `"${attendee.userId}"`,
        `"${attendee.walletAddress || ''}"`,
        `"${attendee.orderId || ''}"`,
        attendee.ticket,
        attendee.price || 0,
        `"${new Date(attendee.date).toLocaleString()}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}_Attendees.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Attendee list exported!')
  }

  if (!event) return null

  const ticketsSold = stats?.totalTicketSold || 0
  const totalTickets = stats?.totalTickets || event.totalTickets || 0
  const fillPercentage = totalTickets > 0 ? (ticketsSold / totalTickets) * 100 : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-3xl bg-[var(--bg-secondary)] border border-yellow-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-yellow-500/10 flex items-center justify-between bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Event Analytics</h2>
                  <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    Insights for <span className="text-yellow-500">"{event.name}"</span>
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-yellow-500/10 rounded-xl text-[var(--text-secondary)] hover:text-yellow-500 transition-all">
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-yellow-500" size={40} />
                <p className="text-[var(--text-secondary)] font-bold animate-pulse">Calculating insights...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   <StatCard 
                    label="Total Revenue" 
                    value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} 
                    icon={<DollarSign size={18} />} 
                    color="text-green-500"
                    bg="bg-green-500/10"
                   />
                   <StatCard 
                    label="Tickets Sold" 
                    value={stats?.totalTicketSold || 0} 
                    icon={<Users size={18} />} 
                    color="text-blue-500"
                    bg="bg-blue-500/10"
                   />
                   <StatCard 
                    label="Available" 
                    value={stats?.ticketsAvailable || 0} 
                    icon={<PieChart size={18} />} 
                    color="text-yellow-500"
                    bg="bg-yellow-500/10"
                   />
                   <StatCard 
                    label="Conversion" 
                    value={`${(totalTickets > 0 ? (ticketsSold / totalTickets) * 100 : 0).toFixed(1)}%`} 
                    icon={<TrendingUp size={18} />} 
                    color="text-purple-500"
                    bg="bg-purple-500/10"
                   />
                </div>

                {/* Progress Visualizer */}
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-yellow-500/10 transition-all duration-700" />
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-lg font-black text-white">Ticket Inventory</h3>
                      <p className="text-[var(--text-secondary)] text-xs">Real-time capacity tracking</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-yellow-500">{ticketsSold}</span>
                      <span className="text-[var(--text-secondary)] font-bold text-sm"> / {totalTickets} sold</span>
                    </div>
                  </div>

                  <div className="h-6 bg-black/40 rounded-full border border-white/5 p-1 relative overflow-hidden shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${fillPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] relative"
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-bar-stripes_1s_linear_infinite]" />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center">
                    <div>
                      <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Status</p>
                      <p className={`text-xs font-black mt-1 ${fillPercentage > 90 ? 'text-red-500' : 'text-green-500'}`}>
                        {fillPercentage > 90 ? 'ALMOST FULL' : 'HEALTHY'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Velocity</p>
                      <div className="flex items-center justify-center gap-1 text-green-500 mt-1">
                        <ArrowUpRight size={12} />
                        <span className="text-xs font-black">+12%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-tighter">Remaining</p>
                      <p className="text-xs font-black text-white mt-1">{stats?.ticketsAvailable} units</p>
                    </div>
                  </div>
                </div>

                {/* Engagement Tips */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-2xl border border-yellow-500/10">
                    <h4 className="font-bold text-sm text-yellow-500 mb-2">Organizer Tip</h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Your conversion rate is currently {((ticketsSold / totalTickets) * 100 || 0).toFixed(1)}%. 
                      Try sharing this event on social media to reach more potential attendees.
                    </p>
                  </div>
                  <div className="p-6 bg-black/20 rounded-2xl border border-white/5">
                    <h4 className="font-bold text-sm text-[var(--text-secondary)] mb-2">Quick Action</h4>
                    <button 
                      onClick={handleExportCSV}
                      className="w-full btn-gold py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Export Attendee List (CSV)
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Footer */}
            <div className="p-4 border-t border-yellow-500/10 bg-black/20 flex items-center justify-center flex-shrink-0">
               <div className="text-[10px] font-bold text-yellow-500/50 uppercase tracking-widest">
                 SINGHDOMAIN INTELLIGENCE ENGINE V1.0
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function StatCard({ label, value, icon, color, bg }: any) {
  return (
    <div className={`p-4 rounded-2xl border border-white/5 ${bg} transition-transform hover:scale-[1.02] duration-300`}>
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">{label}</p>
      <p className="text-xl font-black text-white mt-1">{value}</p>
    </div>
  )
}
