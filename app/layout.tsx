import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

import GoogleAuthProvider from '@/components/GoogleAuthProvider'

export const metadata: Metadata = {
  title: 'SinghDomain - Web3 Domains & TLDs with Zero Renewal Fees',
  description: 'Get your Web3 Domains and TLDs with Zero Renewal Fees. Be a registrar, mint Web3 TLDs, and own your digital identity.',
}

import toast, { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Toaster position="top-right" />
        <GoogleAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  )
}
