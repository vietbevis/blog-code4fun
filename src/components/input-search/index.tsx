'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { KeyboardEvent, Suspense, useEffect, useRef, useState } from 'react'

import { useInfiniteScrollSearchPosts } from '@/services/queries/post'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { useWindowEvent } from '@/hooks/useWindowEvent'

import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

import { Button } from '../ui/button'
import Icon from '../ui/icon'
import InfiniteScrollContainer from '../ui/infinite-scoll-container'
import { Input } from '../ui/input'

const InputSearchComponent = React.memo(({ className }: { className?: string }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, push } = useRouter()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const popoverRef = useClickOutside(() => setOpen(false))
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    if (pathname.startsWith('/search')) {
      replace(`${pathname}?${params.toString()}`)
    } else {
      setQuery(term)
    }
    setSelectedIndex(-1)
  }, 500)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteScrollSearchPosts(query)
  const posts = data ? data.pages.flatMap((page) => page.posts) : []
  const showPopover = !pathname.startsWith('/search') && query && open

  useWindowEvent('scroll', () => {
    inputRef.current?.blur()
    setOpen(false)
  })

  const searchParamsResult = new URLSearchParams({
    ...(query && { q: query })
  })

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prevIndex) => {
        const nextIndex = prevIndex < posts.length - 1 ? prevIndex + 1 : prevIndex
        itemRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        return nextIndex
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prevIndex) => {
        const nextIndex = prevIndex > 0 ? prevIndex - 1 : -1
        itemRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        return nextIndex
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < posts.length) {
        const selectedPost = posts[selectedIndex]
        setOpen(false)
        push(`/${selectedPost.createdBy.userName}/${selectedPost.slug}`)
      } else if (searchParamsResult.toString()) {
        location.href = `/search?${searchParamsResult.toString()}`
      } else {
        push('/search')
      }
    } else if (e.key === 'Escape') {
      e.currentTarget.blur()
      setOpen(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setSelectedIndex(-1)
    }
  }, [open])

  return (
    <>
      <div className={cn('relative hidden w-full md:block', className)}>
        <Button
          variant={'ghost'}
          size={'icon'}
          className={'absolute top-1/2 size-10 -translate-y-1/2 rounded-l-full p-2'}
          onClick={() =>
            searchParamsResult.toString()
              ? (location.href = `/search?${searchParamsResult.toString()}`)
              : push('/search')
          }
        >
          <Icon name='Search' className='size-5 text-muted-foreground' />
        </Button>
        <Input
          ref={inputRef}
          type='search'
          placeholder='Search everything...'
          className='h-10 rounded-full bg-background pl-10'
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('q')?.toString()}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {showPopover && (
          <div
            ref={popoverRef}
            className='absolute inset-x-0 top-full mt-1 overflow-hidden rounded-lg border border-input bg-card shadow-md'
          >
            <div className='flex max-h-96 flex-col divide-y divide-input overflow-y-auto'>
              {status === 'pending' && (
                <div className='grid place-items-center p-4'>
                  <Icon name='LoaderCircle' className='animate-spin' />
                </div>
              )}
              {status !== 'pending' && posts.length === 0 && (
                <div className='p-4 text-center text-muted-foreground'>No results</div>
              )}
              {status !== 'pending' && posts.length > 0 && (
                <InfiniteScrollContainer
                  className='flex flex-col gap-2'
                  onBottomReached={() => {
                    if (hasNextPage && !isFetching) {
                      fetchNextPage()
                    }
                  }}
                >
                  {posts.map((post, index) => (
                    <Link
                      ref={(el) => {
                        itemRefs.current[index] = el
                      }}
                      href={`/${post.createdBy.userName}/${post.slug}`}
                      key={post.id}
                      className={cn(
                        'px-3 py-2',
                        index === selectedIndex && 'bg-accent text-accent-foreground',
                        'hover:bg-accent hover:text-accent-foreground'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <p className='text-sm text-muted-foreground'>@{post.createdBy.userName}</p>
                      <h3 className='text-base font-bold'>{post.title}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {formatDate(post.createdDate)}
                      </p>
                    </Link>
                  ))}
                  {isFetchingNextPage && (
                    <div className='grid place-items-center p-4'>
                      <Icon name='LoaderCircle' className='animate-spin' />
                    </div>
                  )}
                </InfiniteScrollContainer>
              )}
            </div>
          </div>
        )}
      </div>
      {!pathname.startsWith('/search') ? (
        <Button
          variant={'outline'}
          size={'icon'}
          className={cn('shrink-0 rounded-full md:hidden', className)}
          onClick={() => push('/search')}
        >
          <Icon name='Search' className='size-5' />
        </Button>
      ) : (
        <div className={className}></div>
      )}
    </>
  )
})

InputSearchComponent.displayName = 'InputSearchComponent'

export default function InputSearch({ className }: { className?: string }) {
  return (
    <Suspense>
      <InputSearchComponent className={className} />
    </Suspense>
  )
}
