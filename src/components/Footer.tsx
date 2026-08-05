import { Phone, Mail, Globe } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Головна', href: '#' },
  { label: 'Послуги', href: '#s2' },
  { label: 'Географія', href: '#s1' },
  { label: 'Схема роботи', href: '#s3' },
  { label: 'Партнери', href: '#marquee-partners' },
  { label: 'Контакти', href: '#s4' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-30 bg-[#f1f5f9] border-t border-slate-300/80 text-slate-800">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1: Logo + tagline */}
          <div className="flex flex-col gap-4">
            <div>
              <img
                src="/logo2.png"
                alt="Grand Logistics"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-medium">
              Портове експедирування, контейнерні перевезення, митне оформлення та China Sourcing «під ключ».
            </p>

            {/* Messengers */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://t.me/grand_logistics_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#229ED9]/10 hover:border-[#229ED9]/40 hover:text-[#229ED9] transition-all duration-200 shadow-sm"
              >
                {/* Telegram icon */}
                <svg className="h-4 w-4 text-[#229ED9]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.5l-2.95-.924c-.641-.204-.655-.641.136-.953l11.57-4.461c.537-.194 1.006.131.968.959z"/>
                </svg>
                Telegram
              </a>
              <a
                href="https://wa.me/380665715295"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#25D366]/10 hover:border-[#25D366]/40 hover:text-[#25D366] transition-all duration-200 shadow-sm"
              >
                {/* WhatsApp icon */}
                <svg className="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-widest text-[#5a9c2e]">Навігація</h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-slate-700 hover:text-[#5a9c2e] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-px w-3 bg-slate-400 group-hover:bg-[#5a9c2e] group-hover:w-5 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div>
            <h3 className="mb-5 text-xs font-extrabold uppercase tracking-widest text-[#5a9c2e]">Контакти</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#5a9c2e]" strokeWidth={2.5} />
                <div className="text-slate-800 leading-relaxed font-semibold">
                  <div>+38 048 795-21-01</div>
                  <div className="text-slate-500 text-xs font-normal">Факс: +38 048 705-14-52</div>
                  <div>+38 066 571-52-95</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#5a9c2e]" strokeWidth={2.5} />
                <a href="mailto:alexandra@grandlog.com.ua" className="text-slate-800 hover:text-[#5a9c2e] font-semibold transition-colors duration-200 break-all">
                  alexandra@grandlog.com.ua
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-4 w-4 shrink-0 text-[#5a9c2e]" strokeWidth={2.5} />
                <a href="https://www.grandlog.com.ua" target="_blank" rel="noopener noreferrer" className="text-slate-800 hover:text-[#5a9c2e] font-semibold transition-colors duration-200">
                  www.grandlog.com.ua
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-300/80 bg-slate-200/70">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 font-medium">
            © {year} Grand Logistics. Усі права захищені.
          </p>
          <p className="text-xs text-slate-500 font-normal">
            Дозвіл на митну брокерську діяльність № &nbsp;·&nbsp; ТОВ «Гранд Логістика»
          </p>
        </div>
      </div>
    </footer>
  )
}
