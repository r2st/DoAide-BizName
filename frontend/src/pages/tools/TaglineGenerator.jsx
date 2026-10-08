import { useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'

const BUSINESS_TYPES = ['Technology', 'Food & Beverage', 'Fashion', 'Health & Wellness', 'Finance', 'Education', 'Real Estate', 'Marketing', 'Fitness', 'Travel', 'Beauty', 'Entertainment']
const TONES = ['Professional', 'Playful', 'Bold', 'Inspirational']

const TEMPLATES = [
  (v, t) => `${v} your ${t.toLowerCase()} journey`,
  (v, t) => `Where ${v.toLowerCase()} meets ${t.toLowerCase()}`,
  (v, t) => `Empowering ${t.toLowerCase()} through ${v.toLowerCase()}`,
  (v, t) => `${t} reimagined with ${v.toLowerCase()}`,
  (v, t) => `The future of ${t.toLowerCase()} starts with ${v.toLowerCase()}`,
  (v, t) => `${v}. ${t}. Results.`,
  (v, t) => `Your ${t.toLowerCase()} partner in ${v.toLowerCase()}`,
  (v, t) => `Building better ${t.toLowerCase()} with ${v.toLowerCase()}`,
  (v, t) => `${v} at the heart of ${t.toLowerCase()}`,
  (v, t) => `Transforming ${t.toLowerCase()} one ${v.toLowerCase()} at a time`,
  (v, t) => `${t} powered by ${v.toLowerCase()}`,
  (v, t) => `Where ${t.toLowerCase()} meets its match`,
  (v, t) => `${v} first. Always.`,
  (v, t) => `Redefining ${t.toLowerCase()} standards`,
  (v, t) => `${t} solutions driven by ${v.toLowerCase()}`,
  (v, t) => `Think ${v.toLowerCase()}. Think ${t.toLowerCase()}.`,
]

const TONE_MODIFIERS = {
  Professional: (s) => s,
  Playful: (s) => s.replace(/\.$/, '!').replace(/results/i, 'good vibes'),
  Bold: (s) => s.toUpperCase().replace(/\.$/, '.'),
  Inspirational: (s) => s.replace(/^/, 'Dream bigger. ').replace(/journey/, 'adventure'),
}

function generate(type, values, tone) {
  const valArr = values.split(',').map(v => v.trim()).filter(Boolean)
  if (!valArr.length) return []
  const modify = TONE_MODIFIERS[tone] || (s => s)
  const results = []
  const used = new Set()
  for (const val of valArr) {
    for (const tmpl of TEMPLATES) {
      const line = modify(tmpl(val, type))
      if (!used.has(line)) {
        used.add(line)
        results.push(line)
      }
      if (results.length >= 8) break
    }
    if (results.length >= 8) break
  }
  return results
}

export default function TaglineGenerator() {
  const [type, setType] = useState('Technology')
  const [values, setValues] = useState('')
  const [tone, setTone] = useState('Professional')
  const [taglines, setTaglines] = useState([])
  const [copiedIdx, setCopiedIdx] = useState(null)

  function handleGenerate(e) {
    e.preventDefault()
    setTaglines(generate(type, values, tone))
  }

  function copyTagline(text, idx) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(idx)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Tagline Generator',
    url: 'https://bizname.doaide.com/tools/tagline-generator',
    description: 'Generate creative tagline suggestions for your business based on industry, values, and tone.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <PublicLayout title="Free Tagline Generator" jsonLd={jsonLd}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Tagline Generator</h1>
      <p className="mb-6" style={{ color: 'var(--doaide-text-muted)' }}>Generate creative tagline suggestions based on your business type, values, and tone.</p>

      <form onSubmit={handleGenerate} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'var(--doaide-text-muted)' }}>Business Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none"
              style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)' }}
            >
              {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'var(--doaide-text-muted)' }}>Core Values (comma-separated)</label>
            <input
              value={values}
              onChange={e => setValues(e.target.value)}
              placeholder="Innovation, Trust, Quality"
              required
              className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none focus:ring-2"
              style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)', '--tw-ring-color': 'var(--doaide-gold-dim)' }}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1.5" style={{ color: 'var(--doaide-text-muted)' }}>Tone</label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value)}
              className="w-full rounded-lg px-3 py-2.5 text-sm border-0 outline-none"
              style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)' }}
            >
              {TONES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="rounded-lg px-6 py-2.5 font-medium cursor-pointer border-0"
          style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
        >
          Generate Taglines
        </button>
      </form>

      {taglines.length > 0 && (
        <div className="space-y-2">
          {taglines.map((tl, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg p-3" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
              <span className="text-sm" style={{ color: 'var(--doaide-text)' }}>{tl}</span>
              <button
                onClick={() => copyTagline(tl, i)}
                className="text-xs px-3 py-1 rounded-lg cursor-pointer border-0 shrink-0 ml-3"
                style={{ background: 'var(--doaide-gold-bg)', color: 'var(--doaide-gold)' }}
              >
                {copiedIdx === i ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <ShareButtons url="https://bizname.doaide.com/tools/tagline-generator" title="Free Tagline Generator by BizNameAI" />
      </div>
    </PublicLayout>
  )
}
