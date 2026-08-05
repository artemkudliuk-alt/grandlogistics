import { ACCENT } from '../config/scenes'

interface Pill {
  label: string
  sceneNum?: number
  subScene?: string
  targetId?: string
}

const PILLS: Pill[] = [
  { label: '01 Головна', sceneNum: 1 },
  { label: '02 Послуги', sceneNum: 2 },
  { label: '03 Китай Хаб', sceneNum: 3 },
  { label: '04 Карта', targetId: 's1' },
  { label: '05 Вантажі', subScene: 'scene4', targetId: 's2' },
  { label: '06 КНР Сервіс', subScene: 'scene5', targetId: 's2' },
  { label: '07 Переваги', subScene: 'scene6', targetId: 's2' },
  { label: '08 Контакти', subScene: 'scene7', targetId: 's2' },
  { label: '09 Схема', targetId: 's3' },
  { label: '10 Заявка', targetId: 's4' },
]

interface SitePillsProps {
  /** активная кино-сцена 1..3 (для верхнего движка) */
  activeScene?: number
  /** активная секция по targetId, напр. 's3' или 's4' */
  activeTarget?: string
}

/**
 * Пилюли-маршрут по всем 10 экранам сайта — единая нижняя плашка навигации.
 */
export function SitePills({ activeScene, activeTarget }: SitePillsProps) {
  const handleClick = (item: Pill) => {
    if (item.sceneNum) {
      window.dispatchEvent(new CustomEvent('nav-cinema', { detail: item.sceneNum }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (item.subScene) {
      window.dispatchEvent(new CustomEvent('nav-hero4', { detail: item.subScene }))
    }
    if (item.targetId) {
      const el = document.getElementById(item.targetId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex gap-1.5 lg:gap-2 flex-wrap justify-center p-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-2xl shadow-2xl">
      {PILLS.map((item) => {
        const isActive =
          (item.sceneNum !== undefined && item.sceneNum === activeScene) ||
          (item.targetId !== undefined && item.targetId === activeTarget && !item.subScene)
        return (
          <button
            key={item.label}
            onClick={() => handleClick(item)}
            className="pointer-events-auto cursor-pointer rounded-full px-2.5 lg:px-3 py-1 text-[10px] lg:text-[11px] font-bold transition-all duration-300 hover:scale-105 border flex items-center gap-1.5 shrink-0"
            style={{
              backgroundColor: isActive ? ACCENT : 'rgba(255,255,255,0.08)',
              borderColor: isActive ? '#7CC248' : 'rgba(255,255,255,0.15)',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
              boxShadow: isActive ? '0 0 16px rgba(124,194,72,0.6), inset 0 1px 1px rgba(255,255,255,0.4)' : 'none',
            }}
          >
            <span className={isActive ? 'font-extrabold tracking-wide' : 'font-medium'}>{item.label}</span>
            {isActive && <span className="inline-block h-1.5 w-1.5 rounded-full bg-white ml-0.5 shadow-[0_0_4px_#fff]" />}
          </button>
        )
      })}
    </div>
  )
}
