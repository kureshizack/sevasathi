import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import { LangProvider } from './lib/lang'
import { ToastProvider } from './lib/toast'
import { SearchProvider } from './lib/search'
import Layout from './components/Layout'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Schemes from './pages/Schemes'
import Services from './pages/Services'
import Exams from './pages/Exams'
import Office from './pages/Office'
import Tools from './pages/Tools'
import LifeHacks from './pages/LifeHacks'
import Article from './pages/Article'
import SearchPage from './pages/SearchPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <LangProvider>
      <ToastProvider>
        <SearchProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/services" element={<Services />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/office" element={<Office />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/lifehacks" element={<LifeHacks />} />
              <Route path="/article" element={<Article />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </SearchProvider>
      </ToastProvider>
    </LangProvider>
  )
}
