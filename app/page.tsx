import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import dynamic from 'next/dynamic'

// Dynamically import below-the-fold sections for performance
const SponsoredSection = dynamic(() => import('@/components/SponsoredSection'), { 
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-yellow-500/5 rounded-3xl" />
})
const FeaturesSection = dynamic(() => import('@/components/FeaturesSection'), { 
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-orange-500/5 rounded-3xl" />
})
const MintSection = dynamic(() => import('@/components/MintSection'), { 
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse bg-yellow-500/5 rounded-3xl" />
})
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true })

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* Lazy loaded sections */}
      <SponsoredSection />
      <FeaturesSection />
      <MintSection />
      
      <Footer />
    </main>
  )
}
