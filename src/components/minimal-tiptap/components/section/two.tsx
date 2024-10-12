import type { Editor } from '@tiptap/react'
import { VariantProps } from 'class-variance-authority'
import * as React from 'react'

import Icon from '@/components/ui/icon'
import { toggleVariants } from '@/components/ui/toggle'

import { FormatAction } from '../../types'
import { ToolbarSection } from '../toolbar-section'

type TextStyleAction = 'bold' | 'italic' | 'strikethrough' | 'code' | 'clearFormatting'

interface TextStyle extends FormatAction {
  value: TextStyleAction
}

const formatActions: TextStyle[] = [
  {
    value: 'bold',
    label: 'Bold',
    icon: <Icon name='Bold' className='size-5' />,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleBold().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'B']
  },
  {
    value: 'italic',
    label: 'Italic',
    icon: <Icon name='Italic' className='size-5' />,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleItalic().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'I']
  },
  {
    value: 'strikethrough',
    label: 'Strikethrough',
    icon: <Icon name='Strikethrough' className='size-5' />,
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive('strike'),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleStrike().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'shift', 'S']
  },
  {
    value: 'code',
    label: 'Code',
    icon: <Icon name='CodeXml' className='size-5' />,
    action: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive('code'),
    canExecute: (editor) =>
      editor.can().chain().focus().toggleCode().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', 'E']
  },
  {
    value: 'clearFormatting',
    label: 'Clear formatting',
    icon: <Icon name='RemoveFormatting' className='size-5' />,
    action: (editor) => editor.chain().focus().unsetAllMarks().run(),
    isActive: () => false,
    canExecute: (editor) =>
      editor.can().chain().focus().unsetAllMarks().run() && !editor.isActive('codeBlock'),
    shortcuts: ['mod', '\\']
  }
]

interface SectionTwoProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
  activeActions?: TextStyleAction[]
  mainActionCount?: number
}

export const SectionTwo: React.FC<SectionTwoProps> = ({
  editor,
  activeActions = formatActions.map((action) => action.value),
  mainActionCount = 2,
  size,
  variant
}) => {
  return (
    <ToolbarSection
      editor={editor}
      actions={formatActions}
      activeActions={activeActions}
      mainActionCount={mainActionCount}
      dropdownIcon={<Icon name='Ellipsis' className='size-5' />}
      dropdownTooltip='More formatting'
      dropdownClassName='w-8'
      size={size}
      variant={variant}
    />
  )
}

SectionTwo.displayName = 'SectionTwo'

export default SectionTwo
