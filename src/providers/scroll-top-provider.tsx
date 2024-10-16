'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useWindowScroll } from '@/hooks/useWindowScroll'

import { cn } from '@/lib/utils'

const ScrollTop = () => {
  const [scroll, scrollTo] = useWindowScroll()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => scrollTo({ y: 0 })}
          variant={'outline'}
          size={'icon'}
          className={cn(
            'button-scroll-top fixed z-50 rounded-full transition-opacity duration-300',
            scroll.y > 100 ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Icon name='ChevronUp' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Scroll to top</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default ScrollTop
