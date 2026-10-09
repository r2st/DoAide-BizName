import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import FeedbackWidget from './FeedbackWidget'

vi.mock('../lib/api', () => ({
  submitFeedback: vi.fn(),
}))

import { submitFeedback } from '../lib/api'

describe('FeedbackWidget', () => {
  it('renders the feedback button', () => {
    render(<FeedbackWidget />)
    expect(screen.getByLabelText('Send feedback')).toBeInTheDocument()
  })

  it('opens the modal when button is clicked', async () => {
    render(<FeedbackWidget />)
    await userEvent.click(screen.getByLabelText('Send feedback'))
    expect(screen.getByText('Send Feedback')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Tell us what you think...')).toBeInTheDocument()
  })

  it('shows type selector buttons', async () => {
    render(<FeedbackWidget />)
    await userEvent.click(screen.getByLabelText('Send feedback'))
    expect(screen.getByText('suggestion')).toBeInTheDocument()
    expect(screen.getByText('bug')).toBeInTheDocument()
    expect(screen.getByText('praise')).toBeInTheDocument()
  })

  it('submits feedback and shows success message', async () => {
    submitFeedback.mockResolvedValue({ status: 'ok' })
    render(<FeedbackWidget />)
    await userEvent.click(screen.getByLabelText('Send feedback'))
    await userEvent.click(screen.getByText('bug'))
    await userEvent.type(screen.getByPlaceholderText('Tell us what you think...'), 'Found a problem')
    await userEvent.click(screen.getByText('Submit'))
    expect(submitFeedback).toHaveBeenCalledWith('bug', 'Found a problem', '/')
    expect(await screen.findByText('Thanks for your feedback!')).toBeInTheDocument()
  })

  it('shows error message on failure', async () => {
    submitFeedback.mockRejectedValue(new Error('fail'))
    render(<FeedbackWidget />)
    await userEvent.click(screen.getByLabelText('Send feedback'))
    await userEvent.type(screen.getByPlaceholderText('Tell us what you think...'), 'Test')
    await userEvent.click(screen.getByText('Submit'))
    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', async () => {
    render(<FeedbackWidget />)
    await userEvent.click(screen.getByLabelText('Send feedback'))
    expect(screen.getByRole('heading', { name: 'Send Feedback' })).toBeInTheDocument()
    await userEvent.click(screen.getByLabelText('Close feedback'))
    expect(screen.queryByRole('heading', { name: 'Send Feedback' })).not.toBeInTheDocument()
  })

  it('disables submit when message is empty', async () => {
    render(<FeedbackWidget />)
    await userEvent.click(screen.getByLabelText('Send feedback'))
    expect(screen.getByText('Submit')).toBeDisabled()
  })
})
