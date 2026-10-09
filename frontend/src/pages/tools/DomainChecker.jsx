import { useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'
import { checkDomains } from '../../lib/api'

export default function DomainChecker() {
  const [name, setName] = useState('')
  const [results, setResults] = useState(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  async function handleCheck(e) {
    e.preventDefault()
    const clean = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    if (!clean) return
    setChecking(true)
    setError('')
    try {
      const data = await checkDomains(clean)
      setResults(data.results)
    } catch (err) {
      setError(err.message || 'Failed to check domains. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Domain Availability Checker',
    url: 'https://bizname.doaide.com/tools/domain-checker',
    description: 'Check if .com, .in, and .co.in domains are available for your business name. Free, no sign-up required.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
  }

  return (
    <PublicLayout title="Free Domain Availability Checker" jsonLd={jsonLd}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Domain Availability Checker</h1>
      <p className="mb-6" style={{ color: 'var(--doaide-text-muted)' }}>
        Check if .com, .in, and .co.in domains are available for your business name. Free, no login required.
      </p>

      <form onSubmit={handleCheck} className="flex gap-3 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your business name (e.g., mybusiness)"
          className="flex-1 rounded-lg px-4 py-2.5 text-sm border-0 outline-none focus:ring-2"
          style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)', '--tw-ring-color': 'var(--doaide-gold-dim)' }}
        />
        <button
          type="submit"
          disabled={!name.trim() || checking}
          className="rounded-lg px-6 py-2.5 font-medium cursor-pointer border-0 disabled:opacity-40"
          style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
        >
          {checking ? 'Checking...' : 'Check Availability'}
        </button>
      </form>

      {error && (
        <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--doaide-error)', border: '1px solid rgba(248,113,113,0.2)' }}>
          {error}
        </div>
      )}

      {results && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--doaide-text-muted)' }}>Results</h3>
          <div className="grid grid-cols-1 gap-2">
            {results.map(r => (
              <div key={r.domain} className="rounded-xl p-4 flex items-center justify-between" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
                <span className="font-semibold" style={{ color: 'var(--doaide-text)' }}>{r.domain}</span>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{
                  background: r.available === null ? 'rgba(156,163,175,0.15)' :
                    r.available ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
                  color: r.available === null ? 'var(--doaide-text-muted)' :
                    r.available ? 'var(--doaide-success)' : 'var(--doaide-error)',
                }}>
                  {r.available === null ? 'Unknown' : r.available ? 'Likely Available' : 'Likely Taken'}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs mt-4" style={{ color: 'var(--doaide-text-muted)' }}>
            Availability is checked via DNS lookup. For confirmed availability, verify with a domain registrar before purchasing.
          </p>
        </div>
      )}

      <div className="mt-8">
        <ShareButtons url="https://bizname.doaide.com/tools/domain-checker" title="Free Domain Availability Checker by BizNameAI" />
      </div>
    </PublicLayout>
  )
}
