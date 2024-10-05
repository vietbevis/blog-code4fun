import { Control, FieldValues, Path } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './form'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  label: string
  name: Path<T>
  Component: React.ElementType
  className?: string
  required?: boolean
  placeholder?: string
  description?: string
  autoFocus?: boolean
}

const FormFields = <T extends FieldValues>({
  control,
  label,
  name,
  Component,
  className = '',
  required = false,
  placeholder,
  description = '',
  autoFocus = false
}: FormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { invalid } }) => (
        <FormItem className='space-y-1'>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Component
              {...field}
              autoFocus={autoFocus || invalid}
              className={className}
              required={required}
              placeholder={placeholder}
            />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default FormFields
