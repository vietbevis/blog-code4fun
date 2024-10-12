'use client'

// COMMONS
import React from 'react'
// LIBS
import { FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form'

// COMPONENTS
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import Icon from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { Category } from '@/types/auth.type'

import { cn } from '@/lib/utils'

interface FormFieldCustomProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  className?: string
  categories: Category[]
}

const FieldSelectCategory = <T extends FieldValues>({
  categories,
  form,
  name
}: FormFieldCustomProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex w-full flex-col'>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  className={cn(
                    'w-full justify-between bg-card text-base font-normal',
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
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput autoFocus={false} placeholder='Search category...' />
                <CommandList className='w-full'>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        value={category.name}
                        key={category.id}
                        onSelect={() => {
                          form.setValue(name, category.id as PathValue<T, Path<T>>)
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
  )
}

export default FieldSelectCategory
