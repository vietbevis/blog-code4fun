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

      queryClient.setQueryData<InfiniteData<InfiniteComment>>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page, index) =>
            index === 0 ? { ...page, comments: [comment, ...page.comments] } : page
          )
        }
      })
    },
    onError: (error: Error) => {
      toast.error('Error creating comment', {
        description: error.message
      })
    }
  })
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentService.updateComment,
    onSuccess: (updatedComment) => {
      const comment = updatedComment.payload.details
      const queryKey = comment.parentId
        ? ['comments', comment.parentId]
        : ['comments', comment.postId]

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

export const useDeleteComment = (comment: CommentType) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: CommentService.deleteComment,
    onMutate: () => {
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
