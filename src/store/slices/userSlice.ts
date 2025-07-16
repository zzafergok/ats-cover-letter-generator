import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
}

export interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    logoutUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setUser, logoutUser, setLoading, setError } = userSlice.actions

// Selectors with proper typing
export const selectUser = (state: { user: UserState }) => state.user.user
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated
export const selectIsLoading = (state: { user: UserState }) => state.user.isLoading
export const selectError = (state: { user: UserState }) => state.user.error

export default userSlice.reducer
