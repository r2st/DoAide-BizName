import { useParams, Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'
import ShareButtons from '../../components/ShareButtons'
import { ARTICLES } from './articles'

export default function BlogPost() {
  const { slug } = useParams()
  const article = ARTICLES.find((a) => a.slug === slug)

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.date,
    url: `https://bizname.doaide.com/blog/${article.slug}`,
    publisher: { '@type': 'Organization', name: 'BizNameAI' },
  }

  return (
    <PublicLayout title={article.title} jsonLd={jsonLd}>
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
        <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--doaide-border)' }}>
          <ShareButtons url={`https://bizname.doaide.com/blog/${article.slug}`} title={article.title} />
        </div>
      </article>
    </PublicLayout>
  )
}
