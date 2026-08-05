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
 * Поп-ап поверх видео: blur-подложка, мягкое проявление, закрытие по ESC и клику вне.
 * На мобильных — bottom-sheet во всю ширину, на десктопе — центрированное окно.
 */
export function InfoModal({ open, onClose, title, eyebrow, icon: Icon, children, ctaLabel, onCta, size = 'sm' }: InfoModalProps) {
  useEffect(() => {
    if (!open) return
    // Флаг для видео-движков: пока поп-ап открыт, скролл не переключает сцены
    document.body.dataset.modalOpen = '1'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      delete document.body.dataset.modalOpen
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={onClose}
        >
          {/* Подложка: затемнение + blur, чтобы видео оставалось «живым» сзади */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

          <motion.div
            className={`relative w-full ${size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-lg'} max-h-[92vh] sm:max-h-[85vh] overflow-y-auto custom-mobile-scroll rounded-t-3xl sm:rounded-3xl border border-white/20 border-t-white/40 bg-[#0b1019]/95 sm:bg-[#0b1019]/90 backdrop-blur-2xl p-5 sm:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.25)] text-white`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ручка bottom-sheet на мобильных */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25 sm:hidden" />

            {/* Кнопка закрытия — тач-таргет 40px */}
            <button
              onClick={onClose}
              className="absolute right-3.5 top-3.5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:text-white active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
            </button>

            {/* Eyebrow */}
            {eyebrow && (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white/80">
                <span className="h-1.5 w-1.5 rounded-full shadow-[0_0_6px_#7CC248]" style={{ backgroundColor: ACCENT }} />
                <span>{eyebrow}</span>
              </div>
            )}

            {/* Заголовок с иконкой-якорем выбранной темы */}
            <div className="mb-4 flex items-center gap-3 pr-10">
              {Icon && (
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#7CC248]/20 text-[#7CC248] border border-[#7CC248]/35 shadow-[0_0_14px_rgba(124,194,72,0.25)]">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display tracking-tight leading-snug">
                {title}
              </h2>
            </div>

            <div className="text-sm sm:text-[15px] leading-relaxed text-white/85">
              {children}
            </div>

            {ctaLabel && (
              <button
                onClick={() => {
                  onClose()
                  onCta?.()
                }}
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.03] hover:bg-[#88d450] hover:shadow-[0_15px_40px_rgba(124,194,72,0.65)] active:scale-[0.98] cursor-pointer"
                style={{ backgroundColor: ACCENT }}
              >
                <span>{ctaLabel}</span>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
