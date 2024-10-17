'use client'

import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Icon from '@/components/ui/icon'

import { useDeleteComment, useInfiniteScrollCommentsChild } from '@/services/queries/comments'

import { CommentType } from '@/types/auth.type'

import { formatDate } from '@/lib/format'
import { checkImageURL, cn } from '@/lib/utils'

import FormComment from './FormComment'
import RenderComment from './renderComment'

interface CommentItemProps {
  comment: CommentType
  authorPostId: string
  level: number
}

const MAX_LV_CMT = 3

const CommentItem: React.FC<CommentItemProps> = ({ comment, authorPostId, level }) => {
  const [reply, setReply] = useState(false)
  const [update, setUpdate] = useState(false)
  const { mutate: deleteComment, isPending: isPendingDel } = useDeleteComment(comment)
  const { data, hasNextPage, fetchNextPage } = useInfiniteScrollCommentsChild(
    comment.id,
    comment.isHasChildComment || reply
  )

  const commentsChild = useMemo(() => data?.pages.flatMap((page) => page.comments) || [], [data])

  const handleDeleteComment = useCallback(() => {
    try {
      deleteComment(comment.id)
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }, [deleteComment, comment.id])

  const toggleReply = useCallback(() => setReply((prev) => !prev), [])
  const toggleUpdate = useCallback(() => setUpdate((prev) => !prev), [])

  const isAuthorComment = authorPostId === comment.userId
  const canReply = level < MAX_LV_CMT - 1

  return (
    <Card
      className={cn(
        'space-y-4 rounded-lg border-l-4 p-4 pb-0 pr-0 shadow-none',
        isAuthorComment ? 'border-l-blue-500' : 'border-l-gray-300'
      )}
    >
      <CardHeader className='flex flex-row items-center space-x-4 p-0 pr-4'>
        <Link href={`/${comment.userName}`} className='flex w-full items-center gap-2 md:gap-4'>
          <Avatar>
            <AvatarImage src={checkImageURL(comment.avatar)} alt={comment.userName} />
            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className='flex-1'>
            <h3 className='line-clamp-1 text-sm font-semibold'>{comment.name}</h3>
            <p className='text-xs text-gray-500'>{formatDate(comment.createdDate)}</p>
          </div>
        </Link>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='size-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={toggleUpdate}>{update ? 'Cancel' : 'Edit'}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteComment} disabled={isPendingDel}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className='p-0 pr-4'>
        {update ? (
          <FormComment
            postId={comment.postId}
            parentCommentId={comment.id}
            defaultValues={comment.content}
            type='UPDATE'
            commentId={comment.id}
            onSuccess={() => setUpdate(false)}
          />
        ) : (
          <RenderComment comment={comment} />
        )}
      </CardContent>
      <CardFooter className='flex justify-between p-0 pb-4 pr-4'>
        <Button variant='ghost' size='sm' className='text-gray-500'>
          <Icon name='ThumbsUp' className='mr-2 size-4' />
          Like
        </Button>
        <Button
          variant='ghost'
          size='sm'
          className={cn('text-gray-500', !canReply && 'cursor-not-allowed')}
          onClick={toggleReply}
          disabled={!canReply}
        >
          <Icon name='MessageSquare' className='mr-2 size-4' />
          Reply
        </Button>
      </CardFooter>

      {(reply || commentsChild.length > 0) && (
        <div className='space-y-4'>
          {reply && canReply && (
            <div className='mb-4'>
              <FormComment
                postId={comment.postId}
                parentCommentId={comment.id}
                onSuccess={() => setReply(false)}
              />
            </div>
          )}
          {commentsChild.map((commentChild) => (
            <CommentItem
              key={commentChild.id}
              comment={commentChild}
              authorPostId={authorPostId}
              level={level + 1}
            />
          ))}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              className='w-full py-2 text-sm text-blue-600 hover:text-blue-800'
            >
              Load more replies
            </button>
          )}
        </div>
      )}
    </Card>
  )
}

export default React.memo(CommentItem)
