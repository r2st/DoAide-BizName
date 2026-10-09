import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import IndustryGenerator from './IndustryGenerator'

function renderWithRoute(slug) {
  return render(
    <MemoryRouter initialEntries={[`/industry/${slug}`]}>
      <Routes>
        <Route path="/industry/:industry" element={<IndustryGenerator user={null} />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('IndustryGenerator', () => {
  it('renders technology generator', () => {
    renderWithRoute('technology')
    expect(screen.getByText(/Technology/)).toBeInTheDocument()
    expect(screen.getByText(/Name Generator/)).toBeInTheDocument()
  })

  it('renders food generator', () => {
    renderWithRoute('food')
    expect(screen.getByText(/Food & Beverage/)).toBeInTheDocument()
  })

  it('shows not found for invalid industry', () => {
    renderWithRoute('invalid')
    expect(screen.getByText('Industry not found')).toBeInTheDocument()
  })

  it('shows quick idea keyword buttons', () => {
    renderWithRoute('technology')
    expect(screen.getByText('cloud')).toBeInTheDocument()
    expect(screen.getByText('data')).toBeInTheDocument()
  })
})
