import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { dietLabels, dishes, formatPrice, menuCategories, type Dish, type MenuCategoryId } from '../content/menu'
import { Photo } from '../components/Photo'
import { Dialog } from '../components/Dialog'
import { EASE, Reveal } from '../components/motion'
import { SectionHeading } from '../components/SectionHeading'
import { Sprig } from '../components/Botanicals'

function DietTags({ tags, tone = 'dark' }: { tags: Dish['tags']; tone?: 'dark' | 'light' }) {
  if (!tags.length) return null
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Informações alimentares">
      {tags.map((t) => (
        <li
          key={t}
          title={dietLabels[t].long}
          className={
            'border px-2 py-0.5 text-[0.68rem] font-medium tracking-[0.04em] ' +
            (tone === 'dark' ? 'border-forest-line text-on-dark-soft' : 'border-line text-ink-soft')
          }
        >
          <span aria-hidden="true">{dietLabels[t].short}</span>
          <span className="sr-only">{dietLabels[t].long}</span>
        </li>
      ))}
    </ul>
  )
}

export function Menu() {
  const [category, setCategory] = useState<MenuCategoryId>('entradas')
  const [preview, setPreview] = useState<string | null>(null)
  const [selected, setSelected] = useState<Dish | null>(null)
  const reduce = useReducedMotion()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const list = dishes.filter((d) => d.category === category)
  const cat = menuCategories.find((c) => c.id === category)!
  const previewDish = list.find((d) => d.id === preview) ?? list.find((d) => d.photo) ?? list[0]

  const selectCategory = (id: MenuCategoryId) => {
    setCategory(id)
    setPreview(null)
  }

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const n = menuCategories.length
    let next = -1
    if (e.key === 'ArrowRight') next = (index + 1) % n
    if (e.key === 'ArrowLeft') next = (index - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next < 0) return
    e.preventDefault()
    selectCategory(menuCategories[next].id)
    tabsRef.current[next]?.focus()
    tabsRef.current[next]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="section-y relative bg-forest-2 text-on-dark">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end" id="cardapio-titulo">
          <SectionHeading tone="dark" eyebrow="Cardápio" title="O cardápio da estação." />
          <Reveal delay={0.1}>
            <p className="max-w-sm text-on-dark-soft">
              Selecione um prato para ver ingredientes, informações alimentares e a foto em detalhe.
            </p>
          </Reveal>
        </div>

        {/* Abas */}
        <Reveal delay={0.1} className="-mx-[clamp(1.25rem,0.6rem+3.2vw,4rem)] mt-12 overflow-x-auto px-[clamp(1.25rem,0.6rem+3.2vw,4rem)] no-scrollbar">
          <div role="tablist" aria-label="Categorias do cardápio" className="flex min-w-max gap-2 border-b border-forest-line">
            {menuCategories.map((c, i) => {
              const isActive = c.id === category
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabsRef.current[i] = el
                  }}
                  role="tab"
                  type="button"
                  id={`${baseId}-tab-${c.id}`}
                  aria-selected={isActive}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectCategory(c.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={
                    'relative min-h-12 px-4 pb-4 pt-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-colors sm:px-5 ' +
                    (isActive ? 'text-on-dark' : 'text-on-dark-soft hover:text-on-dark')
                  }
                >
                  {c.label}
                  {isActive && (
                    <motion.span
                      layoutId="menu-tab"
                      className="absolute inset-x-0 -bottom-px h-[2px] bg-clay-light"
                      transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${category}`}
          className="mt-10 grid grid-cols-1 gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14"
        >
          {/* Foto em destaque (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-forest-3">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={previewDish.id}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE }}
                  >
                    <Photo
                      src={previewDish.photo}
                      alt={previewDish.photoAlt ?? previewDish.name}
                      width={900}
                      ratio={1.25}
                      sizes="38vw"
                      tone="dark"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f130d]/85 to-transparent p-6 pt-20">
                  <p className="eyebrow text-[0.62rem] text-clay-light">{cat.label}</p>
                  <p className="font-display mt-2 text-[1.5rem] leading-tight">{previewDish.name}</p>
                </div>
              </div>
              <p className="mt-5 flex items-start gap-3 text-sm text-on-dark-soft">
                <Sprig className="mt-0.5 h-5 w-5 shrink-0 text-olive-light" />
                {cat.intro}
              </p>
            </div>
          </div>

          {/* Lista */}
          <div className="lg:col-span-7">
            <p className="mb-6 text-on-dark-soft lg:hidden">{cat.intro}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={category}
                className="flex flex-col"
                initial="hidden"
                animate="show"
                exit="exit"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
                  exit: { opacity: 0, transition: { duration: 0.18 } },
                }}
              >
                {list.map((dish) => (
                  <motion.li
                    key={dish.id}
                    variants={{
                      hidden: { opacity: 0, y: reduce ? 0 : 18 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
                    }}
                    className="border-b border-forest-line first:border-t"
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(dish)}
                      onMouseEnter={() => setPreview(dish.id)}
                      onFocus={() => setPreview(dish.id)}
                      aria-haspopup="dialog"
                      className="group flex w-full gap-4 py-6 text-left sm:gap-6 sm:py-7"
                    >
                      <span className="relative h-20 w-20 shrink-0 overflow-hidden sm:h-24 sm:w-24 lg:hidden">
                        <Photo src={dish.photo} alt="" width={200} ratio={1} sizes="96px" tone="dark" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:flex-nowrap">
                          <span className="font-display basis-full text-[1.3rem] leading-snug transition-colors group-hover:text-clay-light sm:basis-auto sm:text-[1.55rem]">
                            {dish.name}
                          </span>
                          <span aria-hidden="true" className="hidden h-px flex-1 translate-y-[-0.3em] border-b border-dotted border-on-dark/25 sm:block" />
                          <span className="font-display shrink-0 text-[1.15rem] text-clay-light sm:text-[1.3rem]">{formatPrice(dish.price)}</span>
                        </span>
                        <span className="mt-2 block max-w-[38rem] text-[0.95rem] leading-relaxed text-on-dark-soft">{dish.description}</span>
                        <span className="mt-3 flex flex-wrap items-center gap-3">
                          {dish.signature && (
                            <span className="eyebrow text-[0.6rem] text-olive-light">Assinatura da casa</span>
                          )}
                          <DietTags tags={dish.tags} />
                          <span className="ml-auto inline-flex items-center gap-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-on-dark-soft transition-colors group-hover:text-on-dark">
                            Detalhes
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                          </span>
                        </span>
                      </span>
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
            <p className="mt-8 text-[0.8rem] text-on-dark-soft">
              Preços demonstrativos. Informe alergias e restrições à equipe; algumas preparações podem conter traços de alérgenos.
            </p>
          </div>
        </div>
      </div>

      <DishDialog dish={selected} onClose={() => setSelected(null)} />
    </section>
  )
}

function DishDialog({ dish, onClose }: { dish: Dish | null; onClose: () => void }) {
  const [last, setLast] = useState<Dish | null>(dish)
  if (dish && dish !== last) setLast(dish)
  const d = dish ?? last
  const cat = d ? menuCategories.find((c) => c.id === d.category) : null

  return (
    <Dialog open={!!dish} onClose={onClose} title={d?.name ?? 'Prato'} className="max-w-5xl sm:max-h-[min(90dvh,46rem)]" closeLabel="Fechar detalhes do prato">
      {d && (
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
            <Photo src={d.photo} alt={d.photoAlt ?? d.name} width={1000} ratio={1.1} sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="flex flex-col p-6 sm:p-10 md:overflow-y-auto">
            <p className="eyebrow text-[0.65rem] text-clay">{cat?.label}</p>
            <p className="font-display opsz-max mt-3 pr-10 text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.08] text-ink">{d.name}</p>
            <p className="font-display mt-4 text-[1.6rem] text-clay">{formatPrice(d.price)}</p>
            <p className="mt-5 leading-relaxed text-ink-soft">{d.description}</p>

            <div className="mt-8 border-t border-line pt-6">
              <p className="eyebrow text-[0.65rem] text-ink">Ingredientes</p>
              <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.95rem] text-ink-soft">
                {d.ingredients.map((ing) => (
                  <li key={ing} className="flex items-center gap-2">
                    <span aria-hidden="true" className="h-1 w-1 rounded-full bg-olive" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-line pt-6">
              <p className="eyebrow text-[0.65rem] text-ink">Informações alimentares</p>
              {d.tags.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {d.tags.map((t) => (
                    <li key={t} className="border border-line bg-cream px-3 py-1 text-[0.85rem] text-ink">
                      {dietLabels[t].long}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[0.95rem] text-ink-soft">Sem marcadores específicos. Consulte a equipe sobre alergênicos.</p>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row sm:flex-wrap">
              <a href="#reservas" onClick={onClose} className="btn btn-primary">
                Reservar uma mesa
              </a>
              <button type="button" onClick={onClose} className="btn btn-ghost-light">
                Voltar ao cardápio
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}
