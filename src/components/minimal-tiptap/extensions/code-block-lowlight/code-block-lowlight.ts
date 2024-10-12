import { CodeBlockLowlight as TiptapCodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'

export const CodeBlockLowlight = TiptapCodeBlockLowlight.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      lowlight: createLowlight(all),
      defaultLanguage: 'javascript',
      HTMLAttributes: {
        class: 'block-node'
      }
    }
  }
})

export default CodeBlockLowlight
