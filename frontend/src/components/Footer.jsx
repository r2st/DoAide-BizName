export default function Footer() {
  return (
    <footer
      className="border-t mt-16 py-8"
      style={{ borderColor: 'var(--doaide-border)', background: 'var(--doaide-bg-alt)' }}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold mb-2" style={{ color: 'var(--doaide-gold)' }}>BizNameAI</h4>
            <p className="text-sm" style={{ color: 'var(--doaide-text-muted)' }}>
              AI-powered business name generator by DoAide. Generate creative names, check domain availability, and build your brand.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>DoAide Products</h4>
            <ul className="list-none p-0 m-0 space-y-1 text-sm">
              <li><a href="https://gst.doaide.com" target="_blank" rel="noreferrer">DoAide GST</a></li>
              <li><a href="https://contracts.doaide.com" target="_blank" rel="noreferrer">DoAide Contracts</a></li>
              <li><a href="https://doaide.com" target="_blank" rel="noreferrer">All Products</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-2" style={{ color: 'var(--doaide-text)' }}>Legal</h4>
            <ul className="list-none p-0 m-0 space-y-1 text-sm">
              <li><a href="https://doaide.com/privacy">Privacy Policy</a></li>
              <li><a href="https://doaide.com/terms">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 text-center text-xs" style={{ borderTop: '1px solid var(--doaide-border)', color: 'var(--doaide-text-muted)' }}>
          © {new Date().getFullYear()} DoAide. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
