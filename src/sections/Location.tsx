import { motion, useReducedMotion } from 'motion/react'
import { Clock, MapPin, Navigation, Phone } from 'lucide-react'
import { site } from '../config/site'
import { location } from '../content/sections'
import { Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'

/** Mapa ilustrativo (SVG original), usado enquanto não há um Google Maps configurado. */
function IllustratedMap() {
  const reduce = useReducedMotion()
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#ece4d3]" role="img" aria-label="Mapa ilustrativo da localização demonstrativa do restaurante">
      <svg viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="600" height="480" fill="#ece4d3" />
        {/* quadras */}
        {Array.from({ length: 7 }).map((_, r) =>
          Array.from({ length: 8 }).map((__, c) => (
            <rect
              key={`${r}-${c}`}
              x={c * 80 - 20 + (r % 2) * 14}
              y={r * 74 - 10}
              width={62}
              height={56}
              rx={3}
              fill={(r * 3 + c) % 7 === 0 ? '#d4dcc0' : '#e3d9c5'}
            />
          )),
        )}
        {/* parque */}
        <rect x="372" y="64" width="142" height="130" rx="6" fill="#c9d4b0" />
        <circle cx="420" cy="110" r="10" fill="#b5c39a" />
        <circle cx="470" cy="150" r="14" fill="#b5c39a" />
        {/* avenidas */}
        <path d="M-20 300 C 140 280, 260 330, 620 250" stroke="#fffdf8" strokeWidth="18" fill="none" />
        <path d="M200 -20 C 220 140, 180 300, 240 500" stroke="#fffdf8" strokeWidth="14" fill="none" />
        <path d="M-20 120 L 620 160" stroke="#fffdf8" strokeWidth="9" fill="none" />
        {/* rio */}
        <path d="M-20 430 C 120 400, 260 460, 420 420 S 620 400, 640 410" stroke="#bcd0cf" strokeWidth="22" fill="none" opacity=".8" />
      </svg>
      {/* marcador */}
      <div className="absolute left-[44%] top-[52%] -translate-x-1/2 -translate-y-full">
        {!reduce && (
          <motion.span
            className="absolute left-1/2 top-full block h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-clay/40"
            animate={{ scale: [0.6, 1.8], opacity: [0.7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="relative flex flex-col items-center">
          <span className="whitespace-nowrap bg-forest px-3 py-1.5 font-display text-[0.95rem] text-on-dark shadow-lg">{site.name}</span>
          <span className="h-0 w-0 border-x-[7px] border-t-[8px] border-x-transparent border-t-forest" />
        </span>
      </div>
      <span className="absolute bottom-3 left-3 bg-surface/90 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-ink-soft">
        Mapa ilustrativo
      </span>
    </div>
  )
}

export function Location() {
  const loc = site.location
  return (
    <section id="localizacao" aria-labelledby="localizacao-titulo" className="on-light section-y bg-surface">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <div id="localizacao-titulo">
            <SectionHeading eyebrow={location.eyebrow} title={location.title} />
          </div>

          <Reveal delay={0.1} className="mt-10 space-y-8">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-clay" strokeWidth={1.6} />
              <address className="not-italic">
                <p className="font-display text-[1.4rem] leading-tight text-ink">{loc.street}</p>
                <p className="mt-1 text-ink-soft">
                  {loc.district} · {loc.city}
                </p>
                {loc.isDemo && (
                  <p className="mt-3 inline-block border border-line bg-cream px-2.5 py-1 text-[0.75rem] font-medium text-ink-soft">
                    {loc.reference}
                  </p>
                )}
              </address>
            </div>

            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-clay" strokeWidth={1.6} />
              <div>
                {site.contact.phoneHref ? (
                  <a href={`tel:${site.contact.phoneHref}`} className="font-display link-underline text-[1.4rem] text-ink">
                    {site.contact.phoneDisplay}
                  </a>
                ) : (
                  <p className="font-display text-[1.4rem] text-ink">{site.contact.phoneDisplay}</p>
                )}
                <p className="mt-1 text-ink-soft">{site.contact.email} · contato demonstrativo</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-clay" strokeWidth={1.6} />
              <table className="w-full text-left text-[0.95rem]">
                <caption className="sr-only">Horários de funcionamento</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Dias</th>
                    <th scope="col">Almoço</th>
                    <th scope="col">Jantar</th>
                  </tr>
                </thead>
                <tbody>
                  {site.hours.map((h) => (
                    <tr key={h.days} className="border-b border-line last:border-0">
                      <th scope="row" className="py-2.5 pr-4 font-semibold text-ink">
                        {h.days}
                      </th>
                      {!h.lunch && !h.dinner ? (
                        <td colSpan={2} className="py-2.5 text-ink-soft">
                          Fechado
                        </td>
                      ) : (
                        <>
                          <td className="py-2.5 pr-4 text-ink-soft">{h.lunch ?? '—'}</td>
                          <td className="py-2.5 text-ink-soft">{h.dinner ?? '—'}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <a href="#reservas" className="btn btn-primary">
                Reservar mesa
              </a>
              {loc.directionsUrl && (
                <a href={loc.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                  <Navigation className="h-4 w-4" />
                  Como chegar
                </a>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={40} className="lg:col-span-7">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-line lg:aspect-auto lg:h-full lg:min-h-[32rem]">
            {loc.mapEmbedUrl ? (
              <iframe
                src={loc.mapEmbedUrl}
                title={`Mapa de localização do ${site.name}`}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <IllustratedMap />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
