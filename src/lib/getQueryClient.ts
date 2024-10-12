import { QueryClient, isServer } from '@tanstack/react-query'

import { queryConfig } from '../configs/react-query'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: queryConfig
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient()
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}
