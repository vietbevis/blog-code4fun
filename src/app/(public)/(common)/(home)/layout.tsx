import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import Image from 'next/image'
import React from 'react'

import PostService from '@/services/post'

import { EKeyQuery } from '@/constants/enum'

import { getQueryClient } from '@/lib/getQueryClient'

const layout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [EKeyQuery.FEED_POSTS],
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
    <>
      <Image
        src={'/banner.gif'}
        alt='banner'
        width={500}
        height={300}
        unoptimized
        className='aspect-video w-full overflow-hidden rounded-lg'
      />
      <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
    </>
  )
}

export default layout
