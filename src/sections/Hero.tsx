import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { photos } from '../config/images'
import { hero } from '../content/sections'
import { Photo } from '../components/Photo'
import { EASE, MaskLines } from '../components/motion'
import { Basil, Drift, OliveBranch, Rosemary } from '../components/Botanicals'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const plateRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 38])
  const plateY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120])
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -60])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0.2])
  const ringRotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -24])

  return (
    <section
      id="inicio"
      ref={ref}
      aria-label="Apresentação"
      className="grain relative isolate overflow-hidden bg-forest text-on-dark"
    >
      {/* vinheta quente sutil atrás do prato */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] top-[8%] -z-10 h-[80vmin] w-[80vmin] rounded-full opacity-60 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(154,95,54,.28) 0%, rgba(27,32,25,0) 65%)' }}
      />

      {/* folhagem decorativa, canto superior esquerdo (como na referência) */}
      <Drift className="pointer-events-none absolute -left-10 top-16 w-28 text-olive opacity-70 sm:w-36 lg:-left-6 lg:top-20" rotate={5} duration={11}>
        <motion.div
          initial={{ opacity: 0, x: reduce ? 0 : -40, rotate: -30 }}
          animate={{ opacity: 1, x: 0, rotate: -18 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.6 }}
        >
          <Rosemary className="w-full" />
        </motion.div>
      </Drift>

      <div className="container-x relative grid min-h-[100svh] grid-cols-1 items-center gap-10 pb-24 pt-32 lg:grid-cols-12 lg:gap-6 lg:pb-28 lg:pt-36">
        {/* Texto */}
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10 lg:col-span-6 xl:col-span-6">
          <motion.p
            className="eyebrow mb-6 flex items-center gap-3 text-clay-light"
            initial={{ opacity: 0, x: reduce ? 0 : -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <span aria-hidden="true" className="h-px w-10 bg-current" />
            {hero.eyebrow}
          </motion.p>

          <MaskLines
            as="h1"
            inView={false}
            delay={0.18}
            stagger={0.11}
            className="font-display opsz-max text-[length:var(--text-display)] leading-[0.98]"
            lines={[
              ...hero.titleLines,
              <em key="accent" className="text-clay-light" style={{ fontStyle: 'italic', fontWeight: 300 }}>
                {hero.titleAccent}
              </em>,
            ]}
          />

          <motion.p
            className="mt-7 max-w-[30rem] text-[length:var(--text-lead)] leading-relaxed text-on-dark-soft"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
          >
            {hero.description}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.82, ease: EASE }}
          >
            <a href="#reservas" className="btn btn-primary group">
              {hero.primaryCta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
            </a>
            <a href="#cardapio" className="btn btn-ghost-dark">
              {hero.secondaryCta}
            </a>
          </motion.div>
        </motion.div>

        {/* Prato */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:col-span-6 lg:max-w-none">
          <div className="relative mx-auto aspect-square w-[min(88vw,34rem)] lg:ml-auto lg:mr-0 lg:w-[min(46vw,40rem)]">
            {/* anéis concêntricos (sousplat) */}
            <motion.div
              aria-hidden="true"
              style={{ rotate: ringRotate }}
              className="absolute -inset-[7%] rounded-full border border-dashed border-on-dark/12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, delay: 0.2, ease: EASE }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute -inset-[2.5%] rounded-full border border-on-dark/10"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            />

            {/* ramo de alecrim atrás do prato */}
            <Drift className="pointer-events-none absolute -right-[6%] -top-[14%] w-[22%] text-olive-light/70" rotate={6} duration={10} delay={1}>
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : -30, rotate: 40 }}
                animate={{ opacity: 1, y: 0, rotate: 28 }}
                transition={{ duration: 1.5, delay: 0.9, ease: EASE }}
              >
                <Rosemary className="w-full" />
              </motion.div>
            </Drift>

            <motion.div style={{ rotate: plateRotate, y: plateY }} className="absolute inset-0">
              <motion.div
                className="h-full w-full overflow-hidden rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,.65)]"
                initial={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at 50% 50%)', scale: 1.12, rotate: -28 }}
                animate={reduce ? { opacity: 1 } : { clipPath: 'circle(50% at 50% 50%)', scale: 1, rotate: 0 }}
                transition={{ duration: 1.3, ease: [0.77, 0, 0.18, 1], delay: 0 }}
              >
                <Photo
                  src={photos.heroPlate.src}
                  alt={photos.heroPlate.alt}
                  width={1100}
                  ratio={1}
                  sizes="(min-width: 1024px) 46vw, 88vw"
                  priority
                  tone="dark"
                  imgClassName="scale-[1.32] -translate-y-[7%]"
                />
              </motion.div>
            </motion.div>

            {/* acompanhamento */}
            <motion.div
              className="absolute -bottom-[4%] -left-[6%] w-[34%] sm:-left-[10%]"
              initial={{ opacity: 0, scale: reduce ? 1 : 0.6, x: reduce ? 0 : -30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.95, ease: EASE }}
            >
              <Drift duration={8} rotate={3} y={8}>
                <div className="aspect-square overflow-hidden rounded-full border-[6px] border-forest shadow-[0_24px_40px_-12px_rgba(0,0,0,.6)]">
                  <Photo src={photos.heroSide.src} alt={photos.heroSide.alt} width={480} ratio={1} sizes="16vw" tone="dark" />
                </div>
              </Drift>
            </motion.div>

            {/* folha de manjericão */}
            <Drift className="pointer-events-none absolute -right-[3%] bottom-[10%] w-[12%] text-olive" duration={7} rotate={10} delay={0.5}>
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1.3, ease: EASE }}
              >
                <Basil className="w-full" />
              </motion.div>
            </Drift>

            {/* etiqueta */}
            <motion.div
              className="absolute right-[2%] top-[6%] hidden items-center gap-3 sm:flex"
              initial={{ opacity: 0, y: reduce ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: EASE }}
            >
              <span className="h-px w-10 bg-on-dark/40" aria-hidden="true" />
              <span className="eyebrow text-[0.65rem] text-on-dark-soft">{hero.plateLabel}</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ramo de oliveira, base */}
      <Drift className="pointer-events-none absolute -bottom-6 left-[38%] hidden w-56 text-olive/50 lg:block" rotate={3} duration={12}>
        <OliveBranch className="w-full" />
      </Drift>

      {/* faixa inferior */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div className="container-x flex items-center justify-between gap-6 pb-6 text-[0.72rem] uppercase tracking-[0.18em] text-on-dark-soft">
          <a href="#cozinha" className="group flex min-h-11 items-center gap-3 hover:text-on-dark">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-on-dark/25 transition-colors group-hover:border-clay-light">
              <ArrowDown className={'h-3.5 w-3.5 ' + (reduce ? '' : 'animate-bounce')} strokeWidth={1.6} />
            </span>
            <span className="hidden sm:inline">Descubra</span>
          </a>
          <p className="text-right">{hero.note}</p>
        </div>
      </motion.div>
    </section>
  )
}
