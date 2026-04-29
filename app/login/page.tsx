'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useGoogleLogin } from '@react-oauth/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingBackground from '@/components/FloatingBackground'
import { loginUser, googleLogin, saveProfile, isLoggedIn } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsGoogleLoading(true)
      try {
        const data = await googleLogin(codeResponse.access_token)
        saveProfile(data)
        toast.success('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } catch (error: any) {
        toast.error('Google login failed. Please try again.')
      } finally {
        setIsGoogleLoading(false)
      }
    },
    onError: () => {
      toast.error('Google login failed.')
    }
  })

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

              {/* Forgot Password Link */}
              <div className="flex justify-end mt-1 mb-4">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[var(--text-secondary)] hover:text-yellow-500 transition-colors"
                >
                  Forgot Password?
                </Link>
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

            {/* Google Login */}
            <button
              onClick={() => loginWithGoogle()}
              disabled={isGoogleLoading}
              className="w-full mb-6 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-3 transition-all hover:bg-[var(--bg-primary)] border border-[var(--border)]"
              style={{ background: 'var(--bg-secondary)' }}
            >
              {isGoogleLoading ? (
                <div className="w-5 h-5 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

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
