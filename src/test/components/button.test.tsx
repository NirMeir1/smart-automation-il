import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('should render with children', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('should apply primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('should apply secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-gray-600')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('should disable button when loading', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('should disable button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
  })

  it('should apply correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('should show loading spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByText('טוען...')).toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<Button>Accessible Button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('focus-visible:outline-none')
    expect(button).toHaveClass('focus-visible:ring-2')
  })
})