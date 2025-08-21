import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helper ? `${inputId}-helper` : undefined

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        
        <input
          id={inputId}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-md text-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            "placeholder:text-gray-400",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={cn(errorId, helperId).trim() || undefined}
          {...props}
        />
        
        {helper && !error && (
          <p id={helperId} className="text-sm text-gray-600">
            {helper}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }