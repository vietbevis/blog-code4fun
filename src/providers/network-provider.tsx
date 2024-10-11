'use client'

import React, { useEffect } from 'react'
import { toast } from 'sonner'

import useDialogStore from '@/stores/dialog.store'

import { useNetwork } from '@/hooks/useNetwork'

import Loading from '@/app/loading'

const NetworkProvider = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const networkStatus = useNetwork()
  const [oldStatus, setOldStatus] = React.useState(networkStatus.online)
  const { close, openDialog } = useDialogStore()

  useEffect(() => {
    // Khi mạng mất
    if (oldStatus && !networkStatus.online) {
      openDialog({ type: 'Network' })
      toast.error('Bạn đang offline', {
        duration: 5000
      })
    }

    // Khi mạng trở lại
    if (!oldStatus && networkStatus.online) {
      close()
      toast.success('Mạng đã có trở lại', {
        duration: 3000
      })
    }

    // Cập nhật trạng thái cũ
    setOldStatus(networkStatus.online)
  }, [close, networkStatus.online, oldStatus, openDialog])

  if (!networkStatus.online) return <Loading />

  return children
}

export default NetworkProvider
