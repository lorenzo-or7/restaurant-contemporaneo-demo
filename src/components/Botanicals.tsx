import { motion, useReducedMotion } from 'motion/react'

/**
 * Ilustrações botânicas originais (traço), usadas como elementos decorativos
 * gastronômicos: ramo de alecrim, folha de manjericão e ramo de oliveira.
 */

export function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M32 58C32 40 33 24 38 8" />
      <path d="M33 46c-6-2-10-7-11-13 6 1 10 6 11 13Z" />
      <path d="M33 46c5-3 9-8 9-14-5 2-9 7-9 14Z" />
      <path d="M34 32c-5-2-8-6-9-11 5 1 8 5 9 11Z" />
      <path d="M34 32c4-2 7-7 7-11-4 2-7 6-7 11Z" />
      <path d="M36 19c-3-2-5-5-5-8 3 1 5 4 5 8Z" />
      <path d="M36 19c3-2 4-5 4-8-3 1-4 4-4 8Z" />
    </svg>
  )
}

export function Rosemary({ className }: { className?: string }) {
  const leaves = Array.from({ length: 14 }, (_, i) => i)
  return (
    <svg viewBox="0 0 120 320" fill="none" className={className} aria-hidden="true">
      <path d="M62 316C58 230 56 140 66 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {leaves.map((i) => {
        const y = 290 - i * 19
        const x = 60 + (i / 14) * 5
        const len = 34 - i * 1.3
        return (
          <g key={i} fill="currentColor">
            <path d={`M${x} ${y}c-${len * 0.5} -4 -${len} -14 -${len} -22c${len * 0.6} 2 ${len * 0.9} 12 ${len} 22Z`} opacity="0.92" />
            <path d={`M${x + 1} ${y - 9}c${len * 0.5} -4 ${len} -14 ${len} -22c-${len * 0.6} 2 -${len * 0.9} 12 -${len} 22Z`} opacity="0.8" />
          </g>
        )
      })}
    </svg>
  )
}

export function OliveBranch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 140" fill="none" className={className} aria-hidden="true">
      <path d="M6 128C60 104 118 70 232 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {[
        [40, 112, -30],
        [62, 100, 28],
        [86, 88, -36],
        [108, 76, 24],
        [130, 64, -32],
        [152, 52, 22],
        [176, 40, -30],
        [198, 28, 18],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="17" ry="5.2" transform={`rotate(${r} ${x} ${y})`} fill="currentColor" opacity={0.75 + (i % 2) * 0.2} />
      ))}
      <circle cx="96" cy="98" r="5.5" fill="currentColor" opacity="0.55" />
      <circle cx="160" cy="62" r="5" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

export function Basil({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <path d="M20 104C38 58 70 28 108 14C98 54 70 92 20 104Z" fill="currentColor" opacity="0.9" />
      <path d="M22 102C50 74 74 48 104 18" stroke="rgba(0,0,0,.25)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M44 82l-6-14M58 66l-4-16M72 52l-2-14M60 70l14 2M76 54l14 0" stroke="rgba(0,0,0,.18)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

/** Envolve um elemento decorativo com movimento ambiental lento (respeita redução de movimento). */
export function Drift({
  children,
  className,
  duration = 9,
  rotate = 4,
  y = 10,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
  rotate?: number
  y?: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      aria-hidden="true"
      animate={reduce ? undefined : { rotate: [0, rotate, 0, -rotate * 0.6, 0], y: [0, -y, 0, y * 0.6, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}
