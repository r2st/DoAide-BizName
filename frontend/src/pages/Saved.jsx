import { useEffect, useState } from 'react'
import { deleteSavedName, getSavedNames } from '../lib/api'

export default function Saved({ user }) {
  const [names, setNames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getSavedNames()
      .then(setNames)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleDelete = async (id) => {
    await deleteSavedName(id)
    setNames((prev) => prev.filter((n) => n.id !== id))
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p style={{ color: 'var(--doaide-text-secondary)' }}>Sign in to view saved names.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--doaide-text)' }}>
        Saved Names
      </h1>

      {loading ? (
        <p style={{ color: 'var(--doaide-text-muted)' }}>Loading...</p>
      ) : names.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
        >
          <p style={{ color: 'var(--doaide-text-secondary)' }}>No saved names yet. Generate some names and save your favorites!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {names.map((n) => (
            <div
              key={n.id}
              className="rounded-lg p-4 flex items-center justify-between"
              style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
            >
              <div>
                <h3 className="font-bold" style={{ color: 'var(--doaide-text)' }}>{n.name}</h3>
                <p className="text-sm" style={{ color: 'var(--doaide-text-secondary)' }}>{n.tagline}</p>
                {n.notes && <p className="text-xs mt-1" style={{ color: 'var(--doaide-text-muted)' }}>Note: {n.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-mono px-2 py-1 rounded"
                  style={{ background: 'var(--doaide-gold-bg)', color: 'var(--doaide-gold)' }}
                >
                  {n.scores.overall.toFixed(1)}
                </span>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-xs px-2 py-1 rounded cursor-pointer"
                  style={{ background: 'transparent', border: '1px solid var(--doaide-error)', color: 'var(--doaide-error)' }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
