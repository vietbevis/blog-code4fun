'use client'

import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'

import { useAccountMe, useAccountUser, useFollowUser } from '@/services/queries/account.query'

import useAuthStore from '@/stores/auth.store'
import useDialogStore from '@/stores/dialog.store'

import { AccountType } from '@/types/auth.type'

import ROUTES from '@/constants/route'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'

type ButtonFollowProps = {
  createdBy: AccountType
  className?: string
}

export default function ButtonFollow({ createdBy, className }: ButtonFollowProps) {
  const { isAuth } = useAuthStore()
  const { openDialog } = useDialogStore()
  const router = useRouter()

  const { userName: username, id: authorId } = createdBy

  const { data: profileAuthor, isPending: isFetchingAuthor } = useAccountUser(username)
  const { data: meProfile, isPending: isFetchingProfile } = useAccountMe()
  const { mutate: followUser, isPending } = useFollowUser({ username })

  const isSelf = useMemo(
    () => isAuth && meProfile?.id === createdBy.id,
    [isAuth, meProfile?.id, createdBy.id]
  )
  const followType = profileAuthor?.followType || 'UNFOLLOW'

  const handleFollowPost = useCallback(() => {
    if (!isAuth) {
      openDialog({ type: 'Unauthorized' })
    } else if (isSelf) {
      router.push(`${ROUTES.PROFILE}`)
    } else if (!isPending) {
      followUser(authorId)
    }
  }, [isAuth, isSelf, isPending, openDialog, router, followUser, authorId])

  const buttonText = useMemo(() => {
    if (isFetchingAuthor || isFetchingProfile) return 'Follow'
    if (isSelf) return 'Change profile'
    return followType === 'FOLLOW' ? 'Unfollow' : 'Follow'
  }, [isFetchingAuthor, isFetchingProfile, isSelf, followType])

  return (
    <Button
      className={cn('w-full capitalize', className)}
      onClick={handleFollowPost}
      disabled={isPending || isFetchingAuthor}
    >
      {buttonText}
    </Button>
  )
}
