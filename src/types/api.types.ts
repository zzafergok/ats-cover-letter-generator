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

// CV Generator Types - API dokumentasyonuna göre yeni
export interface CVGeneratorTemplate {
  id: string
  name: string
  description: string
  language: string
}

export interface CVGeneratorData {
  templateType: 'basic_hr' | 'office_manager' | 'simple_classic' | 'stylish_accounting' | 'minimalist_turkish'
  data: {
    personalInfo: {
      fullName: string
      address?: string
      city?: string
      state?: string
      zipCode?: string
      phone?: string
      email: string
    }
    objective?: string
    experience?: Array<{
      jobTitle: string
      company: string
      location?: string
      startDate: string
      endDate?: string
      description?: string
    }>
    education?: Array<{
      degree: string
      university: string
      location?: string
      graduationDate?: string
      details?: string
    }>
    communication?: string
    leadership?: string
    references?: Array<{
      name: string
      company: string
      contact: string
    }>
  }
}

export interface GeneratedCV {
  id: string
  templateType: string
  generationStatus: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED'
  createdAt: string
  updatedAt: string
}

export interface CVGeneratorResponse {
  success: boolean
  message: string
  data: GeneratedCV
}

export interface CVGeneratorListResponse {
  success: boolean
  data: GeneratedCV[]
  limitInfo: {
    current: number
    maximum: number
    canCreate: boolean
    type: string
  }
}

export interface CVGeneratorTemplatesResponse {
  success: boolean
  data: CVGeneratorTemplate[]
}

// Additional CV Generator Types - Missing inline types
export interface CVGeneratorTemplatesSimpleResponse {
  success: boolean
  data: Array<{
    id: string
    name: string
    description: string
    language: string
  }>
}

export interface CVGeneratorGenerationData {
  templateType: 'basic_hr' | 'office_manager' | 'simple_classic' | 'stylish_accounting' | 'minimalist_turkish'
  data: {
    personalInfo: {
      fullName: string
      address?: string
      city?: string
      state?: string
      zipCode?: string
      phone?: string
      email: string
    }
    objective?: string
    experience?: Array<{
      jobTitle: string
      company: string
      location?: string
      startDate: string
      endDate?: string
      description?: string
    }>
    education?: Array<{
      degree: string
      university: string
      location?: string
      graduationDate?: string
      details?: string
    }>
    communication?: string
    leadership?: string
    references?: Array<{
      name: string
      company: string
      contact: string
    }>
  }
}

export interface CVGeneratorGenerationResponse {
  success: boolean
  message: string
  data: {
    id: string
    templateType: string
    generationStatus: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED'
    createdAt: string
    updatedAt: string
  }
}

export interface CVGeneratorCVsResponse {
  success: boolean
  data: Array<{
    id: string
    templateType: string
    generationStatus: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED'
    createdAt: string
    updatedAt: string
  }>
  limitInfo: {
    current: number
    maximum: number
    canCreate: boolean
    type: string
  }
}

export interface CVGeneratorCVResponse {
  success: boolean
  data: {
    id: string
    templateType: string
    generationStatus: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED'
    createdAt: string
    updatedAt: string
  }
}

export interface CVGeneratorRegenerateResponse {
  success: boolean
  message: string
  data: {
    id: string
    templateType: string
    generationStatus: 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'FAILED'
    createdAt: string
    updatedAt: string
  }
}

// Template Cover Letter Creation Types - Missing inline types
export interface TemplateCreateCoverLetterDataDetailed {
  templateId: string
  positionTitle: string
  companyName: string
  personalizations: {
    whyPosition?: string
    whyCompany?: string
    additionalSkills?: string
  }
}

