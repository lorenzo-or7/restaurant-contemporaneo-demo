import type { ReactNode } from 'react'
import { MaskLines, Reveal } from './motion'

/** Cabeçalho editorial de seção: sobretítulo com traço + título em máscara. */
export function SectionHeading({
  eyebrow,
  title,
  tone = 'light',
  align = 'left',
  className = '',
  children,
}: {
  eyebrow: string
  title: string | string[]
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
  children?: ReactNode
}) {
  const lines = Array.isArray(title) ? title : [title]
  return (
    <div className={(align === 'center' ? 'mx-auto text-center ' : '') + className}>
      <Reveal>
        <p
          className={
            'eyebrow mb-5 flex items-center gap-3 ' +
            (align === 'center' ? 'justify-center ' : '') +
            (tone === 'dark' ? 'text-clay-light' : 'text-clay')
          }
        >
          <span aria-hidden="true" className="h-px w-8 bg-current" />
          {eyebrow}
        </p>
      </Reveal>
      <MaskLines
        as="h2"
        lines={lines}
        className={'font-display opsz-max text-balance text-[length:var(--text-h2)] ' + (tone === 'dark' ? 'text-on-dark' : 'text-ink')}
      />
      {children}
    </div>
  )
}
