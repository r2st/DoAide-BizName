import { useState } from 'react'
import { Link } from 'react-router-dom'
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

      {/* Industry Generators */}
      {!results && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--doaide-text)' }}>
            Industry-Specific <span style={{ color: 'var(--doaide-gold)' }}>Name Generators</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { slug: 'technology', label: 'Technology', icon: '💻' },
              { slug: 'food', label: 'Food & Beverage', icon: '🍕' },
              { slug: 'fashion', label: 'Fashion', icon: '👗' },
              { slug: 'healthcare', label: 'Healthcare', icon: '🏥' },
            ].map(g => (
              <Link key={g.slug} to={`/industry/${g.slug}`} className="rounded-xl p-5 text-center no-underline transition-colors" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
                <div className="text-3xl mb-2">{g.icon}</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--doaide-text)' }}>{g.label}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Free Tools CTAs */}
      <section className="mb-16 space-y-3">
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
        >
          <div>
            <h3 className="font-bold mb-1" style={{ color: 'var(--doaide-text)' }}>
              Check Domain Availability
            </h3>
            <p className="text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>
              Free DNS-based checker for .com, .in, and .co.in domains. No login required.
            </p>
          </div>
          <Link
            to="/tools/domain-checker"
            className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium no-underline"
            style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
          >
            Check Domains
          </Link>
        </div>
        <div
          className="rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
        >
          <div>
            <h3 className="font-bold mb-1" style={{ color: 'var(--doaide-text)' }}>
              Registering a Trademark?
            </h3>
            <p className="text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>
              Search your name against Indian trademark classes and find the right Nice Classification.
            </p>
          </div>
          <Link
            to="/tools/trademark-search"
            className="shrink-0 rounded-lg px-5 py-2.5 text-sm font-medium no-underline"
            style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
          >
            Search Trademarks
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--doaide-text)' }}>
          Trusted by <span style={{ color: 'var(--doaide-gold)' }}>Indian Entrepreneurs</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Priya Sharma', role: 'Founder, NovaByte Technologies', location: 'Bengaluru', text: 'I was stuck for weeks trying to find a name for my SaaS startup. BizNameAI gave me 30 options in seconds, and "NovaByte" scored highest on memorability. The domain was available too. Saved me weeks of brainstorming.' },
            { name: 'Rahul Mehta', role: 'Co-founder, CraftKart', location: 'Mumbai', text: 'The social handle checker is a lifesaver. We almost went with a name that was taken on Instagram and Twitter. BizNameAI flagged it immediately and suggested alternatives. Our D2C brand launched with consistent handles everywhere.' },
            { name: 'Ananya Krishnan', role: 'CEO, GreenLeaf Organics', location: 'Kochi', text: 'As a first-time entrepreneur, I had no idea how to evaluate business names. The scoring feature broke it down — memorability, pronounceability, brandability. It made the decision feel scientific, not guesswork.' },
            { name: 'Vikram Desai', role: 'Director, FinEdge Consulting', location: 'Pune', text: 'We rebranded from a generic name to "FinEdge" using BizNameAI. Client inquiries increased 40% in the first quarter — people actually remember our name now. The .in and .com domains were both available.' },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-5"
              style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
            >
              <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--doaide-text-secondary)' }}>"{t.text}"</p>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--doaide-text)' }}>{t.name}</p>
                <p className="text-xs" style={{ color: 'var(--doaide-text-muted)' }}>{t.role} &middot; {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--doaide-text)' }}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {[
            { q: 'Is BizNameAI free to use?', a: 'Yes! You get 5 free searches per day with no sign-up required. Each search generates multiple AI-powered name suggestions with domain availability, social handle checks, and name scoring. Upgrade to Pro for unlimited searches starting at ₹299/month.' },
            { q: 'How does the AI generate business names?', a: 'BizNameAI uses advanced language models trained on millions of business names and branding patterns. You provide a keyword, industry, and style preference, and the AI generates unique names that are phonetically pleasing, culturally appropriate, and scored on memorability and brandability.' },
            { q: 'Can I check domain availability for generated names?', a: 'Absolutely. Every generated name automatically shows domain availability across .com, .in, .io, and .co TLDs. Green means available, red means taken. You can register available domains directly through your preferred registrar.' },
            { q: 'Does BizNameAI check social media handle availability?', a: 'Yes. Each generated name is checked for handle availability on major social platforms including Instagram, Twitter/X, and Facebook. Consistent handles across platforms strengthen your brand identity.' },
            { q: 'How is the name score calculated?', a: 'Each name is scored on three dimensions: memorability (how easy it is to recall after hearing once), pronounceability (how easy it is to say correctly), and brandability (length, uniqueness, and visual appeal). The combined score helps you compare candidates objectively.' },
            { q: 'Can I use BizNameAI for naming businesses in India?', a: 'BizNameAI is built with the Indian market in mind. It generates names that work in both English and Hindi contexts, checks .in domain availability alongside .com, and considers cultural appropriateness. Many Indian entrepreneurs use it for naming startups, D2C brands, and consulting firms.' },
          ].map((item, i) => (
            <details
              key={i}
              className="rounded-xl group"
              style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
            >
              <summary
                className="px-5 py-4 cursor-pointer font-medium text-sm list-none flex items-center justify-between"
                style={{ color: 'var(--doaide-text)' }}
              >
                {item.q}
                <span className="ml-2 transition-transform group-open:rotate-45" style={{ color: 'var(--doaide-gold)' }}>+</span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--doaide-text-secondary)' }}>
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
