'use client'

import React, { useMemo } from 'react'

import CommentItem from '@/components/comment/CommentItem'
import CommentSkeleton from '@/components/skeletons/CommentSkeleton'
import { Button } from '@/components/ui/button'

import { useInfiniteScrollComments } from '@/services/queries/comments.query'

interface CommentsProps {
  postId: string
  authorPostId: string
}

const Comments: React.FC<CommentsProps> = ({ postId, authorPostId }) => {
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteScrollComments(postId)

  const comments = useMemo(() => data?.pages.flatMap((page) => page.comments) || [], [data])

  if (isPending) return <CommentSkeleton />

  return (
    <div className='space-y-4'>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} authorPostId={authorPostId} level={1} />
      ))}
      {hasNextPage && (
        <Button
          variant='ghost'
          size={'sm'}
          onClick={() => fetchNextPage()}
          className='w-full'
          loading={isFetchingNextPage}
        >
          Load more comments
        </Button>
      )}
    </div>
  )
}

export default React.memo(Comments)
