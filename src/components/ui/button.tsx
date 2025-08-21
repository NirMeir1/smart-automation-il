import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Variants
          {
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800': variant === 'primary',
            'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800': variant === 'secondary',
            'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 active:bg-gray-100': variant === 'outline',
            'bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800': variant === 'danger',
          },
          
          // Sizes
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent ml-2" />
            <span className="sr-only">טוען...</span>
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }