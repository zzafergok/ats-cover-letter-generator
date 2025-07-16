'use client'

import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm as useReactHookForm, UseFormProps } from 'react-hook-form'

/**
 * Enhanced form hook that combines React Hook Form with Zod validation
 * and adds internationalization support for error messages
 */
export function useForm<T extends z.ZodType<any, any>>(
  schema: T,
  options?: Omit<UseFormProps<z.infer<T>>, 'resolver'>,
) {
  const { t } = useTranslation()

  // Create a custom resolver that translates Zod error messages
  const resolver = zodResolver(schema, {
    errorMap: (issue, ctx) => {
      // Translate common error messages
      let message = issue.message

      // Map Zod error codes to translation keys
      switch (issue.code) {
        case z.ZodIssueCode.invalid_type:
          if (issue.received === 'undefined' || issue.received === 'null') {
            message = t('validation.required')
          }
          break
        case z.ZodIssueCode.too_small:
          if (issue.type === 'string') {
            message = t('validation.minLength', { min: issue.minimum })
          }
          break
        case z.ZodIssueCode.too_big:
          if (issue.type === 'string') {
            message = t('validation.maxLength', { max: issue.maximum })
          }
          break
        case z.ZodIssueCode.invalid_string:
          if (issue.validation === 'email') {
            message = t('validation.email')
          } else {
            message = t('validation.invalidFormat')
          }
          break
      }

      return { message: message ?? ctx.defaultError }
    },
  })

  // Return the useForm hook with our custom resolver
  return useReactHookForm<z.infer<T>>({
    resolver,
    ...options,
  })
}
