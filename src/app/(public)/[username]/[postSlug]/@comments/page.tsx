import { notFound } from 'next/navigation'
import React from 'react'

import { PostType } from '@/types/auth.type'

import { getPostDetails } from '../layout'
import Comments from './Comments'
import FormComment from './FormComment'

const CommentPage = async ({ params }: { params: { username: string; postSlug: string } }) => {
  let post: PostType
  try {
    post = await getPostDetails(params.postSlug)
  } catch (error) {
    console.error('Error fetching data:', error)
    notFound()
  }

  return (
    <div className='space-y-4'>
      <FormComment postId={post.id} />
      <Comments postId={post.id} authorPostId={post.createdBy.id} />
    </div>
  )
}

export default CommentPage
