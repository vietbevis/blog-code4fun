/* eslint-disable @typescript-eslint/no-unused-vars */
import envConfig from '@/configs/envConfig'

import useAuthStore from '@/stores/auth.store'

import { EntityErrorPayload } from '@/types/auth.type'

/* eslint-disable @typescript-eslint/no-explicit-any */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type RequestOptions = Omit<RequestInit, 'method'> & {
  baseUrl?: string | undefined
}

const ENTITY_ERROR_STATUS = 422
const AUTHENTICATION_ERROR_STATUS = 401

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

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({
    status,
    payload
  }: {
    status: typeof ENTITY_ERROR_STATUS
    payload: EntityErrorPayload
  }) {
    super({ status, payload, message: 'Lỗi thực thể' })
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

export const getBaseHeaders = (
  body: FormData | string | undefined
): { [key: string]: string } => {
  const headers: { [key: string]: string } = {
    'x-api-key': envConfig.NEXT_PUBLIC_API_KEY
  }

  // Chỉ thêm "Content-Type" nếu body không phải là FormData
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

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
    if (response.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: typeof ENTITY_ERROR_STATUS
          payload: EntityErrorPayload
        }
      )
    } else if (response.status === AUTHENTICATION_ERROR_STATUS) {
      if (isClient) {
        useAuthStore.getState().logout()
      }
    } else {
      throw new HttpError(data)
    }
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
