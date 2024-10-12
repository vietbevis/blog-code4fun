'use client'

import * as React from 'react'
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import Icon from './icon'

export function formatBytes(
  bytes: number,
  {
    decimals = 0,
    sizeType = 'normal'
  }: { decimals?: number; sizeType?: 'accurate' | 'normal' } = {}
) {
  const sizes =
    sizeType === 'accurate'
      ? ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
      : ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${sizes[i] || 'Bytes'}`
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[]
  onValueChange?: (files: File[]) => void
  onUpload?: (files: File[]) => void
  accept?: DropzoneProps['accept']
  maxSize?: DropzoneProps['maxSize']
  maxFileCount?: DropzoneProps['maxFiles']
  disabled?: boolean
  setImageSelect: React.Dispatch<React.SetStateAction<string | undefined>>
}

export function FileUploader({
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024, // 1MB
  maxFileCount = 1,
  disabled = false,
  setImageSelect,
  onUpload,
  ...dropzoneProps
}: FileUploaderProps) {
  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > maxFileCount) {
        toast.error(`Cannot upload more than ${maxFileCount} files`)
        return
      }

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`)
        })
      }

      if (acceptedFiles.length > 0) {
        setImageSelect(URL.createObjectURL(acceptedFiles[0]))
        onUpload?.(acceptedFiles)
      }
    },
    [onUpload, setImageSelect, maxFileCount]
  )

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden'>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        multiple={false}
        disabled={disabled}
        {...dropzoneProps}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              isDragActive && 'border-muted-foreground/50',
              disabled && 'pointer-events-none opacity-60'
            )}
          >
            <input {...getInputProps()} />
            <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
              <div className='rounded-full border border-dashed p-3'>
                <Icon name='Upload' className='size-7 text-muted-foreground' aria-hidden='true' />
              </div>
              <p className='font-medium text-muted-foreground'>
                Drag {'n'} drop thumbnails here, or click to select thumbnails
              </p>
              <p className='text-sm text-muted-foreground/70'>
                You can upload an image with {formatBytes(maxSize)}
              </p>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  )
}
