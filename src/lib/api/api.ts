/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from './axios'
import {
  Hobby,
  Skill,
  Course,
  SavedCV,
  AuthUser,
  CVUpload,
  Province,
  Education,
  LoginData,
  UserProfile,
  Certificate,
  HighSchool,
  University,
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
  DOCXGenerateData,
  CVUploadsResponse,
  ProvincesResponse,
  DistrictsResponse,
  ATSCVTestResponse,
  ATSValidationData,
  DetailedCVResponse,
  CVGenerateResponse,
  CVOptimizationData,
  HighSchoolsResponse,
  CoverLetterTemplate,
  ATSCVSchemaResponse,
  DetailedCVsResponse,
  KeywordAnalysisData,
  DOCXGenerateResponse,
  UniversitiesResponse,
  ATSCVGenerateResponse,
  ATSValidationResponse,
  CVOptimizationResponse,
  KeywordSuggestionsData,
  CVDetailedGenerateData,
  KeywordAnalysisResponse,
  CoverLetterBasicResponse,
  ATSValidationTipsResponse,
  CoverLetterBasicsResponse,
  KeywordSuggestionsResponse,
  CoverLetterBasicUpdateData,
  CoverLetterDetailedResponse,
  CoverLetterBasicGenerateData,
  CoverLetterDetailedsResponse,
  ATSValidationAnalysisResponse,
  CoverLetterDetailedUpdateData,
  CoverLetterDetailedGenerateData,
  DOCXTemplateAnalysisResponse,
  DOCXTemplatesResponse,
  DOCXTemplatePDFData,
  DOCXTemplatePDFResponse,
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

    downloadCustomPdf: (data: {
      content: string
      positionTitle: string
      companyName: string
      language?: 'TURKISH' | 'ENGLISH'
    }): Promise<Blob> => apiRequest.post('/cover-letter-basic/download/custom-pdf', data, { responseType: 'blob' }),
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

    downloadCustomPdf: (data: {
      content: string
      positionTitle: string
      companyName: string
      language?: 'TURKISH' | 'ENGLISH'
    }): Promise<Blob> => apiRequest.post('/cover-letter-detailed/download/custom-pdf', data, { responseType: 'blob' }),
  },
}

