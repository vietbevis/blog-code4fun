import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  classNameMain?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, maxLength, classNameMain, ...props }, ref) => {
    return (
      <div className={cn('flex w-full flex-col gap-1', classNameMain)}>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-accent-foreground/40 focus:border-accent-foreground/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          value={value}
          {...props}
        />
        {maxLength && (
          <span className='ml-auto text-sm text-muted-foreground'>
            {value?.toString().length}/{maxLength}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
