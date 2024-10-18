import {
  CategoryResponseType,
  DraftPostResponseType,
  ListPostTypeResponse,
  PostQueryParams,
  PostTypeResponse,
  ResponseMainType,
  TagsResponseType
} from '@/types/auth.type'

import { NewPostBodyType } from '@/schemas/auth.schema'

import { EKeyQuery } from '@/constants/enum'
import ROUTES from '@/constants/route'

import http from '@/lib/http'
import { createSearchParam } from '@/lib/utils'

const PostService = {
  getDetail: (slug: string) =>
    http.get<PostTypeResponse>(`${ROUTES.BACKEND.POST_DETAIL}/${slug}`, {
      next: {
        tags: [slug]
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
    return http.get<ListPostTypeResponse>(
      `${ROUTES.BACKEND.POST_FEED}?${createSearchParam<PostQueryParams>(params)}`,
      params.userName
        ? {
            next: {
              tags: [params.userName]
            }
          }
        : {
            next: {
              tags: [EKeyQuery.FEED_POSTS]
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
  },
  saveDraft: (data: NewPostBodyType) => http.post(ROUTES.BACKEND.SAVE_DRAFT, data),
  getDraft: () => http.get<DraftPostResponseType>(ROUTES.BACKEND.SAVE_DRAFT),
  sGetDraft: (accessToken: string) =>
    http.get<DraftPostResponseType>(ROUTES.BACKEND.SAVE_DRAFT, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: 'no-store'
    })
}

export default PostService
