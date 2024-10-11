import Link from 'next/link'
import React from 'react'

import { buttonVariants } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const ItemSidebarLeft = ({
  className,
  data
}: {
  className?: string
  data: {
    id: string
    title: string
    icon?: React.ReactNode
    url: string
  }
}) => {
  return (
    <Link
      href={data.url}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'w-full justify-start gap-2 rounded-md px-4 py-2 text-base transition-colors duration-0 hover:bg-primary/10',
        className
      )}
    >
      {data.icon && data.icon}
      {data.title}
    </Link>
  )
}

export default ItemSidebarLeft
