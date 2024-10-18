import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { CommentType } from '@/types/auth.type'

import CommentService from '../comment.service'
import revalidateApiRequest from '../revalidate'

interface InfiniteComment {
  comments: CommentType[]
  nextPage: number
  totalPage: number
}

export const useCreateComment = (level: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentService.createComment,
    onSuccess: async (newComment, variables) => {
      const { postId, parentCommentId } = variables
      const queryKey = parentCommentId ? ['comments', parentCommentId] : ['comments', postId]

      queryClient.setQueryData<InfiniteData<InfiniteComment>>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page, index) =>
            index === 0
              ? { ...page, comments: [newComment.payload.details, ...page.comments] }
              : page
          )
        }
      })
      let isFirstChildComment = false
      let isParentInFirstPage = false
      if (parentCommentId) {
        const parentQueryKey = level === 2 ? ['comments', postId] : ['comments', parentCommentId]

        queryClient.setQueryData<InfiniteData<InfiniteComment>>(parentQueryKey, (oldData) => {
          if (!oldData || oldData.pages.length === 0) return oldData

          const updatedPages = oldData.pages.map((page, pageIndex) => {
            const updatedComments = page.comments.map((comment) => {
              if (comment.id === parentCommentId) {
                if (!comment.isHasChildComment) {
                  if (level === 2) {
                    isFirstChildComment = true
                    if (pageIndex === 0) {
                      isParentInFirstPage = true
                    }
                  }
                  return { ...comment, isHasChildComment: true }
                }
              }
              return comment
            })
            return { ...page, comments: updatedComments }
          })

          return {
            ...oldData,
            pages: updatedPages
          }
        })
      }
      if (level === 1 || (isFirstChildComment && isParentInFirstPage)) {
        await revalidateApiRequest(`comments-${postId}`)
      }
    },
    onError: (error: Error) => {
      toast.error('Error creating comment', {
        description: error.message
      })
    }
  })
}

export const useUpdateComment = (level: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentService.updateComment,
    onSuccess: async (updatedComment) => {
      const comment = updatedComment.payload.details
      const queryKey = comment.parentId
        ? ['comments', comment.parentId]
        : ['comments', comment.postId]

      if (level === 1) {
        await revalidateApiRequest(`comments-${comment.postId}`)
      }

      queryClient.setQueryData<InfiniteData<InfiniteComment>>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => (c.id === comment.id ? comment : c))
          }))
        }
      })
    },
    onError: (error: Error) => {
      toast.error('Error updating comment', {
        description: error.message
      })
    }
  })
}

export const useDeleteComment = (comment: CommentType, level: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentService.deleteComment,
    onMutate: async () => {
      const queryKey = comment.parentId
        ? ['comments', comment.parentId]
        : ['comments', comment.postId]

      queryClient.setQueryData<InfiniteData<InfiniteComment>>(queryKey, (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((c) => c.id !== comment.id)
          }))
        }
      })

      if (comment.parentId) {
        // Update isHasChildComment of parent comment if it has no child comment after deleting
      }
    },
    onSuccess: async () => {
      const data = queryClient.getQueryData<InfiniteData<InfiniteComment>>([
        'comments',
        comment.parentId
      ])
      const countComments = data?.pages.flatMap((page) => page.comments).length
      if (level === 1 || (level === 2 && countComments === 0)) {
        await revalidateApiRequest(`comments-${comment.postId}`)
      }
    },
    onError: (error: Error) => {
      toast.error('Error deleting comment', {
        description: error.message
      })
    }
  })
}

export const useInfiniteScrollComments = (postId: string) => {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam }) => {
      const { payload } = await CommentService.getComments(postId, { offset: pageParam, limit: 5 })
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
      const { payload } = await CommentService.getCommentsChild(parentId, {
        offset: pageParam,
        limit: 5
      })
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
