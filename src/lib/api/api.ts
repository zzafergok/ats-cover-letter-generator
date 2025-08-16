/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from './axios'
import {
  Hobby,
  Skill,
  Course,
  Project,
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
  RefreshResponse,
  ContactFormData,
  ContactResponse,
  TemplateFilters,
  RegisterResponse,
  CVUploadResponse,
  CVUploadsResponse,
  ProvincesResponse,
  DistrictsResponse,
  ATSAnalysesFilter,
  DetailedCVResponse,
  HighSchoolsResponse,
  CoverLetterTemplate,
  DetailedCVsResponse,
  ATSOptimizationData,
  ATSAnalysesResponse,
  ATSAnalysisResponse,
  UniversitiesResponse,
  ATSMatchAnalysisData,
  SalaryLimitsResponse,
  ContactLimitResponse,
  AuthProfileUpdateData,
  AuthSessionsResponse,
  SalaryCalculationData,
  TemplateCustomPdfData,
  AuthResetPasswordData,
  LocationStatsResponse,
  CVGeneratorCVResponse,
  CVDetailedGenerateData,
  AuthChangePasswordData,
  CVGeneratorCVsResponse,
  ATSOptimizationResponse,
  ATSCompleteAnalysisData,
  HighSchoolStatsResponse,
  UniversityStatsResponse,
  StandardSuccessResponse,
  ATSMatchAnalysisResponse,
  SeveranceCalculationData,
  CoverLetterBasicResponse,
  SeveranceCeilingResponse,
  AuthProfileUpdateResponse,
  CoverLetterBasicsResponse,
  ATSJobPostingAnalysisData,
  SalaryCalculationResponse,
  CVGeneratorGenerationData,
  CoverLetterBasicUpdateData,
  SeveranceConstantsResponse,
  CoverLetterDetailedResponse,
  ATSCompleteAnalysisResponse,
  CoverLetterBasicGenerateData,
  ATSApplyOptimizationResponse,
  CoverLetterDetailedsResponse,
  SeveranceSaveCalculationData,
  SeveranceCalculationResponse,
  CoverLetterDetailedUpdateData,
  ATSJobPostingAnalysisResponse,
  SalaryTaxConfigurationResponse,
  CVGeneratorGenerationResponse,
  CVGeneratorRegenerateResponse,
  TemplateCustomPdfDataWithTitle,
  CoverLetterDetailedGenerateData,
  SeveranceSaveCalculationResponse,
  SeveranceSavedCalculationResponse,
  SeveranceSavedCalculationsResponse,
  CVGeneratorTemplatesSimpleResponse,
  TemplateCreateCoverLetterDataDetailed,
  TemplateCreateCoverLetterResponseDetailed,
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

    downloadCustomPdf: (data: TemplateCustomPdfData): Promise<Blob> =>
      apiRequest.post('/cover-letter-basic/download/custom-pdf', data, { responseType: 'blob' }),
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

    downloadCustomPdf: (data: TemplateCustomPdfData): Promise<Blob> =>
      apiRequest.post('/cover-letter-detailed/download/custom-pdf', data, { responseType: 'blob' }),
  },
}

// Template Cover Letter Custom PDF
export const templateCoverLetterApi = {
  downloadCustomPdf: (data: TemplateCustomPdfDataWithTitle): Promise<Blob> =>
    apiRequest.post('/templates/download/custom-pdf', data, { responseType: 'blob' }),
}

