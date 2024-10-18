/* eslint-disable unused-imports/no-unused-vars */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

import envConfig from '@/configs/envConfig'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const isBrowser = typeof window !== 'undefined'

export function getDeviceInfo() {
  const userAgent = isBrowser ? window.navigator.userAgent : ''
  const deviceType = isBrowser ? window.navigator.platform : ''
  const deviceId = `${userAgent}-${deviceType}-${uuidv4()}`
  return {
    deviceId,
    deviceType
  }
}

export const checkImageURL = (url: string | null | undefined) => {
  if (!url) {
    return '/avatar-default.png'
  }
  if (url.startsWith('http')) {
    return url
  }
  return `${envConfig.NEXT_PUBLIC_API_IMAGE}/${url}`
}

export const convertImageToFormData = async (src: string | string[]) => {
  const srcArray = Array.isArray(src) ? src : [src]
  const formData = new FormData()

  await Promise.all(
    srcArray.map(async (srcItem, index) => {
      const imgFile = await fetch(srcItem).then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch image from ${srcItem}`)
        }
        return response.blob()
      })
      const file = new File([imgFile], `image-${index + 1}.jpg`, {
        type: imgFile.type
      })
      formData.append('files', file)
    })
  )

  return formData
}

export const setUrlToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem('redirect', value)

export const replaceImageSrc = (content: string) => {
  return content.replace(/<img\s+([^>]*?)src="([^"]*?)"([^>]*?)>/g, (match, p1, p2, p3) => {
    if (p2.startsWith('http')) {
      return match
    } else {
      const newSrc = `${envConfig.NEXT_PUBLIC_API_IMAGE}/${p2}`
      return `<img ${p1}src="${newSrc}"${p3}>`
    }
  })
}

export function replaceSpecialChars(str: string) {
  return str.replace(/[^a-zA-Z0-9]/g, '_')
}

export const createSearchParam = <T extends object>(params: T) => {
  const searchParams = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString()
        }
        return acc
      },
      {} as Record<string, string>
    )
  )
  return searchParams.toString()
}
