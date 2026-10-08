import { useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'

function scoreName(name) {
  if (!name.trim()) return null
  const n = name.trim()
  const lower = n.toLowerCase()
  const len = n.length

  const vowels = (lower.match(/[aeiou]/g) || []).length
  const consonants = (lower.match(/[bcdfghjklmnpqrstvwxyz]/g) || []).length
  const ratio = len > 0 ? vowels / len : 0

  let memorability = 10
  if (len > 12) memorability -= Math.min(4, (len - 12) * 0.8)
  if (len < 3) memorability -= 3
  const uniqueChars = new Set(lower).size
  if (uniqueChars / len > 0.7) memorability += 1
  memorability = Math.max(0, Math.min(10, Math.round(memorability)))

  let pronounceability = 10
  const consonantClusters = lower.match(/[bcdfghjklmnpqrstvwxyz]{3,}/g) || []
  pronounceability -= consonantClusters.length * 2
  if (ratio < 0.2 || ratio > 0.6) pronounceability -= 2
  pronounceability = Math.max(0, Math.min(10, Math.round(pronounceability)))

  let lengthScore = 10
  if (len < 3) lengthScore = 3
  else if (len <= 4) lengthScore = 7
  else if (len <= 10) lengthScore = 10
  else if (len <= 15) lengthScore = 7
  else lengthScore = 4

  let uniqueness = 5
  const commonEndings = ['ly', 'ify', 'io', 'er', 'ful']
  if (!commonEndings.some(e => lower.endsWith(e))) uniqueness += 2
  if (uniqueChars > len * 0.6) uniqueness += 1
  if (lower.match(/[qxz]/)) uniqueness += 1
  uniqueness = Math.max(0, Math.min(10, uniqueness))

  const overall = Math.round((memorability + pronounceability + lengthScore + uniqueness) * 2.5)
  const tips = []
  if (len > 12) tips.push('Consider a shorter name (5-10 characters is optimal)')
  if (consonantClusters.length > 0) tips.push('Avoid consonant clusters — they make names hard to pronounce')
  if (ratio < 0.2) tips.push('Add more vowels for better flow')
  if (uniqueness < 5) tips.push('Try less common letter combinations for uniqueness')
  if (overall >= 80) tips.push('Great name! It scores well across all dimensions')

  return { memorability, pronounceability, lengthScore, uniqueness, overall, tips }
}

function ScoreBar({ label, value, max = 10 }) {
  const pct = (value / max) * 100
  const color = pct >= 70 ? 'var(--doaide-success)' : pct >= 40 ? 'var(--doaide-gold)' : 'var(--doaide-error)'
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: 'var(--doaide-text-secondary)' }}>{label}</span>
        <span style={{ color }}>{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'var(--doaide-surface)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function BrandNameScorer() {
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)

  function handleScore(e) {
    e.preventDefault()
    setResult(scoreName(name))
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Brand Name Scorer',
    url: 'https://bizname.doaide.com/tools/brand-name-scorer',
    description: 'Score your business name on memorability, pronounceability, length, and uniqueness.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <PublicLayout title="Free Brand Name Scorer" jsonLd={jsonLd}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Brand Name Scorer</h1>
      <p className="mb-6" style={{ color: 'var(--doaide-text-muted)' }}>Score your business name on memorability, pronounceability, length, and uniqueness.</p>

      <form onSubmit={handleScore} className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter a business name"
          className="flex-1 rounded-lg px-4 py-2.5 text-sm border-0 outline-none focus:ring-2"
          style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)', '--tw-ring-color': 'var(--doaide-gold-dim)' }}
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="rounded-lg px-6 py-2.5 font-medium cursor-pointer border-0 disabled:opacity-40"
          style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
        >
          Score Name
        </button>
      </form>

      {result && (
        <div className="rounded-xl p-6" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold" style={{ color: result.overall >= 70 ? 'var(--doaide-success)' : result.overall >= 40 ? 'var(--doaide-gold)' : 'var(--doaide-error)' }}>
              {result.overall}
            </div>
            <div className="text-xs" style={{ color: 'var(--doaide-text-muted)' }}>Overall Score</div>
          </div>

          <ScoreBar label="Memorability" value={result.memorability} />
          <ScoreBar label="Pronounceability" value={result.pronounceability} />
          <ScoreBar label="Length" value={result.lengthScore} />
          <ScoreBar label="Uniqueness" value={result.uniqueness} />

          {result.tips.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--doaide-border)' }}>
              <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--doaide-text)' }}>Tips</h3>
              <ul className="space-y-1">
                {result.tips.map((tip, i) => (
                  <li key={i} className="text-sm flex items-start gap-2" style={{ color: 'var(--doaide-text-secondary)' }}>
                    <span style={{ color: 'var(--doaide-gold)' }}>&#x2022;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <ShareButtons url="https://bizname.doaide.com/tools/brand-name-scorer" title="Free Brand Name Scorer by BizNameAI" />
      </div>
    </PublicLayout>
  )
}
