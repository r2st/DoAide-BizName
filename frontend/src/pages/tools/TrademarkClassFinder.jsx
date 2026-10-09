import { useState, useMemo } from 'react'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'
import { NICE_CLASSES, POPULAR_CATEGORIES } from './trademarkClassData'

function matchClasses(query) {
  if (!query.trim()) return []
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  return NICE_CLASSES.map((cls) => {
    const haystack = `${cls.title} ${cls.description} ${cls.examples.join(' ')}`.toLowerCase()
    const hits = terms.filter((t) => haystack.includes(t)).length
    return { cls, score: hits }
  })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((m) => m.cls)
}

function ClassCard({ cls, onToggle, selected }) {
  const relatedNames = cls.relatedClasses
    .map((n) => NICE_CLASSES.find((c) => c.number === n))
    .filter(Boolean)

  return (
    <div
      className="rounded-xl p-5 transition-colors"
      style={{
        background: 'var(--doaide-surface)',
        border: selected
          ? '2px solid var(--doaide-gold)'
          : '1px solid var(--doaide-border)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold shrink-0"
            style={{ background: 'var(--doaide-gold-bg)', color: 'var(--doaide-gold)' }}
          >
            {cls.number}
          </span>
          <h3 className="text-base font-semibold" style={{ color: 'var(--doaide-text)' }}>
            {cls.title}
          </h3>
        </div>
        <button
          onClick={() => onToggle(cls.number)}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer border-0 transition-colors"
          style={{
            background: selected ? 'var(--doaide-gold)' : 'var(--doaide-gold-bg)',
            color: selected ? 'var(--doaide-text-on-gold)' : 'var(--doaide-gold)',
          }}
        >
          {selected ? 'Selected' : 'Select'}
        </button>
      </div>

      <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--doaide-text-secondary)' }}>
        {cls.description}
      </p>

      <div className="mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--doaide-text-muted)' }}>
          Examples:
        </span>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {cls.examples.map((ex) => (
            <span
              key={ex}
              className="text-xs px-2 py-0.5 rounded-md"
              style={{ background: 'var(--doaide-bg)', color: 'var(--doaide-text-secondary)' }}
            >
              {ex}
            </span>
          ))}
        </div>
      </div>

      {relatedNames.length > 0 && (
        <div className="pt-3" style={{ borderTop: '1px solid var(--doaide-border)' }}>
          <span className="text-xs font-medium" style={{ color: 'var(--doaide-text-muted)' }}>
            Similar classes:
          </span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {relatedNames.map((r) => (
              <span
                key={r.number}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: 'var(--doaide-gold-bg)', color: 'var(--doaide-gold)' }}
              >
                Class {r.number} — {r.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CostEstimator({ count }) {
  if (count === 0) return null
  const individualFee = 4500
  const othersFee = 9000
  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-gold-dim)' }}
    >
      <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--doaide-gold)' }}>
        Estimated Filing Cost
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg p-4" style={{ background: 'var(--doaide-bg)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--doaide-text-muted)' }}>
            Individuals / Startups / Small Enterprises
          </p>
          <p className="text-xs mb-1" style={{ color: 'var(--doaide-text-secondary)' }}>
            {count} class{count > 1 ? 'es' : ''} x ₹{individualFee.toLocaleString('en-IN')}
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--doaide-success)' }}>
            ₹{(count * individualFee).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ background: 'var(--doaide-bg)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--doaide-text-muted)' }}>
            Others (Companies / LLPs)
          </p>
          <p className="text-xs mb-1" style={{ color: 'var(--doaide-text-secondary)' }}>
            {count} class{count > 1 ? 'es' : ''} x ₹{othersFee.toLocaleString('en-IN')}
          </p>
          <p className="text-xl font-bold" style={{ color: 'var(--doaide-gold)' }}>
            ₹{(count * othersFee).toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      <p className="text-xs mt-3" style={{ color: 'var(--doaide-text-muted)' }}>
        * Government fees only. Attorney fees and professional charges are additional. Fees as per Indian Trademark Rules, 2017.
      </p>
    </div>
  )
}

const FAQ_ITEMS = [
  {
    q: 'What is the Nice Classification for trademarks?',
    a: 'The Nice Classification (NCL) is an international system that categorizes goods and services into 45 classes (1-34 for goods, 35-45 for services) for trademark registration. India follows this system under the Trade Marks Act, 1999. You must register your trademark in the correct class to get protection for your specific goods or services.',
  },
  {
    q: 'How much does trademark registration cost in India?',
    a: 'The government fee for trademark registration in India is ₹4,500 per class for individuals, startups, and small enterprises when filed online. For other entities (companies, LLPs), the fee is ₹9,000 per class. Additional costs include attorney/agent fees (₹3,000–₹10,000) and any opposition proceedings if they arise.',
  },
  {
    q: 'Can I register a trademark in multiple classes?',
    a: 'Yes, you can register your trademark in multiple classes by filing a multi-class application. Each class incurs its own government fee. For example, a tech company might register in Class 9 (software) and Class 42 (IT services). Filing in multiple classes provides broader protection for your brand.',
  },
  {
    q: 'How long does trademark registration take in India?',
    a: 'Trademark registration in India typically takes 12-18 months if there are no objections. After filing, the application is examined within 1-3 months. If accepted, it is published in the Trademark Journal for 4 months for opposition. If no opposition is filed, the registration certificate is issued. You can use the TM symbol immediately after filing.',
  },
  {
    q: 'What is the difference between TM and ® symbols?',
    a: 'The TM (™) symbol can be used by anyone who claims rights to a trademark, even without registration — you can use it as soon as you file your application. The ® (registered) symbol can only be used after the trademark is officially registered by the Registrar of Trademarks. Using ® without registration is an offence under Indian law.',
  },
  {
    q: 'Do I need a trademark attorney to file in India?',
    a: 'While you can file a trademark application yourself on the IP India website (ipindia.gov.in), hiring a trademark attorney is recommended. An attorney can conduct a proper trademark search, advise on the correct classes, draft a strong application, and handle any objections or oppositions that may arise during the process.',
  },
  {
    q: 'How long is a trademark valid in India?',
    a: 'A registered trademark in India is valid for 10 years from the date of filing. It can be renewed indefinitely for successive periods of 10 years by paying the renewal fee. If not renewed, the trademark is removed from the register and loses protection.',
  },
]

export default function TrademarkClassFinder() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [selectedClasses, setSelectedClasses] = useState(new Set())

  const results = useMemo(() => {
    if (activeCategory) {
      return NICE_CLASSES.filter((c) => activeCategory.classNumbers.includes(c.number))
    }
    if (query.trim()) {
      return matchClasses(query)
    }
    return []
  }, [query, activeCategory])

  function handleCategoryClick(cat) {
    if (activeCategory?.label === cat.label) {
      setActiveCategory(null)
    } else {
      setActiveCategory(cat)
      setQuery('')
    }
  }

  function handleSearch(e) {
    setQuery(e.target.value)
    if (e.target.value.trim()) {
      setActiveCategory(null)
    }
  }

  function toggleClass(num) {
    setSelectedClasses((prev) => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  const shareUrl = 'https://bizname.doaide.com/tools/trademark-class-finder'
  const whatsappText = encodeURIComponent(
    `I found the right trademark classes for my business using this free tool! Check it out: ${shareUrl}`
  )

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Trademark Class Finder',
      url: shareUrl,
      description:
        'Find the right Nice Classification class for your trademark in India. Free tool with all 45 classes, government fee calculator, and filing guidance.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
    faqJsonLd,
  ]

  return (
    <PublicLayout title="Free Trademark Class Finder — India" jsonLd={jsonLd}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>
          Trademark Class Finder
        </h1>
        <p className="mb-6" style={{ color: 'var(--doaide-text-muted)' }}>
          Find the right Nice Classification class for your trademark in India.
          Enter your business description or browse popular categories.
        </p>

        {/* Search */}
        <div className="mb-4">
          <input
            value={query}
            onChange={handleSearch}
            placeholder="Describe your product or service (e.g., mobile app, restaurant, clothing brand)..."
            className="w-full rounded-xl px-5 py-3.5 text-sm border-0 outline-none focus:ring-2"
            style={{
              background: 'var(--doaide-surface)',
              color: 'var(--doaide-text)',
              '--tw-ring-color': 'var(--doaide-gold-dim)',
              border: '1px solid var(--doaide-border)',
            }}
          />
        </div>

        {/* Popular Categories */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest mb-2 block" style={{ color: 'var(--doaide-text-muted)' }}>
            Popular Categories
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => handleCategoryClick(cat)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer border-0 transition-colors"
                style={{
                  background: activeCategory?.label === cat.label ? 'var(--doaide-gold)' : 'var(--doaide-surface)',
                  color: activeCategory?.label === cat.label ? 'var(--doaide-text-on-gold)' : 'var(--doaide-text-secondary)',
                  border: `1px solid ${activeCategory?.label === cat.label ? 'var(--doaide-gold)' : 'var(--doaide-border)'}`,
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cost Estimator */}
        <CostEstimator count={selectedClasses.size} />

        {/* Results */}
        {results.length > 0 && (
          <div className="mb-2">
            <p className="text-sm mb-4" style={{ color: 'var(--doaide-text-secondary)' }}>
              Found <strong style={{ color: 'var(--doaide-gold)' }}>{results.length}</strong> matching
              class{results.length !== 1 ? 'es' : ''}
              {activeCategory ? ` for ${activeCategory.label}` : ''}
            </p>
            <div className="grid gap-4">
              {results.map((cls) => (
                <ClassCard
                  key={cls.number}
                  cls={cls}
                  onToggle={toggleClass}
                  selected={selectedClasses.has(cls.number)}
                />
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query.trim() && results.length === 0 && (
          <div
            className="rounded-xl p-8 text-center mb-6"
            style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--doaide-text-muted)' }}>
              No matching classes found. Try different keywords or browse the categories above.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!query.trim() && !activeCategory && (
          <div
            className="rounded-xl p-8 text-center mb-6"
            style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
          >
            <p className="text-lg mb-2" style={{ color: 'var(--doaide-text)' }}>
              Search or pick a category to get started
            </p>
            <p className="text-sm" style={{ color: 'var(--doaide-text-muted)' }}>
              All 45 Nice Classification classes with examples, related classes, and government fee info.
            </p>
          </div>
        )}

        {/* WhatsApp Share */}
        <div className="mt-8 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium no-underline transition-colors"
              style={{ background: '#25D366', color: '#fff' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Share on WhatsApp
            </a>
            <ShareButtons url={shareUrl} title="Free Trademark Class Finder — Find the right class for your brand in India" />
          </div>
        </div>

        {/* Fee Info Section */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
        >
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--doaide-text)' }}>
            Trademark Registration Fees in India
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--doaide-border)' }}>
                  <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--doaide-text)' }}>Applicant Type</th>
                  <th className="text-right py-2 font-medium" style={{ color: 'var(--doaide-text)' }}>Fee per Class</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--doaide-border)' }}>
                  <td className="py-2 pr-4">Individuals / Startups / Small Enterprises</td>
                  <td className="text-right py-2 font-semibold" style={{ color: 'var(--doaide-success)' }}>₹4,500</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Others (Companies / LLPs / Large Enterprises)</td>
                  <td className="text-right py-2 font-semibold" style={{ color: 'var(--doaide-gold)' }}>₹9,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--doaide-text-muted)' }}>
            Fees are for online filing via the IP India portal. Physical filing costs double. Attorney/professional fees are additional.
          </p>
        </div>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--doaide-text)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={i}
                className="rounded-xl group"
                style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
              >
                <summary
                  className="px-5 py-4 cursor-pointer font-medium text-sm list-none flex items-center justify-between"
                  style={{ color: 'var(--doaide-text)' }}
                >
                  {item.q}
                  <span className="ml-2 transition-transform group-open:rotate-45" style={{ color: 'var(--doaide-gold)' }}>+</span>
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: 'var(--doaide-text-secondary)' }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}
