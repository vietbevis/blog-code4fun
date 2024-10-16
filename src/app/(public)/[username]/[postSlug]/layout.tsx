import { notFound } from 'next/navigation'
import React from 'react'

import { CardAuthorDetailPost } from '@/components/author'
import { ButtonLike, ButtonShare } from '@/components/buttons'

import AccountService from '@/services/account.service'
import PostService from '@/services/post'

import { AccountType, PostType } from '@/types/auth.type'

type LayoutProps = {
  children: React.ReactNode
  comments: React.ReactNode
  params: { username: string; postSlug: string }
}

export async function getPostDetails(slug: string): Promise<PostType> {
  const data = await PostService.getDetail(slug)
  if (!data?.payload?.details) {
    throw new Error('Failed to fetch post details')
  }
  return data.payload.details
}

export async function getUserDetails(username: string): Promise<AccountType> {
  const data = await AccountService.getUser(username)
  if (!data?.payload?.details) {
    throw new Error('Failed to fetch user details')
  }
  return data.payload.details
}

export default async function Layout({ children, comments, params }: LayoutProps) {
  let post: PostType
  let user: AccountType

  try {
    ;[post, user] = await Promise.all([
      getPostDetails(params.postSlug),
      getUserDetails(params.username)
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
    notFound()
  }

  return (
    <div className='pb-20 pt-4 md:container sm:bg-background md:pb-4'>
      <article className='gap-4 sm:flex'>
        <aside className='fixed bottom-0 left-0 z-[999] mt-16 grid h-14 w-screen grid-cols-2 place-items-center gap-2 rounded-md border-t border-t-input bg-card sm:static sm:right-full sm:top-20 sm:h-fit sm:w-10 sm:grid-cols-1 sm:grid-rows-3 sm:rounded-none sm:border-none sm:bg-transparent'>
          <ButtonLike post={post} />
          <ButtonShare />
        </aside>
        <div className='flex w-full flex-col gap-4 lg:flex-row'>
          <main className='flex-1 space-y-4'>
            {children}
            <div className='w-full rounded-lg border border-input bg-card'>{comments}</div>
          </main>
          <aside className='basis-[28%]'>
            <CardAuthorDetailPost createdBy={user} />
          </aside>
        </div>
      </article>
    </div>
  )
}
