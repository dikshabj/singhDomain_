'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingBackground from '@/components/FloatingBackground'
import { forgotPassword } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)

    try {
      await forgotPassword(email)
      toast.success('OTP sent to your email!')
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
      }, 1500)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        'Failed to send OTP. Please check your email and try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
        }}
      />
      <Navbar />

      <section className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-32 overflow-hidden">
        <FloatingBackground density="low" />

        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[150px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 md:p-10 border-yellow-500/20 hover:border-yellow-500/30 shadow-2xl">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-yellow-500 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 mb-6 shadow-lg shadow-yellow-500/20">
                <KeyRound className="w-8 h-8 text-black" />
              </div>
              <h1
                className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Forgot Password
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">
                Enter your email address to receive an OTP for password reset.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed relative z-10"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  )
}
