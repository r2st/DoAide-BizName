import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import TrademarkClassFinder from './TrademarkClassFinder'
import { NICE_CLASSES, POPULAR_CATEGORIES } from './trademarkClassData'

function renderPage() {
  return render(
    <MemoryRouter>
      <TrademarkClassFinder />
    </MemoryRouter>
  )
}

describe('TrademarkClassFinder', () => {
  it('renders the page title and description', () => {
    renderPage()
    expect(screen.getByText('Trademark Class Finder')).toBeInTheDocument()
    expect(screen.getByText(/Find the right Nice Classification/)).toBeInTheDocument()
  })

  it('renders the search input', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/Describe your product or service/)).toBeInTheDocument()
  })

  it('renders all popular category buttons', () => {
    renderPage()
    POPULAR_CATEGORIES.forEach((cat) => {
      expect(screen.getByText(cat.label)).toBeInTheDocument()
    })
  })

  it('shows matching classes when user types a search query', async () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Describe your product or service/)
    await userEvent.type(input, 'software')
    const headings = screen.getAllByRole('heading', { level: 3 })
    const titles = headings.map((h) => h.textContent)
    expect(titles).toContain('Electronics & Software')
    expect(titles).toContain('IT & Scientific Services')
  })

  it('shows no-results message for unmatched query', async () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Describe your product or service/)
    await userEvent.type(input, 'xyznonexistent123')
    expect(screen.getByText(/No matching classes found/)).toBeInTheDocument()
  })

  it('filters by popular category when clicked', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Technology'))
    const headings = screen.getAllByRole('heading', { level: 3 })
    const titles = headings.map((h) => h.textContent)
    expect(titles).toContain('Electronics & Software')
    expect(titles).toContain('Advertising & Business')
    expect(titles).toContain('IT & Scientific Services')
  })

  it('deselects category when clicked again', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Technology'))
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((h) => h.textContent)).toContain('Electronics & Software')
    await userEvent.click(screen.getByText('Technology'))
    expect(screen.getByText(/Search or pick a category/)).toBeInTheDocument()
  })

  it('allows selecting a class and shows cost estimator', async () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Describe your product or service/)
    await userEvent.type(input, 'software')
    const selectButtons = screen.getAllByText('Select')
    await userEvent.click(selectButtons[0])
    expect(screen.getByText('Estimated Filing Cost')).toBeInTheDocument()
    expect(screen.getByText('1 class x ₹4,500')).toBeInTheDocument()
  })

  it('updates cost when multiple classes are selected', async () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Describe your product or service/)
    await userEvent.type(input, 'software')
    const selectButtons = screen.getAllByText('Select')
    await userEvent.click(selectButtons[0])
    await userEvent.click(selectButtons[1])
    expect(screen.getByText('2 classes x ₹4,500')).toBeInTheDocument()
    expect(screen.getByText('2 classes x ₹9,000')).toBeInTheDocument()
  })

  it('deselects a class when "Selected" button is clicked', async () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Describe your product or service/)
    await userEvent.type(input, 'software')
    const selectButtons = screen.getAllByText('Select')
    await userEvent.click(selectButtons[0])
    expect(screen.getByText('Selected')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Selected'))
    expect(screen.queryByText('Estimated Filing Cost')).not.toBeInTheDocument()
  })

  it('shows similar/related classes for each result', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Healthcare'))
    expect(screen.getAllByText(/Similar classes/).length).toBeGreaterThan(0)
  })

  it('renders FAQ section with all questions', () => {
    renderPage()
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
    expect(screen.getByText(/What is the Nice Classification/)).toBeInTheDocument()
    expect(screen.getByText(/How much does trademark registration cost/)).toBeInTheDocument()
    expect(screen.getByText(/Can I register a trademark in multiple/)).toBeInTheDocument()
    expect(screen.getByText(/How long does trademark registration take/)).toBeInTheDocument()
    expect(screen.getByText(/What is the difference between TM and/)).toBeInTheDocument()
  })

  it('renders WhatsApp share button', () => {
    renderPage()
    expect(screen.getByText('Share on WhatsApp')).toBeInTheDocument()
  })

  it('renders the fee info table', () => {
    renderPage()
    expect(screen.getByText('Trademark Registration Fees in India')).toBeInTheDocument()
    expect(screen.getByText('Individuals / Startups / Small Enterprises')).toBeInTheDocument()
  })

  it('clears category when user types in search', async () => {
    renderPage()
    await userEvent.click(screen.getByText('Technology'))
    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings.map((h) => h.textContent)).toContain('Electronics & Software')
    const input = screen.getByPlaceholderText(/Describe your product or service/)
    await userEvent.type(input, 'restaurant')
    const updatedHeadings = screen.getAllByRole('heading', { level: 3 })
    expect(updatedHeadings.map((h) => h.textContent)).toContain('Food & Accommodation')
  })
})

describe('trademarkClassData', () => {
  it('has exactly 45 Nice classes', () => {
    expect(NICE_CLASSES).toHaveLength(45)
  })

  it('has class numbers 1 through 45', () => {
    const numbers = NICE_CLASSES.map((c) => c.number)
    for (let i = 1; i <= 45; i++) {
      expect(numbers).toContain(i)
    }
  })

  it('each class has required fields', () => {
    NICE_CLASSES.forEach((cls) => {
      expect(cls.title).toBeTruthy()
      expect(cls.description).toBeTruthy()
      expect(cls.examples.length).toBeGreaterThan(0)
      expect(cls.relatedClasses.length).toBeGreaterThan(0)
    })
  })

  it('related classes reference valid class numbers', () => {
    const validNumbers = new Set(NICE_CLASSES.map((c) => c.number))
    NICE_CLASSES.forEach((cls) => {
      cls.relatedClasses.forEach((num) => {
        expect(validNumbers.has(num)).toBe(true)
      })
    })
  })
})
