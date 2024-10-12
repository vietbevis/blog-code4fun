/* eslint-disable unused-imports/no-unused-vars */
'use client'

import * as React from 'react'
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import Icon from './icon'

/* eslint-disable unused-imports/no-unused-vars */

/* eslint-disable unused-imports/no-unused-vars */

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytest') : (sizes[i] ?? 'Bytes')
  }`
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

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    accept = {
      'image/*': []
    },
    maxSize = 1024 * 1024, // 1MB
    maxFileCount = 1,
    disabled = false,
    className,
    setImageSelect,
    ...dropzoneProps
  } = props

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time')
        return
      }

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`)
        })
      }

      setImageSelect(URL.createObjectURL(acceptedFiles[0]))

      if (onUpload) {
        onUpload(acceptedFiles)
      }
    },
    [onUpload, setImageSelect]
  )

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden'>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={10}
        multiple={true}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isDragActive && 'border-muted-foreground/50',
              disabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <Icon name='Upload' className='size-7 text-muted-foreground' aria-hidden='true' />
                </div>
                <p className='font-medium text-muted-foreground'>Drop the files here</p>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <Icon name='Upload' className='size-7 text-muted-foreground' aria-hidden='true' />
                </div>
                <div className='flex flex-col gap-px'>
                  <p className='font-medium text-muted-foreground'>
                    Drag {`'n'`} drop thumbnails here, or click to select thumbnails
                  </p>
                  <p className='text-sm text-muted-foreground/70'>
                    You can upload a image with ${formatBytes(maxSize)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  )
}
