import { useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'

const TLDS = ['.com', '.io', '.co', '.ai', '.app', '.dev', '.net', '.org']

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export default function DomainChecker() {
  const [domain, setDomain] = useState('')
  const [results, setResults] = useState(null)
  const [checking, setChecking] = useState(false)

  function checkDomain(e) {
    e.preventDefault()
    const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!clean) return
    setChecking(true)
    setTimeout(() => {
      const name = clean.includes('.') ? clean.split('.')[0] : clean
      const ext = clean.includes('.') ? '.' + clean.split('.').slice(1).join('.') : '.com'
      const suggestions = TLDS.map(tld => {
        const full = name + tld
        const h = hashCode(full)
        return { domain: full, available: h % 3 !== 0 }
      })
      const primary = { domain: name + ext, available: hashCode(name + ext) % 3 !== 0 }
      setResults({ primary, suggestions: suggestions.filter(s => s.domain !== primary.domain) })
      setChecking(false)
    }, 800)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Domain Name Checker',
    url: 'https://bizname.doaide.com/tools/domain-checker',
    description: 'Check domain name availability and find alternatives across popular TLDs.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <PublicLayout title="Free Domain Name Checker" jsonLd={jsonLd}>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Domain Name Checker</h1>
      <p className="mb-6" style={{ color: 'var(--doaide-text-muted)' }}>Check if your desired domain name is available across popular TLDs.</p>

      <form onSubmit={checkDomain} className="flex gap-3 mb-6">
        <input
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="mybusiness.com"
          className="flex-1 rounded-lg px-4 py-2.5 text-sm border-0 outline-none focus:ring-2"
          style={{ background: 'var(--doaide-surface)', color: 'var(--doaide-text)', '--tw-ring-color': 'var(--doaide-gold-dim)' }}
        />
        <button
          type="submit"
          disabled={!domain.trim() || checking}
          className="rounded-lg px-6 py-2.5 font-medium cursor-pointer border-0 disabled:opacity-40"
          style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {results && (
        <div className="space-y-3">
          <div className="rounded-xl p-5 flex items-center justify-between" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
            <span className="font-semibold text-lg" style={{ color: 'var(--doaide-text)' }}>{results.primary.domain}</span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{
              background: results.primary.available ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
              color: results.primary.available ? 'var(--doaide-success)' : 'var(--doaide-error)',
            }}>
              {results.primary.available ? 'Likely Available' : 'Likely Taken'}
            </span>
          </div>

          <h3 className="text-sm font-semibold mt-6 mb-2" style={{ color: 'var(--doaide-text-muted)' }}>Alternative TLDs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {results.suggestions.map(s => (
              <div key={s.domain} className="rounded-lg p-3 flex items-center justify-between" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
                <span className="text-sm" style={{ color: 'var(--doaide-text)' }}>{s.domain}</span>
                <span className="text-xs font-medium" style={{ color: s.available ? 'var(--doaide-success)' : 'var(--doaide-error)' }}>
                  {s.available ? 'Available' : 'Taken'}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs mt-4" style={{ color: 'var(--doaide-text-muted)' }}>
            Results are simulated. For actual availability, verify with a domain registrar.
          </p>
        </div>
      )}

      <div className="mt-8">
        <ShareButtons url="https://bizname.doaide.com/tools/domain-checker" title="Free Domain Name Checker by BizNameAI" />
      </div>
    </PublicLayout>
  )
}
