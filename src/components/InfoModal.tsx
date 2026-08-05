import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, type LucideIcon } from 'lucide-react'
import { ACCENT } from '../config/scenes'

interface InfoModalProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  /** Иконка чипса — визуальный якорь «что именно выбрано» */
  icon?: LucideIcon
  children: ReactNode
  ctaLabel?: string
  onCta?: () => void
  /** ширина: sm для текстовых поп-апов, lg для форм/квиза */
  size?: 'sm' | 'lg'
}

/**
 * Поп-ап поверх видео: 100% плавная прокрутка на мобильных (touch-isolation),
 * идеальное размещение в границах экрана (max-h-[85vh]) и блокировка фона.
 */
export function InfoModal({ open, onClose, title, eyebrow, icon: Icon, children, ctaLabel, onCta, size = 'sm' }: InfoModalProps) {
  useEffect(() => {
    if (!open) return

    // Флаг для видео-движков + блокировка прокрутки основного тела страницы
    document.body.dataset.modalOpen = '1'
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      delete document.body.dataset.modalOpen
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[990] flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={onClose}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Подложка: затемнение + blur, чтобы видео оставалось «живым» сзади */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            className={`relative w-full ${
              size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            } max-h-[88vh] sm:max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/20 border-t-white/40 bg-[#0b1019]/95 sm:bg-[#0b1019]/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_40px_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white overflow-hidden`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ручка bottom-sheet на мобильных */}
            <div className="mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full bg-white/30 sm:hidden" />

            {/* Кнопка закрытия — тач-таргет 44px для удобного нажатия папиросой пальца */}
            <button
              onClick={onClose}
              className="absolute right-3.5 top-3.5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:text-white active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>

            {/* Шапка поп-апа (фиксированная) */}
            <div className="shrink-0 pr-10">
              {/* Eyebrow */}
              {eyebrow && (
                <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_6px_#7CC248]" style={{ backgroundColor: ACCENT }} />
                  <span>{eyebrow}</span>
                </div>
              )}

              {/* Заголовок с иконкой */}
              <div className="mb-4 flex items-center gap-3">
                {Icon && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#7CC248]/20 text-[#7CC248] border border-[#7CC248]/35 shadow-[0_0_14px_rgba(124,194,72,0.25)]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight leading-snug">
                  {title}
                </h2>
              </div>
            </div>

            {/* Прокручиваемый контент с идеальным тач-скроллом */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain pr-1.5 text-sm sm:text-[15px] leading-relaxed text-white/90 custom-mobile-scroll"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>

            {/* Нижний CTA футер (фиксированный при наличии кнопки) */}
            {ctaLabel && (
              <div className="mt-4 shrink-0 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    onClose()
                    onCta?.()
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#88d450] active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: ACCENT }}
                >
                  <span>{ctaLabel}</span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
