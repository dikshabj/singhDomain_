'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Search, 
  MessageCircle, 
  HelpCircle
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AnnouncementBar from '@/components/AnnouncementBar'
import FloatingBackground from '@/components/FloatingBackground'

const faqs = [
  {
    q: "How does Singh Domains Work?",
    a: "On the Singh Platform, you can build your own Web3 domain ecosystem to generate passive income from royalties: register the TLD you prefer (e.g. .lambo) and every time someone buys a domain with your TLD (e.g. when.lambo), you earn—without lifting a finger!\n\nSingh Platform offers Web3 TLDs and domains affordably while letting users generate passive income from royalties."
  },
  {
    q: "What is a Singh Domains TLD?",
    a: "A TLD (Top-Level Domain) is everything that follows the final dot of a domain name. For example, in the domain name ‘Singh Platform’, ‘.io’ is the TLD.\n\nSingh Platform royalty allows you to earn passive income every time someone registers a domain on a TLD (e.g. .lambo) owned by you."
  },
  {
    q: "Are there Renewal Fees?",
    a: "No! Once you’ve bought a Singh Platform Domain or TLD, it’s yours forever—with no renewal fees ever!"
  },
  {
    q: "Which Chains are Supported?",
    a: "• Polygon\n• Cronos\n• Binance"
  },
  {
    q: "What are SINGH domains?",
    a: "Singh Platform domains are Web3 domains (NFTs) minted on the Polygon blockchain. You can connect them to your crypto wallet for transactions."
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-40 pb-20 px-6 overflow-hidden">
        <FloatingBackground density="medium" />
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-yellow-600/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <HelpCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 text-xs font-bold tracking-widest uppercase">Support Center</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display mb-8 tracking-tighter" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              FREQUENTLY ASKED <span className="text-gradient">QUESTIONS</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
              Everything you need to know about Singh Domains.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden focus-within:border-yellow-500/50 transition-all duration-300">
                <Search className="absolute left-6 text-gray-500 w-5 h-5 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-transparent text-[var(--text-primary)] placeholder-gray-600 focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="pb-32 px-6 relative z-10 overflow-hidden">
        <FloatingBackground density="medium" />
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`glass-card overflow-hidden group border ${isOpen ? 'border-yellow-500/30 bg-yellow-500/[0.02]' : 'border-[var(--border)] hover:border-white/10'}`}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full px-8 py-7 flex items-center justify-between text-left transition-all"
                    >
                      <span className={`text-xl font-semibold transition-colors duration-300 ${isOpen ? 'text-yellow-500' : 'text-[var(--text-primary)]'}`}>
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-6 h-6 transition-transform duration-500 ${isOpen ? 'rotate-180 text-yellow-500' : 'text-gray-600'}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="px-8 pb-8 text-[var(--text-secondary)] leading-relaxed text-lg whitespace-pre-line">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })
            ) : (
              <div className="text-center py-20 glass-card">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No answers found</h3>
                <p className="text-gray-500">Try searching for different keywords.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA / Still have questions? */}
      <section className="py-24 px-6 border-t border-[var(--border)] relative z-10 overflow-hidden">
        <FloatingBackground density="medium" />
        <div className="absolute inset-0 bg-yellow-500/[0.02] -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 md:p-16 border-yellow-500/10 hover:border-yellow-500/20">
            <h2 className="text-3xl md:text-5xl font-display mb-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              STILL HAVE <span className="text-gradient">QUESTIONS?</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
              Our team and community are always here to help you get started with your Web3 journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="btn-gold px-12 py-4 rounded-xl text-lg font-bold">
                Join Discord
              </button>
              <button className="btn-outline px-12 py-4 rounded-xl text-lg font-bold">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
