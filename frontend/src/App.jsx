import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { getMe, logout } from './lib/api'
import Home from './pages/Home'
import Login from './pages/Login'
import NameDetail from './pages/NameDetail'
import Pricing from './pages/Pricing'
import Saved from './pages/Saved'
import BlogIndex from './pages/blog/BlogIndex'
import BlogPost from './pages/blog/BlogPost'
import ToolsIndex from './pages/tools/ToolsIndex'
import TaglineGenerator from './pages/tools/TaglineGenerator'
import BrandNameScorer from './pages/tools/BrandNameScorer'
import DomainChecker from './pages/tools/DomainChecker'
import Embed from './pages/Embed'

export default function App() {
  const [user, setUser] = useState(null)

  const loadUser = () => {
    const token = localStorage.getItem('bizname_token')
    if (!token) { setUser(null); return }
    getMe().then(setUser).catch(() => {
      logout()
      setUser(null)
    })
  }

  useEffect(() => { loadUser() }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={handleLogout} />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login onLogin={loadUser} />} />
          <Route path="/saved" element={<Saved user={user} />} />
          <Route path="/name/:name" element={<NameDetail />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/tools" element={<ToolsIndex />} />
          <Route path="/tools/tagline-generator" element={<TaglineGenerator />} />
          <Route path="/tools/brand-name-scorer" element={<BrandNameScorer />} />
          <Route path="/tools/domain-checker" element={<DomainChecker />} />
          <Route path="/embed" element={<Embed />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
