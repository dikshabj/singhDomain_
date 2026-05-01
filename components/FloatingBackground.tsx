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
    setHasMounted(true)
  }, [])

  const allIcons = [
    { Icon: Globe,    x1: '15%', y1: '20%', x2: '20%', y2: '28%', size: 50,  delay: 0,   dur: 18 },
    { Icon: Cpu,      x1: '85%', y1: '15%', x2: '78%', y2: '25%', size: 45,  delay: 2,   dur: 22 },
    { Icon: Network,  x1: '5%',  y1: '45%', x2: '12%', y2: '38%', size: 55,  delay: 5,   dur: 20 },
    { Icon: Code,     x1: '92%', y1: '65%', x2: '85%', y2: '75%', size: 40,  delay: 1,   dur: 16 },
    { Icon: Database, x1: '12%', y1: '85%', x2: '18%', y2: '78%', size: 50,  delay: 4,   dur: 25 },
    { Icon: Hash,     x1: '75%', y1: '35%', x2: '82%', y2: '42%', size: 35,  delay: 3,   dur: 19 },
    { Icon: AtSign,   x1: '70%', y1: '85%', x2: '65%', y2: '92%', size: 45,  delay: 6,   dur: 24 },
    { Icon: Link,     x1: '95%', y1: '45%', x2: '88%', y2: '55%', size: 35,  delay: 2,   dur: 21 },
    { Icon: Server,   x1: '20%', y1: '65%', x2: '12%', y2: '75%', size: 45,  delay: 7,   dur: 28 },
    { Icon: Globe,    x1: '45%', y1: '5%',  x2: '50%', y2: '12%', size: 35,  delay: 3.5, dur: 17 },
  ]

  const allPills = [
    { text: '.eth',    x1: '20%', y1: '15%', x2: '24%', y2: '22%', dur: 14, delay: 0   },
    { text: '.sol',    x1: '75%', y1: '25%', x2: '70%', y2: '35%', dur: 18, delay: 1.5 },
    { text: '.singh',  x1: '8%',  y1: '55%', x2: '14%', y2: '48%', dur: 16, delay: 3   },
    { text: '.web3',   x1: '82%', y1: '75%', x2: '75%', y2: '85%', dur: 20, delay: 0.5 },
    { text: '.crypto', x1: '45%', y1: '90%', x2: '52%', y2: '82%', dur: 15, delay: 4   },
    { text: '.meta',   x1: '55%', y1: '12%', x2: '50%', y2: '20%', dur: 17, delay: 2   },
  ]

  // Filter based on density
  const iconCount = density === 'high' ? allIcons.length : density === 'medium' ? 10 : 5
  const pillCount = density === 'high' ? allPills.length : density === 'medium' ? 6 : 3
  const dotCount = density === 'high' ? 25 : density === 'medium' ? 12 : 6

  const icons = allIcons.slice(0, iconCount)
  const pills = allPills.slice(0, pillCount)

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
      {/* Drifting Icons */}
      {icons.map((item, i) => (
        <motion.div
          key={`icon-${i}`}
          className={`absolute text-yellow-500 ${i > 4 ? 'hidden md:block' : ''}`}
          animate={{
            left: [item.x1, item.x2, item.x1],
            top:  [item.y1, item.y2, item.y1],
            rotate: [0, 15, -10, 0],
            opacity: [0.05, 0.15, 0.05], 
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
      {pills.map((item, i) => (
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
            opacity: [0.6, 0.9, 0.6],
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
      {Array.from({ length: dotCount }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            left: `${(i * 13) % 100}%`,
            top: `${(i * 17) % 100}%`,
          }}
          animate={{
            y: [0, -25, 15, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 0.7, 1],
          }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
