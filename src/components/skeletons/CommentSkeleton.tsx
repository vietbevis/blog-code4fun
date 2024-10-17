import React from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

interface CommentSkeletonProps {
  className?: string
}

const CommentSkeleton: React.FC<CommentSkeletonProps> = ({ className }) => {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className='flex flex-row items-center space-x-4 p-4'>
        <Skeleton className='size-12 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-4 w-[200px]' />
          <Skeleton className='h-3 w-[150px]' />
        </div>
      </CardHeader>
      <CardContent className='p-4'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='mt-2 h-4 w-[90%]' />
        <Skeleton className='mt-2 h-4 w-4/5' />
      </CardContent>
      <CardFooter className='flex justify-between p-4'>
        <Skeleton className='h-8 w-20' />
        <Skeleton className='h-8 w-20' />
      </CardFooter>
    </Card>
  )
}

interface CommentSkeletonListProps {
  count?: number
  className?: string
}

export const CommentSkeletonList: React.FC<CommentSkeletonListProps> = ({
  count = 3,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  )
}

export default CommentSkeleton
