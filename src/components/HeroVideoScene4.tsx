import { useState, useRef, useEffect, useCallback } from 'react'
import { ACCENT } from '../config/scenes'
import { CHIPS_UK, CHIPS_EN, type ChipItem } from '../config/chips'
import { useLang, toggleLang } from '../config/lang'
import { HeaderNav } from './HeaderNav'
import { InfoChip } from './InfoChip'
import { InfoModal } from './InfoModal'
import { CalcFormContent } from './CalcFormContent'
import { prioritizeVideoLoad, getPreferredVideoSrc } from '../utils/videoPreloader'

type Hero4SceneKey = 'scene4' | 'scene5' | 'scene6' | 'scene7'

/** Мета сцен 4-7: заголовки + наборы чипсов из единого конфига */
function hero4SceneMeta(lang: 'UK' | 'EN') {
  const uk = lang === 'UK'
  const cfg = uk ? CHIPS_UK : CHIPS_EN
  return {
    scene4: {
      eyebrow: uk ? 'Спеціалізація вантажоперевезень' : 'Cargo Specialization',
      title: uk ? 'Типи вантажів,' : 'Types of Cargo',
      accent: uk ? 'що перевозяться' : 'We Transport',
      chips: cfg.cargo,
      cta: '',
    },
    scene5: {
      eyebrow: uk ? 'Виділений напрямок • High-Margin Hub' : 'Dedicated Division • High-Margin Hub',
      title: uk ? 'Комплексний сервіс в Китаї' : 'Comprehensive Service in China',
      accent: '',
      chips: cfg.sourcing,
      cta: uk ? 'Замовити аудит постачальника в Китаї ➔' : 'Order Supplier Audit in China ➔',
    },
    scene6: {
      eyebrow: uk ? 'Чому обирають нас • Why Us' : 'Why Choose Us • Why Us',
      title: uk ? 'Переваги Grand Logistics' : 'Grand Logistics Advantages',
      accent: '',
      chips: cfg.whyus,
      cta: uk ? 'Отримати розрахунок вартості ➔' : 'Get Cost Calculation ➔',
    },
    scene7: {
      eyebrow: uk ? 'Grand Logistics Services • Партнер 24/7' : 'Grand Logistics Services • Partner 24/7',
      title: uk ? 'Готові розрахувати' : 'Ready to Calculate',
      accent: uk ? 'вартість та маршрут?' : 'Cost & Route?',
      chips: cfg.contacts,
      cta: uk ? 'Розрахувати вартість та маршрут ➔' : 'Calculate Cost & Route ➔',
    },
  } as const
}

type StepState = 'scene4' | 'transit45' | 'scene5' | 'transit56' | 'scene6' | 'transit67' | 'scene7'

