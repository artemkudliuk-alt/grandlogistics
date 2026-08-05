import { useScrollReveal } from '../hooks/useScrollReveal'

interface Partner {
  id: string
  name: string
  src: string
}

const PARTNERS: Partner[] = [
  { id: 'maersk',    name: 'MAERSK',        src: '/user_logos_original/Maersk_Group_Logo.svg.webp' },
  { id: 'msc',       name: 'MSC',           src: '/user_logos_original/MSC_Cruises_Logo.png' },
  { id: 'cma',       name: 'CMA CGM',       src: '/user_logos_original/CMA_CGM_Company_Logo.png' },
  { id: 'cosco',     name: 'COSCO',         src: '/user_logos_original/COSCO_logo.svg' },
  { id: 'one',       name: 'OneLogistics',  src: '/user_logos_original/One-Logistics-Logo.png' },
  { id: 'evergreen', name: 'EVERGREEN',     src: '/user_logos_original/Evergreen_Logo.svg' },
  { id: 'hapag',     name: 'Hapag-Lloyd',   src: '/user_logos_original/Hapag-Lloyd.webp' },
  { id: 'dpworld',   name: 'DP WORLD',      src: '/user_logos_original/DP_World_2021_logo.webp' },
]

export function PartnersMarquee() {
  const marqueeList = [...PARTNERS, ...PARTNERS, ...PARTNERS]
  const revealRef = useScrollReveal<HTMLDivElement>()

  return (
    <div ref={revealRef} id="marquee-partners" className="w-full bg-white py-10 lg:py-12 border-t border-b border-slate-200 overflow-hidden relative">
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header for partners section */}
      <div className="reveal-scroll text-center max-w-3xl mx-auto mb-6 px-4">
        <div className="hidden md:inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-700 mb-2">
          <span className="h-2 w-2 rounded-full bg-[#7CC248]" />
          <span>НАШІ ПАРТНЕРИ ТА МОРСЬКІ ЛІНІЇ</span>
        </div>
      </div>

      <div className="marquee-track items-center gap-16 lg:gap-24 py-2">
        {marqueeList.map((partner, idx) => (
          <div
            key={`${partner.id}-${idx}`}
            className="shrink-0 flex items-center justify-center px-4 hover:scale-105 transition-transform duration-300 cursor-pointer opacity-90 hover:opacity-100"
          >
            {partner.id === 'one' ? (
              <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl flex items-center justify-center shadow-md">
                <img
                  src={partner.src}
                  alt={partner.name}
                  className="h-7 lg:h-9 w-auto object-contain"
                />
              </div>
            ) : (
              <img
                src={partner.src}
                alt={partner.name}
                className="h-10 lg:h-12 w-auto max-w-[160px] lg:max-w-[180px] object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
