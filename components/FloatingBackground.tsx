'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe,
  Cpu,
  Network,
  Code,
  Database,
  Hash,
  AtSign,
  Link,
  Server,
  Zap,
  ShieldCheck,
  Cpu as Chip,
  Layers,
  Box,
  Fingerprint,
  Wifi,
  Cloud
} from 'lucide-react'

interface FloatingBackgroundProps {
  density?: 'high' | 'medium' | 'low'
}

export default function FloatingBackground({ density = 'medium' }: FloatingBackgroundProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Optimization: Delayed start for animations
    const timer = setTimeout(() => {
      setHasMounted(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const allIcons = [
    { Icon: Globe,    x1: '8%',  y1: '5%',  x2: '14%', y2: '12%', size: 110, delay: 0,   dur: 20 },
    { Icon: Cpu,      x1: '88%', y1: '8%',  x2: '82%', y2: '15%', size: 75,  delay: 2,   dur: 24 },
    { Icon: Network,  x1: '3%',  y1: '35%', x2: '9%',  y2: '28%', size: 95,  delay: 5,   dur: 22 },
    { Icon: Code,     x1: '85%', y1: '55%', x2: '79%', y2: '62%', size: 85,  delay: 1,   dur: 18 },
    { Icon: Database, x1: '6%',  y1: '80%', x2: '12%', y2: '73%', size: 100, delay: 4,   dur: 28 },
    { Icon: Hash,     x1: '80%', y1: '20%', x2: '86%', y2: '27%', size: 65,  delay: 3,   dur: 21 },
    { Icon: AtSign,   x1: '75%', y1: '75%', x2: '70%', y2: '82%', size: 80,  delay: 6,   dur: 26 },
    { Icon: Link,     x1: '88%', y1: '45%', x2: '82%', y2: '52%', size: 70,  delay: 2,   dur: 23 },
    { Icon: Server,   x1: '10%', y1: '60%', x2: '4%',  y2: '67%', size: 90,  delay: 7,   dur: 30 },
    { Icon: Globe,    x1: '45%', y1: '3%',  x2: '50%', y2: '8%',  size: 60,  delay: 3.5, dur: 19 },
    { Icon: Zap,      x1: '50%', y1: '90%', x2: '55%', y2: '83%', size: 70,  delay: 1.5, dur: 25 },
    { Icon: ShieldCheck, x1: '30%', y1: '15%', x2: '35%', y2: '22%', size: 65, delay: 8, dur: 28 },
  ]

  const allPills = [
    { text: '.eth',    x1: '4%',  y1: '10%', x2: '8%',  y2: '16%', dur: 16, delay: 0   },
    { text: '.sol',    x1: '87%', y1: '25%', x2: '83%', y2: '32%', dur: 20, delay: 1.5 },
    { text: '.singh',  x1: '5%',  y1: '50%', x2: '10%', y2: '44%', dur: 18, delay: 3   },
    { text: '.web3',   x1: '82%', y1: '75%', x2: '75%', y2: '85%', dur: 22, delay: 0.5 },
    { text: '.crypto', x1: '40%', y1: '92%', x2: '46%', y2: '86%', dur: 17, delay: 4   },
    { text: '.meta',   x1: '60%', y1: '5%',  x2: '55%', y2: '12%', dur: 19, delay: 2   },
  ]

  const iconCount = density === 'high' ? allIcons.length : density === 'medium' ? 8 : 4
  const pillCount = density === 'high' ? allPills.length : density === 'medium' ? 4 : 2
  const dotCount = density === 'high' ? 20 : density === 'medium' ? 10 : 5

  const icons = allIcons.slice(0, iconCount)
  const pills = allPills.slice(0, pillCount)

  return (
    <div className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-0 transition-opacity duration-1000 ${hasMounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Drifting Icons */}
      {hasMounted && icons.map((item, i) => (
        <motion.div
          key={`icon-${i}`}
          className={`absolute text-yellow-500 ${i > 4 ? 'hidden md:block' : ''}`}
          style={{ left: item.x1, top: item.y1 }}
          initial={{ left: item.x1, top: item.y1 }}
          animate={{
            left: [item.x1, item.x2, item.x1],
            top:  [item.y1, item.y2, item.y1],
            rotate: [0, 15, -10, 0],
            opacity: [0.1, 0.25, 0.1], 
            scale: [1, 1.05, 0.97, 1],
          }}
          transition={{
            duration: item.dur,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <item.Icon size={item.size} strokeWidth={0.6} />
        </motion.div>
      ))}

      {/* Floating Domain Extension Pills */}
      {hasMounted && pills.map((item, i) => (
        <motion.div
          key={`pill-${i}`}
          className={`absolute font-mono font-bold select-none ${i > 2 ? 'hidden md:block' : ''}`}
          style={{
            background: 'rgba(245,197,24,0.12)',
            border: '1px solid rgba(245,197,24,0.3)',
            borderRadius: '100px',
            padding: '4px 14px',
            fontSize: '13px',
            color: 'rgba(245,197,24,0.6)',
            letterSpacing: '0.05em',
            left: item.x1,
            top: item.y1,
          }}
          initial={{ left: item.x1, top: item.y1 }}
          animate={{
            left: [item.x1, item.x2, item.x1],
            top:  [item.y1, item.y2, item.y1],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: item.dur,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          {item.text}
        </motion.div>
      ))}

      {/* Subtle animated dots grid accent */}
      {hasMounted && Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            left: `${(i * 13) % 100}%`,
            top: `${(i * 17) % 100}%`,
          }}
          animate={{
            y: [0, -25, 15, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 0.7, 1],
          }}
          transition={{
            duration: 5 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
