import type { Editor } from '@tiptap/react'
import { VariantProps } from 'class-variance-authority'
import { common, createLowlight } from 'lowlight'
import * as React from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import Icon from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toggleVariants } from '@/components/ui/toggle'

import { cn } from '@/lib/utils'

import { ToolbarButton } from '../toolbar-button'

interface CodeBlockPopoverProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

const listLanguages = createLowlight(common).listLanguages()

const CodeBlockPopover = ({ editor, size, variant }: CodeBlockPopoverProps) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  const onSetLanguage = React.useCallback(
    (language: string) => {
      if (language === '') {
        editor.chain().focus().toggleCodeBlock().run()
        return
      }
      editor.chain().focus().setCodeBlock({ language }).run()
    },
    [editor]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          isActive={editor.isActive('codeBlock')}
          tooltip='Code Block'
          aria-label='Insert code block'
          disabled={editor.isActive('numberList') || editor.isActive('bulletList')}
          size={size}
          variant={variant}
        >
          <Icon name='CodeXml' className='size-5' />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent
        className='flex max-h-96 w-full min-w-48 flex-col gap-1 overflow-y-auto p-1'
        align='center'
        side='bottom'
      >
        <Command>
          <CommandInput placeholder='Search language...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {listLanguages.map((language) => (
                <CommandItem
                  key={language}
                  value={language}
                  className='w-full shrink-0 justify-start text-start text-sm'
                  onSelect={(currentValue) => {
                    onSetLanguage(currentValue === value ? '' : currentValue)
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {language}
                  <Icon
                    name='Check'
                    className={cn(
                      'ml-auto size-4',
                      value === language ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { CodeBlockPopover }
