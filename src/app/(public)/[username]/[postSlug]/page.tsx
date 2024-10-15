import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { CardAuthorDetailPost } from '@/components/author'
import { ButtonLike, ButtonShare } from '@/components/buttons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import AccountService from '@/services/account.service'
import PostService from '@/services/post'

import { AccountType, PostType } from '@/types/auth.type'

import { checkImageURL, formatDate } from '@/lib/utils'

import RenderPostDetails from './render'

export async function generateStaticParams() {
  return []
}

async function getPostDetails(slug: string): Promise<PostType> {
  const data = await PostService.getDetail(slug)
  if (!data || !data.payload || !data.payload.details) {
    throw new Error('Failed to fetch post details')
  }
  return data.payload.details
}

async function getUserDetails(username: string): Promise<AccountType> {
  const data = await AccountService.getUser(username)
  if (!data || !data.payload || !data.payload.details) {
    throw new Error('Failed to fetch user details')
  }
  return data.payload.details
}

const DetailsPost = async ({ params }: { params: { username: string; postSlug: string } }) => {
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

  const { createdDate } = post
  const { name, userName, profile } = user

  return (
    <article className='gap-4 sm:flex'>
      <aside className='fixed bottom-0 left-0 z-10 mt-16 grid h-14 w-screen grid-cols-2 place-items-center gap-2 rounded-md border-t border-t-input bg-card sm:static sm:right-full sm:top-20 sm:h-fit sm:w-10 sm:grid-cols-1 sm:grid-rows-3 sm:rounded-none sm:border-none sm:bg-transparent'>
        <ButtonLike post={post} />
        <ButtonShare />
      </aside>
      <div className='flex w-full flex-col gap-4 lg:flex-row'>
        <main className='flex-1'>
          <div className='w-full rounded-lg border-input sm:border sm:bg-card'>
            <div className='aspect-[2/1] w-full overflow-hidden'>
              <Image
                src={checkImageURL(post.thumbnails[0])}
                alt={post.title}
                width={1920}
                height={1080}
                className='size-full rounded-t-lg object-cover'
                priority
              />
            </div>
            <div className='col-span-7 space-y-10 pt-4 sm:p-4 md:p-4 md:py-8 md:pl-10 md:pr-6 lg:col-span-5'>
              <header className='flex items-center gap-4'>
                <Link href={`/${userName}`}>
                  <Avatar className='size-10 ring-1 ring-slate-200 ring-offset-1'>
                    <AvatarImage src={checkImageURL(profile?.avatarUrl)} alt={name} />
                    <AvatarFallback className='text-sm'>
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className='flex flex-col'>
                  <Link
                    href={`/${userName}`}
                    className='line-clamp-1 cursor-pointer text-lg font-bold capitalize'
                  >
                    {name}
                  </Link>
                  <time className='px-1 text-xs text-muted-foreground' dateTime={createdDate}>
                    {formatDate(createdDate)}
                  </time>
                </div>
              </header>
              <RenderPostDetails post={post} />
            </div>
          </div>
        </main>
        <aside className='basis-[28%]'>
          <CardAuthorDetailPost createdBy={user} />
        </aside>
      </div>
    </article>
  )
}

export default DetailsPost
