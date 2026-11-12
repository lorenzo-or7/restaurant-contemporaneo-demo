import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { differentials } from '../content/sections'
import { Photo } from '../components/Photo'
import { EASE, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'
import { Drift, OliveBranch } from '../components/Botanicals'

export function Differentials() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const current = differentials.items[active]

  return (
    <section id="diferenciais" aria-labelledby="diferenciais-titulo" className="on-light section-y relative overflow-hidden bg-cream">
      <Drift className="pointer-events-none absolute -right-16 top-10 w-72 text-olive/25" rotate={4} duration={14}>
        <OliveBranch className="w-full -scale-x-100" />
      </Drift>

      <div className="container-x relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6" id="diferenciais-titulo">
          <SectionHeading eyebrow={differentials.eyebrow} title={differentials.title} />

          <ul className="mt-12 border-t border-line">
            {differentials.items.map((item, i) => {
              const isActive = i === active
              return (
                <Reveal as="li" key={item.id} delay={i * 0.06} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={isActive}
                    aria-controls="diferencial-imagem"
                    className="group flex w-full items-center gap-5 py-5 text-left sm:gap-7 sm:py-6"
                  >
                    <span
                      className={
                        'relative h-14 w-14 shrink-0 overflow-hidden rounded-full transition-[transform,box-shadow] duration-500 sm:h-16 sm:w-16 ' +
                        (isActive ? 'scale-105 shadow-[0_0_0_2px_var(--color-cream),0_0_0_3px_var(--color-clay)]' : 'grayscale-[35%] group-hover:grayscale-0')
                      }
                    >
                      <Photo src={item.photo.src} alt="" width={160} ratio={1} sizes="64px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={
                          'font-display block text-[1.45rem] leading-tight transition-colors duration-300 sm:text-[1.75rem] ' +
                          (isActive ? 'text-ink' : 'text-ink/55 group-hover:text-ink')
                        }
                      >
                        {item.title}
                      </span>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.span
                            className="block overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                          >
                            <span className="block pt-2 text-[0.98rem] leading-relaxed text-ink-soft">{item.text}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span
                      aria-hidden="true"
                      className={
                        'hidden h-px shrink-0 bg-clay transition-all duration-500 sm:block ' + (isActive ? 'w-10' : 'w-0 group-hover:w-5')
                      }
                    />
                  </button>
                </Reveal>
              )
            })}
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <Reveal y={40} className="relative">
            <div id="diferencial-imagem" aria-live="polite" className="relative aspect-[4/5] overflow-hidden bg-cream-deep lg:aspect-[5/6]">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current.id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 0 100%)', scale: 1.08 }}
                  animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0 0%)', scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 1, zIndex: 0 }}
                  transition={{ duration: reduce ? 0.2 : 1, ease: [0.77, 0, 0.18, 1] }}
                  style={{ zIndex: 1 }}
                >
                  <Photo src={current.photo.src} alt={current.photo.alt} width={1100} sizes="(min-width: 1024px) 45vw, 100vw" />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute -left-3 top-8 z-10 bg-surface px-6 py-5 shadow-[0_18px_40px_-20px_rgba(37,40,31,.35)] sm:-left-8">
              <p className="eyebrow text-[0.625rem] text-ink-soft">{differentials.badgeLabel}</p>
              <p className="font-display mt-1 text-[1.9rem] leading-none text-clay" style={{ fontStyle: 'italic', fontWeight: 300 }}>
                {differentials.badgeValue}
              </p>
            </div>

            <p className="absolute bottom-0 right-0 z-10 bg-forest px-5 py-3 text-[0.8rem] tracking-[0.06em] text-on-dark">
              <span className="font-display mr-2 text-clay-light">0{active + 1}</span>
              {current.title}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
