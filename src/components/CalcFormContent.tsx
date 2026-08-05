import { useState, type FormEvent } from 'react'
import { FORM_TEXTS, ACCENT } from '../config/scenes'
import type { Lang } from '../config/lang'

/**
 * Поля формы «Швидкий розрахунок» — используются внутри InfoModal.
 * initialCargoIndex — предвыбор категории, initialFrom/initialTo — предзаполненный маршрут
 * (пришли из чипса, по которому кликнули — решаем за клиента максимум).
 */
export function CalcFormContent({
  lang,
  initialCargoIndex = null,
  initialFrom = '',
  initialTo = '',
}: {
  lang: Lang
  initialCargoIndex?: number | null
  initialFrom?: string
  initialTo?: string
}) {
  const f = FORM_TEXTS[lang]
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const [cargoType, setCargoType] = useState(
    initialCargoIndex !== null && f.cargoOptions[initialCargoIndex]
      ? f.cargoOptions[initialCargoIndex]
      : f.cargoOptions[0]
  )
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/20 p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#88d450] to-[#68ab38] text-white shadow-[0_0_18px_#7CC248] border border-white/40">
          <svg className="h-7 w-7 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-emerald-200">{f.successMsg}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/75">{f.labelFrom}</label>
        <input
          type="text"
          required
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder={f.placeholderFrom}
          className="w-full rounded-xl border border-white/20 border-t-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-200 focus:border-[#7CC248] focus:bg-white/15 focus:ring-2 focus:ring-[#7CC248]/40"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/75">{f.labelTo}</label>
        <input
          type="text"
          required
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={f.placeholderTo}
          className="w-full rounded-xl border border-white/20 border-t-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-200 focus:border-[#7CC248] focus:bg-white/15 focus:ring-2 focus:ring-[#7CC248]/40"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/75">{f.labelCargo}</label>
        {initialCargoIndex !== null && (
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-[#7CC248]/90">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{lang === 'UK' ? 'Категорія підставлена з вашого вибору — можете змінити' : 'Category pre-filled from your selection — feel free to change'}</span>
          </p>
        )}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {f.cargoOptions.map((opt) => {
            const isSelected = cargoType === opt
            return (
              <button
                type="button"
                key={opt}
                onClick={() => setCargoType(opt)}
                aria-pressed={isSelected}
                className={`pointer-events-auto cursor-pointer rounded-xl px-2.5 py-2.5 text-left text-[11px] sm:text-xs font-bold leading-tight transition-all duration-200 ease-out active:scale-[0.97] ${
                  isSelected
                    ? 'bg-[#7CC248] text-white shadow-[0_6px_18px_rgba(124,194,72,0.4)]'
                    : 'bg-white/10 text-white/75 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
                  {isSelected && (
                    <svg className="h-3 w-3 shrink-0 stroke-[3.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className="truncate">{opt}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/75">{f.labelContact}</label>
        <input
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={f.placeholderContact}
          className="w-full rounded-xl border border-white/20 border-t-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-200 focus:border-[#7CC248] focus:bg-white/15 focus:ring-2 focus:ring-[#7CC248]/40"
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-xl py-3.5 px-5 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-[#88d450] hover:shadow-[0_15px_40px_rgba(124,194,72,0.65)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        style={{ backgroundColor: ACCENT }}
      >
        <span>{f.submitBtn}</span>
      </button>

      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] font-medium text-white/60 pt-1">
        <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>{f.confidential}</span>
      </p>
    </form>
  )
}
