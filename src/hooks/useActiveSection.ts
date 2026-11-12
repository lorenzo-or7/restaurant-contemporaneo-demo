import { useEffect, useState } from 'react'

/** Observa as seções e retorna o id da que ocupa o centro da tela. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0])

  useEffect(() => {
    // observa todas as seções com id: fora dos itens do menu, nenhum link fica ativo
    const els = [...document.querySelectorAll<HTMLElement>('main section[id]')]
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])

  return active
}

/** true quando a página foi rolada além de `offset` pixels. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [offset])
  return scrolled
}
