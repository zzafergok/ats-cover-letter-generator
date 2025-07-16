import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../index'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  dismissible?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: {
    source?: string
    timestamp: number
    hash: string
  }
}

interface ToastState {
  toasts: Toast[]
  maxToasts: number
  defaultDuration: number
  messageHashes: string[] // Set yerine array kullanıyoruz
}

const initialState: ToastState = {
  toasts: [],
  maxToasts: 5,
  defaultDuration: 5000,
  messageHashes: [], // Set yerine array
}

// Mesaj hash'i oluşturma fonksiyonu
const createMessageHash = (title: string | undefined, message: string, type: string): string => {
  const baseString = `${type}-${title || ''}-${message}`
  // Simple hash function for better performance
  let hash = 0
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// Benzer toast'ları birleştirme fonksiyonu
const shouldMergeToast = (existingToast: Toast, newToast: Omit<Toast, 'id'>): boolean => {
  return (
    existingToast.type === newToast.type &&
    existingToast.title === newToast.title &&
    existingToast.message === newToast.message
  )
}

// Hash array'ini temizleme utility fonksiyonu
const cleanupHashArray = (hashes: string[], currentTime: number, toasts: Toast[]): string[] => {
  const activeHashes = toasts
    .filter((toast) => toast.metadata?.hash && currentTime - toast.metadata.timestamp < 10000)
    .map((toast) => toast.metadata!.hash)

  return hashes.filter((hash) => activeHashes.includes(hash))
}

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: {
      reducer: (state, action: PayloadAction<Toast>) => {
        const newToast = action.payload
        const messageHash = newToast.metadata?.hash || ''
        const currentTime = Date.now()

        // Hash array'ini temizle
        state.messageHashes = cleanupHashArray(state.messageHashes, currentTime, state.toasts)

        // Aynı mesajın hash'i varsa ve son 3 saniye içinde eklenmişse, yeni toast ekleme
        if (messageHash && state.messageHashes.includes(messageHash)) {
          const existingToast = state.toasts.find(
            (toast) => toast.metadata?.hash === messageHash && currentTime - (toast.metadata?.timestamp || 0) < 3000,
          )

          if (existingToast) {
            return // Duplicate toast'u ekleme
          }
        }

        // Benzer toast'ları kontrol et
        const existingIndex = state.toasts.findIndex((toast) => shouldMergeToast(toast, newToast))

        if (existingIndex !== -1) {
          // Mevcut toast'u güncelle
          state.toasts[existingIndex] = {
            ...state.toasts[existingIndex],
            metadata: {
              ...state.toasts[existingIndex].metadata!,
              timestamp: currentTime,
            },
          }
          return
        }

        // Hash'i kaydet (array'e push)
        if (messageHash && !state.messageHashes.includes(messageHash)) {
          state.messageHashes.push(messageHash)
          // Array boyutunu sınırla
          if (state.messageHashes.length > 50) {
            state.messageHashes = state.messageHashes.slice(-30)
          }
        }

        // Maksimum toast sayısını kontrol et
        if (state.toasts.length >= state.maxToasts) {
          const removedToast = state.toasts.shift()
          if (removedToast?.metadata?.hash) {
            const hashIndex = state.messageHashes.indexOf(removedToast.metadata.hash)
            if (hashIndex > -1) {
              state.messageHashes.splice(hashIndex, 1)
            }
          }
        }

        state.toasts.push(newToast)
      },
      prepare: (toastData: Omit<Toast, 'id' | 'metadata'>) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const timestamp = Date.now()
        const hash = createMessageHash(toastData.title, toastData.message, toastData.type)

        return {
          payload: {
            ...toastData,
            id,
            duration: toastData.duration || 5000,
            dismissible: toastData.dismissible ?? true,
            position: toastData.position || 'top-right',
            metadata: {
              timestamp,
              hash,
              source: 'manual',
            },
          },
        }
      },
    },

    removeToast: (state, action: PayloadAction<string>) => {
      const toastIndex = state.toasts.findIndex((toast) => toast.id === action.payload)
      if (toastIndex !== -1) {
        const removedToast = state.toasts[toastIndex]
        if (removedToast.metadata?.hash) {
          const hashIndex = state.messageHashes.indexOf(removedToast.metadata.hash)
          if (hashIndex > -1) {
            state.messageHashes.splice(hashIndex, 1)
          }
        }
        state.toasts.splice(toastIndex, 1)
      }
    },

    clearAllToasts: (state) => {
      state.toasts = []
      state.messageHashes = []
    },

    updateToast: (state, action: PayloadAction<{ id: string; updates: Partial<Toast> }>) => {
      const { id, updates } = action.payload
      const toastIndex = state.toasts.findIndex((toast) => toast.id === id)

      if (toastIndex !== -1) {
        state.toasts[toastIndex] = {
          ...state.toasts[toastIndex],
          ...updates,
          metadata: {
            ...state.toasts[toastIndex].metadata!,
            timestamp: Date.now(),
          },
        }
      }
    },

    cleanupExpiredHashes: (state) => {
      const currentTime = Date.now()
      state.messageHashes = cleanupHashArray(state.messageHashes, currentTime, state.toasts)
    },
  },
})

// Actions
export const { showToast, removeToast, clearAllToasts, updateToast, cleanupExpiredHashes } = toastSlice.actions

// Selectors
export const selectToasts = (state: RootState) => state.toast.toasts
export const selectToastById = (state: RootState, id: string) => state.toast.toasts.find((toast) => toast.id === id)
export const selectToastsByType = (state: RootState, type: Toast['type']) =>
  state.toast.toasts.filter((toast) => toast.type === type)
export const selectToastCount = (state: RootState) => state.toast.toasts.length

// Async actions
export const showTemporaryToast = (toast: Omit<Toast, 'id' | 'metadata'>) => (dispatch: any) => {
  const toastAction = showToast(toast)
  dispatch(toastAction)

  const duration = toast.duration || 5000

  setTimeout(() => {
    dispatch(removeToast(toastAction.payload.id))
  }, duration)
}

export default toastSlice.reducer
export type { Toast, ToastState }
