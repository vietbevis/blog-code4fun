import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import React from 'react'

import SidebarLeft from '@/components/sidebars/SidebarLeft'
import SidebarRight from '@/components/sidebars/SidebarRight'

import AccountService from '@/services/account.service'
import PostService from '@/services/post.service'

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

  await queryClient.prefetchQuery({
    queryKey: [EKeyQuery.TOP_USERS],
    queryFn: () => AccountService.getTopUsers()
  })

  return (
    <div className='grid grid-cols-4 items-start gap-4 py-4'>
      <div className='col-span-4 flex gap-4 xl:col-span-3'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <SidebarLeft className='hidden basis-[27%] md:block' />
        </HydrationBoundary>
        <div className='col-span-2 flex flex-1 flex-col gap-4 md:col-span-3'>{children}</div>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarRight className='hidden xl:block' />
      </HydrationBoundary>
    </div>
  )
}

export default layout
