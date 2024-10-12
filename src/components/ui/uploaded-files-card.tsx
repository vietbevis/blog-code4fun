/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import useLoadingStore from '@/stores/loading'

import { useUploadFile } from '@/hooks/use-upload-file'

import { checkImageURL } from '@/lib/utils'

import { FileUploader } from './file-uploader'
import Icon from './icon'

export function UploadedFilesCard({
  onChange,
  value = []
}: {
  onChange: (files: string[]) => void
  value: string[]
}) {
  const { onUpload, isUploading, uploadedFiles } = useUploadFile()
  const { setIsLoading } = useLoadingStore()
  const [src, setSrc] = useState<string | undefined>(value[0] ? checkImageURL(value[0]) : undefined)

  useEffect(() => {
    setIsLoading(isUploading)
  }, [isUploading, setIsLoading])

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      onChange([uploadedFiles[0].filename])
    }
  }, [uploadedFiles, onChange])

  const handleRemove = () => {
    onChange([])
    setSrc(undefined)
  }

  return (
    <>
      {value.length > 0 || src ? (
        <div className='relative aspect-video w-full'>
          <img src={src} alt='Uploaded file' className='w-full rounded-md object-cover' />
          <Button
            variant={'ghost'}
            size={'icon'}
            type='button'
            onClick={handleRemove}
            className='absolute right-2 top-2 bg-red-300/60 hover:bg-red-400/60'
          >
            <Icon name='Trash2' />
          </Button>
        </div>
      ) : (
        <FileUploader
          maxFileCount={1}
          maxSize={10 * 1024 * 1024}
          onUpload={onUpload}
          setImageSelect={setSrc}
          disabled={isUploading}
        />
      )}
    </>
  )
}
