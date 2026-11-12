import { ArrowRight } from 'lucide-react'
import { photos } from '../config/images'
import { kitchen } from '../content/sections'
import { Photo } from '../components/Photo'
import { ImageReveal, Parallax, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'
import { Sprig } from '../components/Botanicals'

export function Kitchen() {
  return (
    <section id="cozinha" aria-labelledby="cozinha-titulo" className="on-light section-y relative bg-surface">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5 lg:pt-10" id="cozinha-titulo">
            <SectionHeading eyebrow={kitchen.eyebrow} title={kitchen.title} />
            <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-ink-soft">
              {kitchen.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <p className="text-pretty">{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.25} className="mt-10">
              <a href="#cardapio" className="btn btn-ghost-light group">
                {kitchen.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
              </a>
            </Reveal>
          </div>

          <div className="relative lg:col-span-7">
            <div className="relative ml-auto w-full sm:w-[88%]">
              <ImageReveal className="aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
                <Parallax range={40} className="h-[112%] -translate-y-[6%]">
                  <Photo
                    src={photos.kitchenMain.src}
                    alt={photos.kitchenMain.alt}
                    focus={photos.kitchenMain.focus}
                    width={1100}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </Parallax>
              </ImageReveal>

              <Reveal delay={0.35} y={40} className="absolute -bottom-10 -left-4 w-[44%] sm:-left-[14%] sm:w-[40%]">
                <div className="border-[10px] border-surface bg-surface">
                  <div className="aspect-square overflow-hidden">
                    <Photo src={photos.kitchenDetail.src} alt={photos.kitchenDetail.alt} width={560} ratio={1} sizes="20vw" />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.5} className="absolute -right-2 top-8 hidden max-w-[14rem] bg-forest p-6 text-on-dark sm:block lg:-right-8">
                <Sprig className="mb-3 h-7 w-7 text-clay-light" />
                <p className="font-display text-[1.25rem] leading-snug" style={{ fontStyle: 'italic', fontWeight: 300 }}>
                  {kitchen.quote}
                </p>
                <p className="eyebrow mt-4 text-[0.625rem] text-on-dark-soft">{kitchen.quoteAuthor}</p>
              </Reveal>
            </div>
          </div>
        </div>

        <ol className="mt-28 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4">
          {kitchen.principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="group border-t border-line py-7">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-[0.95rem] text-clay">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-[1.5rem] leading-tight text-ink">{p.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
