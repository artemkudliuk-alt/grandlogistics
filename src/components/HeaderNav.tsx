import { useState } from 'react'
import { FORM_TEXTS, ACCENT } from '../config/scenes'

interface HeaderNavProps {
  lang: 'UK' | 'EN'
  onToggleLang: () => void
  onNavigateQuiz: () => void
  mounted?: boolean
}

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

  return (
    <>
      <header
        className="relative z-40 w-full px-4 py-3 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:mx-auto md:mt-4 md:w-[96%] md:max-w-7xl md:rounded-full md:border md:border-white/15 md:bg-black/40 md:backdrop-blur-2xl md:shadow-[0_8px_32px_rgba(0,0,0,0.4)] md:px-10 md:py-3.5"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transitionDelay: '0ms',
        }}
      >
        {/* --- MOBILE LAYOUT (< md) --- */}

        {/* Left: Burger Menu Button */}
        <div className="flex items-center md:hidden z-10">
          <button
            onClick={() => setMobileOpen(true)}
            className="pointer-events-auto p-2 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95 flex items-center justify-center cursor-pointer"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Center: Logo (Centered on mobile via absolute positioning, left-aligned on desktop) */}
        <div className="md:static absolute left-1/2 -translate-x-1/2 md:translate-x-0 flex items-center justify-center z-10">
          <img
            src="/logo.png"
            alt="Grand Logistics"
            className="h-8 sm:h-10 w-auto object-contain cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleNavClick('top')}
          />
        </div>

        {/* --- DESKTOP NAV LINKS (md+) --- */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 xl:gap-10 text-sm font-semibold text-white/95">
          {navItems.slice(1).map((item) => (
            <span
              key={item.label}
              onClick={() => handleNavClick(item.target)}
              className="pointer-events-auto cursor-pointer hover:text-[#7CC248] hover:scale-105 transition-all duration-300 tracking-tight"
            >
              {item.label}
            </span>
          ))}

          {/* Language Toggle UK / EN */}
          <button
            onClick={onToggleLang}
            className="pointer-events-auto cursor-pointer rounded-full border border-white/35 border-t-white/50 bg-white/10 backdrop-blur-xl px-4 py-1.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <span className={lang === 'UK' ? 'text-[#7CC248] font-extrabold' : 'text-white/60'}>UK</span>
            <span className="text-white/30 font-light">/</span>
            <span className={lang === 'EN' ? 'text-[#7CC248] font-extrabold' : 'text-white/60'}>EN</span>
          </button>
        </nav>

        {/* Right side: Desktop CTA button & language selector (Hidden on mobile) */}
        <div className="hidden md:flex items-center gap-3 z-10">
          <style>{`
            @keyframes floatingCta {
              0%, 100% { transform: translateY(0px); box-shadow: 0 0 20px rgba(124,194,72,0.4); }
              50% { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(124,194,72,0.7); }
            }
            .anim-floating-cta {
              animation: floatingCta 3.5s ease-in-out infinite;
            }
          `}</style>
          <button
            onClick={onNavigateQuiz}
            className="pointer-events-auto rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-[#88d450] active:scale-95 flex items-center gap-2 cursor-pointer anim-floating-cta"
            style={{ backgroundColor: ACCENT }}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-white shadow-[0_0_6px_#fff]" />
            <span>{f.headerCta}</span>
          </button>
        </div>

        {/* Mobile Right Spacer (Balances left burger button to keep logo perfectly centered) */}
        <div className="w-10 md:hidden pointer-events-none" />
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
