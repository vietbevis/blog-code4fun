'use client'

import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'

import UnauthenticatedWrapper from '@/components/UnauthenicatedWrapper'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useDeleteComment, useInfiniteScrollCommentsChild } from '@/services/queries/comments.query'

import envConfig from '@/configs/envConfig'

import useAuthStore from '@/stores/auth.store'
import useLoadingStore from '@/stores/loading'

import { CommentType } from '@/types/auth.type'

import RenderComment from '@/app/(public)/[username]/[postSlug]/@comments/renderComment'
import { formatDate } from '@/lib/format'
import { checkImageURL, cn } from '@/lib/utils'

import FormComment from './FormComment'

interface CommentItemProps {
  comment: CommentType
  authorPostId: string
  level: number
}

const MAX_LV_CMT = envConfig.NEXT_PUBLIC_LEVEL_COMMENT_MAX

const CommentItem: React.FC<CommentItemProps> = ({ comment, authorPostId, level }) => {
  const [reply, setReply] = useState(false)
  const [update, setUpdate] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const { setIsLoading } = useLoadingStore()
  const { userId } = useAuthStore()
  const { mutate: deleteComment, isPending: isPendingDel } = useDeleteComment(comment, level)
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteScrollCommentsChild(
    comment.id,
    reply || showMore
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
  const toggleShowMore = useCallback(() => setShowMore((prev) => !prev), [])

  const isAuthorComment = authorPostId === comment.userId
  const canReply = level < MAX_LV_CMT
  const canEditAndDelete = userId === comment.userId

  const handleSuccess = useCallback(() => {
    setIsLoading(false)
    setReply(false)
    setShowMore(true)
    setUpdate(false)
  }, [setIsLoading])

  return (
    <Card
      className={cn(
        'space-y-4 rounded-lg border-l-4 p-4 pb-0 pr-0 shadow-none',
        isAuthorComment ? 'border-l-blue-500' : 'border-l-gray-300'
      )}
    >
      <CardHeader className='flex flex-row items-center justify-between space-x-4 p-0 pr-4'>
        <Link href={`/${comment.userName}`} className='flex items-center gap-2 md:gap-4'>
          <Avatar className='hidden md:flex'>
            <AvatarImage src={checkImageURL(comment.avatar)} alt={comment.userName} />
            <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className='flex-1'>
            <h3 className='line-clamp-1 text-sm font-semibold'>{comment.name}</h3>
            <p className='text-xs text-gray-500'>
              {formatDate(comment.createdDate)}
              {isAuthorComment && ' - Author'}
            </p>
          </div>
        </Link>
        <div className='flex items-center gap-2'>
          {(commentsChild.length > 0 || comment.isHasChildComment) && (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  onClick={toggleShowMore}
                  disabled={isFetching}
                >
                  <Icon name={showMore ? 'ChevronsDownUp' : 'ChevronsUpDown'} className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showMore ? 'Hide reply' : 'Show more reply'}</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canEditAndDelete && (
            <UnauthenticatedWrapper>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreHorizontal className='size-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={toggleUpdate}>
                    {update ? 'Cancel' : 'Edit'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteComment} disabled={isPendingDel}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </UnauthenticatedWrapper>
          )}
        </div>
      </CardHeader>
      <CardContent className='p-0 pr-4'>
        {update ? (
          <FormComment
            postId={comment.postId}
            parentCommentId={comment.id}
            defaultValues={comment.content}
            type='UPDATE'
            commentId={comment.id}
            onSuccess={handleSuccess}
            level={level}
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
        <UnauthenticatedWrapper>
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
        </UnauthenticatedWrapper>
      </CardFooter>

      {(reply || commentsChild.length > 0) && ((reply && canReply) || showMore || hasNextPage) && (
        <div className='space-y-4 md:ml-4'>
          {reply && canReply && (
            <div className='mb-4'>
              <FormComment
                postId={comment.postId}
                parentCommentId={comment.id}
                onSuccess={handleSuccess}
                level={level + 1}
              />
            </div>
          )}
          {showMore &&
            commentsChild.map((commentChild) => (
              <CommentItem
                key={commentChild.id}
                comment={commentChild}
                authorPostId={authorPostId}
                level={level + 1}
              />
            ))}
          {hasNextPage && (
            <div className='flex items-center gap-4 pb-4 pr-4'>
              <Button
                variant={'ghost'}
                size={'sm'}
                onClick={() => fetchNextPage()}
                className='w-full'
              >
                Load more replies
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default React.memo(CommentItem)
