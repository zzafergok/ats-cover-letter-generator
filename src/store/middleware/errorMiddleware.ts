import { Middleware } from '@reduxjs/toolkit'

import { showToast } from '../slices/toastSlice'

interface ErrorAction {
  type: string
  error: boolean
  payload: {
    message: string
    status?: number
    code?: string
  }
}

export const errorMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)

  if (
    action &&
    typeof action === 'object' &&
    'type' in action &&
    typeof action.type === 'string' &&
    action.type.endsWith('/rejected')
  ) {
    const errorAction = action as ErrorAction

    store.dispatch(
      showToast({
        type: 'error',
        title: 'İşlem Başarısız',
        message: errorAction.payload?.message || 'Beklenmeyen bir hata oluştu',
        duration: 5000,
      }),
    )

    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Redux Error Action')
      console.error('Action:', errorAction.type)
      console.error('Payload:', errorAction.payload)
      console.groupEnd()
    }
  }

  return result
}
