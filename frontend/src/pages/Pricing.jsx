import { useEffect, useState } from 'react'
import { getPricing } from '../lib/api'

export default function Pricing() {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    getPricing().then((data) => setPlans(data.plans)).catch(() => {})
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1
        className="text-4xl font-bold text-center mb-4"
        style={{ fontFamily: 'var(--doaide-font-display)', color: 'var(--doaide-text)' }}
      >
        Simple, Transparent <span style={{ color: 'var(--doaide-gold)' }}>Pricing</span>
      </h1>
      <p className="text-center mb-12" style={{ color: 'var(--doaide-text-secondary)' }}>
        Start free. Upgrade when you need more.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className="rounded-xl p-6 flex flex-col"
            style={{
              background: 'var(--doaide-surface)',
              border: i === 1 ? '2px solid var(--doaide-gold)' : '1px solid var(--doaide-border)',
              boxShadow: i === 1 ? 'var(--doaide-shadow-gold)' : 'none',
            }}
          >
            {i === 1 && (
              <span
                className="text-xs font-bold uppercase tracking-wider mb-3 self-start px-2 py-0.5 rounded"
                style={{ background: 'var(--doaide-gold-bg)', color: 'var(--doaide-gold)' }}
              >
                Popular
              </span>
            )}
            <h3 className="text-xl font-bold" style={{ color: 'var(--doaide-text)' }}>{plan.name}</h3>
            <div className="my-4">
              <span className="text-3xl font-bold" style={{ color: 'var(--doaide-gold)' }}>
                {plan.price === 0 ? 'Free' : `₹${plan.price}`}
              </span>
              {plan.period && (
                <span className="text-sm" style={{ color: 'var(--doaide-text-muted)' }}>
                  /{plan.period}
                </span>
              )}
            </div>
            <ul className="list-none p-0 m-0 space-y-2 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>
                  <span style={{ color: 'var(--doaide-success)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              className="mt-6 w-full py-2.5 rounded-lg font-medium cursor-pointer transition-colors text-sm"
              style={{
                background: i === 1 ? 'var(--doaide-gold)' : 'transparent',
                color: i === 1 ? 'var(--doaide-text-on-gold)' : 'var(--doaide-gold)',
                border: i === 1 ? 'none' : '1px solid var(--doaide-gold)',
              }}
            >
              {plan.price === 0 ? 'Get Started' : 'Subscribe'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
