import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unit?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, unit, ...props }, ref) => {
  return (
    <div className='relative rounded-md flex-1'>
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[#b2927b]/30 bg-[#e8dfd7] px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      {unit && (
        <span className='absolute inset-y-0 right-7 flex items-center text-sm text-muted-foreground'>{unit}</span>
      )}
    </div>
  )
})
Input.displayName = 'Input'

export { Input }
