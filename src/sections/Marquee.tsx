import { marqueeWords } from '../content/sections'
import { Sprig } from '../components/Botanicals'

/** Faixa tipográfica em movimento contínuo (pausa com redução de movimento). */
export function Marquee() {
  const row = [...marqueeWords, ...marqueeWords]
  return (
    <div className="on-light overflow-hidden border-y border-line bg-cream py-6 sm:py-8" aria-hidden="true">
      <div className="animate-marquee flex w-max items-center">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span
                  className="font-display opsz-max whitespace-nowrap px-6 text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] text-ink"
                  style={i % 2 ? { fontStyle: 'italic', fontWeight: 300, color: 'var(--color-clay)' } : undefined}
                >
                  {w}
                </span>
                <Sprig className="h-7 w-7 shrink-0 text-olive" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