export const authApi = {
  // Kullanıcı kayıt
  register: (userData: RegisterData): Promise<RegisterResponse> =>
    apiRequest.post('/auth/register', userData, { skipAuth: true }),

  // Kullanıcı giriş
  login: (credentials: LoginData): Promise<LoginResponse> =>
    apiRequest.post('/auth/login', credentials, { skipAuth: true }),

  // Email doğrulama
  verifyEmail: (token: string): Promise<StandardSuccessResponse> =>
    apiRequest.post('/auth/verify-email', { token }, { skipAuth: true }),

  // Email doğrulama tekrar gönder
  resendVerification: (email: string): Promise<StandardSuccessResponse> =>
    apiRequest.post('/auth/resend-verification', { email }, { skipAuth: true }),

  // Token yenileme
  refresh: (refreshToken: string): Promise<RefreshResponse> =>
    apiRequest.post('/auth/refresh', { refreshToken }, { skipAuth: true }),

  // Çıkış yap
  logout: (): Promise<StandardSuccessResponse> => apiRequest.post('/auth/logout'),

  // Tüm oturumları sonlandır
  logoutAll: (): Promise<StandardSuccessResponse> => apiRequest.post('/auth/logout-all'),

  // Şifre unuttum
  forgotPassword: (email: string): Promise<StandardSuccessResponse> =>
    apiRequest.post('/auth/forgot-password', { email }, { skipAuth: true }),

  // Şifre sıfırla
  resetPassword: (data: AuthResetPasswordData): Promise<StandardSuccessResponse> =>
    apiRequest.post('/auth/reset-password', data, { skipAuth: true }),

  // Mevcut kullanıcı bilgisi
  getCurrentUser: (): Promise<{ success: boolean; data: AuthUser }> => apiRequest.get('/auth/me'),

  // Profil güncelle
  updateProfile: (data: AuthProfileUpdateData): Promise<AuthProfileUpdateResponse> =>
    apiRequest.put('/auth/profile', data),

  // Şifre değiştir
  changePassword: (data: AuthChangePasswordData): Promise<StandardSuccessResponse> =>
    apiRequest.put('/auth/change-password', data),

  // Kullanıcı oturumları
  getSessions: (): Promise<AuthSessionsResponse> => apiRequest.get('/auth/sessions'),
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

  // Proje işlemleri
  project: {
    add: (data: Omit<Project, 'id'>): Promise<{ success: boolean; data: Project; message?: string }> =>
      apiRequest.post('/user-profile/project', data),

    update: (
      id: string,
      data: Partial<Omit<Project, 'id'>>,
    ): Promise<{ success: boolean; data: Project; message?: string }> =>
      apiRequest.put(`/user-profile/project/${id}`, data),

    delete: (id: string): Promise<{ success: boolean; message: string }> =>
      apiRequest.delete(`/user-profile/project/${id}`),
  },
}

// Contact API Servisleri - API dokumentasyonuna göre güncellenmiş
export const contactApi = {
  send: (data: ContactFormData): Promise<ContactResponse> => apiRequest.post('/contact/send', data, { skipAuth: true }),

  getMessages: (): Promise<{ success: boolean; data: any[] }> => apiRequest.get('/contact/messages'),

  checkLimit: (): Promise<ContactLimitResponse> => apiRequest.get('/contact/limit', { skipAuth: true }),
}

