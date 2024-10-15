'use client'

import React from 'react'

import { useInfiniteScrollComments } from '@/services/queries/comments'

import CommentItem from './CommentItem'

const Comments = ({ postId, authorPostId }: { postId: string; authorPostId: string }) => {
  const { data } = useInfiniteScrollComments(postId)
  const comments = data?.pages.flatMap((page) => page.comments) || []

  return (
    <div className='space-y-4'>
      {comments.map((comment) => {
        return (
          <CommentItem key={comment.id} comment={comment} parentId='' authorPostId={authorPostId} />
        )
      })}
    </div>
  )
}

export default Comments
