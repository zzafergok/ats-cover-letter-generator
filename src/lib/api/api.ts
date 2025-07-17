/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/types'
import { apiRequest } from './axios'

// İstatistik type tanımları
export interface ChangeData {
  value: number
  percentage: string
  type: 'positive' | 'negative' | 'neutral'
}

export interface TaskStatistics {
  totalTasks: number
  tasksByStatus: {
    TODO: number
    IN_PROGRESS: number
    DONE: number
  }
  tasksByPriority: {
    LOW: number
    MEDIUM: number
    HIGH: number
    URGENT: number
  }
  tasksByColumn: Record<string, number>
  overdueTasks: number
  unassignedTasks: number
}

export interface TaskStatisticsWithComparison extends TaskStatistics {
  previousPeriod: {
    totalTasks: number
    tasksByStatus: {
      TODO: number
      IN_PROGRESS: number
      DONE: number
    }
    overdueTasks: number
    unassignedTasks: number
  }
  changes: {
    totalTasks: ChangeData
    completedTasks: ChangeData
    pendingTasks: ChangeData
    inProgressTasks: ChangeData
    overdueTasks: ChangeData
  }
}

export interface BasicTaskStatistics extends TaskStatistics {
  totalProjects: number
}

export interface TaskStatisticsResponse {
  success: boolean
  data: TaskStatisticsWithComparison
  message: string
}

export interface ProjectStatisticsResponse {
  success: boolean
  data: {
    current: number
    previous: number
    change: ChangeData
  }
  message: string
}

export interface BasicTaskStatisticsResponse {
  success: boolean
  data: BasicTaskStatistics
  message: string
}

// Contact type tanımları
export interface ContactFormData {
  type: 'CONTACT' | 'SUPPORT'
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message?: string
  data?: any
}

export const authApi = {
  login: (credentials: { email: string; password: string }): Promise<any> =>
    apiRequest.post('/auth/login', credentials, { skipAuth: true }),
  register: (userData: { name: string; email: string; password: string; role?: string }): Promise<any> =>
    apiRequest.post('/auth/register', userData, { skipAuth: true }),
  refresh: (): Promise<any> => apiRequest.post('/auth/refresh'),
  logout: (): Promise<void> => apiRequest.post('/auth/logout'),
  forgotPassword: (email: string): Promise<any> =>
    apiRequest.post('/auth/forgot-password', { email }, { skipAuth: true }),
  resetPassword: (token: string, data: { newPassword: string; confirmPassword: string }): Promise<any> =>
    apiRequest.post('/auth/reset-password', { token, ...data }, { skipAuth: true }),
  verifyEmail: (token: string): Promise<any> => apiRequest.post('/auth/verify-email', { token }, { skipAuth: true }),
}

export const userApi = {
  getProfile: (): Promise<User> => apiRequest.get('/user/profile'),
  updateProfile: (data: { name?: string; email?: string }): Promise<User> => apiRequest.put('/user/update', data),
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<void> =>
    apiRequest.put('/user/change-password', data),
  uploadAvatar: (file: FormData): Promise<{ avatarUrl: string }> =>
    apiRequest.post('/user/avatar', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteAccount: (): Promise<void> => apiRequest.delete('/user/delete'),
}

export const contactApi = {
  send: (data: ContactFormData): Promise<ContactResponse> => apiRequest.post('/contact/send', data, { skipAuth: true }),
}
