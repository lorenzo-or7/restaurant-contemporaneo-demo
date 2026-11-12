import { useState } from 'react'
import { photoSrcSet, photoUrl } from '../config/images'
import { Sprig } from './Botanicals'

type PhotoProps = {
  src?: string
  alt: string
  /** largura base em px da imagem padrão */
  width?: number
  /** proporção altura/largura para recorte na CDN (ex.: 1.25 = 4:5) */
  ratio?: number
  sizes?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  focus?: string
  /** tema do fallback */
  tone?: 'light' | 'dark'
}

const WIDTHS = [480, 720, 960, 1280, 1680]

/**
 * Imagem responsiva com srcset, lazy loading e fallback visual
 * (aparece se a foto não existir ou falhar ao carregar).
 */
export function Photo({
  src,
  alt,
  width = 960,
  ratio,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  priority = false,
  focus,
  tone = 'light',
}: PhotoProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={
          'flex h-full w-full flex-col items-center justify-center gap-3 ' +
          (tone === 'dark' ? 'bg-forest-3 text-on-dark-soft' : 'bg-cream-deep text-ink-soft') +
          ' ' +
          className
        }
      >
        <Sprig className="h-12 w-12 opacity-60" />
        <span className="eyebrow text-[0.625rem] opacity-80">SÉRIA</span>
      </div>
    )
  }

  return (
    <div className={'relative h-full w-full overflow-hidden ' + (tone === 'dark' ? 'bg-forest-3' : 'bg-cream-deep') + ' ' + className}>
      <img
        src={photoUrl(src, width, ratio ? Math.round(width * ratio) : undefined)}
        srcSet={photoSrcSet(src, WIDTHS, ratio)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        ref={(el) => {
          if (el?.complete && el.naturalWidth > 0 && !loaded) setLoaded(true)
        }}
        onError={() => setFailed(true)}
        onLoad={() => setLoaded(true)}
        style={focus ? { objectPosition: focus } : undefined}
        className={
          'h-full w-full object-cover transition-opacity duration-700 ' + (loaded ? 'opacity-100' : 'opacity-0') + ' ' + imgClassName
        }
      />
    </div>
  )
}
