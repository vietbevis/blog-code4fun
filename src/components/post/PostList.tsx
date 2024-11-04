'use client'

import React from 'react'

import { useInfiniteScrollPosts } from '@/services/queries/post.query'

import { PostQueryParams } from '@/types/auth.type'

import PostSkeleton from '../skeletons/PostSkeleton'
import InfiniteScrollContainer from '../ui/infinite-scoll-container'
import Post from './Post'

const PostList = ({ params }: { params?: PostQueryParams }) => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteScrollPosts(params)
  const posts = data ? data.pages.flatMap((page) => page.posts) : []

  if (status === 'pending') {
    return (
      <div className='flex w-full flex-1 flex-col gap-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className='w-full rounded-lg border border-input bg-card p-4 text-center text-3xl font-bold'>
        Error: {error.message}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className='w-full rounded-lg border border-input bg-card p-4 text-center text-3xl font-bold'>
        No data
      </div>
    )
  }
  return (
    <InfiniteScrollContainer
      className='flex w-full flex-1 flex-col gap-4'
      onBottomReached={() => {
        if (hasNextPage && !isFetching) {
          fetchNextPage()
        }
      }}
    >
      {posts.map((post) => (
        <Post data={post} key={post.id} />
      ))}
      {isFetchingNextPage &&
        Array.from({ length: 5 }).map((_, index) => <PostSkeleton key={index} />)}
    </InfiniteScrollContainer>
  )
}

export default PostList
