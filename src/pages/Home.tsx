import { Cinema } from '../components/Cinema'
import { ContentSections } from '../sections/ContentSections'
import { Footer } from '../components/Footer'
import { HeaderNav } from '../components/HeaderNav'
import { useLang, toggleLang } from '../config/lang'

export default function Home() {
  const lang = useLang()

  return (
    <main className="bg-white relative">
      <HeaderNav
        lang={lang}
        onToggleLang={toggleLang}
        onNavigateQuiz={() => window.dispatchEvent(new CustomEvent('open-quiz'))}
      />
      <Cinema />
      <ContentSections />
      <Footer />
    </main>
  )
}
