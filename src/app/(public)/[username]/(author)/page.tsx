import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import React from 'react'

import PostList from '@/components/post/PostList'

import PostService from '@/services/post'

import { EKeyQuery } from '@/constants/enum'

import { getQueryClient } from '@/lib/getQueryClient'

export async function generateStaticParams() {
  return []
}

const AuthorPage = async ({ params }: { params: { username: string } }) => {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [EKeyQuery.FEED_POSTS, params.username],
    queryFn: async ({ pageParam }) => {
      const { payload } = await PostService.getPostsByFilters({
        userName: params.username,
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostList params={{ userName: params.username }} />
    </HydrationBoundary>
  )
}

export default AuthorPage
