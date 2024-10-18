'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { MinimalTiptapEditor } from '@/components/minimal-tiptap'
import { OptimizedFileUploader } from '@/components/ui/OptimizedFileUploader'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import FormFields from '@/components/ui/form-field'
import Icon from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { MultiSelect } from '@/components/ui/multi-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

import { useCreatePost, useSaveDraft } from '@/services/queries/post.query'

import useDialogStore from '@/stores/dialog.store'
import useLoadingStore from '@/stores/loading'

import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'

import { Category } from '@/types/auth.type'

import { FormNewPostSchema, NewPostBodyType } from '@/schemas/auth.schema'

import ROUTES from '@/constants/route'

import { cn, replaceSpecialChars } from '@/lib/utils'

interface FormNewPostProps {
  tags: string[]
  categories: Category[]
  draft: NewPostBodyType
}

const FormNewPost = ({ tags, categories, draft }: FormNewPostProps) => {
  const { mutateAsync: createPostMutation } = useCreatePost()
  const { isLoading } = useLoadingStore()
  const { mutate: saveDraft } = useSaveDraft()
  const { openDialog } = useDialogStore()
  const router = useRouter()

  const form = useForm<NewPostBodyType>({
    resolver: zodResolver(FormNewPostSchema),
    defaultValues: {
      content: draft.content || '<p></p>',
      thumbnails: draft.thumbnails || [],
      shortDescription: draft.shortDescription || '',
      title: draft.title || '',
      tags: draft.tags || [],
      categoryId: draft.categoryId || ''
    }
  })

  const allFields = useWatch({ control: form.control })

  const handleChange = useDebouncedCallback((data: NewPostBodyType) => {
    try {
      saveDraft(data)
    } catch (error) {
      console.log('🚀 ~ file: FormNewPost.tsx:73 ~ handleChange ~ error:', error)
    }
  }, 2000)

  useEffect(() => {
    handleChange(allFields as NewPostBodyType)
  }, [allFields, handleChange])

  // 2. Define a submit handler.
  async function onSubmit(data: NewPostBodyType) {
    toast.promise(createPostMutation(data), {
      loading: `Uploading 1 post...`,
      success: () => {
        saveDraft({} as NewPostBodyType)
        router.replace(ROUTES.HOME)
        router.refresh()
        form.reset()
        return `Create new post successfully`
      },
      error: `Failed to upload 1 post`
    })
  }

  return (
    <div className='mx-auto mb-10 mt-4 max-w-screen-lg rounded-md border border-input p-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' autoComplete='false'>
          <FormField
            control={form.control}
            name='thumbnails'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OptimizedFileUploader onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormFields
            control={form.control}
            name='title'
            label='Title'
            Component={Input}
            placeholder='Title'
            className='h-auto p-4 text-4xl font-bold placeholder:text-muted-foreground'
            labelClassName='sr-only'
          />
          <FormFields
            control={form.control}
            name='shortDescription'
            label='shortDescription'
            Component={Textarea}
            placeholder='Short description'
            className='h-auto p-4 placeholder:text-muted-foreground'
            labelClassName='sr-only'
            maxLength={300}
          />
          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-full justify-between font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? categories.find((categories) => categories.id === field.value)?.name
                          : 'Select category'}
                        <Icon name='ChevronsUpDown' className='ml-2 size-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0'>
                    <Command>
                      <CommandInput placeholder='Search category...' />
                      <CommandList className='w-full'>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                          {categories.map((category) => (
                            <CommandItem
                              value={category.name}
                              key={category.id}
                              onSelect={() => {
                                form.setValue('categoryId', category.id)
                              }}
                            >
                              <Icon
                                name='Check'
                                className={cn(
                                  'mr-2 size-4',
                                  category.id === field.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {category.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='sr-only'>Content</FormLabel>
                <FormControl>
                  <MultiSelect
                    maxCount={5}
                    variant='inverted'
                    options={tags.map((tag) => ({
                      value: replaceSpecialChars(tag),
                      label: tag
                    }))}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder='Select tags you like...'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='min-h-72'>
                <FormLabel className='sr-only'>Content</FormLabel>
                <FormControl>
                  <MinimalTiptapEditor
                    value={field.value}
                    onChange={field.onChange}
                    className='w-full'
                    editorContentClassName='p-5'
                    output='html'
                    placeholder='Write something...'
                    autofocus={true}
                    editable={true}
                    editorClassName='focus:outline-none'
                    immediatelyRender={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2'>
            <Button
              variant={'destructive'}
              onClick={() => {
                openDialog({ type: 'ConfirmExit' })
              }}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FormNewPost
