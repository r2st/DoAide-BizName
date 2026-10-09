import { useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'
import { searchTrademark } from '../../lib/api'

const INDUSTRIES = ['', 'Technology', 'Food & Beverage', 'Fashion', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Real Estate']

export default function TrademarkSearch() {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSearching(true)
    setError('')
    try {
      const data = await searchTrademark(name.trim(), industry)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Trademark Search Helper',
    url: 'https://bizname.doaide.com/tools/trademark-search',
    description: 'Search your business name against Indian trademark classes. Find which Nice Classification classes your brand may need.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <PublicLayout title="Free Trademark Search Helper — India" jsonLd={jsonLd}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Trademark Search Helper</h1>
        <p className="mb-6" style={{ color: 'var(--doaide-text-muted)' }}>
          Enter your business name to find which Indian trademark classes (Nice Classification) it may fall under.
          This helps you identify which classes to register and estimate filing costs.
        </p>

        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'var(--doaide-text-muted)' }}>Business Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., CloudKitchen, FashionHub, MediCare..."
                required
                className="w-full rounded-lg px-4 py-2.5 text-sm border-0 outline-none focus:ring-2"
                style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)', '--tw-ring-color': 'var(--doaide-gold-dim)' }}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'var(--doaide-text-muted)' }}>Industry (optional)</label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none"
                style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)' }}
              >
                <option value="">Any Industry</option>
                {INDUSTRIES.filter(Boolean).map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={!name.trim() || searching}
            className="rounded-lg px-6 py-2.5 font-medium cursor-pointer border-0 disabled:opacity-40"
            style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
          >
            {searching ? 'Searching...' : 'Search Trademark Classes'}
          </button>
        </form>

        {error && (
          <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--doaide-error)', border: '1px solid rgba(248,113,113,0.2)' }}>
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-4">
            {results.classes.length > 0 ? (
              <>
                <p className="text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>
                  Found <strong style={{ color: 'var(--doaide-gold)' }}>{results.classes.length}</strong> potentially
                  relevant trademark class{results.classes.length !== 1 ? 'es' : ''} for "{results.name}".
                </p>

                <div className="grid gap-3">
                  {results.classes.map(cls => (
                    <div key={cls.class_number} className="rounded-xl p-5" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
                      <div className="flex items-start gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold shrink-0" style={{ background: 'var(--doaide-gold-bg)', color: 'var(--doaide-gold)' }}>
                          {cls.class_number}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-semibold" style={{ color: 'var(--doaide-text)' }}>Class {cls.class_number} — {cls.title}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {cls.matched_keywords.map(kw => (
                              <span key={kw} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--doaide-gold-bg)', color: 'var(--doaide-gold)' }}>
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs" style={{ color: 'var(--doaide-text-muted)' }}>Relevance</div>
                          <div className="font-bold" style={{ color: 'var(--doaide-gold)' }}>{cls.relevance_score}/10</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl p-5 mt-4" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-gold-dim)' }}>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--doaide-gold)' }}>Estimated Filing Cost</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg p-4" style={{ background: 'var(--doaide-bg)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--doaide-text-muted)' }}>Individuals / Startups</p>
                      <p className="text-xl font-bold" style={{ color: 'var(--doaide-success)' }}>
                        ₹{(results.classes.length * results.filing_fee_individual).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--doaide-text-secondary)' }}>
                        {results.classes.length} class{results.classes.length !== 1 ? 'es' : ''} × ₹{results.filing_fee_individual.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="rounded-lg p-4" style={{ background: 'var(--doaide-bg)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--doaide-text-muted)' }}>Companies / LLPs</p>
                      <p className="text-xl font-bold" style={{ color: 'var(--doaide-gold)' }}>
                        ₹{(results.classes.length * results.filing_fee_other).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--doaide-text-secondary)' }}>
                        {results.classes.length} class{results.classes.length !== 1 ? 'es' : ''} × ₹{results.filing_fee_other.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs mt-3" style={{ color: 'var(--doaide-text-muted)' }}>
                    * Government fees only. Attorney fees are additional.
                  </p>
                </div>
              </>
            ) : (
              <div className="rounded-xl p-8 text-center" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
                <p className="text-sm" style={{ color: 'var(--doaide-text-muted)' }}>
                  No matching trademark classes found. Try adding an industry or use our{' '}
                  <Link to="/tools/trademark-class-finder" style={{ color: 'var(--doaide-gold)' }}>Trademark Class Finder</Link>{' '}
                  to browse all 45 classes.
                </p>
              </div>
            )}

            <div className="rounded-lg p-4 text-sm" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid var(--doaide-gold-dim)' }}>
              <p style={{ color: 'var(--doaide-text-secondary)' }}>
                <strong style={{ color: 'var(--doaide-gold)' }}>Important:</strong> This is a preliminary search based on keyword matching.
                For a comprehensive trademark search, check the{' '}
                <a href="https://ipindiaonline.gov.in/tmrpublicsearch/frmmain.aspx" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--doaide-gold)' }}>
                  IP India Public Search
                </a>{' '}
                portal or consult a trademark attorney.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8">
          <ShareButtons url="https://bizname.doaide.com/tools/trademark-search" title="Free Trademark Search Helper — India" />
        </div>
      </div>
    </PublicLayout>
  )
}
