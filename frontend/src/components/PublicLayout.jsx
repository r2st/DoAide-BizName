import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PublicLayout({ title, jsonLd, children }) {
  useEffect(() => {
    if (title) document.title = `${title} | BizNameAI`
    return () => { document.title = 'BizNameAI' }
  }, [title])

  useEffect(() => {
    if (!jsonLd) return
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [jsonLd])

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {children}
      </div>

      <div className="border-t py-10 text-center" style={{ borderColor: 'var(--doaide-border)', background: 'var(--doaide-gold-bg)' }}>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Need the perfect business name?</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--doaide-text-muted)' }}>AI-powered business name generator with domain availability and branding insights.</p>
        <Link to="/" className="inline-block rounded-lg px-6 py-2.5 font-medium no-underline" style={{ background: 'var(--doaide-gold)', color: 'var(--doaide-text-on-gold)' }}>
          Try BizNameAI Free
        </Link>
      </div>
    </>
  )
}
