import { useState } from 'react'
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

  const navItems = [
    { label: 'Головна', target: 'top' },
    { label: f.navServices, target: 's2' },
    { label: f.navGeography, target: 's1' },
    { label: 'Схема роботи', target: 's3' },
    { label: f.navSourcing, target: 's5' },
    { label: 'Партнери', target: 'marquee-partners' },
    { label: f.navContacts, target: 's4' },
  ]

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
            {/* Language Toggle — два флага: активный яркий, неактивный тёмный */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={lang === 'EN' ? onToggleLang : undefined}
                className={`pointer-events-auto cursor-pointer text-lg leading-none transition-all duration-200 ${
                  lang === 'UK' ? 'opacity-100 scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'opacity-25 grayscale hover:opacity-60 hover:grayscale-0'
                }`}
                title="Українська"
              >
                🇺🇦
              </button>
              <span className="text-white/20 text-xs">/</span>
              <button
                onClick={lang === 'UK' ? onToggleLang : undefined}
                className={`pointer-events-auto cursor-pointer text-lg leading-none transition-all duration-200 ${
                  lang === 'EN' ? 'opacity-100 scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'opacity-25 grayscale hover:opacity-60 hover:grayscale-0'
                }`}
                title="English"
              >
                🇬🇧
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
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0b1019]/95 backdrop-blur-3xl text-white animate-[fadeIn_0.3s_ease-out] p-6 overflow-y-auto">
          {/* Drawer Top Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/15">
            <img src="/logo.png" alt="Grand Logistics" className="h-8 w-auto" />
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

          {/* Drawer Navigation Links */}
          <div className="flex flex-col gap-4 py-8">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#7CC248] mb-1">
              Навігація сайту
            </div>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.target)}
                className="text-left text-xl font-extrabold text-white hover:text-[#7CC248] transition-colors py-2 border-b border-white/5 flex items-center justify-between group"
              >
                <span>{item.label}</span>
                <span className="text-white/30 group-hover:text-[#7CC248] transition-colors">➔</span>
              </button>
            ))}
          </div>

          {/* Language & CTA in Drawer */}
          <div className="mt-auto pt-6 border-t border-white/15 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 font-medium">Мова інтерфейсу / Language:</span>
              <button
                onClick={onToggleLang}
                className="rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1.5"
              >
                <span className={lang === 'UK' ? 'text-[#7CC248] font-extrabold' : 'text-white/60'}>UK</span>
                <span className="text-white/30">/</span>
                <span className={lang === 'EN' ? 'text-[#7CC248] font-extrabold' : 'text-white/60'}>EN</span>
              </button>
            </div>

            <button
              onClick={() => {
                setMobileOpen(false)
                onNavigateQuiz()
              }}
              className="w-full rounded-2xl py-4 text-sm font-extrabold text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: ACCENT }}
            >
              <span>{f.headerCta}</span>
            </button>

            {/* Quick Contact Links */}
            <div className="flex items-center justify-center gap-4 pt-2 text-xs text-white/70">
              <a href="https://t.me/grand_logistics_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#229ED9]">
                <span>Telegram</span>
              </a>
              <span>•</span>
              <a href="tel:+380665715295" className="text-emerald-400">
                <span>+38 066 571-52-95</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
