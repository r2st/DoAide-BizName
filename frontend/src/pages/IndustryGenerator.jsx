import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import NameCard from '../components/NameCard'
import PublicLayout from '../components/PublicLayout'
import { generateNames, saveName } from '../lib/api'

const INDUSTRIES = {
  technology: {
    label: 'Technology',
    icon: '💻',
    description: 'Generate AI-powered business names for tech startups, SaaS products, apps, and IT companies.',
    keywords: ['app', 'cloud', 'data', 'ai', 'code', 'digital', 'tech', 'cyber', 'smart', 'logic'],
    styles: ['modern', 'minimal', 'bold'],
  },
  food: {
    label: 'Food & Beverage',
    icon: '🍕',
    description: 'Generate creative names for restaurants, cafes, cloud kitchens, D2C food brands, and bakeries.',
    keywords: ['kitchen', 'spice', 'fresh', 'organic', 'taste', 'bites', 'cafe', 'grill', 'brew', 'harvest'],
    styles: ['playful', 'classic', 'bold'],
  },
  fashion: {
    label: 'Fashion & Lifestyle',
    icon: '👗',
    description: 'Generate stylish brand names for clothing, accessories, ethnic wear, and lifestyle brands.',
    keywords: ['style', 'luxe', 'thread', 'stitch', 'urban', 'vogue', 'chic', 'drape', 'bloom', 'weave'],
    styles: ['modern', 'bold', 'classic'],
  },
  healthcare: {
    label: 'Healthcare & Wellness',
    icon: '🏥',
    description: 'Generate trustworthy names for clinics, hospitals, healthtech startups, and wellness brands.',
    keywords: ['care', 'health', 'vita', 'med', 'cure', 'well', 'heal', 'life', 'pulse', 'remedy'],
    styles: ['professional', 'modern', 'classic'],
  },
}

export default function IndustryGenerator({ user }) {
  const { industry: slug } = useParams()
  const config = INDUSTRIES[slug]

  const [keyword, setKeyword] = useState('')
  const [style, setStyle] = useState(config?.styles[0] || 'modern')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!config) {
    return (
      <PublicLayout title="Industry Not Found">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--doaide-text)' }}>Industry not found</h1>
          <Link to="/" style={{ color: 'var(--doaide-gold)' }}>Go to name generator</Link>
        </div>
      </PublicLayout>
    )
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    const term = keyword.trim() || config.keywords[Math.floor(Math.random() * config.keywords.length)]
    setLoading(true)
    setError('')
    try {
      const data = await generateNames(term, config.label, style)
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (nameId) => {
    if (!user) { setError('Sign in to save names'); return }
    try { await saveName(nameId) } catch (err) { setError(err.message) }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${config.label} Business Name Generator`,
    url: `https://bizname.doaide.com/industry/${slug}`,
    description: config.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <PublicLayout title={`${config.label} Name Generator`} jsonLd={jsonLd}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">{config.icon}</div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>
            {config.label} <span style={{ color: 'var(--doaide-gold)' }}>Name Generator</span>
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--doaide-text-muted)' }}>{config.description}</p>
        </div>

        <form onSubmit={handleGenerate} className="max-w-xl mx-auto mb-8">
          <div className="flex items-center rounded-xl overflow-hidden" style={{ background: 'var(--doaide-surface)', border: '2px solid var(--doaide-border)', boxShadow: 'var(--doaide-shadow-gold)' }}>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder={`Enter a keyword (e.g., ${config.keywords.slice(0, 3).join(', ')})...`}
              className="flex-1 px-5 py-4 text-lg outline-none"
              style={{ background: 'transparent', color: 'var(--doaide-text)', border: 'none' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-4 font-semibold cursor-pointer transition-colors"
              style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)', border: 'none', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
          <div className="flex gap-2 mt-3 justify-center">
            {config.styles.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border-0"
                style={{
                  background: style === s ? 'var(--doaide-gold)' : 'var(--doaide-surface)',
                  color: style === s ? 'var(--doaide-text-on-gold)' : 'var(--doaide-text-secondary)',
                  border: `1px solid ${style === s ? 'var(--doaide-gold)' : 'var(--doaide-border)'}`,
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <span className="text-xs" style={{ color: 'var(--doaide-text-muted)' }}>Quick ideas:</span>
          {config.keywords.map(kw => (
            <button
              key={kw}
              onClick={() => setKeyword(kw)}
              className="text-xs px-2.5 py-1 rounded-lg cursor-pointer border-0"
              style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text-secondary)', border: '1px solid var(--doaide-border)' }}
            >
              {kw}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--doaide-error)', border: '1px solid rgba(248,113,113,0.2)' }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--doaide-border)', borderTopColor: 'var(--doaide-gold)' }} />
            <p className="mt-4 text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>Generating {config.label.toLowerCase()} names...</p>
          </div>
        )}

        {results && !loading && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--doaide-text)' }}>
              {config.label} Names for "<span style={{ color: 'var(--doaide-gold)' }}>{results.keyword}</span>"
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.names.map(name => (
                <NameCard key={name.id} name={name} onSave={handleSave} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--doaide-text)' }}>Other Industry Generators</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(INDUSTRIES).filter(([k]) => k !== slug).map(([k, v]) => (
              <Link key={k} to={`/industry/${k}`} className="rounded-xl p-4 text-center no-underline" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
                <div className="text-2xl mb-1">{v.icon}</div>
                <div className="text-xs font-medium" style={{ color: 'var(--doaide-text)' }}>{v.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
