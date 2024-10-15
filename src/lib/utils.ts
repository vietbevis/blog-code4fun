/* eslint-disable unused-imports/no-unused-vars */
import { type ClassValue, clsx } from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import jwt from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

import AuthService from '@/services/auth.service'

import envConfig from '@/configs/envConfig'

import useAuthStore from '@/stores/auth.store'

import { TokenPayload } from '@/types/auth.type'

import { HttpError } from './http'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export const handleErrorApi = ({
  error,
  setError
}: {
  error: any
  setError?: UseFormSetError<any>
}) => {
  if (error instanceof HttpError && setError) {
    error.payload.errors.forEach((item: any) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(error?.payload?.message ?? 'Lỗi không xác định')
  }
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

export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
  force?: boolean
}) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi cái function `checkAndRefreshToken`
  // Vì để mỗi lần mà checkAndRefreshToken() được gọi thì sẽ có một access và refresh token mới
  // Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const { token, login, logout } = useAuthStore.getState()
  const { accessToken, refreshToken } = token || {}

  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)

  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)
  const now = Math.round(new Date().getTime() / 1000)
  // Trường hợp refresh token hết hạn thì cho logout
  if (decodedRefreshToken.exp <= now) {
    logout()
    return param?.onError && param.onError()
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (
    param?.force ||
    decodedAccessToken.exp - now < (decodedAccessToken.exp - decodedAccessToken.iat) / 3
    // decodedAccessToken.exp - now < 3572 // test 10s gọi 1 lần
  ) {
    // Gọi API refresh token
    try {
      // Gọi API refresh token
      const result = await AuthService.refreshToken()
      login(result.payload)
      return param?.onSuccess && param.onSuccess()
    } catch (error) {
      return param?.onError && param.onError()
    }
  }
}

export function formatDate(date: string) {
  dayjs.extend(relativeTime)
  const commentTime = dayjs(date).format('MMMM D, YYYY')
  return commentTime
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
