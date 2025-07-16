/* eslint-disable @typescript-eslint/no-require-imports */
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

// Reducers
import langReducer from './slices/langSlice'
import userReducer from './slices/userSlice'
import themeReducer from './slices/themeSlice'
import toastReducer from './slices/toastSlice'
import loadingReducer from './slices/loadingSlice'

import { apiSlice } from '../services/apiSlice'

// SSR için koşullu import
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value)
    },
    removeItem() {
      return Promise.resolve()
    },
  }
}

// SSR ile uyumlu storage objesi
const storage = typeof window !== 'undefined' ? require('redux-persist/lib/storage').default : createNoopStorage()

const persistConfig = {
  key: 'sea-ui-kit',
  version: 1,
  storage,
  whitelist: ['theme', 'lang', 'user'],
  blacklist: ['toast', 'api', 'loading'], // Toast'ları persist etmiyoruz
}

const rootReducer = combineReducers({
  theme: themeReducer,
  lang: langReducer,
  user: userReducer,
  toast: toastReducer, // Toast slice'ını persist dışında tutuyoruz
  loading: loadingReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['api', 'toast.messageHashes'], // Toast state'ını serializable check'ten hariç tutuyoruz
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
      },
      immutableCheck: {
        ignoredPaths: ['api', 'toast'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === 'development',
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
