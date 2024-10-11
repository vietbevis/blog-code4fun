'use client'

import React from 'react'

import { useInfiniteScrollPosts } from '@/services/queries/post'

import PostSkeleton from '../skeletons/PostSkeleton'
import InfiniteScrollContainer from '../ui/infinite-scoll-container'
import Post from './Post'

const PostList = () => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteScrollPosts()

  const posts = data ? data.pages.flatMap((page) => page.posts) : []

  if (status === 'error') {
    return <div>Error: {error.message}</div>
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
      className='flex flex-col gap-4'
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
