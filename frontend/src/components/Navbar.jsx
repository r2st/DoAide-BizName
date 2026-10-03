import { Link } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="border-b border-[var(--doaide-border)] bg-[var(--doaide-bg)]">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="var(--doaide-gold)" />
            <circle cx="11" cy="13" r="2.5" fill="var(--doaide-text-on-gold)" />
            <circle cx="21" cy="13" r="2.5" fill="var(--doaide-text-on-gold)" />
            <path d="M10 20 C10 23, 16 25, 16 25 C16 25, 22 23, 22 20" stroke="var(--doaide-text-on-gold)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <rect x="8" y="6" width="16" height="2" rx="1" fill="var(--doaide-text-on-gold)" opacity="0.5" />
          </svg>
          <span className="text-xl font-bold" style={{ color: 'var(--doaide-text)' }}>
            Biz<span style={{ color: 'var(--doaide-gold)' }}>Name</span>AI
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/pricing" className="text-sm hover:text-[var(--doaide-gold-light)]" style={{ color: 'var(--doaide-text-secondary)' }}>
            Pricing
          </Link>
          {user ? (
            <>
              <Link to="/saved" className="text-sm hover:text-[var(--doaide-gold-light)]" style={{ color: 'var(--doaide-text-secondary)' }}>
                Saved
              </Link>
              <button
                onClick={onLogout}
                className="text-sm px-3 py-1.5 rounded-lg border cursor-pointer"
                style={{
                  borderColor: 'var(--doaide-border)',
                  background: 'transparent',
                  color: 'var(--doaide-text-secondary)',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-1.5 rounded-lg font-medium no-underline"
              style={{
                background: 'var(--doaide-gold)',
                color: 'var(--doaide-text-on-gold)',
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
