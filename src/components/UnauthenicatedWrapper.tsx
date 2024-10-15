'use client'

import React, { ReactNode, isValidElement } from 'react'

import useAuthStore from '@/stores/auth.store'
import useDialogStore from '@/stores/dialog.store'

import { cn } from '@/lib/utils'

interface UnauthenticatedWrapperProps {
  children: ReactNode
}

const UnauthenticatedWrapper = ({ children }: UnauthenticatedWrapperProps) => {
  const { isAuth } = useAuthStore()
  const { openDialog } = useDialogStore()

  const handleAction = (e: React.SyntheticEvent) => {
    if (!isAuth) {
      e.preventDefault()
      e.stopPropagation()
      openDialog({ type: 'Unauthorized' })
    }
  }

  if (isValidElement(children)) {
    return (
      <div
        onClick={handleAction}
        onMouseDown={handleAction}
        onKeyDown={handleAction}
        onTouchStart={handleAction}
        className={cn(isAuth ? 'cursor-auto' : 'cursor-not-allowed')}
      >
        {children}
      </div>
    )
  }

  return <>{children}</>
}

export default UnauthenticatedWrapper
