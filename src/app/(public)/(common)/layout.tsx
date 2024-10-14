import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import React from 'react'

import SidebarLeft from '@/components/sidebars/SidebarLeft'
import SidebarRight from '@/components/sidebars/SidebarRight'

import PostService from '@/services/post'

import { EKeyQuery } from '@/constants/enum'

import { getQueryClient } from '@/lib/getQueryClient'

const layout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: [EKeyQuery.TAGS],
    queryFn: PostService.getTags
  })

  return (
    <div className='grid grid-cols-2 items-start gap-4 py-4 md:grid-cols-3 xl:grid-cols-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarLeft className='hidden md:block' />
      </HydrationBoundary>
      <div className='col-span-2 flex flex-col gap-4'>{children}</div>
      <SidebarRight className='hidden md:block' />
    </div>
  )
}

export default layout
