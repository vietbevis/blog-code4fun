// COMMONS
import React, { Fragment } from 'react'

// COMPONENTS
import BadgeCustom from '@/components/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { AccountType, PostType } from '@/types/auth.type'

// TYPES

const MorePostWithAuthor = async ({
  posts,
  author
}: {
  posts: PostType[]
  author: AccountType
}) => {
  if (!posts.length) {
    return 'No post found...'
  }

  return (
    <Card>
      <CardHeader className='mb-4 space-y-0 border-b border-b-input p-4'>
        <CardTitle className='text-xl'>More with {author.name}</CardTitle>
        <CardDescription className='hidden'></CardDescription>
      </CardHeader>
      <CardContent className='p-4 pt-0'>
        {posts.map((post, index) => (
          <Fragment key={post.id}>
            {index !== 0 && <Separator className='my-4' />}
            <div className='flex items-center justify-between gap-4'>
              <div className='flex flex-col items-start space-y-2'>
                <h3 className='line-clamp-2 text-lg font-semibold'>{post.title}</h3>
                <BadgeCustom
                  // href={`/category/${post.category.id}`}
                  href={`/`}
                  label={post.category.name}
                  className='hidden md:inline-block'
                />
              </div>
            </div>
          </Fragment>
        ))}
      </CardContent>
    </Card>
  )
}

export default MorePostWithAuthor
