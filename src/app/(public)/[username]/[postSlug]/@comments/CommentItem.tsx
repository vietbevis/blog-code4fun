'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'

import { useInfiniteScrollCommentsChild } from '@/services/queries/comments'

import { CommentType } from '@/types/auth.type'

import { cn } from '@/lib/utils'

import FormComment from './FormComment'

const CommentItem = ({
  comment,
  parentId,
  authorPostId
}: {
  comment: CommentType
  parentId: string
  authorPostId: string
}) => {
  const [reply, setReply] = useState(false)
  const { data } = useInfiniteScrollCommentsChild(comment.id, comment.isHasChildComment || false)
  const commentsChild = data?.pages.flatMap((page) => page.comments) || []

  return (
    <div>
      <div
        className={cn(
          'border-l-4 pl-4',
          authorPostId === comment.userId ? 'border-blue-300' : 'border-gray-700'
        )}
      >
        Comment Item {comment.content}
        <p>ParentId {parentId}</p>
        <Button onClick={() => setReply(!reply)}>Reply</Button>
      </div>
      {reply && <FormComment postId={comment.postId} parentCommentId={comment.id} />}
      {commentsChild.length > 0 && (
        <div className='ml-5 mt-4 space-y-4'>
          {commentsChild.map((commentChild) => (
            <CommentItem
              key={commentChild.id}
              comment={commentChild}
              parentId={comment.id}
              authorPostId={authorPostId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem
