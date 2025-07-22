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

// CV type tanımları - API dokumentasyonuna göre güncellenmiş
export type CVUploadStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type CVType = 'ATS_OPTIMIZED' | 'CREATIVE' | 'TECHNICAL'
export type Language = 'TURKISH' | 'ENGLISH'

export interface CVUpload {
  id: string
  originalName: string
  fileName: string
  size: number
  uploadedAt: string
  status: CVUploadStatus
  extractedText?: string
}

export interface SavedCV {
  id: string
  title: string
  content: string
  cvType: CVType
  createdAt: string
  updatedAt: string
}

export interface DetailedCV {
  id: string
  content: string
  jobDescription: string
  language: Language
  createdAt: string
  updatedAt: string
}

export interface CVGenerateData {
  positionTitle: string
  companyName: string
  cvType: CVType
  jobDescription: string
  additionalRequirements?: string
  targetKeywords?: string[]
}

export interface CVSaveData {
  title: string
  content: string
  cvType: CVType
}

export interface CVDetailedGenerateData {
  jobDescription: string
  language: Language
}

export interface CVUploadResponse {
  success: boolean
  data: CVUpload
  message: string
}

export interface CVUploadsResponse {
  success: boolean
  data: CVUpload[]
}

export interface CVGenerateResponse {
  success: boolean
  data: {
    content: string
    positionTitle: string
    companyName: string
    cvType: CVType
  }
  message?: string
}

export interface SavedCVsResponse {
  success: boolean
  data: SavedCV[]
}

export interface DetailedCVsResponse {
  success: boolean
  data: DetailedCV[]
}

export interface DetailedCVResponse {
  success: boolean
  data: DetailedCV
}

// Cover Letter type tanımları - API dokumentasyonuna göre güncellenmiş
export interface CoverLetterBasic {
  id: string
  content: string
  positionTitle: string
  companyName: string
  language: Language
  createdAt: string
  updatedAt: string
}

export interface CoverLetterDetailed {
  id: string
  content: string
  positionTitle: string
  companyName: string
  language: Language
  whyPosition?: string
  whyCompany?: string
  workMotivation?: string
  createdAt: string
  updatedAt: string
}

export interface CoverLetterBasicGenerateData {
  cvUploadId: string
  positionTitle: string
  companyName: string
  jobDescription: string
  language: Language
}

export interface CoverLetterDetailedGenerateData {
  positionTitle: string
  companyName: string
  jobDescription: string
  language: Language
  whyPosition: string
  whyCompany: string
  workMotivation: string
}

export interface CoverLetterBasicUpdateData {
  updatedContent: string
}

export interface CoverLetterDetailedUpdateData {
  updatedContent: string
}

export interface CoverLetterBasicResponse {
  success: boolean
  data: CoverLetterBasic
  message?: string
}

export interface CoverLetterDetailedResponse {
  success: boolean
  data: CoverLetterDetailed
  message?: string
}

export interface CoverLetterBasicsResponse {
  success: boolean
  data: CoverLetterBasic[]
}

export interface CoverLetterDetailedsResponse {
  success: boolean
  data: CoverLetterDetailed[]
}

export interface CoverLetterCategory {
  key: string
  label: string
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

export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  city: string
  state: string
  linkedin?: string
}

export interface JobInfo {
  positionTitle: string
  companyName: string
  department?: string
  hiringManagerName?: string
  jobDescription: string
  requirements: string[]
}

export interface Experience {
  currentPosition: string
  yearsOfExperience: number
  relevantSkills: string[]
  achievements: string[]
  previousCompanies: string[]
}

export interface AdditionalInfo {
  reasonForApplying?: string
  companyKnowledge?: string
  careerGoals?: string
}

export type CoverLetterType = 'TECHNICAL' | 'CREATIVE' | 'FORMAL' | 'CASUAL'
export type ToneType = 'CONFIDENT' | 'PROFESSIONAL' | 'FRIENDLY' | 'ENTHUSIASTIC'

