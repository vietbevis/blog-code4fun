import { cookies } from 'next/headers'
import React from 'react'

import PostService from '@/services/post.service'

import { CategoryResponseType, DraftPostResponseType, TagsResponseType } from '@/types/auth.type'

import { EKeyToken } from '@/constants/enum'

import FormNewPost from './FormNewPost'

export async function generateMetadata() {
  return {
    title: 'Create new post',
    description: 'Create new post'
  }
}

const NewsPage = async () => {
  const cookieStore = cookies()
  const accessToken = cookieStore.get(EKeyToken.ACCESS_TOKEN)?.value || ''
  let data:
    | [
        { status: number; payload: TagsResponseType },
        { status: number; payload: CategoryResponseType },
        { status: number; payload: DraftPostResponseType }
      ]
    | [] = []

  try {
    data = await Promise.all([
      PostService.getTags(),
      PostService.getCategory({}),
      PostService.sGetDraft(accessToken)
    ])
  } catch (error: any) {
    return <div>Failed to load data {error.message}</div>
  }

  return (
    <FormNewPost
      tags={data[0].payload.details}
      categories={data[1].payload.details.records}
      draft={data[2].payload.details}
    />
  )
}

export default NewsPage
