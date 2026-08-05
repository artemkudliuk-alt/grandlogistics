import { useEffect, useRef, useState, useCallback } from 'react'
import { CINEMA_STEPS } from '../config/scenes'
import { UILayer } from './UILayer'
import { prioritizeVideoLoad, preloadNextSceneVideos, getPreferredVideoSrc } from '../utils/videoPreloader'

export function Cinema() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [activeStepState, setActiveStepState] = useState(0) // Индекс в CINEMA_STEPS (0..4 для 3 сцен)
  const [prevActiveStep, setPrevActiveStep] = useState<number | null>(null)
  const prevStepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setActiveStep = useCallback((newStep: number | ((prev: number) => number)) => {
    setActiveStepState((current) => {
      const next = typeof newStep === 'function' ? newStep(current) : newStep
      if (current !== next) {
        setPrevActiveStep(current)
        if (prevStepTimerRef.current) clearTimeout(prevStepTimerRef.current)
        prevStepTimerRef.current = setTimeout(() => {
          setPrevActiveStep(null)
        }, 750)
      }
      return next
    })
  }, [])

  const activeStep = activeStepState
  const [scene, setScene] = useState(1) // Сцена 1..3 в 3D кино-части
  const isTransitioningRef = useRef(false)

  const isTransit = CINEMA_STEPS[activeStep].kind !== 'loop'

  // Единая механика dim-fade: уход в лёгкое затемнение (0.6, 500ms) → смена шага под его
  // прикрытием → спокойное проявление (луп → 0.35 за 1000ms, пролёт → 0 за 500ms)
  const [dimOpacity, setDimOpacity] = useState(0.6)
  const [dimDuration, setDimDuration] = useState(0)
  const dimTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearDimTimers = useCallback(() => {
    dimTimersRef.current.forEach(clearTimeout)
    dimTimersRef.current = []
  }, [])

  const dimTo = useCallback((opacity: number, duration: number) => {
    setDimDuration(duration)
    setDimOpacity(opacity)
  }, [])

  const runDimFade = useCallback((applySwitch: () => void, target: 'loop' | 'transit') => {
    clearDimTimers()
    dimTo(0.6, 500)
    const t = setTimeout(() => {
      applySwitch()
      dimTo(target === 'loop' ? 0.35 : 0, target === 'loop' ? 1000 : 500)
    }, 500)
    dimTimersRef.current.push(t)
  }, [clearDimTimers, dimTo])

  // Первое появление: спокойный выход из затемнения
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => dimTo(0.35, 2000))
    )
    return () => cancelAnimationFrame(id)
  }, [dimTo])

  useEffect(() => () => clearDimTimers(), [clearDimTimers])

  // Пошаговая смарт-подгрузка видео для следующей сцены
  useEffect(() => {
    preloadNextSceneVideos(scene)
  }, [scene])

  // Запуск проигрывания видео (паузим все неактивные ролики для идеального 60fps без лагов)
  const playVideo = useCallback((idx: number) => {
    videoRefs.current.forEach((v, i) => {
      if (v && i !== idx) {
        v.pause()
      }
    })
    const v = videoRefs.current[idx]
    if (v) {
      if (CINEMA_STEPS[idx]?.kind === 'transit') {
        v.currentTime = 0
      }
      v.play().catch(() => {})
    }
  }, [])

  // Вперед к следующей сцене или переход к карте (4-му экрану) после 3-й сцены
  const triggerNext = useCallback(() => {
    if (isTransitioningRef.current) return

    if (scene < 3) {
      isTransitioningRef.current = true
      const transitIdx = (scene - 1) * 2 + 1
      const nextLoopIdx = scene * 2

      // Уходим в лёгкое затемнение, под ним запускаем пролёт
      runDimFade(() => {
        setActiveStep(transitIdx)
        const transitVideo = videoRefs.current[transitIdx]

        if (transitVideo) {
          transitVideo.currentTime = 0
          playVideo(transitIdx)
          const handleEnded = () => {
            transitVideo.removeEventListener('ended', handleEnded)
            // Пролёт закончился — через dim-fade проявляем следующий луп
            runDimFade(() => {
              setActiveStep(nextLoopIdx)
              setScene((prev) => prev + 1)
              playVideo(nextLoopIdx)
            }, 'loop')
            setTimeout(() => {
              isTransitioningRef.current = false
            }, 700)
          }
          transitVideo.addEventListener('ended', handleEnded, { once: true })
        } else {
          runDimFade(() => {
            setActiveStep(nextLoopIdx)
            setScene((prev) => prev + 1)
            playVideo(nextLoopIdx)
          }, 'loop')
          isTransitioningRef.current = false
        }
      }, 'transit')
    } else if (scene === 3) {
      // ПОСЛЕ 3-Й СЦЕНЫ — ПЛАВНЫЙ СРОЛЛ К КАРТЕ (4-Й ЕКРАН)
      isTransitioningRef.current = true
      const s1 = document.getElementById('s1')
      if (s1) {
        s1.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 700)
    }
  }, [scene, playVideo, runDimFade, setActiveStep])

  // Назад к предыдущей сцене — пролёт проигрывается с включением transit-видео
  const triggerPrev = useCallback(() => {
    if (isTransitioningRef.current) return

    if (scene > 1) {
      isTransitioningRef.current = true
      const transitIdx = (scene - 2) * 2 + 1
      const prevLoopIdx = (scene - 2) * 2

      // Уходим в затемнение, под ним включаем пролёт
      runDimFade(() => {
        setActiveStep(transitIdx)
        const transitVideo = videoRefs.current[transitIdx]

        if (transitVideo) {
          transitVideo.currentTime = 0
          transitVideo.play().then(() => {
            const handleEnded = () => {
              transitVideo.removeEventListener('ended', handleEnded)
              runDimFade(() => {
                setActiveStep(prevLoopIdx)
                setScene((prev) => prev - 1)
                playVideo(prevLoopIdx)
              }, 'loop')
              setTimeout(() => {
                isTransitioningRef.current = false
              }, 700)
            }
            transitVideo.addEventListener('ended', handleEnded, { once: true })
          }).catch(() => {
            runDimFade(() => {
              setActiveStep(prevLoopIdx)
              setScene((prev) => prev - 1)
              playVideo(prevLoopIdx)
            }, 'loop')
            isTransitioningRef.current = false
          })
        } else {
          runDimFade(() => {
            setActiveStep(prevLoopIdx)
            setScene((prev) => prev - 1)
            playVideo(prevLoopIdx)
          }, 'loop')
          isTransitioningRef.current = false
        }
      }, 'transit')
    }
  }, [scene, playVideo, runDimFade, setActiveStep])

  // Прямой переход к сцене (пилюли) — тоже через dim-fade
  const jumpToScene = useCallback((targetScene: number) => {
    if (targetScene <= 3) {
      if (isTransitioningRef.current) return
      isTransitioningRef.current = true

      const targetLoopIdx = (targetScene - 1) * 2
      prioritizeVideoLoad(CINEMA_STEPS[targetLoopIdx].src)
      window.scrollTo({ top: 0, behavior: 'smooth' })

      runDimFade(() => {
        const targetVideo = videoRefs.current[targetLoopIdx]
        if (targetVideo) {
          targetVideo.currentTime = 0
          targetVideo.play().catch(() => {})
        }
        setActiveStep(targetLoopIdx)
        setScene(targetScene)
      }, 'loop')

      setTimeout(() => {
        isTransitioningRef.current = false
      }, 700)
    } else {
      const sectionId = `s1`
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [runDimFade, setActiveStep])

  // Слушатель глобальной навигации к кино-сценам
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<number>
      if (customEvent.detail) {
        jumpToScene(customEvent.detail)
      }
    }
    window.addEventListener('nav-cinema', handleNav)
    return () => window.removeEventListener('nav-cinema', handleNav)
  }, [jumpToScene])

  // Обработчик wheel и touch скролла для кино-части (первые 3 сцены)
  useEffect(() => {
    let cooldown = false
    let touchStartY = 0
    let hasSwipedInCurrentTouch = false

    const getScrollEl = () => document.getElementById('cinema-content-scroll')

    const canScrollDownInContent = (): boolean => {
      const scrollEl = getScrollEl()
      if (!scrollEl) return false
      return scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight - 10
    }

    const canScrollUpInContent = (): boolean => {
      const scrollEl = getScrollEl()
      if (!scrollEl) return false
      return scrollEl.scrollTop > 10
    }

    const getS1Top = () => {
      const s1 = document.getElementById('s1')
      if (!s1) return 9999
      return s1.getBoundingClientRect().top + window.scrollY
    }

    // WHEEL (mouse/trackpad) — переключение сцен через wheel
    const handleWheel = (e: WheelEvent) => {
      if (document.body.dataset.modalOpen) return // Открыт поп-ап — сцены не переключаем
      const scrollY = window.scrollY
      const s1Top = getS1Top()
      if (scrollY >= s1Top - 50) return // Already on map or below
      if (cooldown || isTransitioningRef.current) return

      if (e.deltaY > 20) {
        if (canScrollDownInContent()) return // Internal content still scrollable — don't switch scene
        e.preventDefault()
        cooldown = true
        if (scene <= 3) {
          triggerNext()
        }
        setTimeout(() => { cooldown = false }, 700)
      } else if (e.deltaY < -20) {
        if (canScrollUpInContent()) return
        e.preventDefault()
        cooldown = true
        if (scene > 1) {
          triggerPrev()
        }
        setTimeout(() => { cooldown = false }, 700)
      }
    }

    // TOUCH — свайпы между сценами 1 -> 2 -> 3 -> Карта
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY
        hasSwipedInCurrentTouch = false
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const scrollY = window.scrollY
      const s1Top = getS1Top()
      if (scrollY < s1Top - 50) {
        // На сценах 1 и 2 блокируем нативный скролл, на сцене 3 разрешаем естественный свайп вниз к карте
        if (e.cancelable && scene < 3) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (document.body.dataset.modalOpen) return
      if (hasSwipedInCurrentTouch || cooldown || isTransitioningRef.current) return
      if (!e.changedTouches.length) return

      const scrollY = window.scrollY
      const s1Top = getS1Top()
      if (scrollY >= s1Top - 50) return // Мы уже на карте или ниже

      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY - touchEndY // >0 = Свайп вверх (вперед)

      if (Math.abs(deltaY) < 30) return // Порог свайпа (30px)

      if (deltaY > 30) { // Свайп ВВЕРХ (Вперед)
        if (canScrollDownInContent()) return // Если внутри блока ещё есть скролл вниз

        if (scene <= 3) {
          // Сцена 1 → 2 → 3 → Карта
          hasSwipedInCurrentTouch = true
          cooldown = true
          triggerNext()
          setTimeout(() => { cooldown = false }, 600)
        }
      } else if (deltaY < -30) { // Свайп ВНИЗ (Назад)
        if (canScrollUpInContent()) return
        if (scene > 1) {
          hasSwipedInCurrentTouch = true
          cooldown = true
          triggerPrev()
          setTimeout(() => { cooldown = false }, 600)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.body.dataset.modalOpen) return
      const scrollY = window.scrollY
      if (scrollY < getS1Top() - 50) {
        if (cooldown || isTransitioningRef.current) return

        if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
          if (canScrollDownInContent()) return
          e.preventDefault()
          cooldown = true
          if (scene <= 3) {
            triggerNext()
          }
          setTimeout(() => { cooldown = false }, 1000)
        } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
          if (canScrollUpInContent()) return
          if (scene > 1) {
            e.preventDefault()
            cooldown = true
            triggerPrev()
            setTimeout(() => { cooldown = false }, 1000)
          }
        }
      }
    }

    // Блокировка вылезания карты на 1 и 2 экранах
    const handleWindowScroll = () => {
      if (scene < 3 && window.scrollY > 5) {
        window.scrollTo(0, 0)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleWindowScroll)
    }
  }, [scene, triggerNext, triggerPrev, activeStep, playVideo, setActiveStep])

  // Управление автопроигрыванием лупов при активности
  useEffect(() => {
    CINEMA_STEPS.forEach((step, i) => {
      const v = videoRefs.current[i]
      if (!v) return

      if (i === activeStep || i === prevActiveStep) {
        if (step.kind === 'loop') {
          v.play().catch(() => {})
        }
      } else {
        v.pause()
      }
    })
  }, [activeStep, prevActiveStep])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Видео-слои первых 3-х сцен — 100% перманентное монтирование для 0ms старта без задержек раскодирования */}
      {CINEMA_STEPS.map((step, i) => {
        const isCurrent = i === activeStep
        const isPrev = i === prevActiveStep
        const videoSrc = getPreferredVideoSrc(step.src)

        return (
          <video
            key={`cinema-v-${i}`}
            ref={(el) => { videoRefs.current[i] = el }}
            src={videoSrc}
            poster={step.src.replace('.mp4', '_poster.jpg')}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
            style={{
              opacity: isCurrent || isPrev ? 1 : 0,
              zIndex: isCurrent ? 3 : isPrev ? 2 : 1,
            }}
            muted
            playsInline
            loop={step.kind === 'loop'}
            preload="auto"
          />
        )
      })}

      {/* Лёгкое затемнение луп-экранов: вход — спокойный fade из темноты, выход — быстрое затемнение в пролёт */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-black"
        style={{
          opacity: dimOpacity,
          transition: dimDuration > 0 ? `opacity ${dimDuration}ms ease-out` : 'none',
        }}
      />

      <UILayer
        scene={scene}
        stepIndex={activeStep}
        totalSteps={5}
        isTransit={isTransit}
        onSelectScene={jumpToScene}
        onNext={triggerNext}
      />
    </div>
  )
}
