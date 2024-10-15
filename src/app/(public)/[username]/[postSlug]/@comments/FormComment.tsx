'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import UnauthenticatedWrapper from '@/components/UnauthenicatedWrapper'
import MinimalTiptapCommentsEditor from '@/components/minimal-tiptap/minimal-tiptap-comments'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { useCreateComment } from '@/services/queries/comments'

import useAuthStore from '@/stores/auth.store'
import useLoadingStore from '@/stores/loading'

import { CommentBodyType, FormCommentSchema } from '@/schemas/auth.schema'

interface FormCommentProps {
  postId: string
  parentCommentId?: string
}

const FormComment = ({ postId, parentCommentId = '' }: FormCommentProps) => {
  const { isAuth } = useAuthStore()
  const { setIsLoading } = useLoadingStore()
  const { mutateAsync: createComment, isPending } = useCreateComment()
  const form = useForm<CommentBodyType>({
    resolver: zodResolver(FormCommentSchema),
    defaultValues: {
      content: '<p></p>',
      postId,
      parentCommentId
    }
  })

  useEffect(() => {
    setIsLoading(isPending)
  }, [isPending, setIsLoading])

  // 2. Define a submit handler.
  async function onSubmit(data: CommentBodyType) {
    if (isPending) return
    try {
      await createComment(data)
      form.reset()
    } catch (error) {
      console.log('🚀 ~ file: FormComment.tsx:48 ~ onSubmit ~ error:', error)
    }
  }
  return (
    <UnauthenticatedWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' autoComplete='false'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='sr-only'>Content</FormLabel>
                <FormControl>
                  <MinimalTiptapCommentsEditor
                    value={field.value}
                    onChange={field.onChange}
                    className='w-full'
                    editorContentClassName='p-5'
                    output='html'
                    placeholder={isAuth ? 'Write a comment...' : 'Sign in to comment'}
                    autofocus={false}
                    editable={true}
                    editorClassName='focus:outline-none'
                    immediatelyRender={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </UnauthenticatedWrapper>
  )
}

export default FormComment
