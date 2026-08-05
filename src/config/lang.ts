import { useSyncExternalStore } from 'react'

export type Lang = 'UK' | 'EN'

let current: Lang = 'UK'
if (typeof window !== 'undefined') {
  const saved = window.localStorage.getItem('gl-lang')
  if (saved === 'UK' || saved === 'EN') current = saved
}

const listeners = new Set<() => void>()

export function setLang(lang: Lang) {
  current = lang
  window.localStorage.setItem('gl-lang', lang)
  listeners.forEach((fn) => fn())
}

export function toggleLang() {
  setLang(current === 'UK' ? 'EN' : 'UK')
}

/** Глобальный язык интерфейса — единый переключатель UK/EN для всех видео-движков */
export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => {
        listeners.delete(cb)
      }
    },
    () => current
  )
}
