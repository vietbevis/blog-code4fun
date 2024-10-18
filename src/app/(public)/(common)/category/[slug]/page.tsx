import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import PostList from '@/components/post/PostList'

import PostService from '@/services/post.service'

import envConfig from '@/configs/envConfig'

import { EKeyQuery } from '@/constants/enum'

import { getQueryClient } from '@/lib/getQueryClient'
import { baseOpenGraph } from '@/shared-metadata'

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const url = `${envConfig.NEXT_PUBLIC_API_URL}` + `/category/${params.slug}`

  return {
    title: params.slug,
    description: params.slug,
    openGraph: {
      ...baseOpenGraph,
      title: params.slug,
      description: params.slug,
      url,
      images: [{ url: envConfig.NEXT_PUBLIC_API_URL + '/logo.png' }]
    },
    alternates: {
      canonical: url
    }
  }
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
