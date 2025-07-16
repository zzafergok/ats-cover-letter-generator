import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { RootState } from '../index'

interface LoadingItem {
  id: string
  message?: string
  progress?: number
  type: 'global' | 'component' | 'page' | 'api'
  startTime: number
}

interface LoadingState {
  items: Record<string, LoadingItem>
  globalLoading: boolean
  pageLoading: boolean
}

const initialState: LoadingState = {
  items: {},
  globalLoading: false,
  pageLoading: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: {
      reducer: (state, action: PayloadAction<LoadingItem>) => {
        state.items[action.payload.id] = action.payload

        // Update global flags
        if (action.payload.type === 'global') {
          state.globalLoading = true
        }
        if (action.payload.type === 'page') {
          state.pageLoading = true
        }
      },
      prepare: (payload: Omit<LoadingItem, 'startTime'>) => ({
        payload: {
          ...payload,
          startTime: Date.now(),
        },
      }),
    },

    updateLoading: (state, action: PayloadAction<{ id: string; progress?: number; message?: string }>) => {
      const { id, progress, message } = action.payload
      if (state.items[id]) {
        if (progress !== undefined) {
          state.items[id].progress = progress
        }
        if (message !== undefined) {
          state.items[id].message = message
        }
      }
    },

    stopLoading: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const item = state.items[id]

      if (item) {
        delete state.items[id]

        // Update global flags
        const hasGlobalLoading = Object.values(state.items).some((item) => item.type === 'global')
        const hasPageLoading = Object.values(state.items).some((item) => item.type === 'page')

        state.globalLoading = hasGlobalLoading
        state.pageLoading = hasPageLoading
      }
    },

    clearAllLoading: (state) => {
      state.items = {}
      state.globalLoading = false
      state.pageLoading = false
    },

    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload

      if (!action.payload) {
        // Remove all global loading items
        Object.keys(state.items).forEach((id) => {
          if (state.items[id]?.type === 'global') {
            delete state.items[id]
          }
        })
      }
    },

    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload

      if (!action.payload) {
        // Remove all page loading items
        Object.keys(state.items).forEach((id) => {
          if (state.items[id]?.type === 'page') {
            delete state.items[id]
          }
        })
      }
    },
  },
})

// Actions
export const { startLoading, updateLoading, stopLoading, clearAllLoading, setGlobalLoading, setPageLoading } =
  loadingSlice.actions

// Selectors
export const selectLoadingItems = (state: RootState) => state.loading.items
export const selectGlobalLoading = (state: RootState) => state.loading.globalLoading
export const selectPageLoading = (state: RootState) => state.loading.pageLoading
export const selectIsLoading = (state: RootState, id: string) => !!state.loading.items[id]
export const selectLoadingProgress = (state: RootState, id: string) => state.loading.items[id]?.progress
export const selectLoadingMessage = (state: RootState, id: string) => state.loading.items[id]?.message

// Complex selectors
export const selectLoadingByType = (state: RootState, type: LoadingItem['type']) =>
  (Object.values(state.loading.items) as LoadingItem[]).filter((item: LoadingItem) => item.type === type)

export const selectLongestRunningLoading = (state: RootState) => {
  const items = Object.values(state.loading.items) as LoadingItem[]
  if (items.length === 0) return null

  return items.reduce((longest, current) => (current.startTime < longest.startTime ? current : longest))
}

export const selectAnyLoading = (state: RootState) => Object.keys(state.loading.items).length > 0

// Async actions for common loading patterns
export const withLoading =
  <T extends any[], R>(
    loadingId: string,
    asyncFn: (...args: T) => Promise<R>,
    options: {
      type?: LoadingItem['type']
      message?: string
      onProgress?: (progress: number) => void
    } = {},
  ) =>
  async (dispatch: any, ...args: T): Promise<R> => {
    try {
      const loadingPayload: Omit<LoadingItem, 'startTime'> = {
        id: loadingId,
        type: options.type || 'component',
      }
      if (options.message) {
        loadingPayload.message = options.message
      }
      dispatch(startLoading(loadingPayload))

      const result = await asyncFn(...args)
      return result
    } finally {
      dispatch(stopLoading(loadingId))
    }
  }

export default loadingSlice.reducer
export type { LoadingItem, LoadingState }
