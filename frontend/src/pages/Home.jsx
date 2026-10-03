import { useState } from 'react'
import NameCard from '../components/NameCard'
import { generateNames, saveName } from '../lib/api'

const INDUSTRIES = [
  '', 'Technology', 'Food & Beverage', 'Fashion', 'Health & Fitness',
  'Finance', 'Education', 'Real Estate', 'Travel', 'E-commerce', 'Media',
]

const STYLES = ['modern', 'playful', 'professional', 'minimal', 'bold', 'classic']

export default function Home({ user }) {
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('')
  const [style, setStyle] = useState('modern')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!keyword.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await generateNames(keyword.trim(), industry, style)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (nameId) => {
    if (!user) {
      setError('Sign in to save names')
      return
    }
    try {
      await saveName(nameId)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="text-center py-16 md:py-24">
        <h1
          className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
          style={{ fontFamily: 'var(--doaide-font-display)', color: 'var(--doaide-text)' }}
        >
          Find the Perfect Name<br />
          <span style={{ color: 'var(--doaide-gold)' }}>for Your Business</span>
        </h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: 'var(--doaide-text-secondary)' }}>
          AI-powered name generator with instant domain availability, social handle checks,
          and name scoring. Free to use, no sign-up required.
        </p>

        <form onSubmit={handleGenerate} className="max-w-2xl mx-auto">
          <div
            className="flex items-center rounded-xl overflow-hidden"
            style={{
              background: 'var(--doaide-surface)',
              border: '2px solid var(--doaide-border)',
              boxShadow: 'var(--doaide-shadow-gold)',
            }}
          >
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter a keyword (e.g., cloud, coffee, fitness)..."
              className="flex-1 px-5 py-4 text-lg outline-none"
              style={{
                background: 'transparent',
                color: 'var(--doaide-text)',
                border: 'none',
                fontFamily: 'var(--doaide-font)',
              }}
            />
            <button
              type="submit"
              disabled={loading || !keyword.trim()}
              className="px-6 py-4 text-lg font-semibold cursor-pointer transition-colors"
              style={{
                background: 'var(--doaide-gold)',
                color: 'var(--doaide-text-on-gold)',
                border: 'none',
                opacity: loading || !keyword.trim() ? 0.6 : 1,
              }}
            >
              {loading ? 'Generating...' : 'Generate ✨'}
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm cursor-pointer"
              style={{
                background: 'var(--doaide-surface)',
                color: 'var(--doaide-text)',
                border: '1px solid var(--doaide-border)',
              }}
            >
              <option value="">Any Industry</option>
              {INDUSTRIES.filter(Boolean).map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm cursor-pointer"
              style={{
                background: 'var(--doaide-surface)',
                color: 'var(--doaide-text)',
                border: '1px solid var(--doaide-border)',
              }}
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </form>

        {!user && (
          <p className="text-xs mt-3" style={{ color: 'var(--doaide-text-muted)' }}>
            5 free searches per day. <a href="/pricing">Upgrade for unlimited.</a>
          </p>
        )}
      </section>

      {error && (
        <div
          className="rounded-lg px-4 py-3 mb-6 text-sm"
          style={{
            background: 'rgba(248,113,113,0.1)',
            color: 'var(--doaide-error)',
            border: '1px solid rgba(248,113,113,0.2)',
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div
            className="inline-block w-8 h-8 border-2 rounded-full animate-spin"
            style={{
              borderColor: 'var(--doaide-border)',
              borderTopColor: 'var(--doaide-gold)',
            }}
          />
          <p className="mt-4 text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>
            AI is crafting perfect names for you...
          </p>
        </div>
      )}

      {results && !loading && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--doaide-text)' }}>
            Generated Names for "<span style={{ color: 'var(--doaide-gold)' }}>{results.keyword}</span>"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.names.map((name) => (
              <NameCard key={name.id} name={name} onSave={handleSave} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      {!results && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '🤖', title: 'AI-Powered', desc: 'Advanced AI generates unique, creative names tailored to your industry' },
            { icon: '🌐', title: 'Domain Check', desc: 'Instant availability check for .com, .in, .io, and .co domains' },
            { icon: '📊', title: 'Name Scoring', desc: 'Each name scored on memorability, brandability, and length' },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl p-6 text-center"
              style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>{f.desc}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
