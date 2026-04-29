'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingBackground from '@/components/FloatingBackground'
import { verifyOtp, getSavedEmail, isLoggedIn } from '@/lib/auth'

export default function VerifyOtpPage() {
  const router = useRouter()
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/')
      return
    }

    const savedEmail = getSavedEmail()
    if (!savedEmail) {
      toast.error('Session expired. Please register again.')
      router.push('/signup')
    } else {
      setEmail(savedEmail)
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp.trim()) {
      toast.error('Please enter the OTP')
      return
    }

    setIsLoading(true)

    try {
      await verifyOtp(email, Number(otp))
      toast.success('Account verified successfully! You can now login.')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        'Invalid OTP. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) return null

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

        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-300/10 dark:bg-orange-500/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* OTP Card */}
          <div className="glass-card p-8 md:p-10 border-yellow-500/20 hover:border-yellow-500/30 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 mb-6 shadow-lg shadow-yellow-500/20">
                <ShieldCheck className="w-8 h-8 text-black" />
              </div>
              <h1
                className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Verify OTP
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">
                We've sent a verification code to <br/>
                <span className="font-semibold text-[var(--text-primary)]">{email}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2 text-center">
                  Enter Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all text-center text-xl font-bold tracking-widest [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    id="verify-otp"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !otp}
                className="w-full btn-gold py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed relative z-10"
                id="verify-submit"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Login link */}
            <p className="text-center text-[var(--text-secondary)] text-sm">
              Already verified?{' '}
              <Link
                href="/login"
                className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
