import { Control, FieldValues, Path } from 'react-hook-form'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form'

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
  labelClassName?: string
  maxLength?: number
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
  autoFocus = false,
  labelClassName,
  maxLength
}: FormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { invalid } }) => (
        <FormItem className='space-y-1'>
          <FormLabel className={labelClassName}>{label}</FormLabel>
          <FormControl>
            <Component
              {...field}
              autoFocus={autoFocus || invalid}
              className={className}
              required={required}
              placeholder={placeholder}
              {...(maxLength && { maxLength })}
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
