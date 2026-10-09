import { Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'

const TOOLS = [
  { slug: 'tagline-generator', title: 'Tagline Generator', description: 'Generate catchy taglines for your brand based on business type and tone.', icon: '✍️' },
  { slug: 'brand-name-scorer', title: 'Brand Name Scorer', description: 'Score any business name on memorability, pronounceability, length, and uniqueness.', icon: '📊' },
  { slug: 'domain-checker', title: 'Domain Availability Checker', description: 'Check if .com, .in, and .co.in domains are available via real DNS lookup. No login required.', icon: '🌐' },
  { slug: 'trademark-search', title: 'Trademark Search Helper', description: 'Search your business name against Indian trademark classes and estimate filing costs.', icon: '🔍' },
  { slug: 'trademark-class-finder', title: 'Trademark Class Finder', description: 'Find the right Nice Classification class for your trademark in India with fee calculator.', icon: '™️' },
]

const INDUSTRY_GENERATORS = [
  { slug: 'technology', label: 'Tech', icon: '💻' },
  { slug: 'food', label: 'Food', icon: '🍕' },
  { slug: 'fashion', label: 'Fashion', icon: '👗' },
  { slug: 'healthcare', label: 'Healthcare', icon: '🏥' },
]

export default function ToolsIndex() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Business Naming Tools',
    url: 'https://bizname.doaide.com/tools',
    description: 'Free tools to help you name your business, check domains, search trademarks, and create taglines.',
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

        <h2 className="text-xl font-bold mt-12 mb-4" style={{ color: 'var(--doaide-text)' }}>
          Industry-Specific <span style={{ color: 'var(--doaide-gold)' }}>Name Generators</span>
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--doaide-text-muted)' }}>
          AI-powered name generators tailored for specific industries with curated prompts and styles.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {INDUSTRY_GENERATORS.map((g) => (
            <Link
              key={g.slug}
              to={`/industry/${g.slug}`}
              className="rounded-xl p-5 text-center no-underline transition-colors block"
              style={{ border: '1px solid var(--doaide-border)', background: 'var(--doaide-surface)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--doaide-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--doaide-border)')}
            >
              <div className="text-3xl mb-2">{g.icon}</div>
              <div className="text-sm font-semibold" style={{ color: 'var(--doaide-text)' }}>{g.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </PublicLayout>
  )
}
