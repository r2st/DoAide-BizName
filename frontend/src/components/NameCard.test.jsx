import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import NameCard from './NameCard'

const mockName = {
  id: 1,
  name: 'TestBrand',
  tagline: 'A great brand',
  domains: [
    { domain: 'testbrand.com', available: true },
    { domain: 'testbrand.in', available: false },
  ],
  socials: [
    { platform: 'twitter', handle: '@testbrand', likely_available: true },
  ],
  scores: {
    memorability: 8.0,
    brandability: 7.5,
    length: 9.0,
    overall: 8.1,
  },
}

describe('NameCard', () => {
  it('renders the name and tagline', () => {
    render(<NameCard name={mockName} />)
    expect(screen.getByText('TestBrand')).toBeInTheDocument()
    expect(screen.getByText('A great brand')).toBeInTheDocument()
  })

  it('shows domain availability badges', () => {
    render(<NameCard name={mockName} />)
    expect(screen.getByText(/testbrand\.com/)).toBeInTheDocument()
    expect(screen.getByText(/testbrand\.in/)).toBeInTheDocument()
  })

  it('shows the overall score', () => {
    render(<NameCard name={mockName} />)
    expect(screen.getByText('8.1')).toBeInTheDocument()
  })

  it('calls onSave when save button is clicked', async () => {
    const onSave = vi.fn()
    render(<NameCard name={mockName} onSave={onSave} />)
    await userEvent.click(screen.getByText(/Save/))
    expect(onSave).toHaveBeenCalledWith(1)
  })

  it('copies name to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })
    render(<NameCard name={mockName} />)
    await userEvent.click(screen.getByText('Copy'))
    expect(writeText).toHaveBeenCalledWith('TestBrand')
  })
})
