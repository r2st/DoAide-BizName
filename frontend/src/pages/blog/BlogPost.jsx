import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'
import { ARTICLES } from './articles'

export default function BlogPost() {
  const { slug } = useParams()
  const article = ARTICLES.find((a) => a.slug === slug)

  useEffect(() => {
    if (!article) return
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        datePublished: article.date,
        url: `https://bizname.doaide.com/blog/${article.slug}`,
        publisher: { '@type': 'Organization', name: 'BizNameAI' },
        author: { '@type': 'Organization', name: 'BizNameAI' },
        description: article.excerpt,
      },
    ]
    if (article.faqs?.length) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      })
    }
    const scripts = schemas.map((s) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.textContent = JSON.stringify(s)
      document.head.appendChild(el)
      return el
    })
    return () => scripts.forEach((el) => document.head.removeChild(el))
  }, [article])

  if (!article) {
    return (
      <PublicLayout title="Not Found">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Article not found</h1>
          <Link to="/blog" className="text-sm" style={{ color: 'var(--doaide-gold)' }}>Back to blog</Link>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout title={article.title}>
      <article className="max-w-3xl mx-auto">
        <Link to="/blog" className="text-xs no-underline mb-6 inline-block" style={{ color: 'var(--doaide-gold)' }}>&larr; All articles</Link>
        <div className="flex items-center gap-2 text-xs mb-3" style={{ color: 'var(--doaide-text-muted)' }}>
          <time>{article.date}</time>
          <span>&middot;</span>
          <span>{article.readTime}</span>
        </div>
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--doaide-text)' }}>{article.title}</h1>
        <div className="prose max-w-none text-sm leading-relaxed space-y-4" style={{ color: 'var(--doaide-text-secondary, var(--doaide-text-muted))' }}>
          {article.content.split('\n\n').map((para, i) => {
            if (para.startsWith('**') && para.indexOf('**', 2) > 0) {
              const boldEnd = para.indexOf('**', 2)
              return (
                <p key={i}>
                  <strong style={{ color: 'var(--doaide-text)' }}>{para.slice(2, boldEnd)}</strong>
                  {para.slice(boldEnd + 2)}
                </p>
              )
            }
            return <p key={i}>{para}</p>
          })}
        </div>

        {article.faqs?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--doaide-text)' }}>Frequently Asked Questions</h2>
            <div className="space-y-4">
              {article.faqs.map((faq, i) => (
                <details key={i} className="rounded-lg p-4" style={{ border: '1px solid var(--doaide-border)', background: 'var(--doaide-surface)' }}>
                  <summary className="cursor-pointer font-medium text-sm" style={{ color: 'var(--doaide-text)' }}>{faq.q}</summary>
                  <p className="mt-2 text-sm" style={{ color: 'var(--doaide-text-muted)' }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--doaide-border)' }}>
          <ShareButtons url={`https://bizname.doaide.com/blog/${article.slug}`} title={article.title} />
        </div>
      </article>
    </PublicLayout>
  )
}
