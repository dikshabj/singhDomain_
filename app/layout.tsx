import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SinghDomain - Web3 Domains & TLDs with Zero Renewal Fees',
  description: 'Get your Web3 Domains and TLDs with Zero Renewal Fees. Be a registrar, mint Web3 TLDs, and own your digital identity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
