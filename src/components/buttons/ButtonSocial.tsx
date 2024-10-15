import Link from 'next/link'
import React from 'react'

import { Button } from '../ui/button'

const ButtonSocial = ({
  url,
  icon,
  title
}: {
  url: string
  icon: React.ReactNode
  title: string
}) => {
  return (
    <Link href={url} target='_blank' className='group relative inline-block'>
      <Button variant={'outline'} size={'icon'}>
        {icon}
      </Button>
      <span className='absolute -top-14 left-1/2 z-20 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-100'>
        {title}
      </span>
    </Link>
  )
}

export default ButtonSocial