export interface TemplateCreateCoverLetterResponseDetailed {
  success: boolean
  data: {
    content: string
    templateId: string
    positionTitle: string
    companyName: string
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

// ATS Optimization API Types - API dokumentasyonuna göre
export interface ATSJobPostingAnalysisData {
  jobPostingText?: string
  jobPostingUrl?: string
  companyName?: string
  positionTitle?: string
}

export interface ATSJobAnalysis {
  id: string
  userId: string
  companyName: string
  positionTitle: string
  requiredSkills: string[]
  preferredSkills: string[]
  requiredExperience: Array<{
    skillArea: string
    minimumYears: number
    isRequired: boolean
    description: string
  }>
  keywords: Array<{
    keyword: string
    category: 'TECHNICAL' | 'SOFT_SKILL' | 'INDUSTRY' | 'ROLE'
    importance: 'HIGH' | 'MEDIUM' | 'LOW'
    frequency: number
  }>
  atsKeywords: string[]
  seniorityLevel: 'ENTRY' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE'
  industryType: string
  analysisStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
}

export interface ATSJobPostingAnalysisResponse {
  success: boolean
  data: {
    jobAnalysis: ATSJobAnalysis
  }
  message?: string
}

export interface ATSMatchAnalysisData {
  useUserProfile?: boolean
  cvData?: any
}

export interface ATSMatchAnalysis {
  id: string
  userId: string
  jobAnalysisId: string
  overallScore: number
  skillsMatch: {
    score: number
    totalRequired: number
    matched: number
    missing: string[]
    extra: string[]
  }
  experienceMatch: {
    score: number
    totalYearsRequired: number
    totalYearsUser: number
    relevantExperiences: Array<{
      company: string
      position: string
      relevanceScore: number
      matchingSkills: string[]
    }>
  }
  keywordMatch: {
    score: number
    totalKeywords: number
    matchedKeywords: number
    missingHighPriority: string[]
    missingMediumPriority: string[]
  }
  missingSkills: string[]
  recommendations: Array<{
    type: 'SKILL_GAP' | 'EXPERIENCE_GAP' | 'KEYWORD_OPTIMIZATION' | 'FORMAT_IMPROVEMENT'
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    title: string
    description: string
    estimatedImpact: number
  }>
  matchStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
}

export interface ATSMatchAnalysisResponse {
  success: boolean
  data: {
    matchAnalysis: ATSMatchAnalysis
  }
  message?: string
}

export interface ATSOptimizationData {
  optimizationLevel: 'BASIC' | 'ADVANCED' | 'COMPREHENSIVE'
  targetSections: Array<{
    section: 'SKILLS' | 'EXPERIENCE' | 'EDUCATION' | 'OBJECTIVE' | 'KEYWORDS'
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
  }>
  preserveOriginal?: boolean
}

export interface ATSOptimization {
  id: string
  userId: string
  matchAnalysisId: string
  beforeScore: number
  afterScore: number
  improvementPercentage: number
  changes: Array<{
    section: string
    changeType: 'ADDED' | 'MODIFIED' | 'REMOVED' | 'REORDERED'
    newValue: string
    reason: string
    keywords: string[]
  }>
  atsCompliance: {
    score: number
    passedChecks: string[]
    failedChecks: string[]
    recommendations: Array<{
      category: string
      recommendation: string
      impact: 'HIGH' | 'MEDIUM' | 'LOW'
    }>
  }
  optimizationStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
}

export interface ATSOptimizationResponse {
  success: boolean
  data: {
    optimization: ATSOptimization
  }
  message?: string
}

export interface ATSCompleteAnalysisData {
  jobPostingAnalysis: {
    jobPostingText?: string
    jobPostingUrl?: string
    companyName?: string
    positionTitle?: string
  }
  optimizationLevel: 'BASIC' | 'ADVANCED' | 'COMPREHENSIVE'
  targetSections: Array<{
    section: 'SKILLS' | 'EXPERIENCE' | 'EDUCATION' | 'OBJECTIVE' | 'KEYWORDS'
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
  }>
}

export interface ATSCompleteAnalysisResponse {
  success: boolean
  data: {
    jobAnalysis: any
    matchAnalysis: any
    optimization: any
  }
  message?: string
}

export interface ATSApplyOptimizationResponse {
  success: boolean
  data: {
    applied: boolean
  }
  message?: string
}

export interface ATSAnalysesFilter {
  page?: number
  limit?: number
  type?: 'job_analysis' | 'match_analysis' | 'optimization'
}

export interface ATSAnalysisItem {
  id: string
  type: 'job_analysis' | 'match_analysis' | 'optimization'
  companyName: string
  positionTitle: string
  score?: number
  createdAt: string
}

export interface ATSAnalysesResponse {
  success: boolean
  data: {
    analyses: ATSAnalysisItem[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  message?: string
}

export interface ATSAnalysisResponse {
  success: boolean
  data: any
  message?: string
}

// Severance Calculator API Types
export interface SeveranceCalculationData {
  workStartDate: string // ISO date string
  workEndDate: string // ISO date string
  monthlyGrossSalary: number
  cumulativeTaxBase?: number
  calculationBasisDays?: number // default: 30
}

export interface SeveranceCalculationResult {
  // Çalışma bilgileri
  workStartDate: string
  workEndDate: string
  totalWorkDays: number
  totalWorkYears: number
  totalWorkMonths: number
  totalWorkDaysRemainder: number

  // Maaş bilgileri
  monthlyGrossSalary: number
  dailyGrossWage: number
  cumulativeTaxBase: number
  appliedSeveranceCeiling: number

  // Kıdem tazminatı
  severanceEligibleDays: number
  severanceGrossAmount: number
  severanceStampTax: number
  severanceNetAmount: number
  severanceEligible: boolean

  // İhbar tazminatı
  noticeEligibleDays: number
  noticeGrossAmount: number
  noticeIncomeTax: number
  noticeStampTax: number
  noticeNetAmount: number
  noticeExemptionApplied: number

  // Toplam
  totalGrossAmount: number
  totalTaxes: number
  totalNetAmount: number

  // Hesaplama detayları
  calculationDetails: {
    severanceCalculationBasis: string
    noticeCalculationBasis: string
    taxYear: number
    stampTaxRate: number
    incomeTaxBrackets: Array<{
      min: number
      max: number
      rate: number
      appliedAmount: number
      taxAmount: number
    }>
  }
}

export interface SeveranceCalculationResponse {
  success: boolean
  data: SeveranceCalculationResult
  message?: string
}

export interface SeveranceConstants {
  year: number
  // Kıdem tazminatı tavanları
  severanceCeilingH1: number // Ocak-Haziran
  severanceCeilingH2: number // Temmuz-Aralık

  // Vergi oranları
  stampTaxRate: number
  incomeTaxBrackets: Array<{
    min: number
    max: number
    rate: number
  }>

  // Kıdem tazminatı kuralları
  minimumWorkDaysForSeverance: number // 365 gün
  severanceDaysPerYear: number // 30 gün

  // İhbar tazminatı kuralları
  noticeRules: {
    lessThan6Months: number // 2 hafta
    lessThan18Months: number // 4 hafta
    lessThan3Years: number // 6 hafta
    moreThan3Years: number // 8 hafta
  }

  // İhbar tazminatı muafiyet tutarı
  noticeExemptionAmount: number
}

export interface SeveranceConstantsResponse {
  success: boolean
  data: SeveranceConstants
  message?: string
}

export interface SeveranceCeilingData {
  date: string
  ceilingAmount: number
  period: 'H1' | 'H2' // Hangi yarıyıl
  year: number
}

export interface SeveranceCeilingResponse {
  success: boolean
  data: SeveranceCeilingData
  message?: string
}

export interface SeveranceSaveCalculationData {
  calculationName?: string
  workStartDate: string
  workEndDate: string
  monthlyGrossSalary: number
  cumulativeTaxBase?: number
  calculationResult: any
}

export interface SeveranceSaveCalculationResponse {
  success: boolean
  data: {
    id: string
    calculationName: string
    createdAt: string
  }
  message?: string
}

export interface SeveranceSavedCalculationItem {
  id: string
  calculationName: string
  workStartDate: string
  workEndDate: string
  monthlyGrossSalary: number
  totalNetAmount: number
  createdAt: string
}

export interface SeveranceSavedCalculationsResponse {
  success: boolean
  data: SeveranceSavedCalculationItem[]
  message?: string
}

export interface SeveranceSavedCalculationDetail {
  id: string
  calculationName: string
  workStartDate: string
  workEndDate: string
  monthlyGrossSalary: number
  cumulativeTaxBase: number
  calculationResult: any
  createdAt: string
}

export interface SeveranceSavedCalculationResponse {
  success: boolean
  data: SeveranceSavedCalculationDetail
  message?: string
}

// Salary Calculator Types - Existing types expanded
export interface SalaryCalculationData {
  grossSalary?: number
  netSalary?: number
  year?: number
  month?: number
  isMarried?: boolean
  dependentCount?: number
  isDisabled?: boolean
  disabilityDegree?: 1 | 2 | 3
}

export interface SalaryCalculationResult {
  grossSalary: number
  netSalary: number
  sgkEmployeeShare: number
  unemploymentInsurance: number
  incomeTax: number
  stampTax: number
  totalDeductions: number
  employerCost: number
  employerSgkShare: number
  employerUnemploymentInsurance: number
  breakdown: {
    taxableIncome: number
    appliedTaxBracket: {
      minAmount: number
      maxAmount: number
      rate: number
      cumulativeTax: number
    }
    minimumWageExemption: number
    minimumLivingAllowance: number
    effectiveTaxRate: number
  }
}

export interface SalaryCalculationResponse {
  success: boolean
  data: SalaryCalculationResult
  message?: string
}

export interface SalaryLimitsResponse {
  success: boolean
  data: {
    minGrossSalary: number
    maxGrossSalary: number
    minNetSalary: number
    maxNetSalary: number
  }
  message?: string
}

export interface SalaryTaxConfiguration {
  year: number
  brackets: Array<{
    minAmount: number
    maxAmount: number
    rate: number
    cumulativeTax: number
  }>
  sgkRates: {
    employeeRate: number
    employerRate: number
    employerDiscountedRate: number
    unemploymentEmployeeRate: number
    unemploymentEmployerRate: number
    lowerLimit: number
    upperLimit: number
  }
  stampTaxRate: number
  minimumWage: {
    gross: number
    net: number
    daily: number
    hourly: number
  }
}

export interface SalaryTaxConfigurationResponse {
  success: boolean
  data: SalaryTaxConfiguration
  message?: string
}

// Template API Response Types - Inline types'ı tanımlamak için
export interface TemplateCustomPdfData {
  content: string
  positionTitle: string
  companyName: string
  language?: 'TURKISH' | 'ENGLISH'
}

export interface TemplateCustomPdfDataWithTitle extends TemplateCustomPdfData {
  templateTitle?: string
}

// Contact Limit Response Type
export interface ContactLimitResponse {
  success: boolean
  data: { remainingRequests: number; resetTime: string }
}

// Auth Profile Update Data
export interface AuthProfileUpdateData {
  firstName: string
  lastName: string
}

export interface AuthProfileUpdateResponse {
  success: boolean
  data: AuthUser
  message?: string
}

// Auth Change Password Data
export interface AuthChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Auth Reset Password Data
export interface AuthResetPasswordData {
  token: string
  newPassword: string
  confirmPassword: string
}

// Auth Sessions Response
export interface AuthSessionsResponse {
  success: boolean
  data: any[]
}

// Location Stats Response
export interface LocationStatsResponse {
  success: boolean
  data: { totalProvinces: number; totalDistricts: number; isLoaded: boolean }
}

// School Stats Responses
export interface HighSchoolStatsResponse {
  success: boolean
  data: { total: number; cities: number; isLoaded: boolean }
}

export interface UniversityStatsResponse {
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
}

// Template Filter Types
export interface TemplateFilters {
  industry?: 'TECHNOLOGY' | 'FINANCE' | 'HEALTHCARE' | 'EDUCATION' | 'MARKETING'
  category?: string
  language?: 'TURKISH' | 'ENGLISH'
}

// Standard Success Response
export interface StandardSuccessResponse {
  success: boolean
  message: string
}
