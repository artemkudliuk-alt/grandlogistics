import type { LucideIcon } from 'lucide-react'

interface InfoChipProps {
  icon: LucideIcon
  label: string
  onClick: () => void
  /** задержка входа, мс */
  delay?: number
  mounted?: boolean
  /** компактный вид на lg — чтобы 5 чипсов влезали в одну строку */
  compact?: boolean
  /** Текст мягкого тултипа при наведении (что внутри поп-апа) */
  hint?: string
}

/**
 * Тёмный «стеклянный» чип с иконкой — компактный вход в поп-ап с деталями.
 * Зелёный появляется только на hover, чтобы не перегружать видео.
 * При наведении мягко всплывает тултип с темой поп-апа.
 */
export function InfoChip({ icon: Icon, label, onClick, delay = 0, mounted = true, compact = false, hint }: InfoChipProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative pointer-events-auto inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-white/20 border-t-white/35 bg-[rgba(58,63,68,0.55)] backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#7CC248]/60 hover:bg-[rgba(58,63,68,0.75)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.55),0_0_18px_rgba(124,194,72,0.25)] hover:scale-[1.04] active:scale-[0.97] ${
        compact ? 'px-4 py-2 sm:px-5 sm:py-2.5 lg:px-3.5 lg:py-2' : 'px-4 py-2 sm:px-5 sm:py-2.5'
      }`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Мягкий тултип: что откроется по клику (только на устройствах с hover) */}
      {hint && (
        <span
          className="pointer-events-none absolute -top-11 left-1/2 z-20 hidden -translate-x-1/2 translate-y-1.5 whitespace-nowrap rounded-xl border border-white/15 bg-[#0b1019]/95 px-3.5 py-2 text-[11px] font-bold text-white/90 opacity-0 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-200 ease-out delay-300 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:block"
        >
          {hint}
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-white/15 bg-[#0b1019]/95" />
        </span>
      )}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/85 transition-all duration-300 group-hover:bg-[#7CC248] group-hover:text-white group-hover:shadow-[0_0_10px_rgba(124,194,72,0.7)]">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
      </span>
      <span className={`whitespace-nowrap font-bold text-white/90 transition-colors duration-300 group-hover:text-white ${
        compact ? 'text-xs sm:text-sm lg:text-xs xl:text-sm' : 'text-xs sm:text-sm'
      }`}>
        {label}
      </span>
      <span className="text-white/35 text-xs transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[#7CC248]">
        ➔
      </span>
    </button>
  )
}
