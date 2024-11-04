/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { PostType } from '@/types/auth.type'

import { formatDate } from '@/lib/format'
import { checkImageURL } from '@/lib/utils'

import InfoHover from '../ui/InfoHover'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

const WORD_PER_MINUTE = 225

function calculateReadingTime(content: string) {
  const words = content.trim().split(/\s+/)
  const wordCount = words.length

  const minutes = Math.ceil(wordCount / WORD_PER_MINUTE)

  // Handle edge cases
  if (minutes === 0) {
    return '< 1 min read'
  }

  return `${minutes} min read`
}

const Post = ({ data }: { data: PostType }) => {
  return (
    <div className='w-full space-y-4 rounded-lg border border-input bg-card p-4'>
      <div className='flex flex-1 flex-col-reverse items-center justify-between gap-2 sm:flex-row'>
        <div className='w-full'>
          <div className='flex items-center gap-1'>
            <InfoHover data={data.createdBy}>
              <Avatar className='size-8'>
                <AvatarImage src={checkImageURL(data.createdBy.profile?.avatarUrl)} />
                <AvatarFallback>{data.createdBy.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </InfoHover>
            <div className='flex flex-col'>
              <InfoHover
                data={data.createdBy}
                className='cursor-pointer rounded-md px-1 hover:bg-background'
              >
                <h3 className='cursor-pointer text-base font-bold'>{data.createdBy.name}</h3>
              </InfoHover>
              <span className='px-1 text-xs text-muted-foreground'>
                {formatDate(data.createdDate)}
              </span>
            </div>
          </div>
          <div className='mt-2 sm:ml-9'>
            {/* Title */}
            <Link
              href={`/${data.createdBy.userName}/${data.slug}`}
              className='line-clamp-3 text-2xl font-bold'
            >
              {data.title}
            </Link>
            {/* Description */}
            <p className='mt-2 line-clamp-2 text-sm text-muted-foreground sm:line-clamp-3 sm:text-base'>
              {data.shortDescription}
            </p>
          </div>
        </div>
        <div className='aspect-video size-full max-h-60 shrink-0 overflow-hidden rounded-md sm:w-40 md:w-48 lg:w-56'>
          <Image
            src={checkImageURL(data.thumbnails[0])}
            alt=''
            width={700}
            height={550}
            className='aspect-video size-full object-cover object-center'
          />
        </div>
      </div>

      <div className='flex items-center gap-3 sm:ml-9'>
        <Link href={`/category/${data.category.name}`}>
          <Button variant={'outline'} size={'sm'} className='rounded-full opacity-70'>
            {data.category.name}
          </Button>
        </Link>
        <Link href={`/${data.createdBy.userName}/${data.slug}`}>
          <Button variant={'outline'} size={'sm'} className='rounded-full opacity-70'>
            {calculateReadingTime(data.content)}
          </Button>
        </Link>
      </div>

      {/* Like, Comments, Save */}
      {/* <div className='flex items-center gap-2 sm:ml-7'>
        <Link
          title='Like'
          href={`/${data.createdBy.userName}/${data.slug}`}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'items-center gap-2 px-1 py-0'
          )}
        >
          <IconSparkleHeart />
          <span>{data.favourite}</span>
          <span className='hidden sm:inline'>Like</span>
        </Link>
        <Link
          title='Comments'
          href={`/${data.createdBy.userName}/${data.slug}#comments`}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'items-center gap-2 px-1 py-0'
          )}
        >
          <IconComment />
          <span>{data.totalComments}</span>
          <span className='hidden sm:inline'>Comments</span>
        </Link>
        <p className="ml-auto text-sm">Save</p>
        <Button variant={'ghost'} size={'icon'} title='Save' className='ml-auto'>
          <IconSave />
        </Button>
      </div> */}
    </div>
  )
}

export default Post
