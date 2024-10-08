import React from 'react'
import { create } from 'zustand'

type DialogType = 'Unauthorized' | 'ConfirmExit' | 'Network' | null

interface DialogState {
  isOpen: boolean
  content: React.ReactNode | null
  type: DialogType
  onOpenChange: (isOpen: boolean) => void
  close: () => void
  openDialog: ({
    type,
    content
  }: {
    type: DialogType
    content?: React.ReactNode
  }) => void
}

const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  content: null,
  type: null,
  onOpenChange: (isOpen) => set({ isOpen }),
  close: () => set({ isOpen: false }),
  openDialog: ({ type, content }) =>
    set({
      content: content,
      type: type || 'Unauthorized',
      isOpen: true
    })
}))

export default useDialogStore
