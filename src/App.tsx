import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { Watch } from './pages/Watch'
import { Search } from './pages/Search'
import { Library } from './pages/Library'
import './styles/globals.css'

/** Rota değişince sayfayı başa sar — SPA'da tarayıcı bunu kendi yapmaz. */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/search" element={<Search />} />
          <Route path="/library" element={<Library />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
