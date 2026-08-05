import { RealWorldMap } from '../components/RealWorldMap'
import { HeroVideoScene4 } from '../components/HeroVideoScene4'
import { WorkStepsTimeline } from '../components/WorkStepsTimeline'
import { PartnersMarquee } from '../components/PartnersMarquee'
import { GraphiteContactForm } from '../components/GraphiteContactForm'

export function ContentSections() {
  return (
    <div className="relative z-30 bg-slate-950 shadow-[0_-30px_90px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-700">

      {/* 4-Й ЕКРАН: ІНТЕРАКТИВНА ВЕКТОРНА КАРТА НА ВЕСЬ ЕКРАН (100dvh) */}
      <section id="s1" className="h-[100dvh] min-h-[100dvh] w-full relative overflow-hidden snap-start scroll-mt-0">
        <RealWorldMap />
      </section>

      {/* 5-7 ЭКРАНЫ: SEAMLESS 3D CINEMA VIDEO ENGINE */}
      <section id="s2" className="min-h-screen w-full relative">
        <HeroVideoScene4 />
      </section>

      {/* 8-Й ЕКРАН: СХЕМА РОБОТИ (5 ЕТАПІВ ВІД ЗАЯВКИ ДО ДВЕРЕЙ) */}
      <section id="s3" className="min-h-screen w-full relative">
        <WorkStepsTimeline />
      </section>

      {/* БЕГУЩАЯ СТРОКА ЛОГОТИПІВ ПАРТНЕРІВ */}
      <section id="marquee-partners" className="w-full relative">
        <PartnersMarquee />
      </section>

      {/* 9-Й ЕКРАН: ГРАФІТОВА КОНТАКТНА ФОРМА ТА ОНЛАЙН 24/7 */}
      <section id="s4" className="w-full relative">
        <GraphiteContactForm />
      </section>

    </div>
  )
}
