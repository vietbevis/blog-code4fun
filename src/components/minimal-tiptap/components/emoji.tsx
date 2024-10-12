'use client'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Editor } from '@tiptap/core'
import { useTheme } from 'next-themes'
import React from 'react'

const EmojiPicker = ({ editor }: { editor: Editor }) => {
  const { theme } = useTheme()

  const addEmoji = (emoji: any) => {
    editor.chain().focus().insertContent(emoji.native).run()
  }

  return <Picker data={data} onEmojiSelect={addEmoji} theme={theme} />
}

export default EmojiPicker
