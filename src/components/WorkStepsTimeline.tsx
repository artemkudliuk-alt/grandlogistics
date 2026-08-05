import { useState } from 'react'
import { FileText, Calculator, ShieldCheck, Container, Truck, type LucideIcon } from 'lucide-react'
import { useLang } from '../config/lang'
import { useScrollReveal } from '../hooks/useScrollReveal'

interface Step {
  num: string
  titleUk: string
  titleEn: string
  descUk: string
  descEn: string
  badgeUk: string
  badgeEn: string
  icon: LucideIcon
}

const STEPS: Step[] = [
  {
    num: '01',
    badgeUk: 'КРОК 1',
    badgeEn: 'STEP 1',
    titleUk: '1. Заявка',
    titleEn: '1. Request',
    descUk: 'Онлайн-запит на сайті, розрахунок у боті Telegram або дзвінок у цілодобову службу 24/7.',
    descEn: 'Online request, Telegram bot calculation, or round-the-clock hotline call.',
    icon: FileText,
  },
  {
    num: '02',
    badgeUk: 'КРОК 2 • 15 ХВ',
    badgeEn: 'STEP 2 • 15 MIN',
    titleUk: '2. Розрахунок кошторису (15 хв)',
    titleEn: '2. Cost Calculation (15 min)',
    descUk: 'Точний підбір мультимодального маршруту, розрахунок митних платежів та фіксація тарифу.',
    descEn: 'Multimodal route selection, customs duties calculation, and fixed rate agreement.',
    icon: Calculator,
  },
  {
    num: '03',
    badgeUk: 'КРОК 3 • WAR RISKS',
    badgeEn: 'STEP 3 • WAR RISKS',
    titleUk: '3. Договір & Страхування',
    titleEn: '3. Contract & Insurance',
    descUk: 'Підписання прямого ЗЕД договору та 100% страхування військових ризиків (War Risks).',
    descEn: 'Direct FEA contract signing and 100% War Risks insurance coverage.',
    icon: ShieldCheck,
  },
  {
    num: '04',
    badgeUk: 'КРОК 4 • LOGISTICS',
    badgeEn: 'STEP 4 • LOGISTICS',
    titleUk: '4. Забор & Таможня & Порт',
    titleEn: '4. Pickup & Customs & Port',
    descUk: 'Консолідація товарів на складі в КНР/ЄС, сертифікація, портовий експедирування та митниця.',
    descEn: 'Warehouse consolidation in China/EU, certification, port forwarding & customs.',
    icon: Container,
  },
  {
    num: '05',
    badgeUk: 'КРОК 5 • DOOR-TO-DOOR',
    badgeEn: 'STEP 5 • DOOR-TO-DOOR',
    titleUk: '5. Доставка «до дверей»',
    titleEn: '5. Door-to-Door Delivery',
    descUk: 'Автомобільне або залізничне довезення контейнера прямо до складських дверей замовника.',
    descEn: 'Trucking or rail transport of container straight to the customer warehouse door.',
    icon: Truck,
  },
]

export function WorkStepsTimeline() {
  const [activeStep, setActiveStep] = useState(0)
  const lang = useLang()
  const revealRef = useScrollReveal<HTMLDivElement>()

  return (
    <div ref={revealRef} className="relative w-full min-h-screen bg-slate-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-12 text-slate-900 overflow-hidden border-t border-slate-200">
      
      <div className="max-w-[1536px] mx-auto relative z-10 w-full">
        
        {/* Заголовок секции */}
        <div className="reveal-scroll text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-[#7CC248]/40 bg-[#7CC248]/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#458021] mb-3">
            <span className="h-2 w-2 rounded-full bg-[#7CC248]" />
            <span>ПРОЗОРІЙ ПРОЦЕС ДОСТАВКИ</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
            Схема роботи від заявки
            <span className="block text-[#458021] mt-1">до одержання вантажу</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm lg:text-base text-slate-600 font-medium">
            Повний супровід на кожному етапі із фіксованими термінами та цілодобовим онлайн-моніторингом.
          </p>
        </div>

        {/* Интерактивный таймлайн 5 шагов — Широкие карточки без градиентов */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
          
          {/* Соединительная сплошная линия */}
          <div className="hidden lg:block absolute top-[48px] left-[calc(10%+24px)] right-[calc(10%+24px)] h-0.5 bg-[#7CC248]/30 -z-0" />

          {STEPS.map((step, index) => {
            const isActive = activeStep === index

            return (
              <div
                key={step.num}
                className="reveal-scroll h-full"
                style={{ transitionDelay: `${120 + index * 110}ms` }}
              >
              <div
                onMouseEnter={() => setActiveStep(index)}
                className={`relative group h-full rounded-2xl border transition-all duration-300 p-5 sm:p-6 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isActive
                    ? 'border-[#7CC248] bg-white shadow-xl shadow-[#7CC248]/10 -translate-y-1.5'
                    : 'border-slate-200 bg-white hover:border-[#7CC248]/60 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div>
                  {/* Top step header */}
                  <div className="flex items-center justify-between mb-4 lg:mb-5">
                    <div
                      className={`flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-[#7CC248] text-white border border-[#68ab38] shadow-md'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-[#7CC248]/10 group-hover:text-[#458021]'
                      }`}
                    >
                      <step.icon className="h-6 w-6" strokeWidth={2} />
                    </div>

                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border transition-all ${
                        isActive
                          ? 'bg-[#7CC248]/15 border-[#7CC248] text-[#458021]'
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {lang === 'UK' ? step.badgeUk : step.badgeEn}
                    </span>
                  </div>

                  {/* Step title */}
                  <h3
                    className={`text-base lg:text-lg font-extrabold font-display mb-2 lg:mb-3 transition-colors duration-300 leading-snug ${
                      isActive ? 'text-[#458021]' : 'text-slate-900 group-hover:text-[#458021]'
                    }`}
                  >
                    {lang === 'UK' ? step.titleUk : step.titleEn}
                  </h3>

                  {/* Step description */}
                  <p className="text-xs lg:text-sm text-slate-600 leading-relaxed font-medium">
                    {lang === 'UK' ? step.descUk : step.descEn}
                  </p>
                </div>

                {/* Bottom step progress indicator */}
                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className={isActive ? 'text-[#458021]' : 'text-slate-400'}>
                    Крок {step.num} з 05
                  </span>
                  <span
                    className={`transition-transform duration-300 ${
                      isActive ? 'translate-x-1 text-[#458021]' : 'text-slate-400 group-hover:text-[#458021]'
                    }`}
                  >
                    ➔
                  </span>
                </div>
              </div>
              </div>
            )
          })}
        </div>


      </div>
    </div>
  )
}
