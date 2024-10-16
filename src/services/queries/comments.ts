import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { CommentType } from '@/types/auth.type'

import CommentService from '../comment.service'

interface InfiniteComment {
  comments: CommentType[]
  nextPage: number
  totalPage: number
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentService.createComment,
    onSuccess: (newComment) => {
      const comment = newComment.payload.details
      const queryKey = comment.parentId
        ? ['comments', comment.parentId]
        : ['comments', comment.postId]

      queryClient.setQueryData<InfiniteData<InfiniteComment>>(queryKey, (oldData) =>
        updateComments(oldData, comment, queryClient)
      )
    },
    onError: (error: Error) => {
      toast.error('Error creating comment', {
        description: error.message
      })
    }
  })
}

const updateComments = (
  oldData: InfiniteData<InfiniteComment> | undefined,
  newComment: CommentType,
  queryClient: ReturnType<typeof useQueryClient>
): InfiniteData<InfiniteComment> | undefined => {
  if (!oldData) return oldData

  const isChildComment = Boolean(newComment.parentId)

  if (isChildComment) {
    return updateChildComment(oldData, newComment, queryClient)
  }

  return updateParentComment(oldData, newComment)
}

const updateChildComment = (
  oldData: InfiniteData<InfiniteComment>,
  newComment: CommentType,
  queryClient: ReturnType<typeof useQueryClient>
): InfiniteData<InfiniteComment> => {
  return {
    ...oldData,
    pages: oldData.pages.map((page) => ({
      ...page,
      comments: page.comments.map((c) => {
        if (c.id === newComment.parentId) {
          if (c.isHasChildComment) {
            updateChildCommentCache(newComment, queryClient)
            return c
          }
          return { ...c, isHasChildComment: true }
        }
        return c
      })
    }))
  }
}

const updateChildCommentCache = (
  newComment: CommentType,
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.setQueryData<InfiniteData<InfiniteComment>>(
    ['comments', newComment.parentId],
    (oldChildData) => {
      if (!oldChildData) return oldChildData
      return {
        ...oldChildData,
        pages: oldChildData.pages.map((childPage, index) =>
          index === 0 ? { ...childPage, comments: [newComment, ...childPage.comments] } : childPage
        )
      }
    }
  )
}

const updateParentComment = (
  oldData: InfiniteData<InfiniteComment>,
  newComment: CommentType
): InfiniteData<InfiniteComment> => {
  return {
    ...oldData,
    pages: oldData.pages.map((page, index) =>
      index === 0 ? { ...page, comments: [newComment, ...page.comments] } : page
    )
  }
}

export const useInfiniteScrollComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam }) => {
      const { payload } = await CommentService.getComments(postId, { offset: pageParam })
      return {
        comments: payload.details.records,
        nextPage: payload.details.offset + 1,
        totalPage: payload.details.totalPage
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPage ? lastPage.nextPage : undefined
  })
}

export const useInfiniteScrollCommentsChild = (parentId: string, hasChild: boolean) => {
  return useInfiniteQuery({
    queryKey: ['comments', parentId],
    queryFn: async ({ pageParam }) => {
      const { payload } = await CommentService.getCommentsChild(parentId, { offset: pageParam })
      return {
        comments: payload.details.records,
        nextPage: payload.details.offset + 1,
        totalPage: payload.details.totalPage
      }
    },
    enabled: hasChild || false,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPage ? lastPage.nextPage : undefined
  })
}
