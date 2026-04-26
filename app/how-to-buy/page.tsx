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
  ChevronRight
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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
    <main className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden">
      <Navbar />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow-600/5 rounded-full blur-[100px] -z-10" />

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
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto relative">
          
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-yellow-500/30 to-transparent hidden md:block" />

          <div className="space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 relative`}
              >
                {/* Step Number Circle (Desktop) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-yellow-500/50 flex items-center justify-center z-10 hidden md:flex">
                  <span className="text-yellow-400 font-bold">{index + 1}</span>
                </div>

                {/* Content Side */}
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 glass-card border-yellow-500/20 group hover:border-yellow-500/50 transition-all duration-500`}>
                    <step.icon className="w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Visualization/Placeholder Side */}
                <div className="w-full md:w-1/2">
                  <div className="glass-card p-4 flex items-center justify-center relative overflow-hidden group min-h-[180px]">
                    {step.image ? (
                      <div className="relative w-full rounded-xl overflow-hidden bg-[var(--bg-secondary)] flex items-center justify-center p-4">
                        <img 
                          src={step.image} 
                          alt={step.title}
                          className="w-auto max-w-full max-h-[420px] rounded-lg object-contain transition-transform duration-700 group-hover:scale-105 shadow-xl"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Animated gradient bg */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10 text-center">
                          <div className="w-20 h-20 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                            <step.icon className="w-10 h-10 text-yellow-400" />
                          </div>
                          <div className="h-1 w-12 bg-yellow-500 mx-auto rounded-full mb-4" />
                          <span className="text-xs uppercase tracking-[0.3em] text-yellow-500/60 font-semibold">Visual Representation</span>
                        </div>
                      </>
                    )}

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-white/5" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-white/5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/5 -z-10" />
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
