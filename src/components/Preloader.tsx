import { useEffect, useState } from 'react'
import { subscribePreloaderProgress, startSequentialPreload } from '../utils/videoPreloader'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // 1. Запускаем систему пошаговой загрузки видео
    startSequentialPreload()

    // 2. Слушаем РЕАЛЬНЫЙ прогресс подгрузки 1-го видео-экрана
    const unsubscribe = subscribePreloaderProgress((percent, heroReady) => {
      setProgress((prev) => Math.max(prev, percent))
      if (heroReady || percent >= 100) {
        setProgress(100)
        setTimeout(() => {
          setIsReady(true)
          setTimeout(() => setShouldRender(false), 700)
        }, 300)
      }
    })

    // Фолбэк на случай проблем сети (максимум 4.5с)
    const fallbackTimer = setTimeout(() => {
      setProgress(100)
      setIsReady(true)
      setTimeout(() => setShouldRender(false), 600)
    }, 4500)

    return () => {
      clearTimeout(fallbackTimer)
      unsubscribe()
    }
  }, [])

  if (!shouldRender) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950 text-white transition-all duration-700 ease-in-out ${
        isReady ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 pointer-events-auto scale-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Логотип Grand Logistics с неоновым свечением */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#7CC248]/20 blur-2xl animate-pulse" />
          <img
            src="/logo.png"
            alt="Grand Logistics"
            className="relative h-14 sm:h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(124,194,72,0.6)]"
          />
        </div>

        {/* Заголовок загрузки */}
        <div className="mb-2 text-xs uppercase tracking-widest font-extrabold text-[#7CC248] flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#7CC248] animate-ping" />
          <span>Ініціалізація 3D-платформи</span>
        </div>

        {/* Числовой процент 0% -> 100% */}
        <div className="mb-6 font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          {progress}<span className="text-[#7CC248]">%</span>
        </div>

        {/* Прогресс-бар с неоновой заливкой */}
        <div className="w-64 sm:w-72 h-2 rounded-full bg-slate-800/80 p-0.5 border border-slate-700/60 overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#5a9c2e] via-[#7CC248] to-[#9be864] shadow-[0_0_12px_#7CC248] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
