/* eslint-disable unused-imports/no-unused-vars */
import {
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { PostQueryParams, PostTypeResponse } from '@/types/auth.type'

import { EKeyQuery } from '@/constants/enum'

import PostService from '../post.service'
import revalidateApiRequest from '../revalidate'

export const useDetailPost = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: ['post-detail', slug],
    queryFn: () => PostService.getDetail(slug),
    select: (data) => data.payload.details
  })
}

export const useDetailPostById = ({ postId }: { postId: string }) => {
  return useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => PostService.getDetailById(postId),
    select: (data) => data.payload.details
  })
}

export const useLikePost = ({ slug }: { slug: string }) => {
  const queryClient = useQueryClient()
  const queryKeyDetail: QueryKey = ['post-detail', slug]

  return useMutation({
    mutationFn: PostService.likePost,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeyDetail })

      const previousDetailState = queryClient.getQueryData<{
        status: number
        payload: PostTypeResponse
      }>(queryKeyDetail)

      // Cập nhật chi tiết bài viết
      queryClient.setQueryData(queryKeyDetail, () => {
        if (!previousDetailState) return previousDetailState
        return {
          ...previousDetailState,
          payload: {
            ...previousDetailState.payload,
            details: {
              ...previousDetailState.payload.details,
              favoriteType:
                previousDetailState.payload.details.favoriteType === 'LIKE' ? 'UNLIKE' : 'LIKE',
              favourite:
                previousDetailState.payload.details.favoriteType === 'LIKE'
                  ? previousDetailState.payload.details.favourite - 1
                  : previousDetailState.payload.details.favourite + 1
            }
          }
        }
      })

      return {
        previousDetailState
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKeyDetail, context?.previousDetailState)
      toast.error('Error', {
        description: error.message
      })
    }
  })
}

export const useCreatePost = () => {
  return useMutation({
    mutationFn: PostService.createPost,
    onSuccess: async (data) => {
      await Promise.all([
        revalidateApiRequest(EKeyQuery.FEED_POSTS),
        revalidateApiRequest(data.payload.details.createdBy.userName)
      ])
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message
      })
    }
  })
}

export const useTags = () => {
  return useQuery({
    queryKey: [EKeyQuery.TAGS],
    queryFn: PostService.getTags
  })
}

export const useInfiniteScrollPosts = (params?: PostQueryParams) => {
  return useInfiniteQuery({
    queryKey: [
      EKeyQuery.FEED_POSTS,
      ...Object.values(params || {}).filter((value) => value !== undefined && value !== null)
    ],
    queryFn: async ({ pageParam }) => {
      const { payload } = await PostService.getPostsByFilters({
        ...params,
        offset: pageParam
      })
      return {
        posts: payload.details.records,
        nextPage: payload.details.offset + 1,
        totalPage: payload.details.totalPage
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPage ? lastPage.nextPage : undefined
  })
}

export const useSearchPosts = (query: string) => {
  return useQuery({
    queryKey: ['search-posts', query],
    queryFn: () => PostService.search({ query }),
    enabled: !!query,
    staleTime: 0
  })
}

export const useInfiniteScrollSearchPosts = (query?: string) => {
  query = query || ''
  return useInfiniteQuery({
    queryKey: ['search-posts', query],
    refetchOnMount: false,
    enabled: !!query,
    staleTime: 0,
    queryFn: async ({ pageParam }) => {
      const { payload } = await PostService.search({
        query,
        offset: pageParam
      })
      return {
        posts: payload.details.records,
        nextPage: payload.details.offset + 1,
        totalPage: payload.details.totalPage
      }
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPage ? lastPage.nextPage : undefined
  })
}

export const useSaveDraft = () => {
  return useMutation({
    mutationFn: PostService.saveDraft,
    onError: (error) => {
      console.log('🚀 ~ file: post.query.tsx:165 ~ useSaveDraft ~ error:', error)
    }
  })
}

export const useGetDraft = () => {
  return useQuery({
    queryKey: [EKeyQuery.DRAFT],
    queryFn: PostService.getDraft,
    staleTime: Infinity
  })
}
