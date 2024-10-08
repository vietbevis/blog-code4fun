/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from 'next/navigation'

import envConfig from '@/configs/envConfig'

import useAuthStore from '@/stores/auth.store'

import ROUTES from '@/constants/route'

/* eslint-disable @typescript-eslint/no-explicit-any */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type RequestOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({
    status,
    payload,
    message = 'Lỗi HTTP'
  }: {
    status: number
    payload: any
    message?: string
  }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export const normalizePath = (path: string) =>
  path.startsWith('/') ? path.slice(1) : path

// Body
// Nếu options.body là FormData thì body = options.body
// Nếu options.body không phải là FormData thì chuyển options.body thành JSON
const handleBodyData = (body?: any): FormData | string | undefined => {
  if (body instanceof FormData) return body
  if (body) return JSON.stringify(body)
  return undefined
}

const getBaseHeaders = (body: any): Record<string, string> => ({
  ...(!(body instanceof FormData) && { 'Content-Type': 'application/json' })
})

export const isClient = typeof window !== 'undefined'

const getAuthorizationHeader = (): string | undefined => {
  const token = isClient
    ? useAuthStore.getState().token?.accessToken
    : undefined
  return token ? `Bearer ${token}` : undefined
}

// Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ process.env.NEXT_PUBLIC_API_ENDPOINT
// Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
const getFullUrl = (url: string, baseUrl?: string) =>
  `${baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT}/${normalizePath(url)}`

let clientLogoutRequest: null | Promise<any> = null
const request = async <Response>(
  method: HttpMethod,
  url: string,
  options?: RequestOptions | undefined
) => {
  const body = handleBodyData(options?.body)
  const authorizationHeader = getAuthorizationHeader()
  const headers: HeadersInit = {
    ...getBaseHeaders(body),
    ...options?.headers,
    ...(authorizationHeader && {
      Authorization: authorizationHeader
    })
  }

  const response = await fetch(getFullUrl(url, options?.baseUrl), {
    method,
    ...options,
    headers,
    body
  })

  const payload: Response = await response.json()

  const data = {
    status: response.status,
    payload
  }

  if (!response.ok) {
    if (response.status === 401) {
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch(ROUTES.HANDLER.LOGOUT, {
            method: 'PUT',
            body: null, // Logout luôn luôn thành công
            headers
          })
          try {
            await clientLogoutRequest
            // eslint-disable-next-line unused-imports/no-unused-vars
          } catch (error) {
          } finally {
            useAuthStore.getState().logout()
            clientLogoutRequest = null
            // Redirect về trang login có thể dẫn đến loop vô hạn
            // Nếu không không được xử lý đúng cách
            // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
            // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
            location.href = ROUTES.LOGIN
          }
        }
      } else {
        // Đây là trường hợp khi mà chúng ta vẫn còn access token (còn hạn)
        // Và chúng ta gọi API ở Next.js Server (Route Handler, Server Component) đến Server Backend
        const accessToken = (options?.headers as any)?.Authorization.split(
          'Bearer '
        )[1]
        redirect(`/login?accessToken=${accessToken}`)
      }
    } else throw new HttpError(data)
  }

  return data
}

const http = {
  get<Response>(url: string, options?: Omit<RequestOptions, 'body'>) {
    return request<Response>('GET', url, options)
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<RequestOptions, 'body'>
  ) {
    return request<Response>('POST', url, { ...options, body })
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<RequestOptions, 'body'>
  ) {
    return request<Response>('PUT', url, { ...options, body })
  },
  delete<Response>(url: string, options?: Omit<RequestOptions, 'body'>) {
    return request<Response>('DELETE', url, options)
  }
}
export default http
