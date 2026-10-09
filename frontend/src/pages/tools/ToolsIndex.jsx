import { Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'

const TOOLS = [
  { slug: 'tagline-generator', title: 'Tagline Generator', description: 'Generate catchy taglines for your brand based on business type and tone.', icon: '✍️' },
  { slug: 'brand-name-scorer', title: 'Brand Name Scorer', description: 'Score any business name on memorability, pronounceability, length, and uniqueness.', icon: '📊' },
  { slug: 'domain-checker', title: 'Domain Name Checker', description: 'Check domain availability across popular TLDs for your business name.', icon: '🌐' },
  { slug: 'trademark-class-finder', title: 'Trademark Class Finder', description: 'Find the right Nice Classification class for your trademark in India with fee calculator.', icon: '™️' },
]

export default function ToolsIndex() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Business Naming Tools',
    url: 'https://bizname.doaide.com/tools',
    description: 'Free tools to help you name your business, check domains, and create taglines.',
  }

  return (
    <PublicLayout title="Free Tools" jsonLd={jsonLd}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Free Business Naming Tools</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--doaide-text-muted)' }}>Everything you need to name, brand, and launch your business.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.slug}
              to={`/tools/${t.slug}`}
              className="rounded-xl p-5 no-underline transition-colors block"
              style={{ border: '1px solid var(--doaide-border)', background: 'var(--doaide-surface)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--doaide-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--doaide-border)')}
            >
              <div className="text-2xl mb-3">{t.icon}</div>
              <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--doaide-text)' }}>{t.title}</h2>
              <p className="text-xs" style={{ color: 'var(--doaide-text-muted)' }}>{t.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
