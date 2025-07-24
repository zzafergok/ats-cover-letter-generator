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

// User Profile API Servisleri - API dokumentasyonuna göre genişletilmiş
export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  github?: string
  linkedin?: string
  portfolioWebsite?: string
  aboutMe?: string
  profilePictureUrl?: string
  avatarColor?: string
  educations: Education[]
  experiences: WorkExperience[]
  courses: Course[]
  certificates: Certificate[]
  hobbies: Hobby[]
  skills: Skill[]
}

export type EducationType = 'LISE' | 'ONLISANS' | 'LISANS' | 'YUKSEKLISANS'

export interface Education {
  id: string
  schoolName: string
  degree?: string
  fieldOfStudy?: string
  grade?: number
  gradeSystem: 'PERCENTAGE' | 'GPA_4'
  educationType?: EducationType
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

// CV type tanımları - API dokumentasyonuna göre güncellenmiş
export type CVUploadStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type CVType = 'ATS_OPTIMIZED' | 'CREATIVE' | 'TECHNICAL'
export type Language = 'TURKISH' | 'ENGLISH'

export interface CVUpload {
  id: string
  originalName: string
  fileName: string
  size: number
  uploadDate: string
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

//  Location Services - API format
export interface Province {
  id: string
  code: string
  name: string
  districts: District[]
}

export interface District {
  id: string
  name: string
  provinceCode: string
}

export interface ProvincesResponse {
  success: boolean
  data: Province[]
  message?: string
}

export interface DistrictsResponse {
  success: boolean
  data: District[]
  message?: string
}

// High School Services - API format
export interface HighSchool {
  id: string
  name: string
  city?: string
  district?: string
  type?: string
}

export interface HighSchoolsResponse {
  success: boolean
  data: HighSchool[]
  message?: string
}

// University Services - API format
export interface University {
  id: string
  name: string
  city?: string
  type: 'STATE' | 'PRIVATE' | 'FOUNDATION'
  website?: string
}

export interface UniversitiesResponse {
  success: boolean
  data: University[]
  message?: string
}

// User Profile API responses
export interface UserProfileResponse {
  success: boolean
  data: UserProfile
  message?: string
}
