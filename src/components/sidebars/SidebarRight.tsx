'use client'

import Link from 'next/link'
import React from 'react'

import { useHeadroom } from '@/hooks/useHeadroom'

import { cn } from '@/lib/utils'

import { IconBook } from '../icons'
import { Button } from '../ui/button'

const SidebarRight = ({ className }: { className?: string }) => {
  const pinned = useHeadroom({ fixedAt: 80 })
  return (
    <div
      className={cn(
        'flex h-auto flex-col space-y-2 overflow-y-auto transition-all duration-300 md:sticky md:left-0 md:space-y-4',
        pinned ? 'md:top-20' : 'md:top-4',
        pinned ? 'md:h-[calc(100dvh-6rem)]' : 'md:h-[calc(100dvh-2rem)]',
        className
      )}
    >
      <div className='flex items-center gap-2 rounded-lg border border-input bg-card p-4'>
        <div className='space-y-2'>
          <h3 className='text-lg font-medium'>Hi, everyone!</h3>
          <p className='text-sm text-muted-foreground'>Share your knowledge with the world</p>
          <Link href={'/news'} className='inline-block'>
            <Button>Create Post</Button>
          </Link>
        </div>
        <IconBook className='size-20 shrink-0' />
      </div>
    </div>
  )
}

export default SidebarRight
