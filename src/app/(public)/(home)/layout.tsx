import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import Image from 'next/image'
import React from 'react'

import SidebarLeft from '@/components/sidebars/SidebarLeft'
import SidebarRight from '@/components/sidebars/SidebarRight'

import PostService from '@/services/post'

const layout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['tags'],
    queryFn: PostService.getTags
  })
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['feed-posts'],
    queryFn: async ({ pageParam }) => {
      const { payload } = await PostService.getPostsByFilters({
        offset: pageParam
      })
      return {
        posts: payload.details.records,
        nextPage: payload.details.offset + 1,
        totalPage: payload.details.totalPage
      }
    },
    initialPageParam: 0
  })
  return (
    <div className='grid grid-cols-2 items-start gap-4 py-4 md:grid-cols-3 xl:grid-cols-4'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SidebarLeft className='hidden md:block' />
        <div className='col-span-2 flex flex-col gap-4'>
          <Image
            src={'/banner.gif'}
            alt='banner'
            width={500}
            height={300}
            unoptimized
            className='aspect-video w-full overflow-hidden rounded-lg'
          />
          {children}
        </div>
      </HydrationBoundary>
      <SidebarRight className='hidden md:block' />
    </div>
  )
}

export default layout
