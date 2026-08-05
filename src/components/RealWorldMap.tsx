import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationPin {
  id: string
  name: string
  country: string
  flag: string
  type: 'port' | 'origin'
  coords: [number, number]
  desc: string
  transitTime: string
  capacity: string
  labelPos?: 'top' | 'bottom' | 'left' | 'right'
}

const LOCATIONS: LocationPin[] = [
  // ПОРТИ УКРАЇНИ
  {
    id: 'odesa',
    name: 'Порт Одеса',
    country: 'Україна',
    flag: '🇺🇦',
    type: 'port',
    coords: [46.4825, 30.7233],
    desc: 'Головний контейнерний хаб України. Внутріпортове експедирування, стафінг, расстафінг, митне очищення.',
    transitTime: '1-2 дні з порту',
    capacity: 'FCL / LCL / Зерно',
    labelPos: 'top',
  },
  {
    id: 'chornomorsk',
    name: 'Порт Чорноморськ',
    country: 'Україна',
    flag: '🇺🇦',
    type: 'port',
    coords: [46.3017, 30.6569],
    desc: 'Спеціалізований зерновий та контейнерний термінал. Пряме перевантаження на Ж/Д та автотранспорт.',
    transitTime: '1-2 дні з порту',
    capacity: 'Зерно / FCL / LCL',
    labelPos: 'bottom',
  },
  {
    id: 'pivdennyi',
    name: 'Порт Південний',
    country: 'Україна',
    flag: '🇺🇦',
    type: 'port',
    coords: [46.6231, 31.0267],
    desc: 'Найглибоководніший порт України. Прийом великотоннажних суден класу Panamax та Capesize.',
    transitTime: '1-2 дні з порту',
    capacity: 'FCL / Bulk / Наливні',
    labelPos: 'right',
  },

  // ПОРТИ РУМУНІЇ ТА ПОЛЬЩІ
  {
    id: 'constanta',
    name: 'Порт Констанца',
    country: 'Румунія (ЄС)',
    flag: '🇷🇴',
    type: 'port',
    coords: [44.1598, 28.6348],
    desc: 'Головний транзитний хаб Чорного моря для вантажів в Україну та Молдову. Крос-докінг та мультимодал.',
    transitTime: '3-5 днів до України',
    capacity: 'ЄС Транзит / FCL',
    labelPos: 'bottom',
  },
  {
    id: 'gdansk',
    name: 'Порт Гданськ',
    country: 'Польща (ЄС)',
    flag: '🇵🇱',
    type: 'port',
    coords: [54.3520, 18.6466],
    desc: 'Балтійський океанський хаб. Прямі сервіси з Азії, автодоставка Door-to-Door по всьому ЄС та Україні.',
    transitTime: '2-4 дні до України',
    capacity: 'Block Trains / FCL',
    labelPos: 'top',
  },
  {
    id: 'gdynia',
    name: 'Порт Гдиня',
    country: 'Польща (ЄС)',
    flag: '🇵🇱',
    type: 'port',
    coords: [54.5189, 18.5305],
    desc: 'Сучасний контейнерний термінал. Висока швидкість обробки та розмитнення вантажів.',
    transitTime: '2-4 дні до України',
    capacity: 'FCL / LCL Сервіс',
    labelPos: 'left',
  },

  // ГЛОБАЛЬНІ ТОЧКИ ВІДПРАВЛЕННЯ (ORIGINS)
  {
    id: 'shanghai',
    name: 'Шанхай / Нінбо',
    country: 'Китай',
    flag: '🇨🇳',
    type: 'origin',
    coords: [31.2304, 121.4737],
    desc: 'Власний консолідаційний хаб Grand Logistics у Китаї. Викуп, QC-аудит фабрик, склади зберігання.',
    transitTime: '22-28 днів морем',
    capacity: 'FCL / LCL / Rail',
    labelPos: 'right',
  },
  {
    id: 'guangzhou',
    name: 'Гуанчжоу / Шеньчжень',
    country: 'Китай',
    flag: '🇨🇳',
    type: 'origin',
    coords: [23.1291, 113.2644],
    desc: 'Південний логістичний вузол КНР. Електроніка, текстиль, обладнання.',
    transitTime: '24-30 днів морем',
    capacity: 'Авіа / LCL Сервіс',
    labelPos: 'bottom',
  },
  {
    id: 'newyork',
    name: 'Нью-Йорк / Лос-Анджелес',
    country: 'США',
    flag: '🇺🇸',
    type: 'origin',
    coords: [40.7128, -74.0060],
    desc: 'Атлантичні та Тихоокеанські лінії. Доставка машин, обладнання та товарів широкого вжитку.',
    transitTime: '18-24 дні морем',
    capacity: 'FCL / Ro-Ro / Авіа',
    labelPos: 'left',
  },
  {
    id: 'mumbai',
    name: 'Мумбаї / Мундра',
    country: 'Індія',
    flag: '🇮🇳',
    type: 'origin',
    coords: [18.9220, 72.8347],
    desc: 'Індійський океанський хаб. Фармацевтика, текстиль, сировина та агрохімія.',
    transitTime: '20-25 днів морем',
    capacity: 'FCL / LCL / Reefer',
    labelPos: 'bottom',
  },
  {
    id: 'hamburg',
    name: 'Гамбург / Роттердам',
    country: 'Євросоюз (ЄС)',
    flag: '🇪🇺',
    type: 'origin',
    coords: [53.5511, 9.9937],
    desc: 'Північноєвропейські мегахаби. Консолідація з усіх країн ЄС, автодоставка 24/7.',
    transitTime: '2-4 дні авто',
    capacity: 'Auto Door / ADR',
    labelPos: 'top',
  },
]

