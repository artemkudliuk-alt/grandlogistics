import { useState, type FormEvent } from 'react'
import { ACCENT } from '../config/scenes'
import type { Lang } from '../config/lang'
import {
  Wheat,
  Cpu,
  Shirt,
  Building2,
  TriangleAlert,
  ThermometerSnowflake,
  FileCheck,
  SearchCheck,
  Anchor,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

const ORIGINS = [
  { title: 'Китай', titleEn: 'China', code: 'cn', desc: 'Гуанчжоу / Шанхай', descEn: 'Guangzhou / Shanghai' },
  { title: 'США', titleEn: 'USA', code: 'us', desc: 'Нью-Йорк / Лос-Анджелес', descEn: 'New York / Los Angeles' },
  { title: 'ЄС', titleEn: 'EU', code: 'eu', desc: 'Німеччина / Польща', descEn: 'Germany / Poland' },
  { title: 'Індія', titleEn: 'India', code: 'in', desc: 'Мумбаї / Мундра', descEn: 'Mumbai / Mundra' },
]

const DESTINATIONS = [
  { title: 'Україна', titleEn: 'Ukraine', code: 'ua', desc: 'Порти Одеси / Київ', descEn: 'Odesa Ports / Kyiv' },
  { title: 'ЄС (Європа)', titleEn: 'EU (Europe)', code: 'eu', desc: 'Констанца / Гданськ', descEn: 'Constanța / Gdańsk' },
]

/** SVG-флаг страны (эмодзи-флаги не рендерятся на Windows) */
function Flag({ code, className = 'h-4 w-6' }: { code: string; className?: string }) {
  return (
    <img
      src={`/flags/${code}.svg`}
      alt={code.toUpperCase()}
      className={`${className} shrink-0 rounded-[3px] object-cover shadow-[0_1px_3px_rgba(0,0,0,0.5)]`}
      loading="lazy"
    />
  )
}

const CARGO_TYPES: { title: string; titleEn: string; icon: LucideIcon }[] = [
  { title: 'Зернові / Напилом', titleEn: 'Grain / Bulk', icon: Wheat },
  { title: 'Електроніка', titleEn: 'Electronics', icon: Cpu },
  { title: 'Одяг & Текстиль', titleEn: 'Apparel & Textile', icon: Shirt },
  { title: 'Будматеріали', titleEn: 'Construction', icon: Building2 },
  { title: 'Небезпечний ADR', titleEn: 'Dangerous ADR', icon: TriangleAlert },
  { title: 'Рефрижератор', titleEn: 'Reefer', icon: ThermometerSnowflake },
]

const EXTRAS: { title: string; titleEn: string; icon: LucideIcon; desc: string; descEn: string }[] = [
  { title: 'Митне оформлення', titleEn: 'Customs Clearance', icon: FileCheck, desc: 'Імпорт / Експорт / Транзит брокер', descEn: 'Import / Export / Transit broker' },
  { title: 'Викуп та аудит у КНР', titleEn: 'China Sourcing & Audit', icon: SearchCheck, desc: 'Пошук фабрик & QC-інспекція', descEn: 'Factory search & QC inspection' },
  { title: 'Портове експедирування', titleEn: 'Port Forwarding', icon: Anchor, desc: 'Суднова документація та ПРР', descEn: 'Vessel docs & stevedoring' },
  { title: 'Страхування військових ризиків', titleEn: 'War Risks Insurance', icon: ShieldCheck, desc: 'War Risks Coverage 100%', descEn: 'War Risks Coverage 100%' },
]

/**
 * 4-шаговый квиз подбора услуги — контент для InfoModal.
 */
export function QuizContent({ lang }: { lang: Lang }) {
  const uk = lang === 'UK'
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [origin, setOrigin] = useState(ORIGINS[0].title)
  const [destination, setDestination] = useState(DESTINATIONS[0].title)
  const [cargo, setCargo] = useState(CARGO_TYPES[1].title)
  const [weight, setWeight] = useState('15')
  const [volume, setVolume] = useState('40')
  const [extras, setExtras] = useState<string[]>([EXTRAS[0].title, EXTRAS[3].title])
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggleExtra = (title: string) => {
    setExtras((prev) => (prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]))
  }

  const stepNames = uk
    ? ['Маршрут перевезення', 'Параметри вантажу', 'Послуги «під ключ»', 'Фінал & Контакти']
    : ['Shipping Route', 'Cargo Parameters', 'Turnkey Services', 'Final & Contacts']

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const backBtn = (to: 1 | 2 | 3) => (
    <button
      type="button"
      onClick={() => setStep(to)}
      className="pointer-events-auto rounded-xl px-5 py-3 text-xs font-bold text-white/80 border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
    >
      ← {uk ? 'Назад' : 'Back'}
    </button>
  )

  const nextBtn = (to: 2 | 3 | 4, label: string) => (
    <button
      type="button"
      onClick={() => setStep(to)}
      className="pointer-events-auto rounded-xl py-3.5 px-8 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45)] transition-all duration-300 hover:scale-105 hover:bg-[#88d450] flex items-center gap-2 cursor-pointer"
      style={{ backgroundColor: ACCENT }}
    >
      <span>{label}</span>
    </button>
  )

  if (submitted) {
    return (
      <div className="py-6 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#88d450] to-[#68ab38] text-white shadow-[0_0_20px_#7CC248] border border-white/50">
          <svg className="h-8 w-8 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold text-white font-display">
          {uk ? 'Заявку успішно прийнято!' : 'Request received!'}
        </h3>
        <p className="text-sm text-white/90 max-w-md mx-auto leading-relaxed">
          {uk
            ? "Дякуємо! Наш провідний логіст вже розробляє 2-3 варіанти кошторису та маршруту (Авіа / Ж/Д / Море) і зв'яжеться з вами протягом 15 хвилин."
            : 'Thank you! Our lead logistics specialist is already preparing 2-3 cost & route options (Air / Rail / Sea) and will contact you within 15 minutes.'}
        </p>
        <div className="pt-2 text-xs text-white/60 font-mono">
          {origin} ➔ {destination} | {cargo} ({weight}т / {volume}м³)
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Шкала прогресса */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs font-bold text-white/80 mb-2">
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7CC248] text-white text-[11px] font-extrabold shadow-[0_0_8px_#7CC248]">
              {step}
            </span>
            <span>
              {uk ? `Крок ${step} з 4: ` : `Step ${step} of 4: `}
              {stepNames[step - 1]}
            </span>
          </span>
          <span className="text-[#7CC248] font-extrabold">{step * 25}%</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/10 p-0.5 border border-white/15 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#88d450] to-[#68ab38] transition-all duration-700 shadow-[0_0_12px_#7CC248]"
            style={{ width: `${step * 25}%` }}
          />
        </div>
      </div>

      {/* ШАГ 1: МАРШРУТ */}
      {step === 1 && (
        <div className="space-y-5 quiz-step-in">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2.5">
              🌏 {uk ? 'КРАЇНА ВІДПРАВЛЕННЯ:' : 'COUNTRY OF ORIGIN:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ORIGINS.map((item, idx) => {
                const isSelected = origin === item.title
                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setOrigin(item.title)}
                    style={{ animationDelay: `${idx * 70}ms` }}
                    className={`quiz-step-in pointer-events-auto cursor-pointer p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#7CC248] bg-gradient-to-br from-[#7CC248]/25 to-[#68ab38]/20 shadow-[0_0_15px_rgba(124,194,72,0.4)] scale-[1.02]'
                        : 'border-white/15 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Flag code={item.code} />
                        <h4 className="font-extrabold text-xs text-white whitespace-nowrap">{uk ? item.title : item.titleEn}</h4>
                      </div>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[#7CC248] shadow-[0_0_6px_#7CC248]" />}
                    </div>
                    <p className="text-[10px] text-white/60 whitespace-nowrap truncate">{uk ? item.desc : item.descEn}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2.5">
              📍 {uk ? 'КРАЇНА ПРИЗНАЧЕННЯ:' : 'DESTINATION:'}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {DESTINATIONS.map((item, idx) => {
                const isSelected = destination === item.title
                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setDestination(item.title)}
                    style={{ animationDelay: `${(idx + 4) * 70}ms` }}
                    className={`quiz-step-in pointer-events-auto cursor-pointer p-3 rounded-xl border text-left transition-all duration-300 flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#7CC248] bg-gradient-to-br from-[#7CC248]/25 to-[#68ab38]/20 shadow-[0_0_15px_rgba(124,194,72,0.4)] scale-[1.02]'
                        : 'border-white/15 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Flag code={item.code} className="h-5 w-8" />
                    <div className="overflow-hidden">
                      <h4 className="font-extrabold text-xs text-white whitespace-nowrap truncate">{uk ? item.title : item.titleEn}</h4>
                      <p className="text-[10px] text-white/60 whitespace-nowrap truncate">{uk ? item.desc : item.descEn}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            {nextBtn(2, uk ? 'Далі: Параметри вантажу ➔' : 'Next: Cargo Parameters ➔')}
          </div>
        </div>
      )}

      {/* ШАГ 2: ПАРАМЕТРЫ ГРУЗА */}
      {step === 2 && (
        <div className="space-y-5 quiz-step-in">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2.5">
              📦 {uk ? 'ТИП ВАНТАЖУ:' : 'CARGO TYPE:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CARGO_TYPES.map((item, idx) => {
                const isSelected = cargo === item.title
                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => setCargo(item.title)}
                    style={{ animationDelay: `${idx * 60}ms` }}
                    className={`quiz-step-in pointer-events-auto cursor-pointer p-3 rounded-xl border text-left transition-all duration-300 flex items-center gap-2.5 ${
                      isSelected
                        ? 'border-[#7CC248] bg-[#7CC248]/25 shadow-[0_0_15px_rgba(124,194,72,0.4)]'
                        : 'border-white/15 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 transition-colors duration-300 ${isSelected ? 'text-[#7CC248] drop-shadow-[0_0_6px_rgba(124,194,72,0.7)]' : 'text-white/70'}`}
                      strokeWidth={2}
                    />
                    <span className="text-xs text-white font-medium">{uk ? item.title : item.titleEn}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                ⚖️ {uk ? 'ВАГА (ТОНН):' : 'WEIGHT (TONS):'}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={uk ? 'напр. 15' : 'e.g. 15'}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-[#7CC248] focus:bg-white/15 focus:ring-2 focus:ring-[#7CC248]/40"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                📐 {uk ? "ОБ'ЄМ (М³):" : 'VOLUME (M³):'}
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder={uk ? 'напр. 40' : 'e.g. 40'}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-[#7CC248] focus:bg-white/15 focus:ring-2 focus:ring-[#7CC248]/40"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {backBtn(1)}
            {nextBtn(3, uk ? 'Далі: Додаткові послуги ➔' : 'Next: Extra Services ➔')}
          </div>
        </div>
      )}

      {/* ШАГ 3: ДОП. УСЛУГИ */}
      {step === 3 && (
        <div className="space-y-5 quiz-step-in">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2.5">
              🛡️ {uk ? 'СЕРВІСИ «ПІД КЛЮЧ»:' : 'TURNKEY SERVICES:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EXTRAS.map((item, idx) => {
                const isChecked = extras.includes(item.title)
                return (
                  <button
                    type="button"
                    key={item.title}
                    onClick={() => toggleExtra(item.title)}
                    style={{ animationDelay: `${idx * 60}ms` }}
                    className={`quiz-step-in pointer-events-auto cursor-pointer p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-start justify-between ${
                      isChecked
                        ? 'border-[#7CC248] bg-gradient-to-br from-[#7CC248]/25 to-[#68ab38]/20 shadow-[0_0_20px_rgba(124,194,72,0.4)]'
                        : 'border-white/15 bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                          isChecked ? 'bg-[#7CC248] text-white shadow-[0_0_12px_#7CC248]' : 'bg-white/10 text-white/70'
                        }`}
                      >
                        <item.icon className="h-4.5 w-4.5" strokeWidth={2} />
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">{uk ? item.title : item.titleEn}</h4>
                        <p className="text-[11px] text-white/60 mt-0.5">{uk ? item.desc : item.descEn}</p>
                      </div>
                    </div>
                    <div
                      className={`h-6 w-6 shrink-0 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                        isChecked ? 'bg-[#7CC248] border-[#7CC248] text-white shadow-[0_0_10px_#7CC248]' : 'border-white/30'
                      }`}
                    >
                      {isChecked && (
                        <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {backBtn(2)}
            {nextBtn(4, uk ? 'Далі: Отримати розрахунок ➔' : 'Next: Get Estimate ➔')}
          </div>
        </div>
      )}

      {/* ШАГ 4: ФИНАЛ */}
      {step === 4 && (
        <div className="space-y-5 quiz-step-in">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-xs text-white/90 space-y-2">
            <div className="font-extrabold text-[#7CC248] uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#7CC248] shadow-[0_0_6px_#7CC248]" />
              <span>{uk ? '📋 ВАШ СФОРМОВАНИЙ ЗАПИТ:' : '📋 YOUR REQUEST SUMMARY:'}</span>
            </div>
            <div>
              • {uk ? 'Маршрут' : 'Route'}: <span className="font-bold text-white">{origin} ➔ {destination}</span>
            </div>
            <div>
              • {uk ? 'Вантаж' : 'Cargo'}: <span className="font-bold text-white">{cargo} ({weight || '15'}т / {volume || '40'}м³)</span>
            </div>
            <div>
              • {uk ? 'Послуги' : 'Services'}: <span className="font-bold text-white">{extras.join(', ') || (uk ? 'Стандартний фрахт' : 'Standard freight')}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
              📱 {uk ? 'ТЕЛЕФОН АБО TELEGRAM ДЛЯ КОШТОРИСУ:' : 'PHONE OR TELEGRAM FOR ESTIMATE:'}
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+380 (XX) XXX-XX-XX / @username"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-[#7CC248] focus:bg-white/15 focus:ring-2 focus:ring-[#7CC248]/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            {backBtn(3)}
            <button
              type="submit"
              className="pointer-events-auto rounded-xl py-3.5 px-8 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#88d450] hover:shadow-[0_15px_40px_rgba(124,194,72,0.65)] active:scale-95 flex items-center gap-2 cursor-pointer"
              style={{ backgroundColor: ACCENT }}
            >
              <span>{uk ? 'Отримати 2-3 варіанти (Авіа / Ж/Д / Море) ➔' : 'Get 2-3 Options (Air / Rail / Sea) ➔'}</span>
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
