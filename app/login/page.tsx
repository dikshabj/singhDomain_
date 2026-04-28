'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingBackground from '@/components/FloatingBackground'
import { loginUser, saveProfile, isLoggedIn } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      router.push('/')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email')
      return
    }
    if (!password.trim()) {
      toast.error('Please enter your password')
      return
    }

    setIsLoading(true)

    try {
      const data = await loginUser(email, password)
      saveProfile(data)
      toast.success('Login successful! Redirecting...')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.activate ||
        error?.response?.data?.error ||
        'Invalid credentials. Please try again.'
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

        {/* Background blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-400/10 dark:bg-yellow-500/5 rounded-full blur-[150px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-300/10 dark:bg-orange-500/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Login Card */}
          <div className="glass-card p-8 md:p-10 border-yellow-500/20 hover:border-yellow-500/30 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 mb-6 shadow-lg shadow-yellow-500/20">
                <LogIn className="w-8 h-8 text-black" />
              </div>
              <h1
                className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Welcome Back
              </h1>
              <p className="text-[var(--text-secondary)] text-sm">
                Login to access your Singh Domain dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all"
                    id="login-email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition-all"
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-yellow-500 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed relative z-10"
                id="login-submit"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Login
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">or</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Signup link */}
            <p className="text-center text-[var(--text-secondary)] text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-yellow-600 dark:text-yellow-400 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

          {/* Bottom security badge */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              Secured with SSL encryption
            </span>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
