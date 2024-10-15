import { InfiniteData, useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { CommentType } from '@/types/auth.type'

import { getQueryClient } from '@/lib/getQueryClient'

import CommentService from '../comment.service'

interface InfiniteComment {
  comments: CommentType[]
  nextPage: number
  totalPage: number
}

export const useCreateComment = () => {
  const queryClient = getQueryClient()
  return useMutation({
    mutationFn: CommentService.createComment,
    onSuccess: (newComment) => {
      const comment = newComment.payload.details
      const isChild = comment.parentId !== '' ? true : false
      console.log('🚀 ~ file: comments.ts:13 ~ useCreateComment ~ isChild:', isChild)

      const updateComments = (oldComments: InfiniteData<InfiniteComment> | undefined) => {
        if (!oldComments) return oldComments
        return {
          ...oldComments,
          pages: oldComments.pages.map((page) => ({
            ...page,
            comments: [comment, ...page.comments]
          }))
        }
      }

      const queryKey = isChild ? ['comments', comment.parentId] : ['comments', comment.postId]

      queryClient.setQueryData<InfiniteData<InfiniteComment>>(queryKey, updateComments)
    },
    onError: (error) => {
      toast.error('Error', {
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
