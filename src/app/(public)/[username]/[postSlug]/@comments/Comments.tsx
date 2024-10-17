'use client'

import React, { useMemo } from 'react'

import CommentSkeleton from '@/components/skeletons/CommentSkeleton'

import { useInfiniteScrollComments } from '@/services/queries/comments'

import CommentItem from './CommentItem'

interface CommentsProps {
  postId: string
  authorPostId: string
}

const Comments: React.FC<CommentsProps> = ({ postId, authorPostId }) => {
  const { data, isPending, hasNextPage, fetchNextPage } = useInfiniteScrollComments(postId)

  const comments = useMemo(() => data?.pages.flatMap((page) => page.comments) || [], [data])

  if (isPending) return <CommentSkeleton />

  return (
    <div className='space-y-4'>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} authorPostId={authorPostId} level={1} />
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className='w-full py-2 text-sm text-blue-600 hover:text-blue-800'
        >
          Load more comments
        </button>
      )}
    </div>
  )
}

export default React.memo(Comments)
