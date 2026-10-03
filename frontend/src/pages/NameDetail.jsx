import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NameCard from '../components/NameCard'
import { getNameDetails } from '../lib/api'

export default function NameDetail() {
  const { name } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getNameDetails(name)
      .then(setData)
      .catch((err) => setError(err.message))
  }, [name])

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--doaide-text)' }}>Name Not Found</h1>
        <p style={{ color: 'var(--doaide-text-secondary)' }}>{error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p style={{ color: 'var(--doaide-text-muted)' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>
        <span style={{ color: 'var(--doaide-gold)' }}>{data.name}</span> — Business Name Details
      </h1>
      <p className="mb-8 text-sm" style={{ color: 'var(--doaide-text-muted)' }}>
        Domain availability, social handles, and name scoring for "{data.name}".
      </p>
      <NameCard name={data} />
    </div>
  )
}
