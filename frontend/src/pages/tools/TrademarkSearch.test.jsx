import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import TrademarkSearch from './TrademarkSearch'

describe('TrademarkSearch', () => {
  it('renders the heading and search form', () => {
    render(
      <MemoryRouter>
        <TrademarkSearch />
      </MemoryRouter>
    )
    expect(screen.getByText('Trademark Search Helper')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/CloudKitchen/)).toBeInTheDocument()
    expect(screen.getByText('Search Trademark Classes')).toBeInTheDocument()
  })

  it('has an industry selector', () => {
    render(
      <MemoryRouter>
        <TrademarkSearch />
      </MemoryRouter>
    )
    expect(screen.getByText('Any Industry')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
  })
})
