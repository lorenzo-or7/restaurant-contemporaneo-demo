import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { site } from '../config/site'
import { useActiveSection, useScrolled } from '../hooks/useActiveSection'
import { EASE } from '../components/motion'
import { Sprig } from '../components/Botanicals'

const ids = site.nav.map((n) => n.id)

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={'font-display inline-flex items-baseline gap-2 leading-none ' + className}>
      <span className="text-[1.6rem] tracking-[0.06em]" style={{ fontVariationSettings: "'opsz' 144", fontWeight: 400 }}>
        {site.name}
      </span>
    </span>
  )
}

export function Navbar() {
  const scrolled = useScrolled(40)
  const active = useActiveSection(ids)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Menu mobile: Escape fecha, foco preso, rolagem travada
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const first = menuRef.current?.querySelector<HTMLElement>('a,button')
    first?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
      if (e.key === 'Tab' && menuRef.current) {
        const items = [toggleRef.current!, ...menuRef.current.querySelectorAll<HTMLElement>('a,button')]
        const i = items.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          items[items.length - 1].focus()
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault()
          items[0].focus()
        }
      }
    }
    const onResize = () => window.innerWidth >= 1024 && setOpen(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[100] bg-clay px-4 py-3 text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <header
        className={
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ' +
          (scrolled || open
            ? 'border-b border-forest-line/70 bg-forest/92 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent')
        }
      >
        <nav
          aria-label="Principal"
          className={'container-x flex items-center justify-between gap-6 transition-[height] duration-500 ' + (scrolled ? 'h-16' : 'h-20 lg:h-24')}
        >
          <a href="#inicio" className="group flex items-center gap-2.5 text-on-dark" aria-label={`${site.name}, voltar ao início`}>
            <Sprig className="h-6 w-6 text-clay-light transition-transform duration-500 group-hover:rotate-12" />
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {site.nav.slice(0, 4).map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={
                      'relative px-4 py-3 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-colors ' +
                      (isActive ? 'text-on-dark' : 'text-on-dark-soft hover:text-on-dark')
                    }
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-4 -bottom-0.5 h-px bg-clay-light"
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href="#reservas"
              aria-current={active === 'reservas' ? 'location' : undefined}
              className="btn btn-primary hidden min-h-11 px-6 sm:inline-flex"
            >
              Reservar mesa
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="relative grid h-11 w-11 place-items-center text-on-dark lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-6">
                <span
                  className={
                    'absolute left-0 block h-px w-6 bg-current transition-transform duration-300 ' + (open ? 'top-1.5 rotate-45' : 'top-0')
                  }
                />
                <span
                  className={
                    'absolute left-0 block h-px bg-current transition-all duration-300 ' + (open ? 'top-1.5 w-6 -rotate-45' : 'top-3 w-4')
                  }
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            ref={menuRef}
            className="fixed inset-0 z-40 flex flex-col bg-forest pt-24 text-on-dark lg:hidden"
            initial={{ clipPath: reduce ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', opacity: reduce ? 0 : 1 }}
            animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
            exit={{ clipPath: reduce ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)', opacity: reduce ? 0 : 1 }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease: [0.77, 0, 0.18, 1] }}
          >
            <nav aria-label="Menu mobile" className="container-x flex flex-1 flex-col overflow-y-auto pb-8">
              <ul className="flex flex-col border-t border-forest-line">
                {site.nav.map((item, i) => (
                  <motion.li
                    key={item.id}
                    className="border-b border-forest-line"
                    initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.18 + i * 0.06, duration: 0.6, ease: EASE }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === item.id ? 'location' : undefined}
                      className="font-display opsz-max flex items-baseline justify-between py-4 text-[2.1rem]"
                    >
                      <span className={active === item.id ? 'text-clay-light' : ''}>{item.label}</span>
                      <span className="font-sans text-xs tracking-[0.2em] text-on-dark-soft">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mt-auto pt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.5 }}
              >
                <a href="#reservas" onClick={() => setOpen(false)} className="btn btn-primary w-full">
                  Reservar mesa
                </a>
                <p className="mt-6 text-sm text-on-dark-soft">
                  {site.hours[0].days}: {site.hours[0].lunch} e {site.hours[0].dinner}
                </p>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
