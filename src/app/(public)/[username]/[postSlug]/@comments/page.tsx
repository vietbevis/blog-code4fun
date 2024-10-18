import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import React from 'react'

import CommentService from '@/services/comment.service'

import { PostType } from '@/types/auth.type'

import { getQueryClient } from '@/lib/getQueryClient'

import { getPostDetails } from '../layout'
import Comments from './Comments'
import FormComment from './FormComment'

const CommentPage = async ({ params }: { params: { username: string; postSlug: string } }) => {
  let post: PostType
  try {
    post = await getPostDetails(params.postSlug)
  } catch (error) {
    console.error('Error fetching data:', error)
    notFound()
  }

  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['comments', post.id],
    queryFn: async ({ pageParam }) => {
      const { payload } = await CommentService.getComments(post.id, { offset: pageParam, limit: 5 })
      return {
        comments: payload.details.records,
        nextPage: payload.details.offset + 1,
        totalPage: payload.details.totalPage
      }
    },
    initialPageParam: 0
  })

  return (
    <div className='space-y-4'>
      <FormComment postId={post.id} level={1} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Comments postId={post.id} authorPostId={post.createdBy.id} />
      </HydrationBoundary>
    </div>
  )
}

export default CommentPage
