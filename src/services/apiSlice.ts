import { createApi } from '@reduxjs/toolkit/query/react'

import { API_ENDPOINTS } from './constants'
import { axiosBaseQuery } from './apiService'

// Tip tanımlarını basitleştiriyoruz
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ApiUser {
  id: string
  username: string
  email: string
  name: string
  role: string
}

export interface AuthResponse {
  user: ApiUser
  token: string
  refreshToken: string
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  }),
  tagTypes: ['User', 'Posts', 'Settings', 'Auth', 'Files'],
  endpoints: (builder) => ({
    // Authentication endpoints
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        data: credentials,
        skipAuth: true,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    refreshToken: builder.mutation<
      { token: string; refreshToken: string; expiresIn: number },
      { refreshToken: string }
    >({
      query: ({ refreshToken }: { refreshToken: string }) => ({
        url: API_ENDPOINTS.AUTH.REFRESH,
        method: 'POST',
        data: { refreshToken },
        skipAuth: true,
        skipErrorHandling: true,
      }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    register: builder.mutation<
      AuthResponse,
      {
        name: string
        email: string
        password: string
        confirmPassword: string
      }
    >({
      query: (userData) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: 'POST',
        data: userData,
        skipAuth: true,
      }),
      invalidatesTags: ['Auth'],
    }),

    // User endpoints
    getCurrentUser: builder.query<ApiUser, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.PROFILE,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<ApiUser, Partial<ApiUser>>({
      query: (userData) => ({
        url: API_ENDPOINTS.USER.UPDATE,
        method: 'PUT',
        data: userData,
        showErrorToast: true,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.USER.DELETE,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Auth'],
    }),

    // Posts endpoints - ApiExampleComponent için ekliyoruz
    getPosts: builder.query<any[], { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search }) => ({
        url: API_ENDPOINTS.POSTS.LIST,
        method: 'GET',
        params: { page, limit, search },
      }),
      providesTags: ['Posts'],
    }),

    getPost: builder.query<any, string | number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.POSTS.LIST}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),

    createPost: builder.mutation<any, { title: string; content: string; tags?: string[] }>({
      query: (postData) => ({
        url: API_ENDPOINTS.POSTS.CREATE,
        method: 'POST',
        data: postData,
      }),
      invalidatesTags: ['Posts'],
    }),

    updatePost: builder.mutation<any, { id: string | number; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.POSTS.UPDATE}/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }, 'Posts'],
    }),

    deletePost: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.POSTS.DELETE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),

    // Health check endpoint
    healthCheck: builder.query<{ status: string; timestamp: string }, void>({
      query: () => ({
        url: '/health',
        method: 'GET',
        skipAuth: true,
        timeout: 5000,
      }),
    }),

    // API info endpoint
    getApiInfo: builder.query<{ version: string; environment: string }, void>({
      query: () => ({
        url: '/info',
        method: 'GET',
        skipAuth: true,
      }),
    }),
  }),
})

// Export hooks - ApiExampleComponent için gerekli olan hook'ları da ekliyoruz
export const {
  // Auth hooks
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useRegisterMutation,

  // User hooks
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useDeleteUserMutation,

  // Posts hooks - ApiExampleComponent için
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,

  // System hooks
  useHealthCheckQuery,
  useGetApiInfoQuery,

  // Advanced hooks
  useLazyGetCurrentUserQuery,
  useLazyGetPostsQuery,
  usePrefetch,
} = apiSlice

export default apiSlice
