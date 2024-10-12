import { isRedirectError } from 'next/dist/client/components/redirect'
import * as React from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import useUploadMediaMutation from '@/services/queries/media'

import { UploadFileResponseType } from '@/types/auth.type'

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.'

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message
    })
    return errors.join('\n')
  } else if (err instanceof Error) {
    return err.message
  } else if (isRedirectError(err)) {
    throw err
  } else {
    return unknownError
  }
}

export function useUploadFile() {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadFileResponseType[]>([])
  const { mutateAsync: upload, isPending } = useUploadMediaMutation()

  const onUpload = (files: File[]) => {
    try {
      const formData = new FormData()

      files.map((file) => {
        formData.append('files', file)
      })

      toast.promise(upload(formData), {
        loading: `Uploading 1 file...`,
        success: ({ payload }) => {
          setUploadedFiles(payload)
          return `1 file uploaded`
        },
        error: `Failed to upload 1 file`
      })
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return {
    onUpload,
    uploadedFiles,
    setUploadedFiles,
    isUploading: isPending
  }
}
