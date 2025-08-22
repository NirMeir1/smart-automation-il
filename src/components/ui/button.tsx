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
          "inline-flex items-center justify-center font-medium min-h-[44px] rounded-full",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-from)] focus-visible:ring-offset-2",
          "hover:scale-[1.02] hover:shadow-[var(--shadow)]",
          "disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none",
          
          // Variants
          {
            'bg-white text-[var(--navy)]': variant === 'primary',
            'bg-transparent text-white border-2 border-white hover:bg-white hover:text-[var(--navy)]': variant === 'secondary',
            'border border-[var(--outline)] bg-transparent text-[var(--navy)] hover:bg-[var(--muted)]': variant === 'outline',
            'bg-transparent text-[var(--ink)] hover:bg-[var(--muted)]': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          },
          
          // Sizes - all use 12px vertical, 20px horizontal padding
          {
            'px-5 py-3 text-sm': size === 'sm',
            'px-5 py-3 text-base': size === 'md', 
            'px-5 py-3 text-lg': size === 'lg',
          },
          
          className
        )}
        style={{}}
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