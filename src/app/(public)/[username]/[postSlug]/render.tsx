'use client'

import copy from 'copy-to-clipboard'
import hljs from 'highlight.js'
import React, { useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'

import ListTags from '@/components/post/ListTags'

import { PostType } from '@/types/auth.type'

import { replaceImageSrc } from '@/lib/utils'

import 'highlight.js/styles/night-owl.css'

const addCopyButton = (el: Element, text: string) => {
  const wrapper = el.parentElement
  if (!wrapper) return

  wrapper.classList.add('relative', 'not-prose', 'rounded-md', 'overflow-hidden', 'group')

  const copyButton = document.createElement('button')
  copyButton.classList.add(
    'absolute',
    'top-2',
    'right-2',
    'p-2',
    'text-gray-500',
    'hover:text-white',
    'transition-colors',
    'border',
    'border-gray-500',
    'rounded-md',
    'opacity-0',
    'group-hover:opacity-100'
  )
  copyButton.innerHTML = `<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
  copyButton.onclick = () => {
    copy(text)
    toast.success('Copied to clipboard!')
  }

  wrapper.appendChild(copyButton)
}

hljs.addPlugin({
  'after:highlightElement': ({ el, text }) => addCopyButton(el, text)
})

const RenderPostDetails: React.FC<{ post: PostType }> = ({ post }) => {
  const highlightCode = useCallback(() => {
    hljs.highlightAll()
  }, [])

  useEffect(() => {
    highlightCode()
  }, [highlightCode])

  const content = useMemo(() => ({ __html: replaceImageSrc(post.content) }), [post.content])

  return (
    <div className='prose prose-base max-w-none overflow-hidden dark:prose-invert md:prose-lg prose-a:italic prose-a:text-blue-500'>
      <h1 className='break-all'>{post.title}</h1>
      <div className='not-prose flex flex-wrap gap-2'>
        <ListTags data={post.tags} />
      </div>
      <p className='break-all'>{post.shortDescription}</p>
      <article dangerouslySetInnerHTML={content} />
    </div>
  )
}

export default React.memo(RenderPostDetails)
