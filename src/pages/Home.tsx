import { Cinema } from '../components/Cinema'
import { ContentSections } from '../sections/ContentSections'
import { Footer } from '../components/Footer'

export default function Home() {
  return (
    <main className="bg-white">
      <Cinema />
      <ContentSections />
      <Footer />
    </main>
  )
}
