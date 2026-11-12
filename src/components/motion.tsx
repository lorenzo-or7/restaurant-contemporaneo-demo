import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef, type ReactNode, type ElementType } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Revelação estrutural: sobe e aparece ao entrar na viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = 'div',
  amount = 0.25,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'p' | 'span' | 'section' | 'header'
  amount?: number
}) {
  const reduce = useReducedMotion()
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: reduce ? 0.3 : 0.9, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </Comp>
  )
}

/** Linhas de título que sobem de dentro de uma máscara (estilo editorial). */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  as: Tag = 'h2',
  inView = true,
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  as?: ElementType
  /** true = anima ao entrar na tela; false = anima imediatamente (hero) */
  inView?: boolean
}) {
  const reduce = useReducedMotion()
  const trigger = inView ? { whileInView: 'show', viewport: { once: true, amount: 0.5 } } : { animate: 'show' }
  return (
    <Tag className={className}>
      <motion.span className="block" initial="hidden" {...trigger}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className={'block ' + (lineClassName ?? '')}
              variants={{
                hidden: reduce ? { opacity: 0 } : { y: '105%' },
                show: reduce ? { opacity: 1 } : { y: '0%' },
              }}
              transition={{ duration: reduce ? 0.3 : 1.05, ease: EASE, delay: delay + i * stagger }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/** Máscara de imagem: a foto se revela de baixo para cima com leve zoom-out. */
export function ImageReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
}) {
  const reduce = useReducedMotion()
  const hidden = {
    up: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  }[direction]
  // O gatilho fica num wrapper sem clip-path: o Chrome considera o recorte
  // no IntersectionObserver e nunca dispararia com inset(100%).
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      <motion.div
        className="h-full w-full overflow-hidden"
        variants={{
          hidden: reduce ? { opacity: 0 } : { clipPath: hidden },
          show: reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' },
        }}
        transition={{ duration: reduce ? 0.3 : 1.25, ease: [0.77, 0, 0.18, 1], delay }}
      >
        <motion.div
          className="h-full w-full"
          variants={{ hidden: reduce ? {} : { scale: 1.18 }, show: { scale: 1 } }}
          transition={{ duration: 1.6, ease: EASE, delay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/** Retorna um MotionValue de deslocamento vertical para parallax discreto. */
export function useParallax(range = 60): [React.RefObject<HTMLDivElement | null>, MotionValue<number>] {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-range, range])
  return [ref, y]
}

export function Parallax({ children, className, range = 50 }: { children: ReactNode; className?: string; range?: number }) {
  const [ref, y] = useParallax(range)
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}
