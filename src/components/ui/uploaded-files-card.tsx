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
  value
}: {
  onChange: (...event: any[]) => void
  value: string[]
}) {
  const { onUpload, isUploading, uploadedFiles } = useUploadFile()
  const { setIsLoading } = useLoadingStore()
  const [src, setSrc] = useState<string | undefined>()

  useEffect(() => {
    setIsLoading(isUploading)
  }, [isUploading, setIsLoading])

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      onChange([uploadedFiles[0].filename])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFiles])

  return (
    <div className='rounded-lg border border-input p-4'>
      {value.length > 0 || src ? (
        <div className='relative aspect-video w-full'>
          <img
            src={value[0] ? checkImageURL(value[0]) : src}
            alt={value[0] || 'Uploaded file'}
            className='w-full rounded-md object-cover'
          />
          <Button
            variant={'ghost'}
            size={'icon'}
            type='button'
            onClick={() => {
              onChange([])
              setSrc(undefined)
            }}
            className={'absolute right-2 top-2 bg-red-300/60 hover:bg-red-400/60'}
          >
            <Icon name={'Trash2'} />
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
    </div>
  )
}
