import {
  CategoryResponseType,
  ListPostTypeResponse,
  PostQueryParams,
  PostTypeResponse,
  ResponseMainType,
  TagsResponseType
} from '@/types/auth.type'

import { NewPostBodyType } from '@/schemas/auth.schema'

import ROUTES from '@/constants/route'

import http from '@/lib/http'

const PostService = {
  getDetail: (slug: string, userName?: string) =>
    http.get<PostTypeResponse>(`${ROUTES.BACKEND.POST_DETAIL}/${slug}`, {
      next: {
        tags: userName ? [slug, userName] : [slug]
      }
    }),
  getDetailById: (id: string) =>
    http.get<PostTypeResponse>(`${ROUTES.BACKEND.POST_DETAIL_BY_ID}/${id}`),
  getTags: () => http.get<TagsResponseType>(`${ROUTES.BACKEND.POST_TAGS}`),
  getCategory: ({ page = 0, limit = 100 }: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams({
      ...(page && { offset: page.toString() }),
      ...(limit && { limit: limit.toString() })
    })
    return http.get<CategoryResponseType>(
      `${ROUTES.BACKEND.POST_CATEGORY}?${searchParams.toString()}`
    )
  },
  getFeedPost: () =>
    http.get<ListPostTypeResponse>(`${ROUTES.BACKEND.POST_FEED}`, {
      next: {
        tags: ['posts-feed']
      }
    }),
  getPostsByFilters: (params: PostQueryParams) => {
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

    return http.get<ListPostTypeResponse>(
      `${ROUTES.BACKEND.POST_FEED}?${searchParams.toString()}`,
      params.userName
        ? {
            next: {
              tags: [params.userName]
            }
          }
        : {
            next: {
              tags: ['feed-posts']
            }
          }
    )
  },
  createPost: (data: NewPostBodyType) =>
    http.post<PostTypeResponse>(ROUTES.BACKEND.CREATE_POST, data),
  likePost: (postId: string) =>
    http.put<ResponseMainType>(`${ROUTES.BACKEND.LIKE_POST}/${postId}`, null),
  getCategories: ({ offset, limit }: { offset?: number; limit?: number }) => {
    const searchParams = new URLSearchParams({
      ...(offset && { offset: offset.toString() }),
      ...(limit && { limit: limit.toString() })
    })
    return http.get<CategoryResponseType>(`${ROUTES.BACKEND.CATEGORY}?${searchParams.toString()}`)
  },
  search: ({ query, offset }: { query: string; offset?: number }) => {
    const searchParams = new URLSearchParams({
      ...(offset && { offset: offset.toString() }),
      ...(query && { search: query.toString() })
    })
    return http.get<ListPostTypeResponse>(`${ROUTES.BACKEND.SEARCH}?${searchParams.toString()}`)
  }
}

export default PostService
