import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import { Preloader } from './components/Preloader'

export default function App() {
  return (
    <>
      <Preloader />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}
