import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('no backend'))))

describe('App', () => {
  it('renders the navbar with BizNameAI branding', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByText('BizNameAI')).toBeInTheDocument()
  })

  it('renders the home page hero', () => {
    render(<MemoryRouter><App /></MemoryRouter>)
    expect(screen.getByText(/Find the Perfect Name/)).toBeInTheDocument()
  })

  it('renders pricing page', () => {
    render(<MemoryRouter initialEntries={['/pricing']}><App /></MemoryRouter>)
    expect(screen.getByText(/Simple, Transparent/)).toBeInTheDocument()
  })

  it('renders login page', () => {
    render(<MemoryRouter initialEntries={['/login']}><App /></MemoryRouter>)
    expect(screen.getByText(/Welcome Back/)).toBeInTheDocument()
  })
})
