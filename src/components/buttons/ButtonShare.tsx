'use client'

import { SquareArrowOutUpRight } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '../ui/button'

const ButtonShare = () => {
  const handleShare = () => {
    const text = window.location.href
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy to clipboard!'))
  }

  return (
    <div className='group relative'>
      <Button variant={'ghost'} size={'icon'} onClick={handleShare}>
        <SquareArrowOutUpRight className='transition-all group-hover:text-blue-500' />
      </Button>
      <span className='pointer-events-none absolute -top-14 left-1/2 z-20 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-100'>
        Share
      </span>
    </div>
  )
}

export default ButtonShare
