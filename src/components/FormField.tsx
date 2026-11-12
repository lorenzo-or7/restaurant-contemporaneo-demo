import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

/** Campo com label persistente, indicação de obrigatório, dica e erro associados via aria. */
export function FormField({
  id,
  label,
  required,
  error,
  hint,
  children,
  tone = 'dark',
  className = '',
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={'mb-2 flex items-baseline justify-between gap-3 text-[0.8rem] font-semibold tracking-[0.04em] ' + (tone === 'dark' ? 'text-on-dark' : 'text-ink')}>
        <span>
          {label}
          {required ? (
            <span className={tone === 'dark' ? 'text-clay-light' : 'text-clay'} aria-hidden="true">
              {' '}*
            </span>
          ) : (
            <span className={'ml-1.5 font-normal ' + (tone === 'dark' ? 'text-on-dark-soft' : 'text-ink-soft')}>(opcional)</span>
          )}
        </span>
      </label>
      {children}
      {error ? (
        <p id={`${id}-erro`} className={'mt-2 flex items-start gap-1.5 text-[0.85rem] ' + (tone === 'dark' ? 'text-[#f0a48a]' : 'text-[#a3391f]')}>
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-dica`} className={'mt-2 text-[0.8rem] ' + (tone === 'dark' ? 'text-on-dark-soft' : 'text-ink-soft')}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-erro` : hint ? `${id}-dica` : undefined
