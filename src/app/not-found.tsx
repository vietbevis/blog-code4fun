'use client'

import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

import { useHeadroom } from '@/hooks/useHeadroom'

import ROUTES from '@/constants/route'

import { cn } from '@/lib/utils'

const NotFound = () => {
  const pinned = useHeadroom({ fixedAt: 80 })
  return (
    <div
      className={cn(
        'flex items-center justify-center py-32',
        pinned ? 'md:h-[calc(100dvh-4rem)]' : 'md:h-dvh'
      )}
    >
      <div className={'mx-auto flex max-w-[700px] items-center gap-10'}>
        <div className={'text-9xl font-bold'}>404</div>
        <div className={'space-y-2'}>
          <h1 className={'text-3xl font-bold'}>Page Not Found</h1>
          <p className={'text-gray-500'}>
            We&apos;re sorry, this page is unknown or does not exist the page you are looking for.
          </p>
          <div className={'h-2'}></div>
          <Button>
            <Link href={ROUTES.HOME}>Back To Home </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
