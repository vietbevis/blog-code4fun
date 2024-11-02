import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import envConfig from '@/configs/envConfig'

import { AccountType, PostType } from '@/types/auth.type'

import { formatDate } from '@/lib/format'
import { checkImageURL } from '@/lib/utils'
import { baseOpenGraph } from '@/shared-metadata'

import { getPostDetails, getUserDetails } from './layout'
import RenderPostDetails from './render'

type PageProps = {
  params: { username: string; postSlug: string }
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
  const url = envConfig.NEXT_PUBLIC_API_URL + `/${user.userName}/${post.slug}`

  return {
    title: `${post.title} | ${user.name}'s Post`,
    description: post.shortDescription || `Read ${user.name}'s post: ${post.title}`,
    openGraph: {
      ...baseOpenGraph,
      title: `${post.title} | ${user.name}'s Post`,
      description: post.shortDescription || `Read ${user.name}'s post: ${post.title}`,
      url,
      images: [{ url: checkImageURL(post.thumbnails[0]) }]
    },
    alternates: {
      canonical: url
    }
  }
}

export default async function DetailsPost({ params }: PageProps) {
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

  const { createdDate, title, thumbnails } = post
  const { name, userName, profile } = user

  return (
    <div className='w-full rounded-lg border-input sm:border sm:bg-card'>
      <div className='aspect-[2/1] w-full overflow-hidden md:aspect-[5/2]'>
        <Image
          src={checkImageURL(thumbnails[0])}
          alt={title}
          width={1920}
          height={768}
          className='size-full rounded-t-lg object-cover'
          loading='lazy'
        />
      </div>
      <div className='col-span-7 space-y-10 pt-4 sm:p-4 md:p-4 md:py-8 md:pl-10 md:pr-6 lg:col-span-5'>
        <header className='flex items-center gap-4'>
          <Link href={`/${userName}`}>
            <Avatar className='size-10 ring-1 ring-slate-200 ring-offset-1'>
              <AvatarImage src={checkImageURL(profile?.avatarUrl)} alt={name} />
              <AvatarFallback className='text-sm'>{name.charAt(0).toUpperCase()}</AvatarFallback>
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
  )
}
