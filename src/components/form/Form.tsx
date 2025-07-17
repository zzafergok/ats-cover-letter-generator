/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext } from 'react'

import { UseFormReturn, FieldPath, FieldValues } from 'react-hook-form'

import { cn } from '@/lib/utils'

interface FormContextValue<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
}

const FormContext = createContext<FormContextValue<any> | null>(null)

function useFormContext<T extends FieldValues = FieldValues>() {
  const context = useContext(FormContext) as FormContextValue<T> | null
  if (!context) {
    throw new Error('Form bileşenleri Form.Root içinde kullanılmalıdır')
  }
  return context
}

interface FormRootProps<T extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void | Promise<void>
}

function FormRoot<T extends FieldValues = FieldValues>({
  form,
  onSubmit,
  className,
  children,
  ...props
}: FormRootProps<T>) {
  return (
    <FormContext.Provider value={{ form }}>
      <form className={cn('space-y-6', className)} onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

interface FormFieldProps<T extends FieldValues = FieldValues> {
  name: FieldPath<T>
  label?: string
  required?: boolean
  description?: string
  className?: string
  children: (field: any) => React.ReactNode
}

function FormField<T extends FieldValues = FieldValues>({
  name,
  label,
  required,
  description,
  className,
  children,
}: FormFieldProps<T>) {
  const { form } = useFormContext<T>()
  const fieldState = form.getFieldState(name, form.formState)
  const error = fieldState.error?.message

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className='text-sm font-medium leading-none'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      {form.register &&
        children({
          ...form.register(name),
          error: !!error,
          'aria-invalid': !!error,
          'aria-describedby': error ? `${name}-error` : undefined,
        })}

      {description && <p className='text-xs text-neutral-500'>{description}</p>}

      {error && (
        <p id={`${name}-error`} className='text-xs text-red-500 font-medium'>
          {error}
        </p>
      )}
    </div>
  )
}

export const Form = {
  Root: FormRoot,
  Field: FormField,
}
