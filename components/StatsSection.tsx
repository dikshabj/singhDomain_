'use client'
import { motion } from 'framer-motion'

export default function StatsSection() {
  const stats = [
    { label: 'Domains Registered', value: '12K+' },
    { label: 'TLDs Available', value: '50+' },
    { label: 'Blockchains', value: '6+' },
    { label: 'Renewal Fee', value: '$0' },
  ]

  return (
    <section className="relative z-10 py-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card px-6 py-8 text-center flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] relative group"
              style={{
                boxShadow: '0 10px 40px -15px rgba(245, 197, 24, 0.15)',
                border: '1px solid rgba(245, 197, 24, 0.1)'
              }}
            >
              {/* Inner glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-colors duration-300 pointer-events-none" />
              
              <div className="text-4xl font-bold text-yellow-400 mb-2 leading-none drop-shadow-[0_0_15px_rgba(245,197,24,0.3)]" style={{fontFamily:'Bebas Neue'}}>{stat.value}</div>
              <div className="text-xs text-[var(--text-secondary)] uppercase tracking-widest opacity-70 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
