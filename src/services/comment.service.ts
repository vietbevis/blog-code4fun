import envConfig from '@/configs/envConfig'

import { CreateCommentResponseType, ListCommentResponseType } from '@/types/auth.type'

import { CommentBodyType } from '@/schemas/auth.schema'

import ROUTES from '@/constants/route'

import http from '@/lib/http'
import { createSearchParam } from '@/lib/utils'

type PaginateParams = {
  offset?: number
  limit?: number
}

const CommentService = {
  createComment: (body: CommentBodyType) =>
    http.post<CreateCommentResponseType>(ROUTES.BACKEND.CREATE_COMMENT, body),
  getComments: (postId: string, params: PaginateParams = { offset: 0, limit: 10 }) => {
    return http.get<ListCommentResponseType>(
      `${ROUTES.BACKEND.GET_COMMENTS}/${postId}?${createSearchParam<PaginateParams>(params)}`,
      {
        baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT_V2
      }
    )
  },
  getCommentsChild: (parentId: string, params: PaginateParams = { offset: 0, limit: 10 }) => {
    return http.get<ListCommentResponseType>(
      `${ROUTES.BACKEND.GET_CHILD_COMMENTS}/${parentId}?${createSearchParam<PaginateParams>(params)}`,
      {
        baseUrl: envConfig.NEXT_PUBLIC_API_ENDPOINT_V2
      }
    )
  },
  updateComment: ({ body, commentId }: { body: CommentBodyType; commentId: string }) =>
    http.put<CreateCommentResponseType>(`${ROUTES.BACKEND.UPDATE_COMMENT}/${commentId}`, body),
  deleteComment: (commentId: string) =>
    http.put<CreateCommentResponseType>(`${ROUTES.BACKEND.DELETE_COMMENT}/${commentId}`, {})
}

export default CommentService
