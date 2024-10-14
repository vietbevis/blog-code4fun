import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { CardAuthorDetailPost } from '@/components/author'
import { ButtonLike, ButtonShare } from '@/components/buttons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import PostService from '@/services/post'

import { checkImageURL, formatDate } from '@/lib/utils'

import RenderPostDetails from './render'

export async function generateStaticParams() {
  return []
}

const DetailsPost = async ({ params }: { params: { username: string; postSlug: string } }) => {
  let data = null
  try {
    data = await PostService.getDetail(params.postSlug)
  } catch (error) {
    console.log('🚀 ~ file: page.tsx:31 ~ error:', error)
  }

  if (!data) return notFound()

  const post = data.payload.details
  const { createdBy: author, createdDate } = post
  const { name, userName, profile } = author

  return (
    <div className='gap-4 sm:flex'>
      <div className='fixed bottom-0 left-0 z-10 mt-16 grid h-14 w-screen grid-cols-1 place-items-center gap-2 rounded-md border-t border-t-input bg-card sm:static sm:right-full sm:top-20 sm:h-fit sm:w-10 sm:grid-cols-1 sm:grid-rows-3 sm:rounded-none sm:border-none sm:bg-transparent'>
        <ButtonLike post={post} />
        <ButtonShare />
      </div>
      <div className='flex w-full flex-col gap-4 lg:flex-row'>
        <div className='flex-1'>
          <div className='w-full rounded-lg border-input sm:border sm:bg-card'>
            <div className={'aspect-[2/1] w-full overflow-hidden'}>
              <Image
                src={checkImageURL(post.thumbnails[0])}
                alt={post.title}
                width={1920}
                height={1080}
                className={'size-full rounded-t-lg object-cover'}
              />
            </div>
            <div
              className={
                'col-span-7 space-y-4 pt-4 sm:p-4 md:p-4 md:py-8 md:pl-10 md:pr-6 lg:col-span-5'
              }
            >
              <div className='flex items-center gap-4'>
                <Link href={`/${userName}`}>
                  <Avatar className='size-10 ring-1 ring-slate-200 ring-offset-1'>
                    <AvatarImage src={checkImageURL(profile?.avatarUrl)} />
                    <AvatarFallback className='text-sm'>
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className='flex flex-col'>
                  <Link
                    href={`/${userName}`}
                    className={'line-clamp-1 cursor-pointer text-lg font-bold capitalize'}
                  >
                    {name}
                  </Link>
                  <span className='px-1 text-xs text-muted-foreground'>
                    {formatDate(createdDate)}
                  </span>
                </div>
              </div>
              <RenderPostDetails post={post} />
            </div>
          </div>
        </div>
        <div className='basis-[28%]'>
          <CardAuthorDetailPost createdBy={post.createdBy} />
        </div>
      </div>
    </div>
  )
}

export default DetailsPost