export interface GenerateCoverLetterData {
  personalInfo: PersonalInfo
  jobInfo: JobInfo
  experience: Experience
  coverLetterType: CoverLetterType
  tone: ToneType
  additionalInfo?: AdditionalInfo
}

export interface GenerateCoverLetterResponse {
  success: boolean
  data: {
    content: string
    metadata: {
      personalInfo: PersonalInfo
      jobInfo: JobInfo
      coverLetterType: CoverLetterType
      tone: ToneType
      generatedAt: string
      wordCount: number
      characterCount: number
    }
  }
  message?: string
}

export interface SaveCoverLetterData {
  title: string
  content: string
  coverLetterType: CoverLetterType
  positionTitle: string
  companyName: string
  category?: string
}

export interface SavedCoverLetter {
  id: string
  title: string
  content: string
  coverLetterType: CoverLetterType
  positionTitle: string
  companyName: string
  category?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface SavedCoverLettersResponse {
  success: boolean
  data: SavedCoverLetter[]
  message?: string
}

export interface CoverLetterByIdResponse {
  success: boolean
  data: SavedCoverLetter
  message?: string
}

export interface DeleteCoverLetterResponse {
  success: boolean
  message: string
}

export type DownloadFormat = 'pdf' | 'docx'

export interface DownloadCoverLetterResponse {
  success: boolean
  data: Blob
  filename?: string
}

export interface AnalyzeCoverLetterData {
  content: string
}

export interface CoverLetterAnalysis {
  score: number
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  readabilityScore: number
  keywordMatching: {
    matchedKeywords: string[]
    missedKeywords: string[]
    keywordDensity: number
  }
  structure: {
    hasIntroduction: boolean
    hasBody: boolean
    hasConclusion: boolean
    paragraphCount: number
  }
  tone: {
    detectedTone: string
    confidence: number
    recommendations: string[]
  }
}

export interface AnalyzeCoverLetterResponse {
  success: boolean
  data: CoverLetterAnalysis
  message?: string
}

export type TemplateCategoryType =
  | 'SOFTWARE_DEVELOPER'
  | 'MARKETING_SPECIALIST'
  | 'PROJECT_MANAGER'
  | 'DATA_ANALYST'
  | 'SALES_REPRESENTATIVE'
  | 'HUMAN_RESOURCES'
  | 'FINANCE'
  | 'DESIGN'
  | 'GENERAL'

export interface CoverLetterTemplate {
  id: string
  category: TemplateCategoryType
  title: string
  description: string
  content: string
  placeholders: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateResponse {
  success: boolean
  data: CoverLetterTemplate
  message?: string
}

export interface TemplatesResponse {
  success: boolean
  data: CoverLetterTemplate[]
  message?: string
}

// Cover Letter API Servisleri - API dokumentasyonuna göre güncellenmiş
export const coverLetterApi = {
  // Basic Cover Letter servisleri
  basic: {
    create: (data: CoverLetterBasicGenerateData): Promise<CoverLetterBasicResponse> =>
      apiRequest.post('/cover-letter-basic', data),

    get: (id: string): Promise<CoverLetterBasicResponse> => apiRequest.get(`/cover-letter-basic/${id}`),

    update: (id: string, data: CoverLetterBasicUpdateData): Promise<CoverLetterBasicResponse> =>
      apiRequest.put(`/cover-letter-basic/${id}`, data),

    getAll: (): Promise<CoverLetterBasicsResponse> => apiRequest.get('/cover-letter-basic'),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/cover-letter-basic/${id}`),

    downloadPdf: (id: string): Promise<Blob> =>
      apiRequest.get(`/cover-letter-basic/${id}/download/pdf`, { responseType: 'blob' }),
  },

  // Detailed Cover Letter servisleri
  detailed: {
    create: (data: CoverLetterDetailedGenerateData): Promise<CoverLetterDetailedResponse> =>
      apiRequest.post('/cover-letter-detailed', data),

    get: (id: string): Promise<CoverLetterDetailedResponse> => apiRequest.get(`/cover-letter-detailed/${id}`),

    update: (id: string, data: CoverLetterDetailedUpdateData): Promise<CoverLetterDetailedResponse> =>
      apiRequest.put(`/cover-letter-detailed/${id}`, data),

    getAll: (): Promise<CoverLetterDetailedsResponse> => apiRequest.get('/cover-letter-detailed'),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/cover-letter-detailed/${id}`),

    downloadPdf: (id: string): Promise<Blob> =>
      apiRequest.get(`/cover-letter-detailed/${id}/download/pdf`, { responseType: 'blob' }),
  },

