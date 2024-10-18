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

import { useCreateComment, useUpdateComment } from '@/services/queries/comments.query'

import useLoadingStore from '@/stores/loading'

import { CommentBodyType, FormCommentSchema } from '@/schemas/auth.schema'

interface FormCommentProps {
  postId: string
  parentCommentId?: string
  type?: 'UPDATE' | 'CREATE'
  defaultValues?: string
  commentId?: string
  onSuccess?: () => void
  level: number
}

const FormComment = ({
  postId,
  parentCommentId = '',
  type = 'CREATE',
  defaultValues = '<p></p>',
  commentId = '',
  onSuccess,
  level
}: FormCommentProps) => {
  const { setIsLoading } = useLoadingStore()
  const { mutateAsync: createComment, isPending } = useCreateComment(level)
  const { mutateAsync: updateComment, isPending: loading } = useUpdateComment(level)
  const form = useForm<CommentBodyType>({
    resolver: zodResolver(FormCommentSchema),
    defaultValues: {
      content: defaultValues,
      postId,
      parentCommentId
    }
  })

  useEffect(() => {
    setIsLoading(isPending)
  }, [isPending, setIsLoading])

  useEffect(() => {
    setIsLoading(loading)
  }, [loading, setIsLoading])

  // 2. Define a submit handler.
  async function onSubmit(data: CommentBodyType) {
    if (isPending) return
    try {
      if (type === 'CREATE') {
        await createComment(data)
      } else {
        await updateComment({ body: data, commentId: commentId })
      }
      if (onSuccess) onSuccess()
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
                    placeholder={'Write a comment...'}
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
