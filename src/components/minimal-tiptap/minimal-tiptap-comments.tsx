'use client'

import { EditorContent } from '@tiptap/react'
import { Content, Editor } from '@tiptap/react'
import * as React from 'react'

import useLoadingStore from '@/stores/loading'

import { useHeadroom } from '@/hooks/useHeadroom'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import Icon from '../ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu'
import EmojiPicker from './components/emoji'
import SectionFive from './components/section/five'
import { SectionTwo } from './components/section/two'
import { UseMinimalTiptapEditorProps, useMinimalTiptapEditor } from './hooks/use-minimal-tiptap'
import './styles/index.css'

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
}

const Toolbar = ({ editor }: { editor: Editor }) => {
  const pinned = useHeadroom({ fixedAt: 80 })
  const { isLoading } = useLoadingStore()
  return (
    <div
      className={cn(
        'shrink-0 overflow-x-auto rounded-t-md border-b border-accent-foreground/40 bg-card p-1 transition-all duration-300',
        pinned ? 'top-16' : 'top-0'
      )}
    >
      <div className='flex w-full items-center gap-px'>
        <SectionTwo
          editor={editor}
          activeActions={['bold', 'italic', 'code']}
          mainActionCount={3}
        />

        <SectionFive editor={editor} activeActions={['codeBlock']} mainActionCount={1} />

        <Popover>
          <PopoverTrigger asChild>
            <Button size='icon' variant='ghost' className='size-8'>
              <Icon name='Smile' className='size-5' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto rounded-xl p-1'>
            <EmojiPicker editor={editor} />
          </PopoverContent>
        </Popover>
        <div className='flex flex-1 justify-end'>
          <Button
            className='gap-2'
            size={'sm'}
            disabled={isLoading || editor.isEmpty || editor.getText().trim().length <= 5}
            type='submit'
          >
            Publish
            <Icon name='SendHorizontal' className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export const MinimalTiptapCommentsEditor = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props
    })

    if (!editor) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-auto min-h-32 w-full flex-col rounded-md border border-accent-foreground/40 shadow-sm',
          className
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className={cn('minimal-tiptap-editor', editorContentClassName)}
        />
        <LinkBubbleMenu editor={editor} />
      </div>
    )
  }
)

MinimalTiptapCommentsEditor.displayName = 'MinimalTiptapCommentsEditor'

export default MinimalTiptapCommentsEditor
