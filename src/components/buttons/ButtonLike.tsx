'use client'

import React from 'react'

import { useDetailPost, useLikePost } from '@/services/queries/post.query'

import useAuthStore from '@/stores/auth.store'
import useDialogStore from '@/stores/dialog.store'

import { PostType } from '@/types/auth.type'

import { cn } from '@/lib/utils'

import { IconSparkleHeart } from '../icons'
import { Button } from '../ui/button'
import Icon from '../ui/icon'

interface ButtonLikeProps {
  post: PostType
}

const ButtonLike: React.FC<ButtonLikeProps> = React.memo(({ post }) => {
  const { id: postId, slug } = post
  const { isAuth } = useAuthStore()
  const { openDialog } = useDialogStore()

  const { data, isPending: isLoading } = useDetailPost({ slug })
  const { mutate, isPending } = useLikePost({ slug })

  const totalLike = data?.favourite ?? 0
  const favoriteType = data?.favoriteType ?? 'UNLIKE'

  const handleLikePost = React.useCallback(() => {
    if (!isPending && isAuth) {
      mutate(postId)
    } else if (!isAuth) {
      openDialog({ type: 'Unauthorized' })
    }
  }, [isPending, isAuth, mutate, postId, openDialog])

  const buttonClasses = cn(
    'group relative flex items-center sm:flex-col',
    isPending && 'opacity-50'
  )

  return (
    <div className={buttonClasses} onClick={handleLikePost} aria-disabled={isPending || isLoading}>
      <Button variant='ghost' size='icon' disabled={isPending || isLoading}>
        {favoriteType === 'LIKE' ? (
          <IconSparkleHeart />
        ) : (
          <Icon name='Heart' className='size-6 transition-all group-hover:text-red-500' />
        )}
      </Button>
      <span className='pointer-events-none absolute -top-14 left-1/2 z-20 -translate-x-1/2 scale-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform duration-300 ease-in-out group-hover:scale-100'>
        Like
      </span>
      <span>{totalLike}</span>
    </div>
  )
})

ButtonLike.displayName = 'ButtonLike'

export default ButtonLike