// CV Upload Services - API dokumentasyonuna göre güncellenmiş
export const cvUploadApi = {
  // CV upload işlemleri
  upload: (file: File): Promise<CVUploadResponse> => {
    const formData = new FormData()
    formData.append('cvFile', file)
    return apiRequest.post('/cv-upload/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  getUploads: (): Promise<CVUploadsResponse> => apiRequest.get('/cv-upload/uploads'),

  getUploadStatus: (id: string): Promise<{ success: boolean; data: CVUpload }> =>
    apiRequest.get(`/cv-upload/upload/status/${id}`),

  deleteUpload: (id: string): Promise<{ success: boolean; message: string }> =>
    apiRequest.delete(`/cv-upload/uploads/${id}`),
}

// CV Template Generation Services - Yeni CV generator servisleri
export const cvGeneratorApi = {
  // Mevcut template'leri al
  getTemplates: (): Promise<CVGeneratorTemplatesSimpleResponse> => apiRequest.get('/cv-generator/templates'),

  // Template'den CV oluştur
  generate: (data: CVGeneratorGenerationData): Promise<CVGeneratorGenerationResponse> =>
    apiRequest.post('/cv-generator/generate', data),

  // Kullanıcının oluşturduğu CV'leri al
  getGeneratedCVs: (): Promise<CVGeneratorCVsResponse> => apiRequest.get('/cv-generator'),

  // Belirli bir CV'yi al
  getGeneratedCV: (cvId: string): Promise<CVGeneratorCVResponse> => apiRequest.get(`/cv-generator/${cvId}`),

  // CV'yi PDF olarak indir
  downloadPdf: (cvId: string): Promise<Blob> =>
    apiRequest.get(`/cv-generator/${cvId}/download`, { responseType: 'blob' }),

  // CV'yi yeniden oluştur
  regenerate: (cvId: string): Promise<CVGeneratorRegenerateResponse> =>
    apiRequest.post(`/cv-generator/${cvId}/regenerate`),

  // CV'yi sil
  delete: (cvId: string): Promise<StandardSuccessResponse> => apiRequest.delete(`/cv-generator/${cvId}`),
}

// Legacy CV API - Geriye dönük uyumluluk için
export const cvApi = {
  // CV upload işlemleri - cvUploadApi'ye yönlendir
  upload: cvUploadApi.upload,
  getUploads: cvUploadApi.getUploads,
  getUploadStatus: cvUploadApi.getUploadStatus,
  deleteUpload: cvUploadApi.deleteUpload,

  // CV generation işlemleri - cvGeneratorApi'ye yönlendir
  generate: cvGeneratorApi.generate,
  download: cvGeneratorApi.downloadPdf,

  // Eski CV save işlemleri - şimdilik korunuyor
  save: (data: CVSaveData): Promise<{ success: boolean; data: SavedCV; message?: string }> =>
    apiRequest.post('/cv/save', data),

  // Eski Detailed CV işlemleri - şimdilik korunuyor
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
  getStats: (): Promise<LocationStatsResponse> => apiRequest.get('/locations/stats', { skipAuth: true }),
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
  getHighSchoolStats: (): Promise<HighSchoolStatsResponse> => apiRequest.get('/high-schools/stats', { skipAuth: true }),

  // Lise verilerini yenile
  reloadHighSchools: (): Promise<StandardSuccessResponse> =>
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
  getUniversityStats: (): Promise<UniversityStatsResponse> => apiRequest.get('/universities/stats', { skipAuth: true }),

  // Üniversite verilerini yenile
  refreshUniversities: (): Promise<StandardSuccessResponse> =>
    apiRequest.post('/universities/refresh', {}, { skipAuth: true }),
}

// Template API Servisleri - API dokumentasyonuna göre güncellenmiş
export const templateApi = {
  // Tüm template'leri al (filtreleme seçenekleri ile)
  getAll: (params?: TemplateFilters): Promise<{ success: boolean; data: CoverLetterTemplate[]; message?: string }> => {
    const queryParams = new URLSearchParams()
    if (params?.industry) queryParams.append('industry', params.industry)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.language) queryParams.append('language', params.language)

    const queryString = queryParams.toString()
    return apiRequest.get(`/templates${queryString ? `?${queryString}` : ''}`)
  },

  // Template kategorilerini al
  getCategories: (): Promise<{ success: boolean; data: Record<string, string[]>; message?: string }> =>
    apiRequest.get('/templates/categories'),

  // Sektöre göre template'leri al
  getByIndustry: (
    industry: 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING',
  ): Promise<{ success: boolean; data: CoverLetterTemplate[]; message?: string }> =>
    apiRequest.get(`/templates/industry/${industry}`),

  // ID'ye göre template al
  getById: (templateId: string): Promise<{ success: boolean; data: CoverLetterTemplate; message?: string }> =>
    apiRequest.get(`/templates/${templateId}`),

  // Template'den cover letter oluştur
  createCoverLetter: (
    data: TemplateCreateCoverLetterDataDetailed,
  ): Promise<TemplateCreateCoverLetterResponseDetailed> => apiRequest.post('/templates/create-cover-letter', data),

  // Template'leri başlat (Admin)
  initialize: (): Promise<StandardSuccessResponse> => apiRequest.post('/templates/initialize'),
}

// Salary Calculator API Servisleri - SALARY_API.md'ye göre
export const salaryApi = {
  // Genel maaş hesaplama
  calculate: (data: SalaryCalculationData): Promise<SalaryCalculationResponse> =>
    apiRequest.post('/salary/calculate', data, { skipAuth: true }),

  // Brüt'ten net'e hesaplama
  grossToNet: (data: SalaryCalculationData): Promise<SalaryCalculationResponse> =>
    apiRequest.post('/salary/gross-to-net', data, { skipAuth: true }),

  // Net'ten brüt'e hesaplama
  netToGross: (data: SalaryCalculationData): Promise<SalaryCalculationResponse> =>
    apiRequest.post('/salary/net-to-gross', data, { skipAuth: true }),

  // Maaş limitleri
  getLimits: (year?: number): Promise<SalaryLimitsResponse> => {
    const queryParams = year ? `?year=${year}` : ''
    return apiRequest.get(`/salary/limits${queryParams}`, { skipAuth: true })
  },

  // Vergi konfigürasyonu
  getTaxConfiguration: (year?: number): Promise<SalaryTaxConfigurationResponse> => {
    const queryParams = year ? `?year=${year}` : ''
    return apiRequest.get(`/salary/tax-configuration${queryParams}`, { skipAuth: true })
  },
}

// ATS Optimization API Servisleri - API dokumentasyonuna göre
export const atsApi = {
  // İş ilanı analizi
  analyzeJobPosting: (data: ATSJobPostingAnalysisData): Promise<ATSJobPostingAnalysisResponse> =>
    apiRequest.post('/ats/analyze-job-posting', data),

  // CV-Job uyum analizi
  analyzeMatch: (jobAnalysisId: string, data: ATSMatchAnalysisData): Promise<ATSMatchAnalysisResponse> =>
    apiRequest.post(`/ats/analyze-match/${jobAnalysisId}`, data),

  // CV optimizasyon
  optimize: (matchAnalysisId: string, data: ATSOptimizationData): Promise<ATSOptimizationResponse> =>
    apiRequest.post(`/ats/optimize/${matchAnalysisId}`, data),

  // Tam ATS analizi (tek istekte tüm süreç)
  completeAnalysis: (data: ATSCompleteAnalysisData): Promise<ATSCompleteAnalysisResponse> =>
    apiRequest.post('/ats/complete-analysis', data),

  // Optimizasyonu profile uygula
  applyOptimization: (optimizationId: string): Promise<ATSApplyOptimizationResponse> =>
    apiRequest.post(`/ats/apply-optimization/${optimizationId}`),

  // Kullanıcının ATS analizlerini listele
  getMyAnalyses: (params?: ATSAnalysesFilter): Promise<ATSAnalysesResponse> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.type) queryParams.append('type', params.type)

    const queryString = queryParams.toString()
    return apiRequest.get(`/ats/my-analyses${queryString ? `?${queryString}` : ''}`)
  },

  // Belirli bir analizi getir
  getAnalysis: (analysisId: string): Promise<ATSAnalysisResponse> => apiRequest.get(`/ats/analysis/${analysisId}`),

  // Analizi sil
  deleteAnalysis: (analysisId: string): Promise<StandardSuccessResponse> =>
    apiRequest.delete(`/ats/analysis/${analysisId}`),
}

