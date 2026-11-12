import { motion, useReducedMotion, type PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { testimonials } from '../content/sections'
import { EASE, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'
import { Drift, Rosemary } from '../components/Botanicals'

function usePerView() {
  const [n, setN] = useState(1)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setN(mq.matches ? 2 : 1)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return n
}

export function Testimonials() {
  const items = testimonials.items
  const perView = usePerView()
  const pages = Math.max(1, items.length - perView + 1)
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()
  const safeIndex = Math.min(index, pages - 1)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const GAP = 20

  const go = (to: number) => setIndex(((to % pages) + pages) % pages)

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(safeIndex + 1)
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(safeIndex - 1)
    }
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(safeIndex + 1)
    else if (info.offset.x > 60 || info.velocity.x > 400) go(safeIndex - 1)
  }

  return (
    <section aria-labelledby="depoimentos-titulo" className="on-light section-y relative overflow-hidden bg-surface">
      <Drift className="pointer-events-none absolute -right-6 -top-10 w-32 rotate-[200deg] text-olive/30 sm:w-44" rotate={4} duration={12}>
        <Rosemary className="w-full" />
      </Drift>

      <div className="container-x">
        <div id="depoimentos-titulo">
          <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} align="center" className="max-w-3xl" />
        </div>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-md text-center text-[0.85rem] text-ink-soft">{testimonials.disclaimer}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-14">
          <div
            role="region"
            aria-roledescription="carrossel"
            aria-label="Depoimentos demonstrativos"
            ref={viewportRef}
            tabIndex={0}
            onKeyDown={onKey}
            className="overflow-hidden focus-visible:outline-offset-8"
          >
            <motion.ul
              className="flex cursor-grab touch-pan-y active:cursor-grabbing"
              animate={{ x: -safeIndex * ((width + GAP) / perView) }}
              transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              style={{ gap: GAP }}
            >
              {items.map((t, i) => {
                const visible = i >= safeIndex && i < safeIndex + perView
                return (
                  <li
                    key={t.name}
                    aria-roledescription="slide"
                    aria-label={`${i + 1} de ${items.length}`}
                    aria-hidden={!visible}
                    inert={!visible}
                    className="shrink-0 select-none"
                    style={{ width: `calc((100% - ${(perView - 1) * GAP}px) / ${perView})` }}
                  >
                    <figure
                      className={
                        'relative flex h-full flex-col justify-between bg-forest p-8 text-on-dark transition-opacity duration-700 sm:p-10 ' +
                        (visible ? 'opacity-100' : 'opacity-40')
                      }
                    >
                      <span aria-hidden="true" className="font-display absolute right-5 top-1 text-[5rem] leading-none text-clay-light/35 sm:right-8 sm:top-2 sm:text-[7rem]">
                        ”
                      </span>
                      <blockquote className="relative pr-6 sm:pr-10">
                        <p className="font-display opsz-max text-[clamp(1.25rem,1.1rem+0.6vw,1.6rem)] leading-[1.35]" style={{ fontWeight: 300 }}>
                          {t.quote}
                        </p>
                      </blockquote>
                      <figcaption className="mt-10 flex items-center gap-4 border-t border-forest-line pt-6">
                        <span
                          aria-hidden="true"
                          className="font-display grid h-12 w-12 shrink-0 place-items-center rounded-full bg-clay text-[1.1rem] text-cream"
                        >
                          {t.name.charAt(0)}
                        </span>
                        <span>
                          <span className="block font-semibold text-on-dark">{t.name}</span>
                          <span className="block text-sm text-on-dark-soft">{t.context} · exemplo demonstrativo</span>
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                )
              })}
            </motion.ul>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-2" role="group" aria-label="Escolher depoimento">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ir para o depoimento ${i + 1}`}
                  aria-current={i === safeIndex ? 'true' : undefined}
                  className="group grid h-11 w-6 place-items-center sm:w-8"
                >
                  <span
                    className={
                      'block h-[3px] transition-all duration-500 ' + (i === safeIndex ? 'w-8 bg-clay' : 'w-4 bg-line group-hover:bg-ink-soft')
                    }
                  />
                </button>
              ))}
              <span className="ml-2 whitespace-nowrap font-display text-ink-soft sm:ml-3" aria-live="polite">
                <span className="text-ink">{String(safeIndex + 1).padStart(2, '0')}</span> / {String(pages).padStart(2, '0')}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(safeIndex - 1)}
                aria-label="Depoimento anterior"
                className="grid h-12 w-12 place-items-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-cream"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => go(safeIndex + 1)}
                aria-label="Próximo depoimento"
                className="grid h-12 w-12 place-items-center rounded-full bg-clay text-cream transition-colors hover:bg-clay-hover"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
