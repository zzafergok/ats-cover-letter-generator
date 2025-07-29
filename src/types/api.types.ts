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
  content?: string // Keep for backward compatibility
  generatedContent: string // This is what the API actually returns
  positionTitle: string
  companyName: string
  language: Language
  generationStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
}

export interface CoverLetterDetailed {
  id: string
  content?: string // Keep for backward compatibility
  generatedContent: string // This is what the API actually returns
  positionTitle: string
  companyName: string
  language: Language
  generationStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
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

// Cover Letter Template types
export interface CoverLetterTemplate {
  id: string
  title: string
  content: string
  category:
    | 'SOFTWARE_DEVELOPER'
    | 'FRONTEND_DEVELOPER'
    | 'BACKEND_DEVELOPER'
    | 'FULLSTACK_DEVELOPER'
    | 'DATA_SCIENTIST'
    | 'FINANCIAL_ANALYST'
    | 'INVESTMENT_BANKER'
    | 'FINANCIAL_ADVISOR'
    | 'ACCOUNTING_SPECIALIST'
    | 'RISK_ANALYST'
    | 'NURSE'
    | 'DOCTOR'
    | 'PHARMACIST'
    | 'TEACHER'
    | 'ACADEMIC_ADMINISTRATOR'
    | 'MARKETING_SPECIALIST'
  language: 'TURKISH' | 'ENGLISH'
  industry: 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING'
  description?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface TemplateCreateCoverLetterData {
  templateId: string
  positionTitle: string
  companyName: string
  personalizations: {
    whyPosition?: string
    whyCompany?: string
    additionalSkills?: string
  }
}

export interface TemplateCreateCoverLetterResponse {
  success: boolean
  data: {
    content: string
    templateId: string
    positionTitle: string
    companyName: string
  }
  message?: string
}

export interface TemplatesResponse {
  success: boolean
  data: CoverLetterTemplate[]
  message?: string
}

export interface TemplateCategoriesResponse {
  success: boolean
  data: Record<string, string[]>
  message?: string
}

// ATS CV Services Types
export interface ATSCVGenerateData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: {
      street?: string
      city: string
      state?: string
      postalCode?: string
      country: string
    }
    linkedIn?: string
    website?: string
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
    targetCompany?: string
    jobDescription?: string
    language: 'TURKISH' | 'ENGLISH'
    cvType: 'ATS_OPTIMIZED' | 'TECHNICAL' | 'EXECUTIVE'
    templateStyle: 'MINIMAL' | 'PROFESSIONAL' | 'MODERN'
    useAI?: boolean
  }
}

export interface ATSCVGenerateResponse {
  success: boolean
  message: string
  data: {
    cvId: string
    fileName: string
    fileSize: number
    generationStatus: 'COMPLETED' | 'PROCESSING' | 'FAILED'
    downloadUrl: string
    createdAt: string
    applicantName: string
    targetPosition: string
    language: 'TURKISH' | 'ENGLISH'
    useAI: boolean
    optimizationMetrics?: {
      keywordsMatched: number
      atsScore: number
      processingTimeMs: number
    }
  }
}

export interface ATSCVTestResponse {
  success: boolean
  data: {
    pdfUrl: string
    sampleData: any
  }
  message?: string
}

export interface ATSCVSchemaResponse {
  success: boolean
  data: {
    schema: any
  }
}

export interface ATSValidationTipsResponse {
  success: boolean
  data: {
    tips: Array<{
      category: string
      tip: string
      importance: string
    }>
  }
}

// ATS Validation Services Types
export interface ATSValidationData {
  cvData: {
    personalInfo: any
    professionalSummary: string
    workExperience: any[]
    education: any[]
    skills: any
  }
  jobDescription: string
}

export interface ATSValidationResponse {
  success: boolean
  data: {
    overallScore: number
    sectionScores: {
      formatting: number
      keywords: number
      structure: number
      content: number
    }
    recommendations: Array<{
      section: string
      issue: string
      suggestion: string
      priority: string
    }>
    matchedKeywords: string[]
    missingKeywords: string[]
  }
}

export interface ATSValidationAnalysisResponse {
  success: boolean
  data: {
    scoreRange: string
    level: string
    description: string
    commonIssues: string[]
    nextSteps: string[]
  }
}

// CV Optimization Services Types
export interface CVOptimizationData {
  cvData: {
    personalInfo: any
    professionalSummary: string
    workExperience: any[]
    skills: any
  }
  jobDescription: string
}

export interface CVOptimizationResponse {
  success: boolean
  data: {
    optimizedCV: {
      personalInfo: any
      professionalSummary: string
      workExperience: any[]
    }
    optimizationReport: {
      improvementScore: number
      keywordMatchImprovement: number
      changes: Array<{
        section: string
        change: string
        impact: string
      }>
    }
  }
}

export interface KeywordSuggestionsData {
  jobDescription: string
  targetPosition: string
}

export interface KeywordSuggestionsResponse {
  success: boolean
  data: {
    keywords: {
      critical: string[]
      important: string[]
      recommended: string[]
    }
    phrases: string[]
  }
}

export interface KeywordAnalysisData {
  content: string
  jobDescription: string
}

export interface KeywordAnalysisResponse {
  success: boolean
  data: {
    matchScore: number
    matchedKeywords: string[]
    missingKeywords: string[]
    keywordDensity: Record<string, number>
    suggestions: string[]
  }
}

// DOCX Export Services Types
export interface DOCXGenerateData {
  cvData: {
    personalInfo: any
    professionalSummary: string
    workExperience: any[]
  }
  options: {
    template: string
    fontSize: number
    fontFamily: string
    margins: string
    includePhoto: boolean
  }
}

export interface DOCXGenerateResponse {
  success: boolean
  data: {
    downloadUrl: string
    fileName: string
    fileSize: number
    generatedAt: string
  }
  message?: string
}

// DOCX Template PDF System Types
export interface DOCXTemplate {
  id: string
  name: string
  description?: string
  category?: string
  language?: string
  targetRoles?: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DOCXTemplateAnalysis {
  templateId: string
  analysis: {
    existingPlaceholders: string[]
    recommendedFields: string[]
    templateStructure: {
      sections: string[]
    }
    fieldMapping: {
      [category: string]: string[]
    }
  }
}

export interface DOCXTemplateAnalysisResponse {
  success: boolean
  data: DOCXTemplateAnalysis
}

export interface DOCXTemplatesResponse {
  success: boolean
  data: {
    templates: DOCXTemplate[]
  }
}

export interface DOCXTemplatePDFData extends ATSCVGenerateData {
  useDocxTemplate?: boolean
  docxTemplateId?: string
  useClaudeOptimization?: boolean
}

export interface DOCXTemplatePDFResponse {
  success: boolean
  message: string
  data: {
    cvId: string
    fileName: string
    fileSize: number
    generationStatus: 'COMPLETED' | 'PROCESSING' | 'FAILED'
    downloadUrl: string
    createdAt: string
    applicantName: string
    targetPosition: string
    language: 'TURKISH' | 'ENGLISH'
    useAI: boolean
    templateUsed?: string
    optimizationMetrics?: {
      keywordsMatched: number
      atsScore: number
      processingTimeMs: number
    }
  }
}