// Template Cover Letter Custom PDF
export const templateCoverLetterApi = {
  downloadCustomPdf: (data: {
    content: string
    positionTitle: string
    companyName: string
    templateTitle?: string
    language?: 'TURKISH' | 'ENGLISH'
  }): Promise<Blob> => apiRequest.post('/templates/download/custom-pdf', data, { responseType: 'blob' }),
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

  getUploads: (): Promise<CVUploadsResponse> => apiRequest.get('/cv-upload/uploads'),

  getUploadStatus: (id: string): Promise<{ success: boolean; data: CVUpload }> =>
    apiRequest.get(`/cv-upload/upload/status/${id}`),

  deleteUpload: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/cv-upload/uploads/${id}`),

  // CV generation işlemleri (upload-based)
  generate: (data: CVGenerateData): Promise<CVGenerateResponse> => apiRequest.post('/cv/generate', data),

  // CV save işlemleri
  save: (data: CVSaveData): Promise<{ success: boolean; data: SavedCV; message?: string }> =>
    apiRequest.post('/cv/save', data),

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

// Location API Servisleri - Güncel API format
export const locationApi = {
  // İl servisleri
  getProvinces: (): Promise<ProvincesResponse> => apiRequest.get('/locations/provinces', { skipAuth: true }),

  // İl arama
  searchProvinces: (query: string): Promise<ProvincesResponse> =>
    apiRequest.get(`/locations/provinces/search?q=${encodeURIComponent(query)}`, { skipAuth: true }),

  // İl kodu ile il
  getProvinceByCode: (code: string): Promise<{ success: boolean; data: Province }> =>
    apiRequest.get(`/locations/provinces/code/${code}`, { skipAuth: true }),

  // İl ismi ile il
  getProvinceByName: (name: string): Promise<{ success: boolean; data: Province }> =>
    apiRequest.get(`/locations/provinces/name/${encodeURIComponent(name)}`, { skipAuth: true }),

  // İl koduna göre ilçeler
  getDistrictsByProvinceCode: (code: string): Promise<DistrictsResponse> =>
    apiRequest.get(`/locations/districts/province-code/${code}`, { skipAuth: true }),

  // İl ismine göre ilçeler
  getDistrictsByProvinceName: (name: string): Promise<DistrictsResponse> =>
    apiRequest.get(`/locations/districts/province-name/${encodeURIComponent(name)}`, { skipAuth: true }),

  // İlçe arama
  searchDistricts: (query: string, provinceCode?: string): Promise<DistrictsResponse> => {
    const url = new URL('/locations/districts/search', 'https://api.example.com')
    url.searchParams.append('q', query)
    if (provinceCode) url.searchParams.append('provinceCode', provinceCode)
    return apiRequest.get(url.pathname + url.search, { skipAuth: true })
  },

  // Lokasyon istatistikleri
  getStats: (): Promise<{
    success: boolean
    data: { totalProvinces: number; totalDistricts: number; isLoaded: boolean }
  }> => apiRequest.get('/locations/stats', { skipAuth: true }),
}

// School API Servisleri - Güncel API format
export const schoolApi = {
  // Lise servisleri
  getAllHighSchools: (): Promise<HighSchoolsResponse> => apiRequest.get('/high-schools', { skipAuth: true }),

  // Lise arama
  searchHighSchools: (query: string): Promise<HighSchoolsResponse> =>
    apiRequest.get(`/high-schools/search?q=${encodeURIComponent(query)}`, { skipAuth: true }),

  // Şehre göre liseler
  getHighSchoolsByCity: (city: string): Promise<HighSchoolsResponse> =>
    apiRequest.get(`/high-schools/city/${encodeURIComponent(city)}`, { skipAuth: true }),

  // Lise detayı
  getHighSchoolById: (id: string): Promise<{ success: boolean; data: HighSchool }> =>
    apiRequest.get(`/high-schools/${id}`, { skipAuth: true }),

  // Lise istatistikleri
  getHighSchoolStats: (): Promise<{ success: boolean; data: { total: number; cities: number; isLoaded: boolean } }> =>
    apiRequest.get('/high-schools/stats', { skipAuth: true }),

  // Lise verilerini yenile
  reloadHighSchools: (): Promise<{ success: boolean; message: string }> =>
    apiRequest.post('/high-schools/reload', {}, { skipAuth: true }),

  // Üniversite servisleri
  getAllUniversities: (): Promise<UniversitiesResponse> => apiRequest.get('/universities', { skipAuth: true }),

  // Üniversite arama
  searchUniversities: (query: string): Promise<UniversitiesResponse> =>
    apiRequest.get(`/universities/search?q=${encodeURIComponent(query)}`, { skipAuth: true }),

  // Şehre göre üniversiteler
  getUniversitiesByCity: (city: string): Promise<UniversitiesResponse> =>
    apiRequest.get(`/universities/city/${encodeURIComponent(city)}`, { skipAuth: true }),

  // Türe göre üniversiteler
  getUniversitiesByType: (type: 'STATE' | 'FOUNDATION' | 'PRIVATE'): Promise<UniversitiesResponse> =>
    apiRequest.get(`/universities/type/${type}`, { skipAuth: true }),

  // Üniversite detayı
  getUniversityById: (id: string): Promise<{ success: boolean; data: University }> =>
    apiRequest.get(`/universities/${id}`, { skipAuth: true }),

  // Üniversite istatistikleri
  getUniversityStats: (): Promise<{
    success: boolean
    data: {
      total: number
      state: number
      foundation: number
      private: number
      cities: number
      isLoaded: boolean
      lastUpdated: string
    }
  }> => apiRequest.get('/universities/stats', { skipAuth: true }),

  // Üniversite verilerini yenile
  refreshUniversities: (): Promise<{ success: boolean; message: string }> =>
    apiRequest.post('/universities/refresh', {}, { skipAuth: true }),
}

// Template API Servisleri - API dokumentasyonuna göre yeni
export const templateApi = {
  // Template servisleri
  getAll: (params?: {
    industry?: 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING'
    category?: string
    language?: 'TURKISH' | 'ENGLISH'
  }): Promise<{ success: boolean; data: CoverLetterTemplate[]; message?: string }> => {
    const queryParams = new URLSearchParams()
    if (params?.industry) queryParams.append('industry', params.industry)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.language) queryParams.append('language', params.language)

    const queryString = queryParams.toString()
    return apiRequest.get(`/templates${queryString ? `?${queryString}` : ''}`)
  },

  getCategories: (): Promise<{ success: boolean; data: Record<string, string[]>; message?: string }> =>
    apiRequest.get('/templates/categories'),

  getByIndustry: (
    industry: 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING',
  ): Promise<{ success: boolean; data: CoverLetterTemplate[]; message?: string }> =>
    apiRequest.get(`/templates/industry/${industry}`),

  getById: (templateId: string): Promise<{ success: boolean; data: CoverLetterTemplate; message?: string }> =>
    apiRequest.get(`/templates/${templateId}`),

  createCoverLetter: (data: {
    templateId: string
    positionTitle: string
    companyName: string
    personalizations: {
      whyPosition?: string
      whyCompany?: string
      additionalSkills?: string
    }
  }): Promise<{
    success: boolean
    data: { content: string; templateId: string; positionTitle: string; companyName: string }
    message?: string
  }> => apiRequest.post('/templates/create-cover-letter', data),

  initialize: (): Promise<{ success: boolean; message: string }> => apiRequest.post('/templates/initialize'),
}

// ATS CV Services - API dokumentasyonuna göre yeni
export const atsCvApi = {
  // ATS CV oluştur (DOCX template desteği ile güncellenmiş)
  generate: (data: DOCXTemplatePDFData): Promise<ATSCVGenerateResponse> => apiRequest.post('/ats-cv/generate', data),

  // ATS CV indir
  download: (cvId: string): Promise<Blob> => apiRequest.get(`/ats-cv/${cvId}/download`, { responseType: 'blob' }),

  // Test ATS CV oluştur
  generateTest: (): Promise<ATSCVTestResponse> => apiRequest.get('/ats-cv/test'),

  // ATS Schema al
  getSchema: (): Promise<ATSCVSchemaResponse> => apiRequest.get('/ats-cv/schema', { skipAuth: true }),

  // ATS Validation Tips al
  getValidationTips: (): Promise<ATSValidationTipsResponse> =>
    apiRequest.get('/ats-cv/validation-tips', { skipAuth: true }),
}

// Microsoft ATS Services - Yeni Microsoft ATS sistemi
export const atsCvMicrosoftApi = {
  // Microsoft template listesi
  getTemplates: (): Promise<{
    success: boolean
    data: {
      templates: Array<{
        id: string
        name: string
        category: string
        language: string
        atsScore: number
        sections: string[]
        description?: string
        targetRoles?: string[]
        experienceLevel?: string
      }>
    }
    message: string
  }> => apiRequest.get('/ats-cv-microsoft/templates'),

  // Microsoft ATS CV oluştur ve PDF olarak indir
  generate: (data: {
    personalInfo: {
      firstName: string
      lastName: string
      email: string
      phone: string
      address: {
        city: string
        country: string
      }
      linkedIn?: string
      github?: string
      portfolio?: string
    }
    professionalSummary: {
      summary: string
      targetPosition: string
      yearsOfExperience: number
      keySkills: string[]
    }
    workExperience: Array<{
      id: string
      companyName: string
      position: string
      location: string
      startDate: string
      endDate?: string
      isCurrentRole: boolean
      achievements: string[]
      technologies?: string[]
      industryType?: string
    }>
    education: Array<{
      id: string
      institution: string
      degree: string
      fieldOfStudy: string
      location: string
      startDate: string
      endDate?: string
      gpa?: number
      honors?: string[]
      relevantCoursework?: string[]
    }>
    skills: {
      technical: Array<{
        category: string
        items: Array<{
          name: string
          proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
        }>
      }>
      languages: Array<{
        language: string
        proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'
      }>
      soft: string[]
    }
    certifications?: Array<{
      id: string
      name: string
      issuingOrganization: string
      issueDate: string
      expirationDate?: string
      credentialId?: string
      verificationUrl?: string
    }>
    projects?: Array<{
      id: string
      name: string
      description: string
      technologies: string[]
      startDate: string
      endDate?: string
      url?: string
      achievements: string[]
    }>
    configuration: {
      language: 'TURKISH' | 'ENGLISH'
      microsoftTemplateId: string
      useAIOptimization?: boolean
      jobDescription?: string
      targetCompany?: string
    }
  }): Promise<Blob> => apiRequest.post('/ats-cv-microsoft/generate', data, { responseType: 'blob' }),

  // İş ilanı analizi
  analyzeJob: (data: {
    jobDescription: string
    targetPosition: string
    language: 'TURKISH' | 'ENGLISH'
    industryType?: string
  }): Promise<{
    success: boolean
    data: {
      jobAnalysis: {
        position: string
        language: string
        keywords: string[]
        requirements: string[]
        experienceLevel: string
        technicalSkills: string[]
        softSkills: string[]
      }
      recommendedTemplates: Array<{
        id: string
        name: string
        category: string
        atsScore: number
        matchReason: string
        sections: string[]
        targetIndustries: string[]
      }>
      optimization: {
        suggestedKeywords: string[]
        cvSections: string[]
        atsStrategies: string[]
      }
    }
    message: string
  }> => apiRequest.post('/ats-cv-microsoft/analyze-job', data),

  // CV analizi
  analyzeCV: (data: {
    cvData: any
    templateId: string
  }): Promise<{
    success: boolean
    data: {
      atsScore: number
      compatibility: string
      recommendations: string[]
      missingKeywords: string[]
      structureAnalysis: {
        sectionsFound: string[]
        sectionsRecommended: string[]
        formatting: string
      }
    }
    message: string
  }> => apiRequest.post('/ats-cv-microsoft/analyze-cv', data),
}

// ATS Validation Services - API dokumentasyonuna göre yeni
export const atsValidationApi = {
  // CV'yi ATS uyumluluğu için doğrula
  validate: (data: ATSValidationData): Promise<ATSValidationResponse> =>
    apiRequest.post('/ats-validation/validate', data),

  // Validation analizi al
  getAnalysis: (score: number): Promise<ATSValidationAnalysisResponse> =>
    apiRequest.get(`/ats-validation/analysis/${score}`),

  // ATS en iyi uygulamaları al
  getBestPractices: (): Promise<{
    success: boolean
    data: any
  }> => apiRequest.get('/ats-validation/best-practices', { skipAuth: true }),

  // Yaygın ATS sorunlarını al
  getCommonIssues: (): Promise<{
    success: boolean
    data: any
  }> => apiRequest.get('/ats-validation/common-issues', { skipAuth: true }),
}

// CV Optimization Services - API dokumentasyonuna göre yeni
export const cvOptimizationApi = {
  // CV'yi optimize et
  optimize: (data: CVOptimizationData): Promise<CVOptimizationResponse> =>
    apiRequest.post('/cv-optimization/optimize', data),

  // Keyword önerileri al
  getKeywordSuggestions: (data: KeywordSuggestionsData): Promise<KeywordSuggestionsResponse> =>
    apiRequest.post('/cv-optimization/keyword-suggestions', data),

  // Bölüm optimizasyon ipuçları al
  getSectionTips: (
    section: string,
  ): Promise<{
    success: boolean
    data: any
  }> => apiRequest.get(`/cv-optimization/section-tips/${section}`, { skipAuth: true }),

  // Keyword analizi yap
  analyzeKeywords: (data: KeywordAnalysisData): Promise<KeywordAnalysisResponse> =>
    apiRequest.post('/cv-optimization/analyze-keywords', data),
}

// DOCX Export Services - API dokumentasyonuna göre yeni
export const docxApi = {
  // DOCX CV oluştur
  generate: (data: DOCXGenerateData): Promise<DOCXGenerateResponse> => apiRequest.post('/docx/generate', data),

  // DOCX preview
  preview: (
    data: any,
  ): Promise<{
    success: boolean
    data: any
  }> => apiRequest.post('/docx/preview', data),

  // DOCX seçeneklerini doğrula
  validateOptions: (
    data: any,
  ): Promise<{
    success: boolean
    data: any
  }> => apiRequest.post('/docx/validate-options', data),

  // DOCX en iyi uygulamaları al
  getBestPractices: (): Promise<{
    success: boolean
    data: any
  }> => apiRequest.get('/docx/best-practices'),

  // DOCX vs PDF karşılaştırması al
  getVsPdfComparison: (): Promise<{
    success: boolean
    data: any
  }> => apiRequest.get('/docx/vs-pdf'),
}

// DOCX Template PDF System API Servisleri
export const docxTemplatePdfApi = {
  // Template listesi
  getTemplates: (): Promise<DOCXTemplatesResponse> => apiRequest.get('/docx-template-pdf/templates'),

  // Admin: Template yükle ve analiz et
  uploadAndAnalyze: (templateId: string, file: File): Promise<DOCXTemplateAnalysisResponse> => {
    const formData = new FormData()
    formData.append('template', file)
    return apiRequest.post(`/docx-template-pdf/admin/upload-analyze/${templateId}`, formData)
  },

  // Template ile PDF oluştur (direkt)
  generateWithTemplate: (templateId: string, data: DOCXTemplatePDFData): Promise<DOCXTemplatePDFResponse> =>
    apiRequest.post(`/docx-template-pdf/${templateId}`, data),

  // Esnek template seçimi
  generateFlexible: (templateId: string, data: DOCXTemplatePDFData): Promise<DOCXTemplatePDFResponse> =>
    apiRequest.post(`/docx-template-pdf/generate/${templateId}`, data),

  // Çoklu template PDF oluşturma
  generateMultiple: (data: {
    templateIds: string[]
    cvData: DOCXTemplatePDFData
  }): Promise<{ success: boolean; data: DOCXTemplatePDFResponse[] }> =>
    apiRequest.post('/docx-template-pdf/generate-multiple', data),

  // Template önizleme
  preview: (templateId: string): Promise<Blob> =>
    apiRequest.get(`/docx-template-pdf/preview/${templateId}`, { responseType: 'blob' }),

  // Template yükleme (sadece dosya)
  upload: (templateId: string, file: File): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData()
    formData.append('template', file)
    return apiRequest.post(`/docx-template-pdf/upload/${templateId}`, formData)
  },
}

// PDF Test API Servisleri
export const pdfTestApi = {
  testTurkishCharacters: (): Promise<Blob> =>
    apiRequest.get('/pdf-test/turkish-characters', { responseType: 'blob', skipAuth: true }),
}
