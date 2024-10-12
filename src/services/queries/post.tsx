/* eslint-disable unused-imports/no-unused-vars */
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { toast } from 'sonner'

import { PostQueryParams, PostType, PostTypeResponse } from '@/types/auth.type'

import PostService from '../post'
import revalidateApiRequest from '../revalidate'

interface InfinitePosts {
  posts: PostType[]
  nextPage: number
  totalPage: number
}

export const useDetailPost = ({ slug }: { slug: string }) => {
  return useQuery({
    queryKey: ['post-detail', slug],
    queryFn: () => PostService.getDetail(slug),
    select: (data) => data.payload.details,
    refetchOnMount: false
  })
}

export const useDetailPostById = ({ postId }: { postId: string }) => {
  return useQuery({
    queryKey: ['post-detail', postId],
    queryFn: () => PostService.getDetailById(postId),
    select: (data) => data.payload.details,
    refetchOnMount: false
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

      const createdByUserName = previousDetailState?.payload.details.createdBy.userName

      const updatePostData = (data: any, slug: string) => {
        if (!data) return data
        return {
          ...data,
          pages: data.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: any) =>
              post.slug === slug
                ? {
                    ...post,
                    favoriteType: post.favoriteType === 'LIKE' ? 'UNLIKE' : 'LIKE',
                    favourite:
                      post.favoriteType === 'LIKE' ? post.favourite - 1 : post.favourite + 1
                  }
                : post
            )
          }))
        }
      }

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

      // Cập nhật danh sách bài viết (feed chung và feed của author)
      // const queryKeyInfinite: QueryKey = ["feed-posts"];
      // const queryKeyAuthorPage: QueryKey = ["feed-posts", createdByUserName];

      // const previousInfiniteState =
      //   queryClient.getQueryData<InfiniteData<InfinitePosts>>(queryKeyInfinite);

      // const previousAuthorPageState =
      //   queryClient.getQueryData<InfiniteData<InfinitePosts>>(
      //     queryKeyAuthorPage,
      //   );

      // queryClient.setQueryData(queryKeyInfinite, (oldData) =>
      //   updatePostData(oldData, slug),
      // );
      // queryClient.setQueryData(queryKeyAuthorPage, (oldData) =>
      //   updatePostData(oldData, slug),
      // );

      return {
        previousDetailState
        // previousInfiniteState,
        // previousAuthorPageState,
        // queryKeyAuthorPage,
      }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKeyDetail, context?.previousDetailState)
      // queryClient.setQueryData(["feed-posts"], context?.previousInfiniteState);
      // queryClient.setQueryData(
      //   context?.queryKeyAuthorPage as QueryKey,
      //   context?.previousAuthorPageState,
      // );
      toast.error('Error', {
        description: error.message
      })
    }
  })
}

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts-feed'],
    queryFn: PostService.getFeedPost
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: PostService.createPost,
    onSuccess: async (data) => {
      const createdPost = data.payload.details
      const authorUserName = createdPost.createdBy.userName
      await revalidateApiRequest('feed-posts')

      const updatePosts = (oldData: InfiniteData<InfinitePosts> | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: [createdPost, ...page.posts]
          }))
        }
      }

      // Cập nhật danh sách bài viết chung
      queryClient.setQueryData<InfiniteData<InfinitePosts>>(['feed-posts'], updatePosts)

      // Cập nhật danh sách bài viết trên trang của author
      queryClient.setQueryData<InfiniteData<InfinitePosts>>(
        ['feed-posts', authorUserName],
        updatePosts
      )
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
    queryKey: ['tags'],
    queryFn: PostService.getTags
    // refetchOnMount: false,
  })
}

export const useInfiniteScrollPosts = (params?: PostQueryParams) => {
  return useInfiniteQuery({
    queryKey: [
      'feed-posts',
      ...Object.values(params || {}).filter((value) => value !== undefined && value !== null)
    ],
    refetchOnMount: false,
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

export const useInfiniteScrollSearchPosts = (query: string) => {
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
