import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Button } from '../ui/button'

const ButtonComment = ({ totalComments }: { totalComments?: number }) => {
  return (
    <div className='group relative flex items-center sm:flex-col'>
      <Button variant={'ghost'} size={'icon'}>
        <Link href={'#comments'}>
          <MessageCircle className='transition-all group-hover:text-red-500' />
        </Link>
      </Button>
      <span className='pointer-events-none absolute -top-14 left-1/2 z-20 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-100'>
        Comments
      </span>
      {totalComments && <span>{totalComments}</span>}
    </div>
  )
}

export default ButtonComment
