import * as React from 'react'

import { cn } from '@/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, maxLength, ...props }, ref) => {
    const handleResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
    return (
      <div className='flex flex-col gap-1'>
        <textarea
          className={cn(
            'flex min-h-[80px] w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground hover:border-accent-foreground/40 focus:border-accent-foreground/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          value={value}
          onInput={handleResize}
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
Textarea.displayName = 'Textarea'

export { Textarea }