// Маршрутные линии между origins и портами
const ROUTES: { from: [number, number]; to: [number, number]; label: string }[] = [
  { from: [31.2304, 121.4737], to: [46.4825, 30.7233], label: 'Китай ➔ Одеса (Море)' },
  { from: [23.1291, 113.2644], to: [54.3520, 18.6466], label: 'КНР ➔ Гданськ (Block Train)' },
  { from: [40.7128, -74.0060], to: [44.1598, 28.6348], label: 'США ➔ Констанца' },
  { from: [18.9220, 72.8347], to: [46.3017, 30.6569], label: 'Індія ➔ Чорноморськ' },
  { from: [53.5511, 9.9937], to: [46.4825, 30.7233], label: 'ЄС ➔ Україна (Авто)' },
]

export function RealWorldMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [selectedLoc, setSelectedLoc] = useState<LocationPin>(LOCATIONS[0])
  const [filterType, setFilterType] = useState<'all' | 'ports' | 'origins'>('all')

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !mapInstanceRef.current) {
          observer.disconnect()
          initMap()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(mapContainerRef.current)

    function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return

      // scrollWheelZoom: false — скролл мыши НЕ зумит карту
      const map = L.map(mapContainerRef.current, {
        center: [45.0, 32.0],
        zoom: 4,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: false,
        scrollWheelZoom: false,
      })

      mapInstanceRef.current = map

    // Тёмные векторные тайлы CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const getElTop = (id: string) => {
      const el = document.getElementById(id)
      if (!el) return 0
      return el.getBoundingClientRect().top + window.scrollY
    }

    // 1-СКРОЛЛ ПЕРЕХОДЫ: Скролл вверх -> на 3-й экран, Скролл вниз -> на 5-й экран (s2 - HeroVideoScene4)
    let cooldown = false
    let touchStartY = 0

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          map.zoomIn()
        } else {
          map.zoomOut()
        }
        return
      }

      // Если мы на карте и скроллим БЕЗ Ctrl:
      if (cooldown) return

      if (e.deltaY > 25) {
        // 1 скролл ВНИЗ -> переход на 5-й экран (s2 - HeroVideoScene4)
        const targetY = getElTop('s2')
        if (targetY > 0) {
          e.preventDefault()
          cooldown = true
          window.scrollTo({ top: targetY, behavior: 'smooth' })
          setTimeout(() => { cooldown = false }, 800)
        }
      } else if (e.deltaY < -25) {
        // 1 скролл ВВЕРХ -> переход на 3-й 3D Hero Video экран
        e.preventDefault()
        cooldown = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => { cooldown = false }, 800)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (cooldown) return
      if (!e.changedTouches.length) return

      const touchEndY = e.changedTouches[0].clientY
      const deltaY = touchStartY - touchEndY

      if (Math.abs(deltaY) < 35) return

      if (deltaY > 35) { // Свайп вверх -> переход на следующий видео-луп (s2)
        const targetY = getElTop('s2')
        if (targetY > 0) {
          cooldown = true
          window.scrollTo({ top: targetY, behavior: 'smooth' })
          setTimeout(() => { cooldown = false }, 800)
        }
      } else if (deltaY < -35) { // Свайп вниз -> переход наверх в 3D Cinema
        cooldown = true
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setTimeout(() => { cooldown = false }, 800)
      }
    }

    const container = mapContainerRef.current
    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Бегущие анимированные зеленые линии маршрутов
    ROUTES.forEach((r) => {
      const line = L.polyline([r.from, r.to], {
        color: '#7CC248',
        weight: 3,
        opacity: 0.9,
        dashArray: '10, 14',
        className: 'animated-route-line',
      }).addTo(map)

      const pathEl = line.getElement()
      if (pathEl) {
        pathEl.classList.add('animate-[dashFlow_15s_linear_infinite]')
      }
    })

    // Добавляем метки (Markers)
    LOCATIONS.forEach((loc) => {
      const isPort = loc.type === 'port'
      const posClass =
        loc.labelPos === 'top'
          ? 'bottom-8 left-1/2 -translate-x-1/2'
          : loc.labelPos === 'bottom'
          ? 'top-8 left-1/2 -translate-x-1/2'
          : loc.labelPos === 'left'
          ? 'right-8 top-1/2 -translate-y-1/2'
          : 'left-8 top-1/2 -translate-y-1/2'

      const iconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="h-7 w-7 rounded-full ${isPort ? 'bg-[#7CC248]' : 'bg-emerald-400'} border-2 border-white shadow-[0_0_18px_#7CC248] flex items-center justify-center text-xs font-bold text-slate-950 transition-transform duration-300 group-hover:scale-125">
            ${loc.flag}
          </div>
          <div class="absolute ${posClass} whitespace-nowrap rounded-lg bg-slate-950/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-xl backdrop-blur-md transition-all duration-200 group-hover:border-[#7CC248]">
            ${loc.name}
          </div>
        </div>
      `

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      })

      const marker = L.marker(loc.coords, { icon: customIcon }).addTo(map)

      marker.on('click', () => {
        setSelectedLoc(loc)
        map.flyTo(loc.coords, 5.5, { duration: 1.2 })
      })
    })

    // Вызываем invalidateSize при монтировании и изменении размера окна для 100% заполнения без серых полей
    setTimeout(() => {
      map.invalidateSize()
    }, 200)

    const resizeObserver = new ResizeObserver(() => {
      if (map) map.invalidateSize()
    })
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current)
    }
    }

    return () => {
      observer.disconnect()
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const [isMapVisible, setIsMapVisible] = useState(false)

  useEffect(() => {
    const s1 = document.getElementById('s1')
    if (!s1) return

    const handleScroll = () => {
      const rect = s1.getBoundingClientRect()
      // Плашка видна ТОЛЬКО когда экран находится непосредственно на карте
      const visible = Math.abs(rect.top) < window.innerHeight * 0.35
      setIsMapVisible(visible)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Первоначальная проверка

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // При входе на карту принудительно пересчитываем габариты Leaflet для 100% заполнения без сдвига
  useEffect(() => {
    if (isMapVisible && mapInstanceRef.current) {
      const map = mapInstanceRef.current
      map.invalidateSize()
      const t1 = setTimeout(() => map.invalidateSize(), 80)
      const t2 = setTimeout(() => map.invalidateSize(), 250)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isMapVisible])

  const filteredLocations = LOCATIONS.filter((l) => {
    if (filterType === 'ports') return l.type === 'port'
    if (filterType === 'origins') return l.type === 'origin'
    return true
  })

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* CSS Анимация бегущих зеленых линий */}
      <style>{`
        @keyframes dashFlow {
          from {
            stroke-dashoffset: 200;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animated-route-line {
          animation: dashFlow 12s linear infinite;
        }
      `}</style>

      {/* Интерактивная Leaflet карта */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 h-full w-full" />

      {/* Мобильная бегущая плашка (мгновенно исчезает/появляется) */}
      <div className={`md:hidden absolute top-4 left-4 z-20 pointer-events-auto transition-all duration-200 ease-out ${
        isMapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#7CC248]/50 bg-slate-950/85 px-3.5 py-1.5 text-[11px] font-extrabold text-[#7CC248] backdrop-blur-2xl shadow-xl">
          <span className="h-2 w-2 rounded-full bg-[#7CC248] shadow-[0_0_8px_#7CC248]" />
          <span>ГЛОБАЛЬНА КАРТА ХАБІВ</span>
        </div>
      </div>

      {/* Прозрачная подсказка в левом нижнем углу на украинском языке */}
      <div className={`hidden md:block absolute bottom-6 left-8 z-10 pointer-events-none transition-all duration-200 ease-out ${
        isMapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/60 px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl shadow-lg">
          <span className="text-[#7CC248] font-bold">💡 Масштабування:</span>
          <span>утримуйте <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold text-white">Ctrl</kbd> + колесо миші</span>
          <span className="text-white/30">•</span>
          <span className="text-white/70">Переміщення: ліва кнопка миші</span>
        </div>
      </div>

      {/* ПРАВА ВЕРХНЯ НАВІГАЦІЯ ПО ВСІХ 10 ЕКРАНАХ (ДЕСКТОП - В ОДНУ СТРОЧКУ) */}
      <div className={`hidden md:block absolute top-6 right-6 lg:top-8 lg:right-8 z-30 pointer-events-auto transition-all duration-200 ease-out ${
        isMapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="flex items-center gap-1.5 lg:gap-2 flex-nowrap p-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-2xl shadow-2xl whitespace-nowrap">
          {[
            { label: '01 Головна', sceneNum: 1 },
            { label: '02 Послуги', sceneNum: 2 },
            { label: '03 Квіз', sceneNum: 3 },
            { label: '04 Карта', targetId: 's1', active: true },
            { label: '05 Вантажі', subScene: 'scene4', targetId: 's2' },
            { label: '06 КНР Сервіс', subScene: 'scene5', targetId: 's2' },
            { label: '07 Переваги', subScene: 'scene6', targetId: 's2' },
            { label: '08 Контакти', subScene: 'scene7', targetId: 's2' },
            { label: '09 Схема', targetId: 's3' },
            { label: '10 Заявка', targetId: 's4' },
          ].map((item) => {
            const isActive = item.active
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.sceneNum) {
                    window.dispatchEvent(new CustomEvent('nav-cinema', { detail: item.sceneNum }))
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  } else {
                    if (item.subScene) {
                      window.dispatchEvent(new CustomEvent('nav-hero4', { detail: item.subScene }))
                    }
                    if (item.targetId) {
                      const el = document.getElementById(item.targetId)
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }
                  }
                }}
                className="pointer-events-auto cursor-pointer rounded-full px-2.5 lg:px-3 py-1 text-[10px] lg:text-[11px] font-bold border flex items-center gap-1.5 shrink-0 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: isActive ? '#7CC248' : 'rgba(255, 255, 255, 0.08)',
                  borderColor: isActive ? '#7CC248' : 'rgba(255, 255, 255, 0.15)',
                  color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                  boxShadow: isActive
                    ? '0 0 16px rgba(124, 194, 72, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
                    : 'none',
                }}
              >
                <span className={isActive ? 'font-extrabold tracking-wide' : 'font-medium'}>{item.label}</span>
                {isActive && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white ml-0.5 shadow-[0_0_4px_#fff]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ЛЕВА ВЕРХНЯ КАРТОЧКА: Видна только на десктопе */}
      <div className={`hidden md:block absolute top-8 left-8 z-10 pointer-events-none max-w-md lg:max-w-lg transition-all duration-200 ease-out ${
        isMapVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="pointer-events-auto rounded-[32px] border border-white/20 border-t-white/50 border-l-white/35 bg-[#0b1019]/75 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-6 lg:p-8 space-y-4 lg:space-y-5 transition-all duration-500 hover:border-white/35">
          
          {/* Liquid Glass Тег-плашка */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#7CC248]/40 border-t-[#7CC248]/60 bg-[#7CC248]/15 px-4 py-1.5 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
            <span className="h-2 w-2 rounded-full bg-[#7CC248] shadow-[0_0_8px_#7CC248]" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7CC248]">
              ГЛОБАЛЬНА ЛОГІСТИЧНА МЕРЕЖА
            </span>
          </div>

          {/* Заголовок карточки */}
          <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-display tracking-tight leading-tight">
            Географія перевезень та Порти
          </h2>

          <p className="text-xs lg:text-sm text-slate-200 font-medium leading-relaxed">
            Інтерактивна векторна карта з підсвічуванням ключових хабів та портової інфраструктури: <span className="text-[#7CC248] font-bold">Україна (Одеса, Чорноморськ, Південний)</span>, <span className="text-white font-bold">Румунія (Констанца)</span>, <span className="text-white font-bold">Польща (Гданськ, Гдиня)</span>.
          </p>

          {/* iOS 26 Liquid Glass Переключатель фильтров */}
          <div className="pt-2 border-t border-white/15">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 rounded-xl py-2 px-3 text-xs font-extrabold transition-all duration-300 cursor-pointer text-center ${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-[#88d450] to-[#68ab38] text-slate-950 shadow-[0_0_20px_rgba(124,194,72,0.6),inset_0_1px_1px_rgba(255,255,255,0.5)] scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Усі хаби ({LOCATIONS.length})
              </button>
              <button
                onClick={() => setFilterType('ports')}
                className={`flex-1 rounded-xl py-2 px-3 text-xs font-extrabold transition-all duration-300 cursor-pointer text-center ${
                  filterType === 'ports'
                    ? 'bg-gradient-to-r from-[#88d450] to-[#68ab38] text-slate-950 shadow-[0_0_20px_rgba(124,194,72,0.6),inset_0_1px_1px_rgba(255,255,255,0.5)] scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                ⚓ Порти (6)
              </button>
              <button
                onClick={() => setFilterType('origins')}
                className={`flex-1 rounded-xl py-2 px-3 text-xs font-extrabold transition-all duration-300 cursor-pointer text-center ${
                  filterType === 'origins'
                    ? 'bg-gradient-to-r from-[#88d450] to-[#68ab38] text-slate-950 shadow-[0_0_20px_rgba(124,194,72,0.6),inset_0_1px_1px_rgba(255,255,255,0.5)] scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                🌐 Напрямки (5)
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ДЕТАЛИЗАЦИЯ И ДРОПДАУН ВЫБОРА ХАБА: Компактное окно снизу на моб, карточка справа на десктопе (мгновенное скрытие) */}
      <div className={`fixed bottom-3 left-3 right-3 md:absolute md:bottom-8 md:right-8 md:left-auto md:w-full md:max-w-sm lg:max-w-md z-20 transition-all duration-200 ease-out ${
        isMapVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}>
        <div className="rounded-2xl sm:rounded-[32px] border border-white/25 border-t-white/50 border-l-white/40 bg-[#0b1019]/90 md:bg-[#0b1019]/80 backdrop-blur-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 sm:p-7 lg:p-8 text-white transition-all duration-500">
          
          {/* МОБИЛЬНЫЙ ВЫПАДАЮЩИЙ СПИСОК (2 ДРОПДАУНА РЯДОМ НА ОДНОЙ СТРОКЕ) */}
          <div className="block md:hidden mb-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-extrabold text-[#7CC248] uppercase tracking-wider mb-1 truncate">
                  ⚓ ПОРТИ (6):
                </label>
                <div className="relative">
                  <select
                    value={selectedLoc.type === 'port' ? selectedLoc.id : ''}
                    onChange={(e) => {
                      const loc = LOCATIONS.find((l) => l.id === e.target.value)
                      if (loc) {
                        setSelectedLoc(loc)
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo(loc.coords, 5.5, { duration: 1.2 })
                        }
                      }
                    }}
                    className="w-full appearance-none rounded-xl border border-white/30 border-t-white/50 bg-slate-900/95 px-2.5 py-2 text-[11px] font-extrabold text-white outline-none focus:border-[#7CC248] shadow-lg backdrop-blur-2xl cursor-pointer truncate pr-6"
                  >
                    <option value="" disabled hidden>Оберіть порт...</option>
                    {LOCATIONS.filter((l) => l.type === 'port').map((loc) => (
                      <option key={loc.id} value={loc.id} className="bg-slate-900 text-white font-medium">
                        {loc.flag} {loc.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#7CC248]">
                    <svg className="h-3.5 w-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-[#7CC248] uppercase tracking-wider mb-1 truncate">
                  🌐 НАПРЯМКИ (5):
                </label>
                <div className="relative">
                  <select
                    value={selectedLoc.type === 'origin' ? selectedLoc.id : ''}
                    onChange={(e) => {
                      const loc = LOCATIONS.find((l) => l.id === e.target.value)
                      if (loc) {
                        setSelectedLoc(loc)
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo(loc.coords, 5.5, { duration: 1.2 })
                        }
                      }
                    }}
                    className="w-full appearance-none rounded-xl border border-white/30 border-t-white/50 bg-slate-900/95 px-2.5 py-2 text-[11px] font-extrabold text-white outline-none focus:border-[#7CC248] shadow-lg backdrop-blur-2xl cursor-pointer truncate pr-6"
                  >
                    <option value="" disabled hidden>Оберіть напрямок...</option>
                    {LOCATIONS.filter((l) => l.type === 'origin').map((loc) => (
                      <option key={loc.id} value={loc.id} className="bg-slate-900 text-white font-medium">
                        {loc.flag} {loc.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#7CC248]">
                    <svg className="h-3.5 w-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div key={selectedLoc.id} className="animate-[fadeIn_0.35s_cubic-bezier(0.16,1,0.3,1)] space-y-3 sm:space-y-5">
            {/* Шапка детализации */}
            <div className="flex items-center justify-between border-b border-white/15 pb-2.5 sm:pb-4">
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                <span className="text-2xl sm:text-4xl drop-shadow-md">{selectedLoc.flag}</span>
                <div>
                  <h3 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white font-display tracking-tight">
                    {selectedLoc.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[#7CC248] font-extrabold uppercase tracking-wider mt-0.5">
                    {selectedLoc.country} • {selectedLoc.type === 'port' ? 'Портова інфраструктура' : 'Центр відправлення'}
                  </p>
                </div>
              </div>
              <div className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-[#7CC248] shadow-[0_0_12px_#7CC248]" />
            </div>

            <p className="text-xs lg:text-sm text-slate-100 leading-relaxed font-medium line-clamp-2 sm:line-clamp-none">
              {selectedLoc.desc}
            </p>

            {/* 2 Liquid Glass метрики */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3.5 pt-0.5 sm:pt-1">
              <div className="rounded-xl sm:rounded-2xl border border-white/20 border-t-white/35 bg-white/10 p-2.5 sm:p-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <span className="block text-[9px] sm:text-[10px] text-slate-300 font-extrabold uppercase tracking-wider mb-0.5 sm:mb-1">⏱ ТРАНЗИТНИЙ ЧАС:</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#7CC248]">{selectedLoc.transitTime}</span>
              </div>
              <div className="rounded-xl sm:rounded-2xl border border-white/20 border-t-white/35 bg-white/10 p-2.5 sm:p-4 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                <span className="block text-[9px] sm:text-[10px] text-slate-300 font-extrabold uppercase tracking-wider mb-0.5 sm:mb-1">📦 ТИПИ ОБРОБКИ:</span>
                <span className="text-xs sm:text-sm font-extrabold text-white truncate block">{selectedLoc.capacity}</span>
              </div>
            </div>

            {/* Швидкий выбор хаба (виден только на ДЕСКТОПЕ) */}
            <div className="hidden md:block pt-2">
              <span className="block text-[10px] font-extrabold text-slate-300 uppercase tracking-wider mb-2.5">
                ШВИДКИЙ ВИБІР ХАБУ:
              </span>
              <div className="flex flex-wrap gap-2">
                {filteredLocations.map((loc) => {
                  const isSelected = loc.id === selectedLoc.id
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setSelectedLoc(loc)
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo(loc.coords, 5.5, { duration: 1.2 })
                        }
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all duration-300 cursor-pointer border ${
                        isSelected
                          ? 'border-[#7CC248] bg-gradient-to-r from-[#88d450] to-[#68ab38] text-slate-950 shadow-[0_0_18px_rgba(124,194,72,0.7),inset_0_1px_1px_rgba(255,255,255,0.5)] scale-[1.05]'
                          : 'border-white/15 bg-white/10 text-white/85 hover:bg-white/20 hover:text-white hover:scale-[1.02] backdrop-blur-md'
                      }`}
                    >
                      {loc.flag} {loc.name}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