// Severance Calculator API Servisleri
export const severanceApi = {
  // Kıdem ve İhbar Tazminatı hesaplama
  calculate: (data: SeveranceCalculationData): Promise<SeveranceCalculationResponse> =>
    apiRequest.post('/severance/calculate', data, { skipAuth: true }),

  // Kıdem tazminatı sabitleri ve kuralları
  getConstants: (year?: number): Promise<SeveranceConstantsResponse> => {
    const queryParams = year ? `?year=${year}` : ''
    return apiRequest.get(`/severance/constants${queryParams}`, { skipAuth: true })
  },

  // Kıdem tazminatı tavanı sorgulama
  getSeveranceCeiling: (date: string): Promise<SeveranceCeilingResponse> =>
    apiRequest.get(`/severance/ceiling?date=${date}`, { skipAuth: true }),

  // Geçmiş hesaplamaları kaydet (opsiyonel - kullanıcı girişi gerektiriyorsa)
  saveCalculation: (data: SeveranceSaveCalculationData): Promise<SeveranceSaveCalculationResponse> =>
    apiRequest.post('/severance/save-calculation', data),

  // Kaydedilen hesaplamaları listele
  getSavedCalculations: (): Promise<SeveranceSavedCalculationsResponse> =>
    apiRequest.get('/severance/saved-calculations'),

  // Kaydedilen hesaplamayı getir
  getSavedCalculation: (id: string): Promise<SeveranceSavedCalculationResponse> =>
    apiRequest.get(`/severance/saved-calculations/${id}`),

  // Kaydedilen hesaplamayı sil
  deleteSavedCalculation: (id: string): Promise<StandardSuccessResponse> =>
    apiRequest.delete(`/severance/saved-calculations/${id}`),
}
