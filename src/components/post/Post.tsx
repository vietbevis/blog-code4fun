import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { PostType } from '@/types/auth.type'

import { checkImageURL, cn, formatDate } from '@/lib/utils'

import { IconComment, IconSave, IconSparkleHeart } from '../icons'
import { Button, buttonVariants } from '../ui/button'

const Post = ({ data }: { data: PostType }) => {
  return (
    <div className='w-full space-y-4 rounded-lg border border-input bg-card p-4'>
      <div className='flex flex-1 flex-col-reverse items-center justify-between gap-2 sm:flex-row'>
        <div className='w-full'>
          <div className='mt-2 sm:ml-8'>
            {/* Title */}
            <Link
              href={`/${data.createdBy.userName}/${data.slug}`}
              className='line-clamp-3 break-all text-xl font-bold'
            >
              {data.title}
            </Link>
            <span className='text-xs text-muted-foreground'>{formatDate(data.createdDate)}</span>
            {/* Description */}
            <p className='mt-2 line-clamp-2 break-all text-sm text-muted-foreground sm:line-clamp-3 sm:text-base'>
              {data.shortDescription}
            </p>
            {/* Tags */}
            {/* <div className="my-4 mb-2 flex flex-wrap gap-1">
              <ListTags data={data.tags} />
            </div> */}
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

      {/* Like, Comments, Save */}
      <div className='flex items-center gap-2 sm:ml-7'>
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
        {/* <p className="ml-auto text-sm">Save</p> */}
        <Button variant={'ghost'} size={'icon'} title='Save' className='ml-auto'>
          <IconSave />
        </Button>
      </div>
    </div>
  )
}

export default Post
