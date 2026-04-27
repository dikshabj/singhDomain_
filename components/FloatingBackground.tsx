'use client'

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
  const allIcons = [
    { Icon: Globe,    x1: '8%',  y1: '5%',  x2: '14%', y2: '12%', size: 110, delay: 0,   dur: 18 },
    { Icon: Cpu,      x1: '88%', y1: '8%',  x2: '82%', y2: '15%', size: 75,  delay: 2,   dur: 22 },
    { Icon: Network,  x1: '3%',  y1: '35%', x2: '9%',  y2: '28%', size: 95,  delay: 5,   dur: 20 },
    { Icon: Code,     x1: '85%', y1: '55%', x2: '79%', y2: '62%', size: 85,  delay: 1,   dur: 16 },
    { Icon: Database, x1: '6%',  y1: '80%', x2: '12%', y2: '73%', size: 100, delay: 4,   dur: 25 },
    { Icon: Hash,     x1: '80%', y1: '20%', x2: '86%', y2: '27%', size: 65,  delay: 3,   dur: 19 },
    { Icon: AtSign,   x1: '75%', y1: '75%', x2: '70%', y2: '82%', size: 80,  delay: 6,   dur: 24 },
    { Icon: Link,     x1: '88%', y1: '45%', x2: '82%', y2: '52%', size: 70,  delay: 2,   dur: 21 },
    { Icon: Server,   x1: '10%', y1: '60%', x2: '4%',  y2: '67%', size: 90,  delay: 7,   dur: 28 },
    { Icon: Globe,    x1: '45%', y1: '3%',  x2: '50%', y2: '8%',  size: 60,  delay: 3.5, dur: 17 },
    { Icon: Zap,      x1: '50%', y1: '90%', x2: '55%', y2: '83%', size: 70,  delay: 1.5, dur: 23 },
    { Icon: ShieldCheck, x1: '30%', y1: '15%', x2: '35%', y2: '22%', size: 65, delay: 8, dur: 26 },
    { Icon: Chip,     x1: '25%', y1: '45%', x2: '20%', y2: '50%', size: 80, delay: 1, dur: 20 },
    { Icon: Layers,   x1: '65%', y1: '15%', x2: '70%', y2: '10%', size: 70, delay: 4, dur: 18 },
    { Icon: Box,      x1: '15%', y1: '25%', x2: '10%', y2: '30%', size: 90, delay: 2, dur: 25 },
    { Icon: Fingerprint, x1: '40%', y1: '65%', x2: '35%', y2: '70%', size: 75, delay: 6, dur: 22 },
    { Icon: Wifi,     x1: '70%', y1: '85%', x2: '75%', y2: '80%', size: 65, delay: 3, dur: 19 },
    { Icon: Cloud,    x1: '55%', y1: '35%', x2: '60%', y2: '40%', size: 85, delay: 5, dur: 24 },
  ]

  const allPills = [
    { text: '.eth',    x1: '4%',  y1: '10%', x2: '8%',  y2: '16%', dur: 14, delay: 0   },
    { text: '.sol',    x1: '87%', y1: '25%', x2: '83%', y2: '32%', dur: 18, delay: 1.5 },
    { text: '.singh',  x1: '5%',  y1: '50%', x2: '10%', y2: '44%', dur: 16, delay: 3   },
    { text: '.web3',   x1: '82%', y1: '68%', x2: '78%', y2: '74%', dur: 20, delay: 0.5 },
    { text: '.crypto', x1: '40%', y1: '92%', x2: '46%', y2: '86%', dur: 15, delay: 4   },
    { text: '.meta',   x1: '60%', y1: '5%',  x2: '55%', y2: '12%', dur: 17, delay: 2   },
    { text: '.nft',    x1: '20%', y1: '85%', x2: '26%', y2: '79%', dur: 22, delay: 5   },
    { text: '.dao',    x1: '73%', y1: '42%', x2: '68%', y2: '49%', dur: 19, delay: 1   },
    { text: '.xyz',    x1: '15%', y1: '15%', x2: '12%', y2: '20%', dur: 16, delay: 2.5 },
    { text: '.ai',     x1: '80%', y1: '80%', x2: '75%', y2: '85%', dur: 21, delay: 4.5 },
    { text: '.link',   x1: '35%', y1: '5%',  x2: '40%', y2: '10%', dur: 14, delay: 1   },
    { text: '.site',   x1: '10%', y1: '90%', x2: '15%', y2: '85%', dur: 18, delay: 3   },
    { text: '.online', x1: '65%', y1: '50%', x2: '60%', y2: '55%', dur: 22, delay: 2   },
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
          className="absolute text-yellow-500"
          animate={{
            left: [item.x1, item.x2, item.x1],
            top:  [item.y1, item.y2, item.y1],
            rotate: [0, 15, -10, 0],
            opacity: [0.15, 0.35, 0.15], 
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
          className="absolute font-mono font-bold select-none"
          style={{
            background: 'rgba(245,197,24,0.12)',
            border: '1px solid rgba(245,197,24,0.3)',
            borderRadius: '100px',
            padding: '4px 14px',
            fontSize: '13px',
            color: 'rgba(245,197,24,0.6)',
            letterSpacing: '0.05em',
          }}
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
