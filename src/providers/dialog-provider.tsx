'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import useDialogStore from '@/stores/dialog.store'

const DialogProvider = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const { isOpen, onOpenChange, type } = useDialogStore()
  return (
    <>
      {children}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger className='hidden'></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className='hidden'></DialogTitle>
            <DialogDescription className='hidden'></DialogDescription>
            {type === 'Unauthorized' && <DialogUnauthorized />}
            {type === 'ConfirmExit' && <DialogConfirmExit />}
            {type === 'Network' && <p>Network disconnect</p>}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DialogProvider

function DialogUnauthorized() {
  const onOpenChange = useDialogStore((state) => state.onOpenChange)
  const router = useRouter()
  return (
    <>
      <h1 className='text-2xl font-semibold'>Unauthorized</h1>
      <p className='mt-2'>You are not authorized to access this page.</p>
      <div className='ml-auto flex items-center gap-2 pt-4'>
        <Button
          variant={'destructive'}
          size={'sm'}
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          size={'sm'}
          onClick={() => {
            onOpenChange(false)
            router.push('/login')
          }}
        >
          Login
        </Button>
      </div>
    </>
  )
}

function DialogConfirmExit() {
  const onOpenChange = useDialogStore((state) => state.onOpenChange)
  const router = useRouter()
  return (
    <>
      <h1 className='text-2xl font-semibold'>Confirm Exit</h1>
      <p className='mt-2'>Are you sure you want to exit?</p>
      <div className='ml-auto flex items-center gap-2 pt-4'>
        <Button
          variant={'destructive'}
          size={'sm'}
          onClick={() => onOpenChange(false)}
        >
          No
        </Button>
        <Button
          size={'sm'}
          onClick={() => {
            onOpenChange(false)
            router.replace('/')
          }}
        >
          Yes
        </Button>
      </div>
    </>
  )
}
