/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  action?: ToastAction
  hideProgressBar?: boolean
}

interface ToastState {
  toasts: Toast[]
  maxToasts: number
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  setMaxToasts: (max: number) => void
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set, get) => ({
      toasts: [],
      maxToasts: 5,

      addToast: (toast) => {
        const id = generateId()
        const duration = toast.duration ?? (toast.persistent ? 0 : 5000)
        const newToast: Toast = {
          ...toast,
          id,
          duration,
          persistent: toast.persistent ?? false,
          hideProgressBar: toast.hideProgressBar ?? false,
        }

        set((state) => {
          let updatedToasts = [...state.toasts, newToast]

          // Maksimum toast sayısını kontrol et
          if (updatedToasts.length > state.maxToasts) {
            updatedToasts = updatedToasts.slice(-state.maxToasts)
          }

          return { toasts: updatedToasts }
        })

        // Otomatik kaldırma (persistent olmayan toast'lar için)
        if (!toast.persistent && duration > 0) {
          setTimeout(() => {
            get().removeToast(id)
          }, duration)
        }

        return id
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        })),

      clearToasts: () => set({ toasts: [] }),

      setMaxToasts: (max) => set({ maxToasts: Math.max(1, max) }),
    }),
    { name: 'toast-store' },
  ),
)

// Enhanced hook with better API
export const useToast = () => {
  const { addToast, removeToast, clearToasts } = useToastStore()

  return {
    success: (
      message: string,
      title?: string,
      options?: Partial<Pick<Toast, 'duration' | 'persistent' | 'action' | 'hideProgressBar'>>,
    ) => addToast({ type: 'success', message, title, hideProgressBar: false, ...options }),

    error: (
      message: string,
      title?: string,
      options?: Partial<Pick<Toast, 'duration' | 'persistent' | 'action' | 'hideProgressBar'>>,
    ) => addToast({ type: 'error', message, title, duration: 7000, hideProgressBar: false, ...options }),

    warning: (
      message: string,
      title?: string,
      options?: Partial<Pick<Toast, 'duration' | 'persistent' | 'action' | 'hideProgressBar'>>,
    ) => addToast({ type: 'warning', message, title, duration: 6000, hideProgressBar: false, ...options }),

    info: (
      message: string,
      title?: string,
      options?: Partial<Pick<Toast, 'duration' | 'persistent' | 'action' | 'hideProgressBar'>>,
    ) => addToast({ type: 'info', message, title, hideProgressBar: false, ...options }),

    custom: (toast: Omit<Toast, 'id'>) => addToast({ hideProgressBar: false, ...toast }),

    remove: removeToast,
    clear: clearToasts,

    promise: <T>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: any) => string)
      },
    ) => {
      const loadingToastId = addToast({
        type: 'info',
        message: loading,
        persistent: true,
        hideProgressBar: true,
      })

      return promise
        .then((data) => {
          removeToast(loadingToastId)
          const successMessage = typeof success === 'function' ? success(data) : success
          addToast({ type: 'success', message: successMessage, hideProgressBar: false })
          return data
        })
        .catch((err) => {
          removeToast(loadingToastId)
          const errorMessage = typeof error === 'function' ? error(err) : error
          addToast({ type: 'error', message: errorMessage, duration: 7000, hideProgressBar: false })
          throw err
        })
    },
  }
}
