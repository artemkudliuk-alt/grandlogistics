import { useState, useEffect } from 'react'
import { FORM_TEXTS, ACCENT } from '../config/scenes'

interface HeaderNavProps {
  lang: 'UK' | 'EN'
  onToggleLang: () => void
  onNavigateQuiz: () => void
  mounted?: boolean
}

// 10 навигационных пунктов из SitePills — теперь в шапке
interface NavPill {
  label: string
  sceneNum?: number
  subScene?: string
  targetId?: string
}

const SITE_NAV: NavPill[] = [
  { label: 'Головна', sceneNum: 1 },
  { label: 'Послуги', sceneNum: 2 },
  { label: 'Китай', sceneNum: 3 },
  { label: 'Карта', targetId: 's1' },
  { label: 'Вантажі', subScene: 'scene4', targetId: 's2' },
  { label: 'КНР Сервіс', subScene: 'scene5', targetId: 's2' },
  { label: 'Переваги', subScene: 'scene6', targetId: 's2' },
  { label: 'Контакти', subScene: 'scene7', targetId: 's2' },
  { label: 'Схема', targetId: 's3' },
  { label: 'Заявка', targetId: 's4' },
]

export function HeaderNav({ lang, onToggleLang, onNavigateQuiz, mounted = true }: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const f = FORM_TEXTS[lang]

  // Блокируем переключение 3D сцен при открытом мобильном меню и отключаем скролл заднего фона
  useEffect(() => {
    if (mobileOpen) {
      document.body.dataset.modalOpen = 'true'
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        delete document.body.dataset.modalOpen
        document.body.style.overflow = originalOverflow
      }
    }
  }, [mobileOpen])

  const handleNavClick = (target: string) => {
    setMobileOpen(false)
    if (target === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.getElementById(target)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleNavPill = (item: NavPill) => {
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
    <>
      <header
        className="relative z-40 w-full border-b border-white/10 bg-black/50 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transitionDelay: '0ms',
        }}
      >
        {/* Одна строка на десктопе: лого | nav по всей ширине | lang + CTA */}
        <div className="hidden md:flex items-center gap-0 h-14 px-6 xl:px-10">

          {/* Логотип */}
          <div className="shrink-0 pr-6 border-r border-white/15">
            <img
              src="/logo.png"
              alt="Grand Logistics"
              className="h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleNavClick('top')}
            />
          </div>

          {/* 10 навигационных пунктов — по всей оставшейся ширине */}
          <nav className="flex-1 flex items-center justify-between px-4 xl:px-6">
            {SITE_NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavPill(item)}
                className="pointer-events-auto cursor-pointer text-[11px] xl:text-xs font-semibold text-white/70 hover:text-white transition-colors duration-200 tracking-wide whitespace-nowrap px-1"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Правая часть: UK/EN + CTA */}
          <div className="shrink-0 pl-6 border-l border-white/15 flex items-center gap-4">
            {/* Language Toggle — два флага SVG: активный яркий, неактивный тёмный */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={lang === 'EN' ? onToggleLang : undefined}
                className={`pointer-events-auto cursor-pointer transition-all duration-200 rounded-sm overflow-hidden ${
                  lang === 'UK' ? 'opacity-100 scale-110 ring-1 ring-white/40' : 'opacity-25 grayscale hover:opacity-60 hover:grayscale-0'
                }`}
                title="Українська"
              >
                <img src="/flags/ua.svg" alt="UA" className="w-6 h-4 object-cover" />
              </button>
              <span className="text-white/20 text-xs">/</span>
              <button
                onClick={lang === 'UK' ? onToggleLang : undefined}
                className={`pointer-events-auto cursor-pointer transition-all duration-200 rounded-sm overflow-hidden ${
                  lang === 'EN' ? 'opacity-100 scale-110 ring-1 ring-white/40' : 'opacity-25 grayscale hover:opacity-60 hover:grayscale-0'
                }`}
                title="English"
              >
                <img src="/flags/gb.svg" alt="EN" className="w-6 h-4 object-cover" />
              </button>
            </div>

            {/* CTA */}
            <style>{`
              @keyframes floatingCta {
                0%, 100% { box-shadow: 0 0 16px rgba(124,194,72,0.4); }
                50% { box-shadow: 0 6px 24px rgba(124,194,72,0.7); }
              }
              .anim-floating-cta { animation: floatingCta 3.5s ease-in-out infinite; }
            `}</style>
            <button
              onClick={onNavigateQuiz}
              className="pointer-events-auto rounded-full px-5 py-2 text-xs font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#88d450] active:scale-95 flex items-center gap-1.5 cursor-pointer anim-floating-cta"
              style={{ backgroundColor: ACCENT }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
              <span>{f.headerCta}</span>
            </button>
          </div>
        </div>

        {/* === MOBILE === */}
        <div className="flex md:hidden items-center justify-between px-4 py-3">
          {/* Burger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="pointer-events-auto p-2 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo centered */}
          <img
            src="/logo.png"
            alt="Grand Logistics"
            className="h-8 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleNavClick('top')}
          />

          {/* Spacer */}
          <div className="w-10" />
        </div>
      </header>


      {/* --- BURGER MENU OVERLAY / DRAWER FOR MOBILE --- */}
      {mobileOpen && (
        <div
          className="pointer-events-auto fixed inset-0 z-[100] flex flex-col bg-[#0b1019] text-white animate-[fadeIn_0.3s_ease-out] overflow-y-auto overscroll-contain"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >

          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <img src="/logo.png" alt="Grand Logistics" className="h-8 w-auto" />
            {/* Флаги в шапке дровера */}
            <div className="flex items-center gap-2">
              <button
                onClick={lang === 'EN' ? onToggleLang : undefined}
                className={`cursor-pointer transition-all duration-200 rounded-sm overflow-hidden ${
                  lang === 'UK' ? 'opacity-100 scale-110 ring-1 ring-white/40' : 'opacity-30 grayscale'
                }`}
                title="Українська"
              >
                <img src="/flags/ua.svg" alt="UA" className="w-7 h-5 object-cover" />
              </button>
              <span className="text-white/20 text-sm">/</span>
              <button
                onClick={lang === 'UK' ? onToggleLang : undefined}
                className={`cursor-pointer transition-all duration-200 rounded-sm overflow-hidden ${
                  lang === 'EN' ? 'opacity-100 scale-110 ring-1 ring-white/40' : 'opacity-30 grayscale'
                }`}
                title="English"
              >
                <img src="/flags/gb.svg" alt="EN" className="w-7 h-5 object-cover" />
              </button>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 active:scale-95 transition-all"
              aria-label="Close menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 10 навигационных пунктов */}
          <div className="flex-1 flex flex-col px-6 py-6 gap-0">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#7CC248] mb-4">
              Навігація сайту
            </div>
            {SITE_NAV.map((item) => (
              <button
                key={item.label}
                onClick={() => { setMobileOpen(false); handleNavPill(item) }}
                className="text-left text-xl font-bold text-white hover:text-[#7CC248] transition-colors py-3.5 border-b border-white/8 flex items-center justify-between group"
              >
                <span>{item.label}</span>
                <span className="text-white/25 group-hover:text-[#7CC248] transition-colors text-base">➔</span>
              </button>
            ))}
          </div>

          {/* Нижняя часть: CTA + контакты */}
          <div className="px-6 py-6 border-t border-white/10 space-y-3">
            <button
              onClick={() => { setMobileOpen(false); onNavigateQuiz() }}
              className="w-full rounded-2xl py-4 text-sm font-extrabold text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
              style={{ backgroundColor: ACCENT }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-white" />
              <span>{f.headerCta}</span>
            </button>

            <div className="flex items-center justify-center gap-4 pt-1 text-xs text-white/60">
              <a href="https://t.me/grand_logistics_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#229ED9] hover:text-[#44b8f0] transition-colors">
                Telegram
              </a>
              <span>•</span>
              <a href="tel:+380665715295" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                +38 066 571-52-95
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