  // Eski API ile geriye dönük uyumluluk için
  // Cover Letter oluşturma
  generate: async (data: GenerateCoverLetterData): Promise<GenerateCoverLetterResponse> => {
    const response = await apiRequest.post('/cover-letter/generate', data)
    return response
  },

  // Template'e göre template alma
  getTemplate: async (category: TemplateCategoryType): Promise<TemplateResponse> => {
    const response = await apiRequest.get(`/cover-letter/template/${category}`)
    return response
  },

  // Cover Letter kaydetme
  save: async (data: SaveCoverLetterData): Promise<{ success: boolean; data: SavedCoverLetter; message?: string }> => {
    const response = await apiRequest.post('/cover-letter/save', data)
    return response
  },

  // Kaydedilmiş cover letter'ları alma
  getSaved: async (): Promise<SavedCoverLettersResponse> => {
    const response = await apiRequest.get('/cover-letter/saved')
    return response
  },

  // ID'ye göre cover letter alma
  getById: async (id: string): Promise<CoverLetterByIdResponse> => {
    const response = await apiRequest.get(`/cover-letter/saved/${id}`)
    return response
  },

  // Cover Letter silme
  delete: async (id: string): Promise<DeleteCoverLetterResponse> => {
    const response = await apiRequest.delete(`/cover-letter/saved/${id}`)
    return response
  },

  // PDF olarak indirme
  downloadPdf: async (id: string): Promise<DownloadCoverLetterResponse> => {
    const response = await apiRequest.get(`/cover-letter/download/${id}?format=pdf`, {
      responseType: 'blob',
    })
    return response
  },

  // DOCX olarak indirme
  downloadDocx: async (id: string): Promise<DownloadCoverLetterResponse> => {
    const response = await apiRequest.get(`/cover-letter/download/${id}?format=docx`, {
      responseType: 'blob',
    })
    return response
  },

  // Cover Letter analizi
  analyze: async (data: AnalyzeCoverLetterData): Promise<AnalyzeCoverLetterResponse> => {
    const response = await apiRequest.post('/cover-letter/analyze', data)
    return response
  },

  // Missing methods for coverLetterStore
  getCategories: async () => {
    const response = await apiRequest.get('/cover-letter/categories')
    return response
  },

