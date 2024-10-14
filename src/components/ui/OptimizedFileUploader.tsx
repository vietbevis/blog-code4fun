/* eslint-disable @next/next/no-img-element */
'use client'

import * as React from 'react'
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import envConfig from '@/configs/envConfig'

import useLoadingStore from '@/stores/loading'

import { useUploadFile } from '@/hooks/use-upload-file'

import { checkImageURL, cn } from '@/lib/utils'

import Icon from './icon'

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

/* eslint-disable @next/next/no-img-element */

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

interface OptimizedFileUploaderProps {
  onChange: (files: string[]) => void
  value?: string[]
  accept?: DropzoneProps['accept']
  maxSize?: number
  maxFileCount?: number
  disabled?: boolean
}

export function OptimizedFileUploader({
  onChange,
  value = [],
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024 * envConfig.NEXT_PUBLIC_IMAGE_SIZE_MAX,
  maxFileCount = 1,
  disabled = false,
  ...props
}: OptimizedFileUploaderProps) {
  const { onUpload, isUploading, uploadedFiles } = useUploadFile()
  const { setIsLoading } = useLoadingStore()
  const [src, setSrc] = React.useState<string | undefined>(
    value[0] ? checkImageURL(value[0]) : undefined
  )

  React.useEffect(() => {
    setIsLoading(isUploading)
  }, [isUploading, setIsLoading])

  React.useEffect(() => {
    if (uploadedFiles.length > 0) {
      onChange([uploadedFiles[0].filename])
    }
  }, [uploadedFiles, onChange])

  const handleDrop = React.useCallback(
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
        setSrc(URL.createObjectURL(acceptedFiles[0]))
        onUpload(acceptedFiles)
      }
    },
    [onUpload, maxFileCount]
  )

  const handleRemove = React.useCallback(() => {
    onChange([])
    setSrc(undefined)
  }, [onChange])

  return (
    <div className='relative flex flex-col gap-6 overflow-hidden' {...props}>
      {src ? (
        <div className='relative aspect-video w-full'>
          <img src={src} alt='Uploaded file' className='w-full rounded-md object-cover' />
          <Button
            variant='ghost'
            size='icon'
            type='button'
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className='absolute right-2 top-2 bg-red-300/60 hover:bg-red-400/60'
          >
            <Icon name='Trash2' />
          </Button>
        </div>
      ) : (
        <Dropzone
          onDrop={handleDrop}
          accept={accept}
          maxSize={maxSize}
          multiple={false}
          disabled={disabled || isUploading}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
                isDragActive && 'border-muted-foreground/50',
                (disabled || isUploading) && 'pointer-events-none opacity-60'
              )}
            >
              <input {...getInputProps()} />
              <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                <div className='rounded-full border border-dashed p-3'>
                  <Icon name='Upload' className='size-7 text-muted-foreground' aria-hidden='true' />
                </div>
                <p className='font-medium text-muted-foreground'>
                  Drag &apos;n&apos; drop thumbnails here, or click to select thumbnails
                </p>
                <p className='text-sm text-muted-foreground/70'>
                  You can upload an image up to {formatBytes(maxSize)}
                </p>
              </div>
            </div>
          )}
        </Dropzone>
      )}
    </div>
  )
}
