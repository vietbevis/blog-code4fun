'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Cropper from 'react-easy-crop'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'

import useUploadMediaMutation from '@/services/queries/media'

import { getCroppedImg } from '@/lib/cropImage'
import { checkImageURL } from '@/lib/utils'

type Point = { x: number; y: number }

interface AvatarUploaderProps {
  currentAvatar: string | undefined
  onAvatarChange: (newAvatarUrl: string) => void
}

export function AvatarUploader({ currentAvatar, onAvatarChange }: AvatarUploaderProps) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const { mutateAsync: upload, isPending } = useUploadMediaMutation()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImage(URL.createObjectURL(acceptedFiles[0]))
    setOpen(true)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  })

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCropConfirm = useCallback(async () => {
    if (image && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      const formData = new FormData()
      const file = new File([croppedImage], `avatar.jpg`, {
        type: croppedImage.type
      })
      formData.append('files', file)
      toast.promise(upload(formData), {
        loading: `Uploading 1 file...`,
        success: ({ payload }) => {
          onAvatarChange(payload[0].filename)
          toast.success('Avatar uploaded successfully')
          setOpen(false)
          return `1 file uploaded`
        },
        error: `Failed to upload 1 file`
      })
    }
  }, [image, croppedAreaPixels, upload, onAvatarChange])

  return (
    <>
      <div {...getRootProps()} className='cursor-pointer'>
        <input {...getInputProps()} />
        <Avatar className='size-24 ring-2 ring-background ring-offset-2'>
          <AvatarImage src={checkImageURL(currentAvatar)} alt='Avatar' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
          </DialogHeader>
          <div className='relative h-64'>
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            className='my-4'
          />
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} disabled={isPending}>
              {isPending ? 'Uploading...' : 'Confirm'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
