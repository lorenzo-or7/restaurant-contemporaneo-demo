import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { EASE } from './motion'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  variant?: 'panel' | 'sheet' | 'fullscreen'
  className?: string
  closeLabel?: string
  tone?: 'light' | 'dark'
}

let openCount = 0

/**
 * Modal acessível: foco preso dentro do diálogo, Escape fecha, foco devolvido
 * ao gatilho, fundo inerte e rolagem da página travada.
 */
export function Dialog({
  open,
  onClose,
  title,
  children,
  variant = 'panel',
  className = '',
  closeLabel = 'Fechar',
  tone = 'light',
}: DialogProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement
    const root = document.getElementById('root')
    openCount++
    root?.setAttribute('inert', '')
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = scrollbar ? `${scrollbar}px` : ''

    const t = window.setTimeout(() => {
      const panel = panelRef.current
      if (!panel) return
      const auto = panel.querySelector<HTMLElement>('[data-autofocus]')
      ;(auto ?? panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus()
    }, 30)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      openCount--
      if (openCount <= 0) {
        openCount = 0
        root?.removeAttribute('inert')
        document.body.style.overflow = ''
        document.body.style.paddingRight = ''
      }
      returnFocus.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  const panelMotion =
    variant === 'sheet'
      ? { initial: { y: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }, animate: { y: 0, opacity: 1 }, exit: { y: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 } }
      : variant === 'fullscreen'
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : { initial: { opacity: 0, y: reduce ? 0 : 32, scale: reduce ? 1 : 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: reduce ? 0 : 16 } }

  const layout =
    variant === 'sheet'
      ? 'items-end sm:items-center justify-center sm:p-6'
      : variant === 'fullscreen'
        ? 'items-stretch justify-stretch'
        : 'items-end sm:items-center justify-center sm:p-6'

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-[80] flex ${layout}`}>
          <motion.div
            className="absolute inset-0 bg-[#0e110c]/75 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            {...panelMotion}
            transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
            className={
              'relative flex max-h-[100dvh] w-full flex-col overflow-hidden outline-none ' +
              (tone === 'dark' ? 'bg-forest text-on-dark' : 'on-light bg-surface text-ink') +
              ' ' +
              className
            }
          >
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={
                'absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full transition-colors ' +
                (tone === 'dark'
                  ? 'bg-forest-2/80 text-on-dark hover:bg-forest-3'
                  : 'bg-surface/90 text-ink shadow-[0_1px_0_rgba(0,0,0,.06)] hover:bg-cream-deep')
              }
              aria-label={closeLabel}
            >
              <X className="h-5 w-5" strokeWidth={1.6} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