  download: async (id: string, format: 'pdf' | 'docx' = 'pdf') => {
    const response = await apiRequest.get(`/cover-letter/download/${id}?format=${format}`, {
      responseType: 'blob',
    })
    return response
  },
}

// Template API Servisleri
export const templateApi = {
  // Software Developer template
  getSoftwareDeveloperTemplate: async (): Promise<TemplateResponse> => {
    const response = await apiRequest.get('/cover-letter/template/SOFTWARE_DEVELOPER')
    return response
  },

  // Marketing Specialist template
  getMarketingSpecialistTemplate: async (): Promise<TemplateResponse> => {
    const response = await apiRequest.get('/cover-letter/template/MARKETING_SPECIALIST')
    return response
  },

  // Project Manager template
  getProjectManagerTemplate: async (): Promise<TemplateResponse> => {
    const response = await apiRequest.get('/cover-letter/template/PROJECT_MANAGER')
    return response
  },

  // Genel template alma metodu
  getTemplateByCategory: async (category: TemplateCategoryType): Promise<TemplateResponse> => {
    const response = await apiRequest.get(`/cover-letter/template/${category}`)
    return response
  },

  // Missing methods that hooks are trying to call
  getCategories: async (): Promise<TemplateCategory[]> => {
    const response = await apiRequest.get('/cover-letter/template/categories')
    return response
  },

  getAllTemplates: async (): Promise<TemplatePreview[]> => {
    const response = await apiRequest.get('/cover-letter/template/all')
    return response
  },

  getTemplatesByCategory: async (category: string): Promise<TemplatePreview[]> => {
    const response = await apiRequest.get(`/cover-letter/template/category/${category}`)
    return response
  },

  getTemplateDetail: async (templateId: string): Promise<any> => {
    const response = await apiRequest.get(`/cover-letter/template/detail/${templateId}`)
    return response
  },

  getStatistics: async (): Promise<any> => {
    const response = await apiRequest.get('/cover-letter/template/statistics')
    return response
  },

  generateCoverLetter: async (data: GenerateCoverLetterFromTemplateData): Promise<any> => {
    const response = await apiRequest.post('/cover-letter/generate', data)
    return response
  },
}

// Auth API Servisleri - API dokumentasyonuna göre güncellenmiş
export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: 'USER' | 'ADMIN'
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'USER' | 'ADMIN'
  emailVerified: boolean
  createdAt?: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: AuthUser
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

export interface RegisterResponse {
  success: boolean
  data: {
    message: string
    email: string
    emailSent: boolean
  }
  message: string
}

export interface RefreshResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

export const authApi = {
  // Kullanıcı kayıt
  register: (userData: RegisterData): Promise<RegisterResponse> =>
    apiRequest.post('/auth/register', userData, { skipAuth: true }),

  // Kullanıcı giriş
  login: (credentials: LoginData): Promise<LoginResponse> =>
    apiRequest.post('/auth/login', credentials, { skipAuth: true }),

  // Email doğrulama
  verifyEmail: (token: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.post('/auth/verify-email', { token }, { skipAuth: true }),

  // Email doğrulama tekrar gönder
  resendVerification: (email: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.post('/auth/resend-verification', { email }, { skipAuth: true }),

  // Token yenileme
  refresh: (refreshToken: string): Promise<RefreshResponse> =>
    apiRequest.post('/auth/refresh', { refreshToken }, { skipAuth: true }),

  // Çıkış yap
  logout: (): Promise<{ success: boolean; message: string }> => apiRequest.post('/auth/logout'),

  // Tüm oturumları sonlandır
  logoutAll: (): Promise<{ success: boolean; message: string }> => apiRequest.post('/auth/logout-all'),

  // Şifre unuttum
  forgotPassword: (email: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.post('/auth/forgot-password', { email }, { skipAuth: true }),

  // Şifre sıfırla
  resetPassword: (data: {
    token: string
    newPassword: string
    confirmPassword: string
  }): Promise<{ success: boolean; message: string }> =>
    apiRequest.post('/auth/reset-password', data, { skipAuth: true }),

  // Mevcut kullanıcı bilgisi
  getCurrentUser: (): Promise<{ success: boolean; data: AuthUser }> => apiRequest.get('/auth/me'),

  // Profil güncelle
  updateProfile: (data: {
    firstName: string
    lastName: string
  }): Promise<{ success: boolean; data: AuthUser; message?: string }> => apiRequest.put('/auth/profile', data),

  // Şifre değiştir
  changePassword: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<{ success: boolean; message: string }> => apiRequest.put('/auth/change-password', data),

  // Kullanıcı oturumları
  getSessions: (): Promise<{ success: boolean; data: any[] }> => apiRequest.get('/auth/sessions'),
}

// User Profile API Servisleri - API dokumentasyonuna göre genişletilmiş
export interface UserProfile {
  id: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  github?: string
  linkedin?: string
  portfolioWebsite?: string
  portfolioTitle?: string
  aboutMe?: string
  education: Education[]
  experience: WorkExperience[]
  courses: Course[]
  certificates: Certificate[]
  hobbies: Hobby[]
  skills: Skill[]
}

export interface Education {
  id: string
  schoolName: string
  degree?: string
  fieldOfStudy?: string
  grade?: number
  gradeSystem: 'PERCENTAGE' | 'GPA_4'
  startYear: number
  endYear?: number
  isCurrent: boolean
  description?: string
}

export interface WorkExperience {
  id: string
  companyName: string
  position: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' | 'TEMPORARY'
  workMode: 'ONSITE' | 'REMOTE' | 'HYBRID'
  location?: string
  startMonth: number
  startYear: number
  endMonth?: number
  endYear?: number
  isCurrent: boolean
  description?: string
  achievements?: string
}

export interface Course {
  id: string
  courseName: string
  provider?: string
  startMonth?: number
  startYear?: number
  endMonth?: number
  endYear?: number
  duration?: string
  description?: string
}

export interface Certificate {
  id: string
  certificateName: string
  issuer?: string
  issueMonth?: number
  issueYear?: number
  expiryMonth?: number
  expiryYear?: number
  credentialId?: string
  credentialUrl?: string
  description?: string
}

export interface Hobby {
  id: string
  name: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  category?: 'TECHNICAL' | 'SOFT_SKILL' | 'LANGUAGE' | 'TOOL' | 'FRAMEWORK' | 'OTHER'
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  yearsOfExperience?: number
  description?: string
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

// User Profile API Servisleri
export const userProfileApi = {
  // Ana profil işlemleri
  getProfile: (): Promise<{ success: boolean; data: UserProfile }> => apiRequest.get('/user-profile'),

  updateProfile: (data: Partial<UserProfile>): Promise<{ success: boolean; data: UserProfile; message?: string }> =>
    apiRequest.put('/user-profile', data),

  // Eğitim işlemleri
  education: {
    add: (data: Omit<Education, 'id'>): Promise<{ success: boolean; data: Education; message?: string }> =>
      apiRequest.post('/user-profile/education', data),

    update: (
      id: string,
      data: Partial<Omit<Education, 'id'>>,
    ): Promise<{ success: boolean; data: Education; message?: string }> =>
      apiRequest.put(`/user-profile/education/${id}`, data),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/user-profile/education/${id}`),
  },

  // Deneyim işlemleri
  experience: {
    add: (data: Omit<WorkExperience, 'id'>): Promise<{ success: boolean; data: WorkExperience; message?: string }> =>
      apiRequest.post('/user-profile/experience', data),

    update: (
      id: string,
      data: Partial<Omit<WorkExperience, 'id'>>,
    ): Promise<{ success: boolean; data: WorkExperience; message?: string }> =>
      apiRequest.put(`/user-profile/experience/${id}`, data),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/user-profile/experience/${id}`),
  },

  // Kurs işlemleri
  course: {
    add: (data: Omit<Course, 'id'>): Promise<{ success: boolean; data: Course; message?: string }> =>
      apiRequest.post('/user-profile/course', data),

    update: (
      id: string,
      data: Partial<Omit<Course, 'id'>>,
    ): Promise<{ success: boolean; data: Course; message?: string }> =>
      apiRequest.put(`/user-profile/course/${id}`, data),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/user-profile/course/${id}`),
  },

  // Sertifika işlemleri
  certificate: {
    add: (data: Omit<Certificate, 'id'>): Promise<{ success: boolean; data: Certificate; message?: string }> =>
      apiRequest.post('/user-profile/certificate', data),

    update: (
      id: string,
      data: Partial<Omit<Certificate, 'id'>>,
    ): Promise<{ success: boolean; data: Certificate; message?: string }> =>
      apiRequest.put(`/user-profile/certificate/${id}`, data),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/user-profile/certificate/${id}`),
  },

  // Hobi işlemleri
  hobby: {
    add: (data: Omit<Hobby, 'id'>): Promise<{ success: boolean; data: Hobby; message?: string }> =>
      apiRequest.post('/user-profile/hobby', data),

    update: (
      id: string,
      data: Partial<Omit<Hobby, 'id'>>,
    ): Promise<{ success: boolean; data: Hobby; message?: string }> =>
      apiRequest.put(`/user-profile/hobby/${id}`, data),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/user-profile/hobby/${id}`),
  },

  // Yetenek işlemleri
  skill: {
    add: (data: Omit<Skill, 'id'>): Promise<{ success: boolean; data: Skill; message?: string }> =>
      apiRequest.post('/user-profile/skill', data),

    update: (
      id: string,
      data: Partial<Omit<Skill, 'id'>>,
    ): Promise<{ success: boolean; data: Skill; message?: string }> =>
      apiRequest.put(`/user-profile/skill/${id}`, data),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/user-profile/skill/${id}`),
  },
}

// Contact API Servisleri - API dokumentasyonuna göre güncellenmiş
export const contactApi = {
  send: (data: ContactFormData): Promise<ContactResponse> => apiRequest.post('/contact/send', data, { skipAuth: true }),

  getMessages: (): Promise<{ success: boolean; data: any[] }> => apiRequest.get('/contact/messages'),

  checkLimit: (): Promise<{ success: boolean; data: { remainingRequests: number; resetTime: string } }> =>
    apiRequest.get('/contact/limit', { skipAuth: true }),
}

// CV API Servisleri - API dokumentasyonuna göre güncellenmiş
export const cvApi = {
  // CV upload işlemleri
  upload: (file: File): Promise<CVUploadResponse> => {
    const formData = new FormData()
    formData.append('cvFile', file)
    return apiRequest.post('/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getUploads: (): Promise<CVUploadsResponse> => apiRequest.get('/cv/uploads'),

  getUploadStatus: (id: string): Promise<{ success: boolean; data: CVUpload }> =>
    apiRequest.get(`/cv/upload/status/${id}`),

  deleteUpload: (id: string): Promise<{ success: boolean; message: string }> => apiRequest.delete(`/cv/uploads/${id}`),

  // CV generation işlemleri (upload-based)
  generate: (data: CVGenerateData): Promise<CVGenerateResponse> => apiRequest.post('/cv/generate', data),

  // CV save işlemleri
  save: (data: CVSaveData): Promise<{ success: boolean; data: SavedCV; message?: string }> =>
    apiRequest.post('/cv/save', data),

  getSaved: (): Promise<SavedCVsResponse> => apiRequest.get('/cv/saved'),

  deleteSaved: (id: string): Promise<{ success: boolean; message: string }> => apiRequest.delete(`/cv/saved/${id}`),

  // CV download işlemi
  download: (id: string): Promise<Blob> => apiRequest.get(`/cv/download/${id}`, { responseType: 'blob' }),

  // Detailed CV işlemleri (profile-based)
  generateDetailed: (data: CVDetailedGenerateData): Promise<{ success: boolean; data: DetailedCV; message?: string }> =>
    apiRequest.post('/cv/generate-detailed', data),

  getDetailed: (): Promise<DetailedCVsResponse> => apiRequest.get('/cv/detailed'),

  getDetailedById: (id: string): Promise<DetailedCVResponse> => apiRequest.get(`/cv/detailed/${id}`),

  deleteDetailed: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/cv/detailed/${id}`),

  downloadDetailedPdf: (id: string): Promise<Blob> =>
    apiRequest.get(`/cv/detailed/${id}/download/pdf`, { responseType: 'blob' }),
}
