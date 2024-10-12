'use client'

import React, { ReactElement, ReactNode, isValidElement } from 'react'

import useAuthStore from '@/stores/auth.store'
import useDialogStore from '@/stores/dialog.store'

interface UnauthenticatedWrapperProps {
  children: ReactNode
}

const UnauthenticatedWrapper = ({ children }: UnauthenticatedWrapperProps) => {
  const { isAuth } = useAuthStore()
  const { openDialog } = useDialogStore()

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuth) {
      e.preventDefault()
      openDialog({ type: 'Unauthorized' })
    }
  }

  if (isValidElement(children)) {
    return React.cloneElement(children as ReactElement, {
      onClick: (e: React.MouseEvent) => {
        handleClick(e)
        if (typeof children.props.onClick === 'function') {
          children.props.onClick(e)
        }
      }
    })
  }

  return <>{children}</>
}

export default UnauthenticatedWrapper
