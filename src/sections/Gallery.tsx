import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight, Expand } from 'lucide-react'
import { useEffect, useState } from 'react'
import { galleryPhotos, photoUrl } from '../config/images'
import { gallery } from '../content/sections'
import { Photo } from '../components/Photo'
import { Dialog } from '../components/Dialog'
import { EASE, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'

const span = {
  tall: 'row-span-2 col-span-1 md:col-span-3',
  wide: 'col-span-2 md:col-span-6',
  square: 'col-span-1 md:col-span-3',
}

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null)
  const [dir, setDir] = useState(1)
  const reduce = useReducedMotion()
  const n = galleryPhotos.length

  const go = (delta: number) => {
    setDir(delta)
    setIndex((i) => (i === null ? 0 : (i + delta + n) % n))
  }

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index === null])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1)
    else if (info.offset.x > 60) go(-1)
  }

  const current = index !== null ? galleryPhotos[index] : null

  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="on-light section-y bg-cream">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end" id="galeria-titulo">
          <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />
          <Reveal delay={0.1}>
            <p className="max-w-xs text-ink-soft">Toque em uma foto para ampliar e navegar pela galeria.</p>
          </Reveal>
        </div>

        <ul className="mt-12 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-2.5 sm:auto-rows-[12rem] md:grid-cols-12 md:gap-3 lg:auto-rows-[14rem]">
          {galleryPhotos.map((p, i) => (
            <Reveal as="li" key={p.src} delay={(i % 4) * 0.06} y={30} className={span[p.layout]}>
              <button
                type="button"
                onClick={() => {
                  setDir(1)
                  setIndex(i)
                }}
                aria-haspopup="dialog"
                className="group relative block h-full w-full overflow-hidden"
              >
                <span className="sr-only">Ampliar foto: {p.alt}</span>
                <span className="block h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]">
                  <Photo src={p.src} alt="" width={p.layout === 'wide' ? 1100 : 640} sizes={p.layout === 'wide' ? '50vw' : '25vw'} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-t from-[#0f130d]/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between p-4 text-on-dark opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <span className="font-display text-[1.1rem]">{p.caption}</span>
                  <Expand className="h-4 w-4" strokeWidth={1.6} />
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <Dialog
        open={index !== null}
        onClose={() => setIndex(null)}
        title="Galeria de fotos"
        variant="fullscreen"
        tone="dark"
        closeLabel="Fechar galeria"
        className="h-[100dvh]"
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.figure
                  key={index}
                  custom={dir}
                  className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-4 pt-16 sm:px-20"
                  initial={{ opacity: 0, x: reduce ? 0 : dir * 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : dir * -80 }}
                  transition={{ duration: reduce ? 0.15 : 0.6, ease: EASE }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={onDragEnd}
                >
                  <div className="relative h-full w-full max-w-6xl">
                    <img
                      src={photoUrl(current.src, 1800, undefined, 80)}
                      alt={current.alt}
                      className="h-full w-full select-none object-contain"
                      draggable={false}
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <span className="font-display text-[1.3rem] text-on-dark">{current.caption}</span>
                    <span className="mt-1 block text-sm text-on-dark-soft">{current.alt}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-on-dark/30 text-on-dark transition-colors hover:bg-on-dark hover:text-forest sm:grid"
              >
                <ArrowLeft className="h-5 w-5" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-on-dark/30 text-on-dark transition-colors hover:bg-on-dark hover:text-forest sm:grid"
              >
                <ArrowRight className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-forest-line px-4 py-3 sm:px-6">
              <p className="font-display text-on-dark-soft" aria-live="polite">
                <span className="text-on-dark">{String(index + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
              </p>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                {galleryPhotos.map((p, i) => (
                  <button
                    key={p.src}
                    type="button"
                    onClick={() => {
                      setDir(i > index ? 1 : -1)
                      setIndex(i)
                    }}
                    aria-label={`Ver foto ${i + 1}: ${p.caption}`}
                    aria-current={i === index ? 'true' : undefined}
                    className={
                      'h-12 w-12 shrink-0 overflow-hidden transition-opacity sm:h-14 sm:w-14 ' +
                      (i === index ? 'opacity-100 ring-2 ring-clay-light ring-offset-2 ring-offset-forest' : 'opacity-45 hover:opacity-80')
                    }
                  >
                    <Photo src={p.src} alt="" width={120} ratio={1} sizes="56px" tone="dark" />
                  </button>
                ))}
              </div>
              <div className="flex gap-2 sm:hidden">
                <button type="button" onClick={() => go(-1)} aria-label="Foto anterior" className="grid h-11 w-11 place-items-center rounded-full border border-on-dark/30">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Próxima foto" className="grid h-11 w-11 place-items-center rounded-full border border-on-dark/30">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </section>
  )
}
