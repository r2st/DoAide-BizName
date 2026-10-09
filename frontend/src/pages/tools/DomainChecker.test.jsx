import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import DomainChecker from './DomainChecker'

describe('DomainChecker', () => {
  it('renders the heading and form', () => {
    render(
      <MemoryRouter>
        <DomainChecker />
      </MemoryRouter>
    )
    expect(screen.getByText('Domain Availability Checker')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/mybusiness/)).toBeInTheDocument()
    expect(screen.getByText('Check Availability')).toBeInTheDocument()
  })

  it('mentions .com, .in, .co.in in description', () => {
    render(
      <MemoryRouter>
        <DomainChecker />
      </MemoryRouter>
    )
    expect(screen.getByText(/\.com, \.in, and \.co\.in/)).toBeInTheDocument()
  })
})
