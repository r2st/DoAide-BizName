import { useState, useEffect } from 'react'

export default function Embed() {
  const [origin, setOrigin] = useState('')
  useEffect(() => { setOrigin(window.location.origin) }, [])

  const snippet = `<iframe src="${origin}/name/demo" width="100%" height="500" style="border:1px solid #e5e7eb;border-radius:12px;" loading="lazy"></iframe>`

  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => { document.title = 'Embed Widget | BizNameAI' }, [])

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 16px' }}>
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Embed BizNameAI</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--doaide-text-muted)' }}>
        Add an AI business name generator widget to your website. Just paste the code below.
      </p>

      <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}>
        <pre className="text-xs overflow-x-auto whitespace-pre-wrap" style={{ color: 'var(--doaide-text)' }}>{snippet}</pre>
      </div>

      <button
        onClick={copy}
        className="rounded-lg px-5 py-2 text-sm font-medium cursor-pointer border-0"
        style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}
      >
        {copied ? 'Copied!' : 'Copy Embed Code'}
      </button>

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--doaide-text)' }}>Preview</h2>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--doaide-border)' }}>
          <iframe src="/name/demo" width="100%" height="500" style={{ border: 'none' }} loading="lazy" title="BizNameAI Widget Preview" />
        </div>
      </div>
    </div>
  )
}
