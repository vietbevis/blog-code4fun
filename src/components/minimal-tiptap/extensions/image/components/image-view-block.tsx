/* eslint-disable @next/next/no-img-element */
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'

import useUploadMediaMutation from '@/services/queries/media'

import useLoadingStore from '@/stores/loading'

import { checkImageURL, convertImageToFormData } from '@/lib/utils'

export function ImageComponent(props: NodeViewProps) {
  const { node, updateAttributes } = props

  const { mutateAsync: upload, isPending } = useUploadMediaMutation()
  const { setIsLoading } = useLoadingStore()

  const [src, setSrc] = useState<string>(node.attrs.src)
  const isUploading = useRef(false)

  useEffect(() => {
    setIsLoading(isPending)
  }, [isPending, setIsLoading])

  useEffect(() => {
    if (!node.attrs.src.startsWith('data:') || isUploading.current) {
      return
    }

    const uploadImage = async () => {
      try {
        isUploading.current = true
        const formData = await convertImageToFormData(node.attrs.src)
        const uploadedFile = await upload(formData)
        if (!uploadedFile) return
        const newSrc = checkImageURL(uploadedFile.payload[0].filename)
        setSrc(newSrc)
        updateAttributes({ src: newSrc })
      } catch (error) {
        console.error('Error uploading image:', error)
      } finally {
        isUploading.current = false
      }
    }

    uploadImage()
  }, [node.attrs.src, upload, updateAttributes])

  return (
    <NodeViewWrapper className='relative w-full'>
      <img
        alt={node.attrs.alt || 'Image'}
        src={src}
        className='h-auto max-w-full object-cover'
        title={node.attrs.title}
      />
    </NodeViewWrapper>
  )
}
