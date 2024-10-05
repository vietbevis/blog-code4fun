'use client'

import Image from 'next/image'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const layout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-96'>
        <Image
          src={'/logo.png'}
          alt='logo'
          width={500}
          height={500}
          priority
          className='mx-auto w-24 p-4'
        />
        {children}
        <div className='flex items-center justify-center gap-2 px-4'>
          <div className='h-px w-full bg-muted-foreground'></div>
          <p>OR</p>
          <div className='h-px w-full bg-muted-foreground'></div>
        </div>
        <div className='flex items-center justify-center gap-2 p-4'>
          <Button className='w-full'>Google</Button>
          <Button className='w-full'>Github</Button>
        </div>
      </Card>
    </div>
  )
}

export default layout
