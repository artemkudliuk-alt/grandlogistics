import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { submitLead } from '../services/leadService'

export function GraphiteContactForm() {
  const revealRef = useScrollReveal<HTMLDivElement>()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    origin: '',
    destination: '',
    cargoType: 'LCL (Збірні контейнери)',
    comment: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    const res = await submitLead({
      formType: 'contact_form',
      name: formData.name,
      phone: formData.phone,
      origin: formData.origin,
      destination: formData.destination,
      cargoType: formData.cargoType,
      comment: formData.comment,
      lang: 'UK',
    })

    setIsSubmitting(false)

    if (res.success) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: '',
          phone: '',
          origin: '',
          destination: '',
          cargoType: 'LCL (Збірні контейнери)',
          comment: '',
        })
      }, 5000)
    } else {
      setErrorMsg(res.message || 'Помилка відправки. Будь ласка, спробуйте ще раз або напишіть у Telegram.')
    }
  }

  return (
    <div ref={revealRef} id="contacts-form-section" className="relative w-full min-h-[100dvh] bg-[#121622] py-6 sm:py-8 px-4 sm:px-8 lg:px-16 xl:px-20 text-white overflow-hidden border-t border-white/10 flex flex-col justify-center">
      {/* Фоновые декоративные свечения графитового экрана */}
      <div className="pointer-events-none absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#7CC248]/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Заголовок */}
        <div className="reveal-scroll text-center max-w-3xl mx-auto mb-5 sm:mb-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#7CC248]/40 border-t-[#7CC248]/60 bg-[#7CC248]/15 px-4 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#7CC248] backdrop-blur-2xl shadow-md mb-3 sm:mb-4">
            <span className="h-2 w-2 rounded-full bg-[#7CC248] shadow-[0_0_8px_#7CC248]" />
            <span>ОНЛАЙН-РОЗРАХУНОК ТА КОНСУЛЬТАЦІЯ 24/7</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            Отримайте швидкий розрахунок
            <span className="block text-[#7CC248] mt-1">доставки вантажу за 15 хвилин</span>
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
            Ми завжди онлайн! Заповніть форму або зв'яжіться через месенджер для миттєвої консультації.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
          
          {/* Левая колонка: Форма расчёта стоимости */}
          <div className="reveal-scroll lg:col-span-7 rounded-2xl sm:rounded-3xl border border-white/15 border-t-white/30 border-l-white/25 bg-[#181e2c]/80 backdrop-blur-3xl p-5 sm:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.6)]" style={{ transitionDelay: '120ms' }}>
            
            {submitted ? (
              <div className="py-12 text-center animate-[fadeIn_0.5s_ease-out]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#7CC248]/20 border border-[#7CC248] text-[#7CC248] mb-6 shadow-[0_0_25px_rgba(124,194,72,0.5)]">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-white font-display mb-2">Заявку успішно прийнято!</h3>
                <p className="text-sm text-slate-300">Наш черговий логіст зв'яжеться з Вами протягом 15 хвилин.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                      Ваше ім'я / Компанія *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Олександр (ТОВ Логістик)"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#7CC248] focus:bg-white/10 focus:outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                      Телефон / Telegram / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+380 (67) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#7CC248] focus:bg-white/10 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                      Звідки (Країна / Порт)
                    </label>
                    <input
                      type="text"
                      placeholder="Нінбо (КНР) / Гданськ"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#7CC248] focus:bg-white/10 focus:outline-none transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                      Куди (Місто / Склад)
                    </label>
                    <input
                      type="text"
                      placeholder="Київ / Одеса / Дніпро"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#7CC248] focus:bg-white/10 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                    Тип вантажу
                  </label>
                  <select
                    value={formData.cargoType}
                    onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                    className="w-full rounded-2xl border border-white/15 bg-[#141a27] px-4 py-2.5 text-sm text-white focus:border-[#7CC248] focus:outline-none transition-all"
                  >
                    <option value="LCL">Збірні контейнери (LCL)</option>
                    <option value="FCL">Повний контейнер (FCL)</option>
                    <option value="AGRO">Зернові та агропродукція</option>
                    <option value="TECH">Електроніка та обладнання</option>
                    <option value="OVERSIZED">Негабарит та ADR вантажі</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                    Коментар або деталі вантажу
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Об'єм, вага, необхідність викупу в КНР або рефрижераторного режиму..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#7CC248] focus:bg-white/10 focus:outline-none transition-all shadow-inner"
                  />
                </div>

                {errorMsg && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/20 p-3 text-xs text-red-200">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-2xl bg-[#7CC248] py-3.5 text-sm font-extrabold text-white shadow-[0_10px_30px_rgba(124,194,72,0.4)] transition-all hover:scale-[1.02] hover:bg-[#88d450] active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Відправка заявки...</span>
                    </>
                  ) : (
                    <span>Отримати розрахунок за 15 хвилин ➔</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Правая колонка: 4 Ключевых идеи & Онлайн статус */}
          <div className="reveal-scroll lg:col-span-5 space-y-3" style={{ transitionDelay: '240ms' }}>
            
            {/* Live Online Badge */}
            <div className="rounded-3xl border border-[#7CC248]/40 border-t-[#7CC248]/60 bg-[#7CC248]/10 backdrop-blur-2xl p-4 shadow-xl flex items-center gap-4">
              <div className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CC248] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#7CC248]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white font-display">Логісти онлайн прямо зараз</h4>
                <p className="text-xs text-slate-300 font-medium">Черговий диспетчер обробляє заявки в режимі реального часу.</p>
              </div>
            </div>

            {/* 4 Ключевые идеи (Преимущества работы) */}
            <div className="space-y-3">
              <div className="group rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-300 hover:border-[#7CC248]/50 hover:bg-white/10 hover:-translate-y-0.5 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7CC248]/20 text-[#7CC248] border border-[#7CC248]/30 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white font-display group-hover:text-[#7CC248] transition-colors">
                    Розрахунок кошторису за 15 хвилин
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1">
                    Фіксуємо вартість доставки до підписання договору без несподіваних доплат.
                  </p>
                </div>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-300 hover:border-[#7CC248]/50 hover:bg-white/10 hover:-translate-y-0.5 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7CC248]/20 text-[#7CC248] border border-[#7CC248]/30 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white font-display group-hover:text-[#7CC248] transition-colors">
                    Оптимальний вигідний тариф
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1">
                    Прямі контракти з морськими лініями та власна інфраструктура в КНР/ЄС.
                  </p>
                </div>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-300 hover:border-[#7CC248]/50 hover:bg-white/10 hover:-translate-y-0.5 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7CC248]/20 text-[#7CC248] border border-[#7CC248]/30 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white font-display group-hover:text-[#7CC248] transition-colors">
                    100% Страхування War Risks
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1">
                    Повний захист вантажу від військових та форс-мажорних ризиків на всьому маршруті.
                  </p>
                </div>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all duration-300 hover:border-[#7CC248]/50 hover:bg-white/10 hover:-translate-y-0.5 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7CC248]/20 text-[#7CC248] border border-[#7CC248]/30 group-hover:scale-110 transition-transform">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white font-display group-hover:text-[#7CC248] transition-colors">
                    Підтримка 24/7 у Telegram
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1">
                    @grand_logistics_bot — онлайн-трекінг та персональний менеджер.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>


      </div>
    </div>
  )
}
