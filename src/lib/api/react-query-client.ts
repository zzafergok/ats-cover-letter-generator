/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApiInstance } from '@/services/apiService'
import { API_ENDPOINTS, ApiResponse } from '@/services/utils'

// Mevcut axios instance kullanımı
const api = createApiInstance()

/**
 * React Query için API fonksiyonları
 * Mevcut axios altyapısı ile uyumlu wrapper fonksiyonlar
 * Token yönetimi, interceptor'lar ve error handling korunuyor
 */

// Auth API fonksiyonları
export const authApi = {
  // Register - mutation için kullanılacak
  register: async (userData: {
    email: string
    password: string
    name: string
    role?: string
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response
  },

  // Login - mutation için kullanılacak
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response
  },

  // Verify email - mutation için kullanılacak
  verifyEmail: async (token: string): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
    return response
  },

  // Resend verification - mutation için kullanılacak
  resendVerification: async (email: string): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })
    return response
  },

  // Refresh token - mevcut logic korunuyor
  refreshToken: async (refreshToken: string): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
    return response
  },

  // Forgot password - mutation için kullanılacak
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    return response
  },

  // Reset password - mutation için kullanılacak
  resetPassword: async (data: {
    token: string
    newPassword: string
    confirmPassword: string
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data)
    return response
  },

  // Get current user - query için kullanılacak
  getCurrentUser: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.AUTH.ME)
    return response
  },

  // Update profile - mutation için kullanılacak
  updateProfile: async (userData: { name?: string; email?: string }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.AUTH.PROFILE, userData)
    return response
  },

  // Change password - mutation için kullanılacak
  changePassword: async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
    return response
  },

  // Logout - mutation için kullanılacak
  logout: async (refreshToken: string): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
    return response
  },
}

// CV API fonksiyonları
export const cvApi = {
  // Upload CV - mutation için kullanılacak
  uploadCV: async (formData: FormData): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.CV.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Get CV uploads - query için kullanılacak
  getCVUploads: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.CV.UPLOADS)
    return response
  },

  // Delete CV upload - mutation için kullanılacak
  deleteCVUpload: async (uploadId: string): Promise<ApiResponse> => {
    const response: any = await api.delete(API_ENDPOINTS.CV.DELETE_UPLOAD(uploadId))
    return response
  },

  // Generate CV - mutation için kullanılacak
  generateCV: async (data: {
    cvUploadId: string
    positionTitle: string
    companyName: string
    cvType: string
    jobDescription?: string
    additionalRequirements?: string
    targetKeywords?: string[]
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.CV.GENERATE, data)
    return response
  },

  // Save CV - mutation için kullanılacak
  saveCV: async (data: { title: string; content: string; cvType: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.CV.SAVE, data)
    return response
  },

  // Get saved CVs - query için kullanılacak
  getSavedCVs: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.CV.SAVED)
    return response
  },

  // Delete saved CV - mutation için kullanılacak
  deleteSavedCV: async (cvId: string): Promise<ApiResponse> => {
    const response: any = await api.delete(API_ENDPOINTS.CV.DELETE_SAVED(cvId))
    return response
  },

  // Download CV - query için kullanılacak
  downloadCV: async (uploadId: string): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.CV.DOWNLOAD(uploadId), {
      responseType: 'blob',
    })
    return response
  },

  // Download CV as PDF - mutation için kullanılacak
  downloadCVAsPDF: async (downloadData: { content: string; fileName: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.CV.DOWNLOAD_PDF, downloadData, {
      responseType: 'blob',
    })
    return response
  },

  // Download CV as DOCX - mutation için kullanılacak
  downloadCVAsDOCX: async (downloadData: { content: string; fileName: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.CV.DOWNLOAD_DOCX, downloadData, {
      responseType: 'blob',
    })
    return response
  },
}

// Cover Letter API fonksiyonları
export const coverLetterApi = {
  // Get categories - query için kullanılacak
  getCategories: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.COVER_LETTER.CATEGORIES)
    return response
  },

  // Generate cover letter - mutation için kullanılacak
  generateCoverLetter: async (data: {
    cvUploadId?: string
    category: string
    positionTitle: string
    companyName: string
    contactPerson?: string
    jobDescription?: string
    additionalRequirements?: string
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.COVER_LETTER.GENERATE, data)
    return response
  },

  // Save cover letter - mutation için kullanılacak
  saveCoverLetter: async (data: {
    title: string
    content: string
    category: string
    positionTitle: string
    companyName: string
    contactPerson?: string
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.COVER_LETTER.SAVE, data)
    return response
  },

  // Get saved cover letters - query için kullanılacak
  getSavedCoverLetters: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.COVER_LETTER.SAVED)
    return response
  },

  // Delete saved cover letter - mutation için kullanılacak
  deleteSavedCoverLetter: async (coverLetterId: string): Promise<ApiResponse> => {
    const response: any = await api.delete(API_ENDPOINTS.COVER_LETTER.DELETE_SAVED(coverLetterId))
    return response
  },

  // Download cover letter as PDF - mutation için kullanılacak
  downloadCoverLetterAsPDF: async (downloadData: { content: string; fileName: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.COVER_LETTER.DOWNLOAD_PDF, downloadData, {
      responseType: 'blob',
    })
    return response
  },

  // Download cover letter as DOCX - mutation için kullanılacak
  downloadCoverLetterAsDOCX: async (downloadData: { content: string; fileName: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.COVER_LETTER.DOWNLOAD_DOCX, downloadData, {
      responseType: 'blob',
    })
    return response
  },
}

// Contact API fonksiyonları
export const contactApi = {
  // Send message - mutation için kullanılacak
  sendMessage: async (messageData: {
    type: string
    name: string
    email: string
    subject: string
    message: string
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.CONTACT.SEND, messageData)
    return response
  },

  // Check limit - query için kullanılacak
  checkLimit: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.CONTACT.LIMIT)
    return response
  },

  // Get messages (Admin) - query için kullanılacak
  getMessages: async (params?: { page?: number; limit?: number }): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.CONTACT.MESSAGES, { params })
    return response
  },
}

// User API fonksiyonları (authApi ile overlap'i kaldırıldı)
export const userApi = {
  // Get user profile - query için kullanılacak
  getProfile: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.AUTH.ME)
    return response
  },

  // Update user profile - mutation için kullanılacak
  updateProfile: async (userData: { name?: string; email?: string }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.AUTH.PROFILE, userData)
    return response
  },

  // Change password - mutation için kullanılacak
  changePassword: async (passwordData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData)
    return response
  },
}
