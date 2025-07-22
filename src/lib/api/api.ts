/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from './axios'
import {
  Hobby,
  Skill,
  Course,
  SavedCV,
  AuthUser,
  CVUpload,
  Education,
  LoginData,
  UserProfile,
  Certificate,
  CVSaveData,
  DetailedCV,
  RegisterData,
  LoginResponse,
  WorkExperience,
  CVGenerateData,
  RefreshResponse,
  ContactFormData,
  ContactResponse,
  RegisterResponse,
  CVUploadResponse,
  SavedCVsResponse,
  CVUploadsResponse,
  DetailedCVResponse,
  CVGenerateResponse,
  DetailedCVsResponse,
  CVDetailedGenerateData,
  CoverLetterBasicResponse,
  CoverLetterBasicsResponse,
  CoverLetterBasicUpdateData,
  CoverLetterDetailedResponse,
  CoverLetterBasicGenerateData,
  CoverLetterDetailedsResponse,
  CoverLetterDetailedUpdateData,
  CoverLetterDetailedGenerateData,
} from '@/types/api.types'

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
