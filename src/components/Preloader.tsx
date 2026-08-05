import { useEffect, useState } from 'react'
import { subscribePreloaderProgress, startSequentialPreload } from '../utils/videoPreloader'

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    let networkBufferPct = 0
    let heroIsRunning = false
    let currentPct = 0

    // 1. Запускаем систему пошаговой загрузки видео
    startSequentialPreload()

    // 2. Слушаем процент подгрузки сетевого буфера файла loop01
    const unsubscribe = subscribePreloaderProgress((pct) => {
      networkBufferPct = Math.max(networkBufferPct, pct)
    })

    // 3. Форсируем запуск DOM-элемента видео и проверяем, что оно РЕАЛЬНО отработало >= 1.0с в 30fps под занавесом
    const checkVideoRunning = () => {
      const v0 = document.querySelector('video') as HTMLVideoElement | null
      if (v0) {
        v0.muted = true
        v0.defaultMuted = true
        if (v0.paused) {
          v0.play().catch(() => {})
        }
        // Видео считается ГОТОВЫМ, только когда оно уже БЕЖИТ больше 1.0с и кэш скачан >= 90%
        if (v0.currentTime >= 1.0 && !v0.paused && networkBufferPct >= 90) {
          heroIsRunning = true
        }
      }
    }

    const checkInterval = setInterval(checkVideoRunning, 50)

    // 4. Плавный тикающий таймер прогресса
    const progressInterval = setInterval(() => {
      const targetPct = Math.min(95, Math.max(currentPct, networkBufferPct))

      if (!heroIsRunning) {
        // Подтягиваем процент до целевого (до 95%), пока видео разгоняется в фоне
        if (currentPct < targetPct) {
          currentPct += 1
          setProgress(currentPct)
        }
      } else {
        // Видео УЖЕ открутило 1 секунду за прелоадером в 30fps! Завершаем 95% -> 100% и убираем занавес
        if (currentPct < 100) {
          currentPct += 5
          if (currentPct > 100) currentPct = 100
          setProgress(currentPct)
        } else {
          clearInterval(progressInterval)
          clearInterval(checkInterval)
          setTimeout(() => {
            setIsReady(true)
            setTimeout(() => setShouldRender(false), 700)
          }, 150)
        }
      }
    }, 35)

    // Максимальный фолбэк на случай слабейшего 3G (6 секунд)
    const fallbackTimer = setTimeout(() => {
      heroIsRunning = true
    }, 6000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(checkInterval)
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
