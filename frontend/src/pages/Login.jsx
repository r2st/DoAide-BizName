import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../lib/api'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await register(email, password, name)
      } else {
        await login(email, password)
      }
      onLogin()
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--doaide-text)' }}>
        {isRegister ? 'Create Account' : 'Welcome Back'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl p-6 space-y-4"
        style={{ background: 'var(--doaide-surface)', border: '1px solid var(--doaide-border)' }}
      >
        {error && (
          <div className="text-sm px-3 py-2 rounded" style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--doaide-error)' }}>
            {error}
          </div>
        )}

        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none"
            style={{
              background: 'var(--doaide-bg)',
              color: 'var(--doaide-text)',
              border: '1px solid var(--doaide-border)',
            }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--doaide-bg)',
            color: 'var(--doaide-text)',
            border: '1px solid var(--doaide-border)',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg text-sm outline-none"
          style={{
            background: 'var(--doaide-bg)',
            color: 'var(--doaide-text)',
            border: '1px solid var(--doaide-border)',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium cursor-pointer text-sm"
          style={{
            background: 'var(--doaide-gold)',
            color: 'var(--doaide-text-on-gold)',
            border: 'none',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
        </button>
        <p className="text-center text-sm" style={{ color: 'var(--doaide-text-muted)' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError('') }}
            className="cursor-pointer"
            style={{ background: 'none', border: 'none', color: 'var(--doaide-gold)', padding: 0 }}
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  )
}