export function HeroVideoScene4() {
  const lang = useLang()
  const [openModal, setOpenModal] = useState<string | null>(null)
  // Предвыбор для формы расчёта: категория + маршрут (из чипса, по которому кликнули)
  interface CalcPreset {
    cargoIndex: number | null
    from: string
    to: string
  }
  const [calcPreset, setCalcPreset] = useState<CalcPreset | null>(null)

  const openCalc = (preset: CalcPreset | null = null) => {
    setCalcPreset(preset)
    setOpenModal('calc')
  }

  const openCalcFromChip = (chip: ChipItem | null) => {
    if (!chip) return openCalc(null)
    openCalc({
      cargoIndex: chip.calcCargoIndex ?? null,
      from: chip.calcFrom ?? '',
      to: chip.calcTo ?? '',
    })
  }
  const [currentStepState, setCurrentStepState] = useState<StepState>('scene4')
  const [prevStep, setPrevStep] = useState<StepState | null>(null)
  const prevStepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setCurrentStep = useCallback((newStep: StepState | ((prev: StepState) => StepState)) => {
    setCurrentStepState((current) => {
      const next = typeof newStep === 'function' ? newStep(current) : newStep
      if (current !== next) {
        setPrevStep(current)
        if (prevStepTimerRef.current) clearTimeout(prevStepTimerRef.current)
        prevStepTimerRef.current = setTimeout(() => {
          setPrevStep(null)
        }, 750)
      }
      return next
    })
  }, [])

  const currentStep = currentStepState

  // Чип открытого поп-апа (по всем наборам сцен 4-7)
  const chipsCfg = lang === 'UK' ? CHIPS_UK : CHIPS_EN
  const openChip =
    [...chipsCfg.cargo, ...chipsCfg.sourcing, ...chipsCfg.whyus, ...chipsCfg.contacts].find(
      (c) => c.id === openModal
    ) ?? null

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
    const video4Ref = useRef<HTMLVideoElement>(null)
  const transit45Ref = useRef<HTMLVideoElement>(null)
  const video5Ref = useRef<HTMLVideoElement>(null)
  const transit56Ref = useRef<HTMLVideoElement>(null)
  const video6Ref = useRef<HTMLVideoElement>(null)
  const transit67Ref = useRef<HTMLVideoElement>(null)
  const video7Ref = useRef<HTMLVideoElement>(null)

  const isTransitioningRef = useRef(false)

  useEffect(() => {
    const el = document.getElementById('hero4-content-scroll')
    if (el) {
      el.scrollTop = 0
    }
    setOpenModal(null)
  }, [currentStep])

  // Слушатель глобальной навигации к subscene — через dim-fade
  useEffect(() => {
    const handleNav = (e: Event) => {
      const customEvent = e as CustomEvent<StepState>
      if (customEvent.detail && !isTransitioningRef.current) {
        isTransitioningRef.current = true
        const stepName = customEvent.detail
        if (stepName === 'scene4') prioritizeVideoLoad('/videos/loop04.mp4')
        else if (stepName === 'scene5') prioritizeVideoLoad('/videos/loop05.mp4')
        else if (stepName === 'scene6') prioritizeVideoLoad('/videos/loop06.mp4')
        else if (stepName === 'scene7') prioritizeVideoLoad('/videos/loop07.mp4')
        runDimFade(() => setCurrentStep(stepName), 'loop')
        setTimeout(() => { isTransitioningRef.current = false }, 700)
      }
    }
    window.addEventListener('nav-hero4', handleNav)
    return () => window.removeEventListener('nav-hero4', handleNav)
  }, [runDimFade, setCurrentStep])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Функция для проигрывания только активного роликового элемента (остальные видео останавливаем)
  const playActiveLoop = (activeEl: HTMLVideoElement | null) => {
    [video4Ref.current, video5Ref.current, video6Ref.current, video7Ref.current, transit45Ref.current, transit56Ref.current, transit67Ref.current].forEach((v) => {
      if (v && v !== activeEl) {
        v.pause()
      }
    })
    if (activeEl) {
      activeEl.play().catch(() => {})
    }
  }

  useEffect(() => {
    playActiveLoop(video4Ref.current)
  }, [])

  // Запуск прямого транзита (Вперед) — через dim-fade на входе и на выходе
  const runForwardTransit = (nextTransit: StepState, nextScene: StepState, videoEl: HTMLVideoElement | null, nextLoopEl: HTMLVideoElement | null) => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true

    runDimFade(() => {
      setCurrentStep(nextTransit)
      playActiveLoop(videoEl)

      if (videoEl) {
        videoEl.currentTime = 0
        videoEl.play().then(() => {
          const handleEnded = () => {
            videoEl.removeEventListener('ended', handleEnded)
            runDimFade(() => {
              setCurrentStep(nextScene)
              playActiveLoop(nextLoopEl)
            }, 'loop')
            setTimeout(() => { isTransitioningRef.current = false }, 700)
          }
          videoEl.addEventListener('ended', handleEnded, { once: true })
        }).catch(() => {
          runDimFade(() => {
            setCurrentStep(nextScene)
            playActiveLoop(nextLoopEl)
          }, 'loop')
          isTransitioningRef.current = false
        })
      } else {
        runDimFade(() => {
          setCurrentStep(nextScene)
          playActiveLoop(nextLoopEl)
        }, 'loop')
        isTransitioningRef.current = false
      }
    }, 'transit')
  }

  const triggerNext = () => {
    if (currentStep === 'scene4') runForwardTransit('transit45', 'scene5', transit45Ref.current, video5Ref.current)
    else if (currentStep === 'scene5') runForwardTransit('transit56', 'scene6', transit56Ref.current, video6Ref.current)
    else if (currentStep === 'scene6') runForwardTransit('transit67', 'scene7', transit67Ref.current, video7Ref.current)
    else if (currentStep === 'scene7') {
      const s3 = document.getElementById('s3')
      if (s3) {
        const targetY = s3.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
    }
  }

  // Переходы назад — с включением transit-видео скроллинга
  const runReverseTransit = (prevTransit: StepState, prevScene: StepState, videoEl: HTMLVideoElement | null, prevLoopEl: HTMLVideoElement | null) => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true

    runDimFade(() => {
      setCurrentStep(prevTransit)

      if (videoEl) {
        videoEl.currentTime = 0
        videoEl.play().then(() => {
          const handleEnded = () => {
            videoEl.removeEventListener('ended', handleEnded)
            runDimFade(() => {
              setCurrentStep(prevScene)
              if (prevLoopEl) {
                prevLoopEl.play().catch(() => {})
              }
            }, 'loop')
            setTimeout(() => { isTransitioningRef.current = false }, 700)
          }
          videoEl.addEventListener('ended', handleEnded, { once: true })
        }).catch(() => {
          runDimFade(() => {
            setCurrentStep(prevScene)
            if (prevLoopEl) prevLoopEl.play().catch(() => {})
          }, 'loop')
          isTransitioningRef.current = false
        })
      } else {
        runDimFade(() => {
          setCurrentStep(prevScene)
          if (prevLoopEl) prevLoopEl.play().catch(() => {})
        }, 'loop')
        isTransitioningRef.current = false
      }
    }, 'transit')
  }

  const triggerPrev = () => {
    if (currentStep === 'scene7') {
      runReverseTransit('transit67', 'scene6', transit67Ref.current, video6Ref.current)
    } else if (currentStep === 'scene6') {
      runReverseTransit('transit56', 'scene5', transit56Ref.current, video5Ref.current)
    } else if (currentStep === 'scene5') {
      runReverseTransit('transit45', 'scene4', transit45Ref.current, video4Ref.current)
    } else if (currentStep === 'scene4') {
      const s1 = document.getElementById('s1')
      if (s1) {
        const targetY = s1.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
    }
  }



  useEffect(() => {
    let cooldown = false
    let touchStartY = 0

    const canScrollDownInContent = (): boolean => {
      const scrollEl = document.getElementById('hero4-content-scroll')
      if (!scrollEl) return false
      return scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight - 15
    }

    const canScrollUpInContent = (): boolean => {
      const scrollEl = document.getElementById('hero4-content-scroll')
      if (!scrollEl) return false
      return scrollEl.scrollTop > 15
    }

    const handleWheel = (e: WheelEvent) => {
      if (document.body.dataset.modalOpen) return
      const container = document.getElementById('hero-scene-4')
      if (!container) return

      const rect = container.getBoundingClientRect()
      if (rect.top >= -100 && rect.top <= 100) {
        if (cooldown || isTransitioningRef.current) return

        if (e.deltaY > 25) {
          if (canScrollDownInContent()) return
          e.preventDefault()
          cooldown = true
          triggerNext()
          setTimeout(() => { cooldown = false }, 1200)
        } else if (e.deltaY < -25) {
          if (canScrollUpInContent()) return
          e.preventDefault()
          cooldown = true
          triggerPrev()
          setTimeout(() => { cooldown = false }, 1200)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      const container = document.getElementById('hero-scene-4')
      if (!container) return

      const rect = container.getBoundingClientRect()
      if (rect.top >= -100 && rect.top <= 100) {
        if (e.cancelable && (currentStep !== 'scene7' || canScrollDownInContent())) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (document.body.dataset.modalOpen) return
      const container = document.getElementById('hero-scene-4')
      if (!container || cooldown || isTransitioningRef.current) return

      const rect = container.getBoundingClientRect()
      if (rect.top < -100 || rect.top > 100) return
      if (!e.changedTouches.length) return

      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY - touchEndY

      if (Math.abs(deltaY) < 35) return

      if (deltaY > 35) {
        if (canScrollDownInContent()) return
        cooldown = true
        triggerNext()
        setTimeout(() => { cooldown = false }, 1000)
      } else if (deltaY < -35) {
        if (canScrollUpInContent()) return
        cooldown = true
        triggerPrev()
        setTimeout(() => { cooldown = false }, 1000)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentStep])

  useEffect(() => {
    if (video4Ref.current) video4Ref.current.play().catch(() => {})
    if (video5Ref.current) video5Ref.current.play().catch(() => {})
    if (video6Ref.current) video6Ref.current.play().catch(() => {})
    if (video7Ref.current) video7Ref.current.play().catch(() => {})
  }, [])

  // Мягкий 3-секундный фейд (1.5с затухание + 1.5с проявление) на стыках закольцованных видео
  useEffect(() => {
    let animId: number
    const fadeWindow = 1.5

    const updateLoopFades = () => {
      const applyFade = (v: HTMLVideoElement | null, isActive: boolean) => {
        if (!v) return
        if (!isActive) {
          v.style.opacity = '0'
          return
        }
        if (!v.duration || v.duration <= 3) {
          v.style.opacity = '1'
          return
        }
        const timeLeft = v.duration - v.currentTime
        let opacity = 1
        if (timeLeft < fadeWindow) {
          opacity = Math.max(0, timeLeft / fadeWindow)
        } else if (v.currentTime < fadeWindow) {
          opacity = Math.min(1, v.currentTime / fadeWindow)
        }
        v.style.opacity = String(opacity)
      }

      applyFade(video4Ref.current, currentStep === 'scene4')
      applyFade(video5Ref.current, currentStep === 'scene5')
      applyFade(video6Ref.current, currentStep === 'scene6')
      applyFade(video7Ref.current, currentStep === 'scene7')

      animId = requestAnimationFrame(updateLoopFades)
    }

    animId = requestAnimationFrame(updateLoopFades)
    return () => cancelAnimationFrame(animId)
  }, [currentStep])

  return (
    <div id="hero-scene-4" className="relative h-screen w-full overflow-hidden bg-black text-white font-sans">
      <style>{`
        @keyframes animSway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes animPulseGlow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(124,194,72,0.4)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 16px rgba(124,194,72,0.9)); }
        }
        @keyframes animFloatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes animLiftIcon {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.06); }
        }
        @keyframes animSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes animShieldPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(124,194,72,0.4); }
          50% { box-shadow: 0 0 25px rgba(124,194,72,0.85); }
        }

        @keyframes animSearchScan {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.12) rotate(12deg); filter: drop-shadow(0 0 12px rgba(124,194,72,0.8)); }
        }
        @keyframes animCoinPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.14) rotateY(180deg); }
        }
        @keyframes animQcCheck {
          0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(124,194,72,0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 22px rgba(124,194,72,0.9); }
        }
        @keyframes animBoxFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes staggerCardEntrance {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .anim-sway { animation: animSway 3.5s ease-in-out infinite; }
        .anim-pulse-glow { animation: animPulseGlow 2.5s ease-in-out infinite; }
        .anim-float-y { animation: animFloatY 3s ease-in-out infinite; }
        .anim-lift-icon { animation: animLiftIcon 3.2s ease-in-out infinite; }
        .anim-spin-slow { animation: animSpinSlow 12s linear infinite; }
        .anim-shield-pulse { animation: animShieldPulse 2.8s ease-in-out infinite; }

        .anim-search-scan { animation: animSearchScan 3s ease-in-out infinite; }
        .anim-coin-pulse { animation: animCoinPulse 3.2s ease-in-out infinite; }
        .anim-qc-check { animation: animQcCheck 2.4s ease-in-out infinite; }
        .anim-box-float { animation: animBoxFloat 2.8s ease-in-out infinite; }

        .stagger-card {
          animation: staggerCardEntrance 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* 1. Видео-слой 4-й сцены (loop04.mp4) */}
      <video
        ref={video4Ref}
        src={getPreferredVideoSrc('/videos/loop04.mp4')}
        poster="/videos/loop04_poster.jpg"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: currentStep === 'scene4' || prevStep === 'scene4' ? 1 : 0,
          zIndex: currentStep === 'scene4' ? 3 : prevStep === 'scene4' ? 2 : 1,
        }}
        muted
        playsInline
        loop
        preload="auto"
      />

      {/* 2. Видео-слой 3D пролета 4-5 (transit45.mp4) */}
      <video
        ref={transit45Ref}
        src={getPreferredVideoSrc('/videos/transit45.mp4')}
        poster="/videos/transit45_poster.jpg"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: currentStep === 'transit45' || prevStep === 'transit45' ? 1 : 0,
          zIndex: currentStep === 'transit45' ? 3 : prevStep === 'transit45' ? 2 : 1,
        }}
        muted
        playsInline
        preload="auto"
      />

      {/* 3. Видео-слой 5-й сцены (loop05.mp4) */}
      <video
        ref={video5Ref}
        src={getPreferredVideoSrc('/videos/loop05.mp4')}
        poster="/videos/loop05_poster.jpg"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: currentStep === 'scene5' || prevStep === 'scene5' ? 1 : 0,
          zIndex: currentStep === 'scene5' ? 3 : prevStep === 'scene5' ? 2 : 1,
        }}
        muted
        playsInline
        loop
        preload="auto"
      />

      {/* 4. Видео-слой 3D пролета 5-6 (transit56.mp4) */}
      <video
        ref={transit56Ref}
        src={getPreferredVideoSrc('/videos/transit56.mp4')}
        poster="/videos/transit56_poster.jpg"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: currentStep === 'transit56' || prevStep === 'transit56' ? 1 : 0,
          zIndex: currentStep === 'transit56' ? 3 : prevStep === 'transit56' ? 2 : 1,
        }}
        muted
        playsInline
        preload="auto"
      />

      {/* 5. Видео-слой 6-й сцены (loop06.mp4) */}
      <video
        ref={video6Ref}
        src={getPreferredVideoSrc('/videos/loop06.mp4')}
        poster="/videos/loop06_poster.jpg"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: currentStep === 'scene6' || prevStep === 'scene6' ? 1 : 0,
          zIndex: currentStep === 'scene6' ? 3 : prevStep === 'scene6' ? 2 : 1,
        }}
        muted
        playsInline
        loop
        preload="auto"
      />

      {/* 6. Видео-слой 3D пролета 6-7 (transit67.mp4) */}
      <video
        ref={transit67Ref}
        src={getPreferredVideoSrc('/videos/transit67.mp4')}
        poster="/videos/transit67_poster.jpg"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: currentStep === 'transit67' || prevStep === 'transit67' ? 1 : 0,
          zIndex: currentStep === 'transit67' ? 3 : prevStep === 'transit67' ? 2 : 1,
        }}
        muted
        playsInline
        preload="auto"
      />

      {/* 7. Видео-слой 7-й сцены (loop07.mp4) */}
      <video
        ref={video7Ref}
        src={getPreferredVideoSrc('/videos/loop07.mp4')}
        poster="/videos/loop07_poster.jpg"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out pointer-events-none"
        style={{
          opacity: currentStep === 'scene7' || prevStep === 'scene7' ? 1 : 0,
          zIndex: currentStep === 'scene7' ? 3 : prevStep === 'scene7' ? 2 : 1,
        }}
        muted
        playsInline
        loop
        preload="auto"
      />



      {/* Лёгкое затемнение луп-экранов: вход — спокойный fade из темноты, выход — быстрое затемнение в пролёт */}
      <div
        className="pointer-events-none absolute inset-0 z-[20] bg-black"
        style={{
          opacity: dimOpacity,
          transition: dimDuration > 0 ? `opacity ${dimDuration}ms ease-out` : 'none',
        }}
      />

      {/* Контент верхнего слоя (UILayer) */}
      <div className="relative z-30 flex h-full flex-col font-sans">
        
        {/* Топ-навбар: Логотип + Меню + Язык + CTA */}
        <HeaderNav
          lang={lang}
          onToggleLang={toggleLang}
          onNavigateQuiz={scrollToTop}
        />

        {/* Скроллируемая область контента для мобильных и десктопа */}
        {/* Скроллируемая область контента — вертикальная центровка */}
        <div
          id="hero4-content-scroll"
          className="flex-1 overflow-y-auto pointer-events-auto custom-mobile-scroll px-4 sm:px-8 lg:px-16 xl:px-20 pt-2 sm:pt-4 pb-16 sm:pb-20 flex flex-col justify-center my-auto"
        >

        {/* СЦЕНЫ 4-7: заголовок + чипсы с поп-апами */}
        {currentStep.startsWith('scene') && (() => {
          const meta = hero4SceneMeta(lang)[currentStep as Hero4SceneKey]
          const isScene6 = currentStep === 'scene6'
          const isScene7 = currentStep === 'scene7'
          const singleRowChips = isScene6 || isScene7
          return (
            <div className={`flex flex-1 flex-col justify-center px-4 sm:px-8 max-w-5xl w-full animate-[fadeIn_0.5s_ease-out] ${isScene7 ? 'mx-0 text-left' : 'mx-auto text-center'}`}>
              {/* Eyebrow-пилюля (укорочена строго под размер текста) */}
              <div className={`hidden md:inline-flex ${isScene7 ? 'self-start' : 'self-center'} w-fit items-center gap-2.5 rounded-full border border-white/30 border-t-white/50 bg-white/10 px-5 py-2 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-2xl shadow-md mb-3 sm:mb-4 shrink-0`}>
                <span className="h-2 w-2 rounded-full bg-[#7CC248] shadow-[0_0_8px_#7CC248]" />
                <span>{meta.eyebrow}</span>
              </div>

              {/* Заголовок сцены */}
              <h1
                className="mb-4 sm:mb-8 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white font-display tracking-tight leading-tight"
                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
              >
                {meta.title}
                {meta.accent && <span className="block text-[#7CC248] mt-1">{meta.accent}</span>}
              </h1>

              {/* Чипсы с деталями в поп-апах (сцены 6-7 — строго в одну строку на десктопе) */}
              <div className={`flex flex-wrap ${isScene7 ? 'justify-start' : 'justify-center'} gap-2 sm:gap-3 mb-5 sm:mb-9 ${singleRowChips ? 'lg:flex-nowrap' : ''}`}>
                {meta.chips.map((chip) => (
                  <InfoChip key={chip.id} icon={chip.icon} label={chip.label} hint={chip.modalTitle} compact={singleRowChips} onClick={() => setOpenModal(chip.id)} />
                ))}
              </div>

              {/* CTA сцены */}
              {meta.cta && (
                <div className={`flex items-center ${isScene7 ? 'justify-start' : 'justify-center'}`}>
                  <button
                    onClick={() => openCalc(null)}
                    className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full px-6 py-3 sm:px-9 sm:py-4 text-xs sm:text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#88d450] active:scale-95 cursor-pointer"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <span>{meta.cta}</span>
                  </button>
                </div>
              )}
            </div>
          )
        })()}

        {/* ВО ВРЕМЯ ПРОЛЕТА TEXT ТИХО СКРЫВАЕТСЯ */}
        {currentStep.startsWith('transit') && <div className="flex-1" />}

        </div>

      {/* Поп-ап с деталями чипса (сцены 4-7) */}
      <InfoModal
        open={openChip !== null}
        onClose={() => setOpenModal(null)}
        title={openChip?.modalTitle ?? ''}
        eyebrow={openChip?.modalEyebrow}
        icon={openChip?.icon}
        ctaLabel={openChip?.linkHref ? undefined : lang === 'UK' ? 'Розрахувати вартість ➔' : 'Calculate Cost ➔'}
        onCta={() => openCalcFromChip(openChip)}
      >
        <p>{openChip?.modalBody}</p>
        {openChip?.modalList && (
          <ul className="mt-4 space-y-2.5">
            {openChip.modalList.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7CC248] text-white shadow-[0_0_10px_#7CC248]">
                  <svg className="h-3.5 w-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        )}
        {openChip?.modalDetail && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#7CC248] text-white shadow-[0_0_10px_#7CC248]">
              <svg className="h-3.5 w-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-white/90">{openChip.modalDetail}</p>
          </div>
        )}
        {openChip?.linkHref && (
          <a
            href={openChip.linkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#88d450] cursor-pointer"
            style={{ backgroundColor: ACCENT }}
          >
            {openChip.linkLabel}
          </a>
        )}
      </InfoModal>

      {/* Поп-ап: Швидкий розрахунок (сцены 4-7, с предвыбором категории из чипса) */}
      <InfoModal
        open={openModal === 'calc'}
        onClose={() => setOpenModal(null)}
        title={lang === 'UK' ? 'Швидкий розрахунок' : 'Quick Calculation'}
        eyebrow={lang === 'UK' ? 'Відповідь за 15 хвилин' : 'Reply within 15 minutes'}
      >
        <CalcFormContent
          lang={lang}
          initialCargoIndex={calcPreset?.cargoIndex ?? null}
          initialFrom={calcPreset?.from ?? ''}
          initialTo={calcPreset?.to ?? ''}
        />
      </InfoModal>

        {/* Нижние пилюли навигации по ВСЕМ 10 экранам */}
        <div className="hidden md:flex items-center justify-center px-4 sm:px-8 lg:px-16 xl:px-20 py-4 shrink-0 relative z-30">
          <div className="flex gap-1.5 lg:gap-2 flex-wrap justify-center p-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-2xl shadow-2xl">
            {[
              { pill: '01 Головна', sceneNum: 1 },
              { pill: '02 Послуги', sceneNum: 2 },
              { pill: '03 Квіз', sceneNum: 3 },
              { pill: '04 Карта', targetId: 's1' },
              { pill: '05 Вантажі', stepKey: 'scene4' },
              { pill: '06 КНР Сервіс', stepKey: 'scene5' },
              { pill: '07 Переваги', stepKey: 'scene6' },
              { pill: '08 Контакти', stepKey: 'scene7' },
              { pill: '09 Схема', targetId: 's3' },
              { pill: '10 Заявка', targetId: 's4' },
            ].map((s) => {
              const isActive =
                (currentStep === 'scene4' && s.stepKey === 'scene4') ||
                (currentStep === 'scene5' && s.stepKey === 'scene5') ||
                (currentStep === 'scene6' && s.stepKey === 'scene6') ||
                (currentStep === 'scene7' && s.stepKey === 'scene7')

              return (
                <button
                  key={s.pill}
                  onClick={() => {
                    if (s.sceneNum) {
                      window.dispatchEvent(new CustomEvent('nav-cinema', { detail: s.sceneNum }))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    } else if (s.stepKey) {
                      if (!isTransitioningRef.current && currentStep !== s.stepKey) {
                        isTransitioningRef.current = true
                        runDimFade(() => setCurrentStep(s.stepKey as any), 'loop')
                        setTimeout(() => { isTransitioningRef.current = false }, 700)
                      }
                      const el = document.getElementById('s2')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    } else if (s.targetId) {
                      const el = document.getElementById(s.targetId)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className="rounded-full px-2.5 lg:px-3 py-1 text-[10px] lg:text-[11px] font-bold border transition-all duration-300 hover:scale-105 flex items-center gap-1.5 shrink-0 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? ACCENT : 'rgba(255,255,255,0.08)',
                    borderColor: isActive ? '#7CC248' : 'rgba(255,255,255,0.15)',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                    boxShadow: isActive
                      ? '0 0 16px rgba(124,194,72,0.6), inset 0 1px 1px rgba(255,255,255,0.4)'
                      : 'none',
                  }}
                >
                  <span className={isActive ? 'font-extrabold tracking-wide' : 'font-medium'}>{s.pill}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white ml-0.5 shadow-[0_0_4px_#fff]" />}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
