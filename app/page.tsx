import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import SponsoredSection from '@/components/SponsoredSection'
import FeaturesSection from '@/components/FeaturesSection'
import MintSection from '@/components/MintSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <SponsoredSection />
      <FeaturesSection />
      <MintSection />
      <Footer />
    </main>
  )
}
