import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Plus } from 'lucide-react'
import { useState } from 'react'
import { experiences } from '../content/sections'
import { Photo } from '../components/Photo'
import { EASE, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'

/**
 * Painéis fotográficos expansíveis. No desktop o painel ativo se expande
 * (hover, foco ou clique); no mobile vira um acordeão por toque.
 */
export function Experiences() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const items = experiences.items

  return (
    <section id="experiencias" aria-labelledby="experiencias-titulo" className="section-y relative bg-forest text-on-dark">
      <div className="container-x">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7" id="experiencias-titulo">
            <SectionHeading tone="dark" eyebrow={experiences.eyebrow} title={experiences.title} />
          </div>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.15}>
            <p className="text-[1.0625rem] leading-relaxed text-on-dark-soft">{experiences.intro}</p>
          </Reveal>
        </div>

        {/* Desktop: painéis horizontais */}
        <Reveal delay={0.1} className="mt-16 hidden h-[38rem] gap-3 lg:flex xl:h-[42rem]">
          {items.map((item, i) => {
            const isActive = active === i
            return (
              <motion.article
                key={item.id}
                layout
                transition={{ layout: { duration: reduce ? 0 : 0.8, ease: EASE } }}
                onMouseEnter={() => setActive(i)}
                className="relative overflow-hidden"
                style={{ flex: isActive ? 2.6 : 1 }}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={isActive}
                  aria-controls={`exp-desc-${item.id}`}
                  className="group absolute inset-0 z-10 text-left"
                >
                  <span className="sr-only">Ver detalhes: {item.name}</span>
                </button>
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: isActive ? 1 : 1.12 }}
                  transition={{ duration: reduce ? 0 : 1.2, ease: EASE }}
                >
                  <Photo src={item.photo.src} alt={item.photo.alt} width={1280} sizes="60vw" tone="dark" />
                </motion.div>
                <div
                  className={
                    'pointer-events-none absolute inset-0 transition-colors duration-700 ' +
                    (isActive ? 'bg-gradient-to-t from-[#0f130d]/90 via-[#0f130d]/25 to-transparent' : 'bg-[#0f130d]/55')
                  }
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-7">
                  <span className="font-display text-[1.1rem] text-on-dark/80">{item.index}</span>
                  <span
                    className={
                      'grid h-10 w-10 place-items-center rounded-full border border-on-dark/40 transition-transform duration-500 ' +
                      (isActive ? 'rotate-45 opacity-0' : 'opacity-100')
                    }
                    aria-hidden="true"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 p-7 xl:p-9">
                  <h3
                    className={
                      'font-display opsz-max leading-[1.05] transition-[font-size] duration-700 ' +
                      (isActive ? 'text-[2.6rem] xl:text-[3rem]' : 'text-[1.6rem]')
                    }
                  >
                    {item.name}
                  </h3>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        id={`exp-desc-${item.id}`}
                        key="desc"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: reduce ? 0 : 0.35, duration: 0.6, ease: EASE } }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="max-w-[30rem]"
                      >
                        <p className="eyebrow mt-4 text-[0.68rem] text-clay-light">{item.when}</p>
                        <p className="mt-3 text-[1.02rem] leading-relaxed text-on-dark/85">{item.description}</p>
                        <p className="mt-4 text-sm text-on-dark-soft">{item.detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            )
          })}
        </Reveal>

        {/* Mobile/tablet: acordeão por toque */}
        <ul className="mt-12 flex flex-col gap-3 lg:hidden">
          {items.map((item, i) => {
            const isActive = active === i
            return (
              <Reveal as="li" key={item.id} delay={i * 0.06}>
                <article className="relative overflow-hidden">
                  <div className="relative overflow-hidden">
                    <div className={'relative transition-[aspect-ratio] duration-700 ' + (isActive ? 'aspect-[4/5] sm:aspect-[16/11]' : 'aspect-[16/7]')}>
                      <motion.div className="absolute inset-0" animate={{ scale: isActive ? 1 : 1.1 }} transition={{ duration: reduce ? 0 : 1, ease: EASE }}>
                        <Photo src={item.photo.src} alt={item.photo.alt} width={900} sizes="100vw" tone="dark" />
                      </motion.div>
                      <div
                        className={
                          'absolute inset-0 transition-colors duration-700 ' +
                          (isActive ? 'bg-gradient-to-t from-[#0f130d]/95 via-[#0f130d]/30 to-transparent' : 'bg-[#0f130d]/55')
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        aria-expanded={isActive}
                        aria-controls={`exp-m-${item.id}`}
                        className="absolute inset-0 flex flex-col justify-end p-5 text-left sm:p-7"
                      >
                        <span className="flex w-full items-end justify-between gap-4">
                          <span>
                            <span className="font-display block text-[0.95rem] text-on-dark/70">{item.index}</span>
                            <span className="font-display opsz-max mt-1 block text-[1.85rem] leading-[1.05]">{item.name}</span>
                          </span>
                          <span
                            aria-hidden="true"
                            className={
                              'grid h-10 w-10 shrink-0 place-items-center rounded-full border border-on-dark/40 transition-transform duration-500 ' +
                              (isActive ? 'rotate-45' : '')
                            }
                          >
                            <Plus className="h-4 w-4" strokeWidth={1.6} />
                          </span>
                        </span>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              id={`exp-m-${item.id}`}
                              className="block"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0, transition: { delay: reduce ? 0 : 0.25, duration: 0.5 } }}
                              exit={{ opacity: 0, transition: { duration: 0.1 } }}
                            >
                              <span className="eyebrow mt-4 block text-[0.66rem] text-clay-light">{item.when}</span>
                              <span className="mt-2 block text-[0.98rem] leading-relaxed text-on-dark/85">{item.description}</span>
                              <span className="mt-3 block text-sm text-on-dark-soft">{item.detail}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-forest-line pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-on-dark-soft">
            O menu do chef tem lugares limitados no balcão. Informe a experiência desejada no campo de observações da reserva.
          </p>
          <a href="#reservas" className="btn btn-primary group shrink-0">
            Reservar experiência
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
