'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { 
  LogIn, 
  Search, 
  Wallet, 
  ShoppingCart, 
  CheckSquare, 
  CreditCard, 
  Zap, 
  ShieldCheck,
  ChevronRight,
  Globe,
  Cpu,
  Network,
  Code,
  Database,
  Hash,
  AtSign,
  Link,
  Server
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingBackground from '@/components/FloatingBackground'

const steps = [
  {
    title: "Step 1: Login or Register",
    description: "Login to the Singh Platform using your email and password. If you don't have an account, simply register.",
    icon: LogIn,
    color: "#F5C518",
    image: "/images/how-to-buy/step1-login.jpg"
  },
  {
    title: "Step 2: Search for a Domain",
    description: "Use the search bar to find the domain you want.",
    icon: Search,
    color: "#FFD700",
    image: "/images/how-to-buy/step4-add-to-cart.jpg"
  },
  {
    title: "Step 3: Connect Your Wallet",
    description: "Click the Connect Wallet button to link your crypto wallet. If you do not have a MetaMask wallet, you can download it first.",
    icon: Wallet,
    color: "#E6B800",
    image: "/images/how-to-buy/step3-wallet.jpg"
  },
  {
    title: "Step 4: Add Domain to Cart",
    description: "Click the Add to Cart button to include your chosen domain in your shopping cart.",
    icon: ShoppingCart,
    color: "#F5C518",
    image: "/images/how-to-buy/step4-add-to-cart.jpg"
  },
  {
    title: "Step 5: Review Your Cart",
    description: "Double-check the items in your cart and make any necessary changes before proceeding. Once satisfied, click the Proceed to Checkout button.",
    icon: CheckSquare,
    color: "#FFD700",
    image: "/images/how-to-buy/step5-cart.jpg"
  },
  {
    title: "Step 6: Enter Billing Information",
    description: "Fill in your payment details, including your name, address, and payment method.",
    icon: CreditCard,
    color: "#E6B800",
    image: "/images/how-to-buy/step6-billing.jpg"
  },
  {
    title: "Step 7: Complete Payment",
    description: "Click the Pay Now button to finalize your purchase.",
    icon: Zap,
    color: "#F5C518",
    image: "/images/how-to-buy/step7-checkout.jpg"
  },
  {
    title: "Step 8: Verify Your Domain",
    description: "Head to your domain list to confirm your newly purchased domain is there.",
    icon: ShieldCheck,
    color: "#FFD700",
    image: "/images/how-to-buy/step8-verify.jpg"
  }
]

export default function HowToBuyPage() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden relative">
      {/* Global page gradient — light theme richness */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Top-left warm amber blob */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-yellow-300/20 dark:bg-yellow-500/5 blur-[140px]" />
        {/* Top-right cool accent */}
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-orange-200/25 dark:bg-orange-500/5 blur-[120px]" />
        {/* Bottom center warm glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-yellow-200/20 dark:bg-yellow-600/5 blur-[160px]" />
        {/* Mid-left subtle peach */}
        <div className="absolute top-1/2 -left-20 w-[350px] h-[350px] rounded-full bg-amber-200/20 dark:bg-amber-500/5 blur-[100px]" />
        {/* Mid-right subtle gold */}
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-yellow-100/30 dark:bg-yellow-400/5 blur-[130px]" />
      </div>
      <Navbar />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <FloatingBackground density="medium" />
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-300/15 dark:bg-yellow-600/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-10 right-10 w-[200px] h-[200px] bg-amber-300/20 dark:bg-amber-500/5 rounded-full blur-[80px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display mb-6 tracking-tighter" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              HOW TO <span className="text-gradient">BUY A DOMAIN</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Follow these simple steps to secure your unique Web3 identity on the Singh Platform. 
              Ownership simplified for the next generation of the web.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 px-6 relative z-10">
        <FloatingBackground density="medium" />
        {/* Section gradient blobs — light theme richness */}
        <div className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-yellow-300/15 dark:bg-yellow-500/5 blur-[130px] -z-10" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-orange-200/20 dark:bg-orange-500/5 blur-[110px] -z-10" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] rounded-full bg-amber-200/20 dark:bg-amber-500/5 blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-yellow-200/25 dark:bg-yellow-400/5 blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto relative px-4">
          
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-yellow-500/0 via-yellow-500/40 to-yellow-500/0 hidden md:block" />

          <div className="space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24 relative`}
              >
                {/* Step Number Circle (Desktop) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[var(--bg-primary)] border-2 border-yellow-500/50 flex items-center justify-center z-20 hidden md:flex shadow-[0_0_15px_rgba(245,197,24,0.2)]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-black text-lg">
                    {index + 1}
                  </div>
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-1/2 text-center ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 glass-card border-yellow-500/30 group hover:border-yellow-500/60 transition-all duration-500 shadow-lg ${index % 2 === 0 ? 'md:ml-auto' : 'mx-auto md:mr-auto'}`}>
                    <step.icon className="w-8 h-8 text-yellow-500 dark:text-yellow-400 group-hover:rotate-12 transition-all duration-500" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-primary)] leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
                    {step.title}
                  </h3>
                  <p className={`text-[var(--text-secondary)] text-lg leading-relaxed max-w-lg mx-auto ${index % 2 === 0 ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    {step.description}
                  </p>
                </div>

                {/* Visualization Side */}
                <div className="w-full md:w-1/2">
                  <div className="glass-card p-2 rounded-2xl border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-700 shadow-2xl relative group overflow-hidden">
                    {/* Inner glow on hover */}
                    <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    
                    <div className="relative rounded-xl overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center min-h-[300px]">
                      {step.image ? (
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-yellow-500/40">
                          <step.icon className="w-16 h-16" />
                          <span className="text-xs uppercase tracking-widest font-bold">Screenshot Coming Soon</span>
                        </div>
                      )}
                    </div>

                    {/* Decorative Corner Accents */}
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-500/10 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-500/10 rounded-bl-2xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative z-10">
        <FloatingBackground density="medium" />
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 border-yellow-500/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display mb-8" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
              READY TO OWN YOUR <span className="text-gradient">DIGITAL FUTURE?</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-xl mx-auto">
              Join thousands of users who have already secured their Web3 domains on the Singh Platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="btn-gold px-10 py-4 rounded-xl text-lg font-bold flex items-center gap-2 group">
                Get Started Now <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-outline px-10 py-4 rounded-xl text-lg font-bold">
                View Pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
