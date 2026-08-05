import { useEffect, useState } from 'react'
import { SCENE_TEXTS_UK, SCENE_TEXTS_EN, ACCENT } from '../config/scenes'
import { CHIPS_UK, CHIPS_EN, type ChipItem } from '../config/chips'
import { useLang } from '../config/lang'
import { InfoChip } from './InfoChip'
import { InfoModal } from './InfoModal'
import { CalcFormContent } from './CalcFormContent'
import { QuizContent } from './QuizContent'
import { Calculator } from 'lucide-react'

interface Props {
  scene: number // 1..3
  stepIndex: number
  totalSteps: number
  isTransit?: boolean
  onSelectScene?: (sceneNum: number) => void
  onNext?: () => void
}

export function UILayer({ scene, isTransit = false }: Props) {
  const lang = useLang()
  // Единое спокойное появление панели — без стаггера отдельных элементов (устраняет мигание)
  const mounted = true
  const [visible, setVisible] = useState(true)

  // Какой поп-ап открыт: id чипса | 'calc' | 'quiz' | null
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

  const texts = lang === 'UK' ? SCENE_TEXTS_UK : SCENE_TEXTS_EN
  const chips = lang === 'UK' ? CHIPS_UK : CHIPS_EN
  const t = texts[scene - 1]

  // fade+slide панели при смене сцены — единственная анимация входа, спокойная
  useEffect(() => {
    setVisible(false)
    const id = setTimeout(() => setVisible(true), 120)
    return () => clearTimeout(id)
  }, [scene])

  // Закрываем поп-ап при смене сцены/пролёте
  useEffect(() => {
    setOpenModal(null)
  }, [scene, isTransit])

  // Сброс скролла контента наверх при смене сцены
  useEffect(() => {
    const el = document.getElementById('cinema-content-scroll')
    if (el) el.scrollTop = 0
  }, [scene])

  const heroChips = chips.hero
  const serviceChips = chips.services
  const sourcingChips = chips.sourcing
  const activeChips = scene === 1 ? heroChips : scene === 2 ? serviceChips : sourcingChips
  const openChip = activeChips.find((c) => c.id === openModal) ?? null

  // Стаггер отключён — вход делает единый fade+slide обёртки (без мигания)
  const anim = (_delay: number) => ({}) as const

  // Слушатель события для вызова Квиза из глобальной шапки
  useEffect(() => {
    const handleOpenQuiz = () => setOpenModal('quiz')
    window.addEventListener('open-quiz', handleOpenQuiz)
    return () => window.removeEventListener('open-quiz', handleOpenQuiz)
  }, [])

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 flex flex-col font-sans transition-all duration-500 ease-in-out ${
        isTransit ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Центральный контент — идеальная вертикальная центровка на 100% экрана */}
      <div
        id="cinema-content-scroll"
        className="flex-1 overflow-y-auto pointer-events-auto custom-mobile-scroll px-4 sm:px-8 lg:px-16 xl:px-20 pt-2 sm:pt-4 pb-20 sm:pb-24 flex flex-col justify-center my-auto"
        style={{ overscrollBehaviorY: 'contain' }}
      >
        <div
          className="w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
          {scene !== 3 ? (
          <div className={scene === 2 ? 'max-w-5xl mx-auto text-center' : 'max-w-4xl mx-auto lg:mx-0 lg:pl-6 xl:pl-10 text-center lg:text-left'}>
            {/* Eyebrow-пилюля */}
            <div
              className="hidden md:inline-flex mb-4 sm:mb-5 items-center gap-2.5 rounded-full border border-white/30 border-t-white/50 bg-white/10 px-5 py-2 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-2xl shadow-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={anim(100)}
            >
              <span className="inline-block h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_#7CC248]" style={{ backgroundColor: ACCENT }} />
              <span className="whitespace-nowrap">{t.eyebrow}</span>
            </div>

            {/* H1 — Ровно в 2 строки на десктопе */}
            <h1
              className="mb-3 sm:mb-5 text-[26px] sm:text-[38px] lg:text-[48px] xl:text-[54px] font-extrabold leading-[1.15] text-white font-display tracking-tight"
              style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
            >
              <span className="block whitespace-normal sm:whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={anim(200)}>
                {t.titleLine1}
              </span>
              <span className="block whitespace-normal sm:whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={anim(280)}>
                {t.titleLine2}{' '}
                <span className="text-[#7CC248] inline-block" style={{ textShadow: '0 0 15px rgba(124,194,72,0.5), 0 2px 6px rgba(0,0,0,0.9)' }}>
                  {t.titleLine3}
                </span>
              </span>
            </h1>

            {/* Подзаголовок — 1-2 строки максимум */}
            {t.subtitle && (
              <p
                className="mb-4 sm:mb-7 text-xs sm:text-base lg:text-lg leading-relaxed text-white/90 max-w-2xl mx-auto lg:mx-0 font-medium transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ ...anim(400), textShadow: '0 1px 4px rgba(0,0,0,0.95)' }}
              >
                {t.subtitle}
              </p>
            )}

            {/* Ряд инфо-чипсов — детали по клику в поп-апе */}
            <div className={`flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-8 ${scene === 2 ? 'justify-center lg:flex-nowrap lg:gap-2 xl:gap-3' : 'justify-center lg:justify-start'}`}>
              {activeChips.map((chip) => (
                <InfoChip
                  key={chip.id}
                  icon={chip.icon}
                  label={chip.label}
                  mounted={mounted}
                  compact={scene === 2}
                  hint={chip.modalTitle}
                  onClick={() => setOpenModal(chip.id)}
                />
              ))}
            </div>

            {/* Единая CTA (сцены 1-2) */}
            <div className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]" style={anim(760)}>
              <button
                onClick={() => openCalc(null)}
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-base font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#88d450] hover:shadow-[0_15px_40px_rgba(124,194,72,0.65)] active:scale-95 cursor-pointer"
                style={{ backgroundColor: ACCENT }}
              >
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.2} />
                <span>{lang === 'UK' ? 'Швидкий розрахунок вартості ➔' : 'Quick Cost Calculation ➔'}</span>
              </button>
            </div>
          </div>
          ) : (
          /* Сцена 3: Квиз ОТКРЫТ на экране — без чипсов, вся механика сразу доступна */
          <div className="max-w-3xl mx-auto w-full text-center">
            {/* Eyebrow-пилюля */}
            <div
              className="hidden md:inline-flex mb-4 items-center gap-2.5 rounded-full border border-white/30 border-t-white/50 bg-white/10 px-5 py-2 text-[10px] xl:text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-2xl shadow-md transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={anim(100)}
            >
              <span className="inline-block h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_#7CC248]" style={{ backgroundColor: ACCENT }} />
              <span className="whitespace-nowrap">{t.eyebrow}</span>
            </div>

            {/* H1 — ровно в одну строку на мобильных и десктопе */}
            <h1
              className="mb-1.5 sm:mb-3 text-[18px] sm:text-2xl lg:text-3xl font-extrabold leading-tight text-white font-display tracking-tight whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ ...anim(200), textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
            >
              {t.titleLine1}{' '}
              <span className="text-[#7CC248]" style={{ textShadow: '0 0 15px rgba(124,194,72,0.5), 0 2px 6px rgba(0,0,0,0.9)' }}>
                {t.titleLine3}
              </span>
            </h1>

            {/* Одна строка-резюме */}
            <p
              className="mb-3 text-[11px] sm:text-xs text-white/80 font-medium transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] line-clamp-1"
              style={{ ...anim(320), textShadow: '0 1px 4px rgba(0,0,0,0.95)' }}
            >
              {t.bullets.join('  •  ')}
            </p>

            {/* Открытая карточка квиза */}
            <div
              className="pointer-events-auto rounded-2xl sm:rounded-3xl border border-white/20 border-t-white/40 bg-black/65 backdrop-blur-2xl p-3.5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.2)] text-left transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={anim(440)}
            >
              <QuizContent lang={lang} />
            </div>
          </div>
          )}
        </div>
      </div>


      {/* Поп-ап с деталями чипса */}
      <InfoModal
        open={openChip !== null}
        onClose={() => setOpenModal(null)}
        title={openChip?.modalTitle ?? ''}
        eyebrow={openChip?.modalEyebrow}
        icon={openChip?.icon}
        ctaLabel={lang === 'UK' ? 'Розрахувати вартість ➔' : 'Calculate Cost ➔'}
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
      </InfoModal>

      {/* Поп-ап: Швидкий розрахунок (с предвыбором категории из чипса) */}
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

      {/* Поп-ап: 4-шаговый квиз */}
      <InfoModal
        open={openModal === 'quiz'}
        onClose={() => setOpenModal(null)}
        title={lang === 'UK' ? 'Розрахуйте вартість — 2-3 варіанти доставки' : 'Calculate Cost — 2-3 Delivery Options'}
        eyebrow={lang === 'UK' ? 'Інтерактивний підбір • Step-by-Step' : 'Interactive Wizard • Step-by-Step'}
        size="lg"
      >
        <QuizContent lang={lang} />
      </InfoModal>
    </div>
  )
}
