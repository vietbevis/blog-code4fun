import React from 'react'

import { Skeleton } from '../ui/skeleton'

const PostSkeleton = () => {
  return (
    <div className='w-full rounded-lg border border-input bg-card p-4'>
      <div className='flex flex-1 flex-col-reverse items-center justify-between gap-2 sm:flex-row'>
        <div className='w-full'>
          <div className='mt-2 sm:ml-10'>
            {/* Title */}
            <Skeleton className='h-6 w-full rounded sm:w-3/4' />
            {/* Description */}
            <Skeleton className='mt-2 h-4 w-full rounded sm:w-4/5' />
            <Skeleton className='mt-1 h-4 w-full rounded sm:w-4/5' />
            {/* Tags */}
            <div className='my-4 flex flex-wrap gap-1'>
              <Skeleton className='h-4 w-16 rounded' />
              <Skeleton className='h-4 w-16 rounded' />
              <Skeleton className='h-4 w-16 rounded' />
            </div>
          </div>
        </div>
        <div className='size-full max-h-60 shrink-0 overflow-hidden rounded-md sm:max-h-28 sm:w-40 sm:max-w-40'>
          <Skeleton className='aspect-video size-full' />
        </div>
      </div>

      {/* Like, Comments, Save */}
      <div className='flex items-center gap-2 sm:ml-7'>
        <Skeleton className='size-8 rounded-full' />
        <Skeleton className='h-6 w-24 rounded' />
        <Skeleton className='ml-auto h-6 w-16 rounded' />
        <Skeleton className='size-8 rounded-full' />
      </div>
    </div>
  )
}

export default PostSkeleton
