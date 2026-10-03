import { Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'
import { ARTICLES } from './articles'

export default function BlogIndex() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'BizNameAI Blog',
    url: 'https://bizname.doaide.com/blog',
    description: 'Business naming tips, branding strategies, and AI-powered naming insights.',
  }

  return (
    <PublicLayout title="Blog" jsonLd={jsonLd}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Blog</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--doaide-text-muted)' }}>Business naming tips, branding strategies, and AI-powered naming insights.</p>

        <div className="space-y-4">
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              to={`/blog/${a.slug}`}
              className="block rounded-xl p-5 no-underline transition-colors"
              style={{ border: '1px solid var(--doaide-border)', background: 'var(--doaide-surface)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--doaide-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--doaide-border)')}
            >
              <div className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--doaide-text-muted)' }}>
                <time>{a.date}</time>
                <span>&middot;</span>
                <span>{a.readTime}</span>
              </div>
              <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--doaide-text)' }}>{a.title}</h2>
              <p className="text-sm" style={{ color: 'var(--doaide-text-muted)' }}>{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
