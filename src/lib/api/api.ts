// lib.ts
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

// CV type tanımları
export interface UploadedCV {
  id: string
  originalName: string
  fileName: string
  fileSize: number
  filePath: string
  mimeType: string
  markdownContent: string
  uploadDate: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface SavedCV {
  id: string
  title: string
  content: string
  cvType: string
  createdAt: string
  updatedAt: string
}

export interface CVGenerateData {
  cvUploadId: string
  positionTitle: string
  companyName: string
  cvType: 'ATS_OPTIMIZED' | 'CREATIVE' | 'TECHNICAL'
  jobDescription: string
  additionalRequirements?: string
  targetKeywords?: string[]
}

export interface CVSaveData {
  title: string
  content: string
  cvType: 'ATS_OPTIMIZED' | 'CREATIVE' | 'TECHNICAL'
}

// Cover Letter type tanımları
export interface CoverLetterCategory {
  key: string
  label: string
}

export interface SavedCoverLetter {
  id: string
  title: string
  content: string
  category: string
  positionTitle: string
  companyName: string
  contactPerson?: string
  applicationDate: string
  createdAt: string
  updatedAt: string
}

export interface CoverLetterGenerateData {
  cvUploadId: string
  category: string
  positionTitle: string
  companyName: string
  contactPerson?: string
  jobDescription: string
  additionalRequirements?: string
}

export interface CoverLetterSaveData {
  title: string
  content: string
  category: string
  positionTitle: string
  companyName: string
  contactPerson?: string
}

// Template type tanımları
export interface TemplateCategory {
  key: string
  label: string
  description: string
  templateCount: number
}

export interface TemplatePreview {
  id: string
  category: string
  title: string
  placeholders: string[]
  preview: string
  createdAt: string
}

export interface TemplateDetail {
  id: string
  category: string
  title: string
  content: string
  placeholders: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GenerateCoverLetterFromTemplateData {
  templateId: string
  companyName: string
  positionTitle: string
  applicantName: string
  applicantEmail: string
  contactPerson: string
  specificSkills?: string[]
  additionalInfo?: string
}

export interface GeneratedCoverLetterResponse {
  content: string
  templateUsed: {
    id: string
    title: string
    category: string
  }
  generatedFor: {
    companyName: string
    positionTitle: string
    applicantName: string
    contactPerson: string
  }
  generatedAt: string
  statistics: {
    wordCount: number
    characterCount: number
    estimatedReadingTime: number
  }
}

export interface TemplateStatistics {
  totalTemplates: number
  categoryBreakdown: Record<string, number>
  averagePlaceholders: number
  mostUsedCategory: string
  recentlyAdded: Array<{
    id: string
    title: string
    category: string
  }>
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

export const cvApi = {
  upload: (file: File): Promise<UploadedCV> => {
    const formData = new FormData()
    formData.append('cvFile', file)
    return apiRequest.post('/cv/upload', formData)
  },
  getUploaded: (): Promise<UploadedCV[]> => apiRequest.get('/cv/uploads'),
  generate: (
    data: CVGenerateData,
  ): Promise<{ content: string; positionTitle: string; companyName: string; cvType: string }> =>
    apiRequest.post('/cv/generate', data),
  save: (data: CVSaveData): Promise<SavedCV> => apiRequest.post('/cv/save', data),
  getSaved: (): Promise<SavedCV[]> => apiRequest.get('/cv/saved'),
  delete: (id: string): Promise<void> => apiRequest.delete(`/cv/saved/${id}`),
  download: (format: 'pdf' | 'docx', content: string, fileName: string): Promise<Blob> =>
    apiRequest.post(`/cv/download/${format}`, { content, fileName }, { responseType: 'blob' }),
}

export const coverLetterApi = {
  getCategories: (): Promise<CoverLetterCategory[]> => apiRequest.get('/cover-letter/categories'),
  generate: (
    data: CoverLetterGenerateData,
  ): Promise<{
    content: string
    category: string
    positionTitle: string
    companyName: string
    contactPerson?: string
  }> => apiRequest.post('/cover-letter/generate', data),
  save: (data: CoverLetterSaveData): Promise<SavedCoverLetter> => apiRequest.post('/cover-letter/save', data),
  getSaved: (): Promise<SavedCoverLetter[]> => apiRequest.get('/cover-letter/saved'),
  delete: (id: string): Promise<void> => apiRequest.delete(`/cover-letter/saved/${id}`),
  download: (format: 'pdf' | 'docx', content: string, fileName: string): Promise<Blob> =>
    apiRequest.post(`/cover-letter/download/${format}`, { content, fileName }, { responseType: 'blob' }),
}

export const templateApi = {
  getCategories: (): Promise<TemplateCategory[]> =>
    apiRequest.get('/cover-letter-templates/categories', { skipAuth: true }),
  getAllTemplates: (): Promise<TemplatePreview[]> =>
    apiRequest.get('/cover-letter-templates/templates', { skipAuth: true }),
  getTemplatesByCategory: (category: string): Promise<TemplatePreview[]> =>
    apiRequest.get(`/cover-letter-templates/templates/category/${category}`, { skipAuth: true }),
  getTemplateDetail: (templateId: string): Promise<TemplateDetail> =>
    apiRequest.get(`/cover-letter-templates/templates/${templateId}`, { skipAuth: true }),
  generateCoverLetter: (data: GenerateCoverLetterFromTemplateData): Promise<GeneratedCoverLetterResponse> =>
    apiRequest.post('/cover-letter-templates/generate', data),
  getStatistics: (): Promise<TemplateStatistics> => apiRequest.get('/cover-letter-templates/statistics'),
}
