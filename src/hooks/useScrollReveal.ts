import { useEffect, useRef } from 'react'

/**
 * IntersectionObserver-хук: всем элементам с классом .reveal-scroll
 * внутри контейнера добавляет .is-visible при появлении в вьюпорте.
 * Срабатывает один раз — спокойное параллакс-проявление без миганий.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const els = root.querySelectorAll('.reveal-scroll')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return ref
}
