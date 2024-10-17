import type { Editor } from '@tiptap/react'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { cn } from '@/lib/utils'

interface ImageEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor
  close: () => void
}

export default function ImageEditBlock({
  editor,
  className,
  close,
  ...props
}: ImageEditBlockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [link, setLink] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isValidImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  const convertImageUrlToDataUrl = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = url
    })
  }

  const isImageFile = (file: File): boolean => {
    const acceptedTypes = ['image/jpeg', 'image/png']
    return acceptedTypes.includes(file.type)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    fileInputRef.current?.click()
  }

  const handleLink = async () => {
    setIsLoading(true)
    try {
      const isValid = await isValidImageUrl(link)
      if (isValid) {
        const dataUrl = await convertImageUrlToDataUrl(link)
        editor.chain().setImage({ src: dataUrl }).focus().run()
        close()
      } else {
        toast.error('Invalid image URL')
      }
    } catch (error) {
      console.error('Error processing image URL:', error)
      toast.error('An error occurred while processing the image URL.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    if (!isImageFile(file)) {
      toast.error('Please upload a JPG or PNG image file.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      editor.chain().setImage({ src }).focus().run()
    }
    reader.readAsDataURL(file)
    close()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleLink()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn('space-y-6', className)} {...props}>
        <div className='space-y-1'>
          <Label>Attach an image link</Label>
          <div className='flex'>
            <Input
              type='url'
              required
              placeholder='https://example.com/image.jpg'
              value={link}
              className='grow'
              onChange={(e) => setLink(e.target.value)}
            />
            <Button type='submit' className='ml-2 inline-block' disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </div>
        </div>
        <Button className='w-full' onClick={handleClick}>
          Upload from your computer
        </Button>
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          multiple
          className='hidden'
          onChange={handleFile}
        />
      </div>
    </form>
  )
}
