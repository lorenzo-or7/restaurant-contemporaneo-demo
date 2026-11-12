import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowUp } from 'lucide-react'
import { useRef } from 'react'
import { site } from '../config/site'
import { Sprig } from '../components/Botanicals'

const YEAR = new Date().getFullYear()

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const markY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['35%', '0%'])

  return (
    <footer ref={ref} className="relative overflow-hidden bg-forest text-on-dark">
      <div className="container-x pt-20 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <a href="#inicio" className="inline-flex items-center gap-2.5" aria-label={`${site.name}, voltar ao início`}>
              <Sprig className="h-6 w-6 text-clay-light" />
              <span className="font-display text-[1.6rem] tracking-[0.06em]" style={{ fontWeight: 400 }}>
                {site.name}
              </span>
            </a>
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-on-dark-soft">{site.shortAbout}</p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-2">
            <p className="eyebrow mb-4 text-[0.62rem] text-clay-light">Navegar</p>
            <ul className="space-y-1">
              {[...site.nav, { id: 'galeria', label: 'Galeria' }, { id: 'localizacao', label: 'Localização' }].map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="link-underline inline-block py-1 text-[0.95rem] text-on-dark/85 hover:text-on-dark">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4 text-[0.62rem] text-clay-light">Horários</p>
            <ul className="space-y-2 text-[0.92rem] text-on-dark/85">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <span className="block text-on-dark">{h.days}</span>
                  <span className="text-on-dark-soft">
                    {!h.lunch && !h.dinner ? 'Fechado' : [h.lunch, h.dinner].filter(Boolean).join(' · ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className="eyebrow mb-4 text-[0.62rem] text-clay-light">Contato</p>
            <ul className="space-y-1.5 text-[0.92rem] text-on-dark/85">
              <li>{site.contact.phoneDisplay}</li>
              <li>{site.contact.email}</li>
              <li className="text-on-dark-soft">
                {site.location.street} · {site.location.district}
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2" aria-label="Redes sociais">
              {site.socials.map((s) =>
                s.url ? (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline py-1 text-[0.85rem] font-semibold uppercase tracking-[0.12em]">
                      {s.label}
                    </a>
                  </li>
                ) : (
                  <li key={s.label} className="text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-on-dark-soft" title="Link configurável em src/config/site.ts">
                    {s.label}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* wordmark monumental (como no rodapé da referência) */}
      <div className="relative mt-14 select-none overflow-hidden" aria-hidden="true">
        <motion.p
          style={{ y: markY }}
          className="font-display text-center leading-[0.78] text-clay"
        >
          <span
            className="block text-[clamp(5.5rem,24vw,22rem)] tracking-[0.04em]"
            style={{ fontWeight: 300, fontVariationSettings: "'opsz' 144" }}
          >
            {site.name}
          </span>
        </motion.p>
      </div>

      <div className="border-t border-forest-line">
        <div className="container-x flex flex-col gap-4 py-6 text-[0.8rem] text-on-dark-soft md:flex-row md:items-center md:justify-between">
          <p>
            © {YEAR} {site.name} · {site.demoNotice}
          </p>
          <div className="flex items-center justify-between gap-6">
            <a href={site.credits.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-on-dark">
              <span className="text-on-dark-soft">Designed &amp; Developed by</span>
              <span className="font-semibold tracking-[0.04em] transition-colors group-hover:text-clay-light">Or7.dev</span>
            </a>
            <a href="#inicio" aria-label="Voltar ao topo" className="grid h-11 w-11 place-items-center rounded-full border border-on-dark/25 text-on-dark transition-colors hover:border-clay-light hover:text-clay-light">
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
