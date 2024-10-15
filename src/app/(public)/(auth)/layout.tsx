'use client'

import Image from 'next/image'
import React from 'react'

import { Card } from '@/components/ui/card'

import { cn } from '@/lib/utils'

const Layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className={cn('flex min-h-[calc(100dvh-4rem)] items-center justify-center p-4')}>
      <Card className='w-full max-w-96 pb-2 pt-4'>
        <Image
          src={'/logo.png'}
          alt='logo'
          width={800}
          height={800}
          priority
          quality={100}
          className='mx-auto w-24'
        />
        {children}
      </Card>
    </div>
  )
}

export default Layout
