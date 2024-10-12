import React from 'react'

import PostService from '@/services/post'

import { CategoryResponseType, TagsResponseType } from '@/types/auth.type'

import FormNewPost from './FormNewPost'

const NewsPage = async () => {
  let data:
    | [
        { status: number; payload: TagsResponseType },
        { status: number; payload: CategoryResponseType }
      ]
    | [] = []

  try {
    data = await Promise.all([PostService.getTags(), PostService.getCategory({})])
  } catch (error: any) {
    return <div>Failed to load data {error.message}</div>
  }

  return <FormNewPost tags={data[0].payload.details} categories={data[1].payload.details.records} />
}

export default NewsPage
