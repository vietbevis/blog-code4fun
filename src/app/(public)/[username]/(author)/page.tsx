import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import React from 'react'

import PostList from '@/components/post/PostList'

import AccountService from '@/services/account.service'
import PostService from '@/services/post'

import envConfig from '@/configs/envConfig'

import { AccountType } from '@/types/auth.type'

import { EKeyQuery } from '@/constants/enum'

import { getQueryClient } from '@/lib/getQueryClient'
import { checkImageURL } from '@/lib/utils'
import { baseOpenGraph } from '@/shared-metadata'

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: { username: string } }) {
  let user: AccountType | null = null
  try {
    const data = await AccountService.getUser(params.username)
    user = data.payload.details
  } catch (error) {
    console.log('🚀 ~ file: page.tsx:30 ~ generateMetadata ~ error:', error)
  }

  const url = `${envConfig.NEXT_PUBLIC_API_URL}/${params.username}`

  return {
    title: user ? `${user.name}'s Posts` : 'Author not found',
    description: user ? (user.profile?.bio ? user.profile.bio : '') : '',
    openGraph: {
      ...baseOpenGraph,
      title: user ? `${user.name}'s Posts` : 'Author not found',
      description: user ? (user.profile?.bio ? user.profile.bio : '') : '',
      url,
      images: user ? [{ url: checkImageURL(user.profile?.avatarUrl) }] : []
    },
    alternates: {
      canonical: url
    }
  }
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
