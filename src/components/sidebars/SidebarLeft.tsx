'use client'

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useTags } from '@/services/queries/post.query'

import { useHeadroom } from '@/hooks/useHeadroom'

import { cn, replaceSpecialChars } from '@/lib/utils'

import { IconHome, IconJS, IconJava, IconJenkins } from '../icons'
import ItemSidebarLeft from './ItemSidebarLeft'

const menuHomePage = [
  { id: uuidv4(), title: 'Home', icon: <IconHome width={28} height={28} />, url: '/' },
  // { id: uuidv4(), title: 'Following', icon: <IconFollow width={28} height={28} />, url: '/' },
  { id: uuidv4(), title: 'Java', icon: <IconJava width={28} height={28} />, url: '/category/Java' },
  {
    id: uuidv4(),
    title: 'Javascript',
    icon: <IconJS width={28} height={28} />,
    url: '/category/JavaScript'
  },
  {
    id: uuidv4(),
    title: 'DevOps',
    icon: <IconJenkins width={28} height={28} />,
    url: '/category/Devops'
  }
]

export default function SidebarLeft({ className }: { className?: string }) {
  const pinned = useHeadroom({ fixedAt: 80 })
  const { data } = useTags()

  return (
    <div
      className={cn(
        'flex h-auto flex-col space-y-2 overflow-y-auto transition-all duration-300 md:sticky md:left-0 md:space-y-4',
        pinned ? 'md:top-20' : 'md:top-4',
        pinned ? 'md:h-[calc(100dvh-6rem)]' : 'md:h-[calc(100dvh-2rem)]',
        className
      )}
    >
      <div className='flex flex-col gap-2 rounded-lg border border-input bg-card p-2 py-3'>
        {menuHomePage.map((item) => (
          <ItemSidebarLeft data={item} key={item.id} />
        ))}
      </div>
      {/* Tags */}
      {data && (
        <div className='flex grow flex-col overflow-hidden rounded-lg border border-input bg-card p-2 py-3'>
          <h4 className='px-4 py-2 text-xl font-bold'>Related tags</h4>
          <div className='flex max-h-80 flex-col gap-2 overflow-hidden hover:overflow-y-auto'>
            {data.payload.details.map((item) => (
              <ItemSidebarLeft
                data={{
                  id: item,
                  title: `#${item}`,
                  url: `/tag/${replaceSpecialChars(item)}`
                }}
                key={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
