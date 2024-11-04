'use client'

// COMMONS
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

// STORES
// COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import useDialogStore from '@/stores/dialog.store'

import { setUrlToLocalStorage } from '@/lib/utils'

import { Button } from '../ui/button'

const CustomDialog = () => {
  const { isOpen, onOpenChange, type } = useDialogStore()
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className='hidden'></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='hidden'></DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
          {type === 'Unauthorized' && <DialogUnauthorized />}
          {type === 'ConfirmExit' && <DialogConfirmExit />}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CustomDialog

function DialogUnauthorized() {
  const onOpenChange = useDialogStore((state) => state.onOpenChange)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fullUrl = pathname + searchParams
  return (
    <>
      <h1 className='text-2xl font-semibold'>Notice</h1>
      <p className='mt-2'>Please log in to use this feature.</p>
      <div className='ml-auto flex items-center gap-2 pt-4'>
        <Button variant={'destructive'} size={'sm'} onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          size={'sm'}
          onClick={() => {
            setUrlToLocalStorage(fullUrl)
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
        <Button variant={'destructive'} size={'sm'} onClick={() => onOpenChange(false)}>
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
