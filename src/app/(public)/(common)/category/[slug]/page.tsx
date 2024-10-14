import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import PostList from '@/components/post/PostList'

import PostService from '@/services/post'

import { EKeyQuery } from '@/constants/enum'

import { getQueryClient } from '@/lib/getQueryClient'

export async function generateStaticParams() {
  return []
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: [EKeyQuery.FEED_POSTS, params.slug],
    queryFn: async ({ pageParam }) => {
      const { payload } = await PostService.getPostsByFilters({
        categoryName: params.slug,
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
      <PostList params={{ categoryName: params.slug }} />
    </HydrationBoundary>
  )
}
