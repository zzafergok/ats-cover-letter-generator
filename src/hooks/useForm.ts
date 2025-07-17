/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo } from 'react'

import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useForm as useReactHookForm, UseFormProps } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

/**
 * Enhanced form hook that combines React Hook Form with Zod validation
 * and adds internationalization support for error messages
 */
export function useForm<T extends z.ZodTypeAny>(schema: T, options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>) {
  const { t } = useTranslation()

  // Create enhanced schema with custom error map
  const enhancedSchema = useMemo(() => {
    const errorMap: z.ZodErrorMap = (issue, ctx) => {
      let message: string | undefined = issue.message

      // Map Zod error codes to translation keys
      switch (issue.code) {
        case z.ZodIssueCode.invalid_type:
          if (issue.received === 'undefined' || issue.received === 'null') {
            message = t('validation.required')
          } else {
            message = t('validation.invalidType', {
              expected: issue.expected,
              received: issue.received,
            })
          }
          break
        case z.ZodIssueCode.too_small:
          if (issue.type === 'string') {
            message = t('validation.minLength', { min: issue.minimum })
          } else if (issue.type === 'number') {
            message = t('validation.minValue', { min: issue.minimum })
          } else if (issue.type === 'array') {
            message = t('validation.minItems', { min: issue.minimum })
          }
          break
        case z.ZodIssueCode.too_big:
          if (issue.type === 'string') {
            message = t('validation.maxLength', { max: issue.maximum })
          } else if (issue.type === 'number') {
            message = t('validation.maxValue', { max: issue.maximum })
          } else if (issue.type === 'array') {
            message = t('validation.maxItems', { max: issue.maximum })
          }
          break
        case z.ZodIssueCode.invalid_string:
          if (issue.validation === 'email') {
            message = t('validation.email')
          } else if (issue.validation === 'url') {
            message = t('validation.url')
          } else if (issue.validation === 'regex') {
            message = t('validation.pattern')
          } else {
            message = t('validation.invalidFormat')
          }
          break
        case z.ZodIssueCode.invalid_enum_value:
          message = t('validation.invalidOption', {
            options: Array.isArray(issue.options) ? issue.options.join(', ') : String(issue.options),
          })
          break
        case z.ZodIssueCode.custom:
          message = issue.message || t('validation.custom')
          break
        default:
          message = message || t('validation.default')
          break
      }

      return { message: message || ctx.defaultError }
    }

    // Set global error map temporarily and create new schema instance
    const originalErrorMap = z.getErrorMap()
    z.setErrorMap(errorMap)

    // Parse and recreate schema to inherit error map
    const schemaJson = JSON.stringify(schema)
    const recreatedSchema = JSON.parse(schemaJson)

    // Restore original error map
    z.setErrorMap(originalErrorMap)

    // Return schema with proper typing
    return schema._def ? schema : (recreatedSchema as T)
  }, [schema, t])

  // Create resolver with type assertion to bypass TypeScript issues
  const resolver = useMemo(() => {
    return zodResolver(enhancedSchema as any)
  }, [enhancedSchema])

  // Return the useForm hook with our custom resolver
  return useReactHookForm<z.infer<T>>({
    resolver,
    mode: 'onChange',
    ...options,
  })
}
