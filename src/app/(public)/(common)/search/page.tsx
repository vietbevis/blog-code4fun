'use client'

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

import Icon from '@/components/ui/icon'
import { Input } from '@/components/ui/input'

import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'

import HomePage from '../(home)/page'
import PostListSearch from './PostListSearch'

const TagsPage = ({ searchParams }: { searchParams: { q: string } }) => {
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    replace(`${pathname}?${params.toString()}`)
  }, 500)

  return (
    <>
      <div className={'relative w-full md:hidden'}>
        <Input
          type='text'
          placeholder='Search every thing...'
          className='h-10 bg-card pl-10'
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.q?.toString()}
        />
        <Icon name='Search' className='absolute top-1/2 size-10 -translate-y-1/2 p-2' />
      </div>
      <div className='mx-auto w-full flex-1 rounded-md border border-input bg-card p-4 text-center'>
        <h1 className='truncate text-2xl font-bold capitalize md:text-4xl'>
          {searchParams.q ? `Search results: ${searchParams.q}` : 'Search everything...'}
        </h1>
      </div>
      <>{searchParams.q ? <PostListSearch query={searchParams.q} /> : <HomePage />}</>
    </>
  )
}

export default TagsPage
