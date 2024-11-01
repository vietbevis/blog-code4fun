'use client'

import { EditorContent } from '@tiptap/react'
import { Content, Editor } from '@tiptap/react'
import * as React from 'react'

import { Separator } from '@/components/ui/separator'

import { useHeadroom } from '@/hooks/useHeadroom'

import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import Icon from '../ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ImageBubbleMenu } from './components/bubble-menu/image-bubble-menu'
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu'
import EmojiPicker from './components/emoji'
import { SectionFive } from './components/section/five'
import { SectionFour } from './components/section/four'
import { SectionOne } from './components/section/one'
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
  return (
    <div
      className={cn(
        'sticky inset-x-0 z-50 shrink-0 overflow-x-auto rounded-t-md border-b border-border bg-card p-1 transition-all duration-300',
        pinned ? 'top-16' : 'top-0'
      )}
    >
      <div className='flex w-max items-center gap-px'>
        <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

        <Separator orientation='vertical' className='mx-2 h-7' />

        <SectionTwo
          editor={editor}
          activeActions={['bold', 'italic', 'strikethrough', 'code', 'clearFormatting']}
          mainActionCount={5}
        />

        <Separator orientation='vertical' className='mx-2 h-7' />

        <SectionFour
          editor={editor}
          activeActions={['orderedList', 'bulletList']}
          mainActionCount={2}
        />

        <Separator orientation='vertical' className='mx-2 h-7' />

        <SectionFive
          editor={editor}
          activeActions={['codeBlock', 'blockquote', 'horizontalRule']}
          mainActionCount={3}
        />

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
      </div>
    </div>
  )
}

export const MinimalTiptapEditor = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      enableInputRules: true,
      enablePasteRules: true,
      ...props
    })

    if (!editor) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-accent-foreground/40',
          className
        )}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className={cn('minimal-tiptap-editor', editorContentClassName)}
        />
        <LinkBubbleMenu editor={editor} />
        <ImageBubbleMenu editor={editor} />
      </div>
    )
  }
)

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor'

export default MinimalTiptapEditor
