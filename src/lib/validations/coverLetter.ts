import { z } from 'zod'

// Cover letter types
export const coverLetterTypes = ['TECHNICAL', 'CREATIVE', 'MANAGEMENT', 'SALES'] as const
export const coverLetterTones = ['CONFIDENT', 'PROFESSIONAL', 'ENTHUSIASTIC', 'MODEST'] as const

export type CoverLetterType = (typeof coverLetterTypes)[number]
export type CoverLetterTone = (typeof coverLetterTones)[number]

// Cover letter generation schema
export const coverLetterSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, 'Ad soyad gereklidir'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    phone: z.string().min(1, 'Telefon numarası gereklidir'),
    city: z.string().min(1, 'Şehir gereklidir'),
    linkedin: z.string().optional(),
  }),
  jobInfo: z.object({
    positionTitle: z.string().min(1, 'Pozisyon başlığı gereklidir'),
    companyName: z.string().min(1, 'Şirket adı gereklidir'),
    department: z.string().optional(),
    hiringManagerName: z.string().optional(),
    jobDescription: z.string().min(1, 'İş tanımı gereklidir'),
  }),
  experience: z.object({
    currentPosition: z.string().min(1, 'Mevcut pozisyon gereklidir'),
    yearsOfExperience: z.string().min(1, 'Deneyim yılı gereklidir'),
    relevantSkills: z.string().min(1, 'Yetenekler gereklidir'),
    achievements: z.string().optional(),
    previousCompanies: z.string().optional(),
  }),
  coverLetterType: z.enum(coverLetterTypes),
  tone: z.enum(coverLetterTones),
  additionalInfo: z.object({
    reasonForApplying: z.string().optional(),
    companyKnowledge: z.string().optional(),
    careerGoals: z.string().optional(),
  }),
})

// Type exports
export type CoverLetterFormValues = z.infer<typeof coverLetterSchema>
export type PersonalInfo = z.infer<typeof coverLetterSchema>['personalInfo']
export type JobInfo = z.infer<typeof coverLetterSchema>['jobInfo']
export type Experience = z.infer<typeof coverLetterSchema>['experience']
export type AdditionalInfo = z.infer<typeof coverLetterSchema>['additionalInfo']

// Utility functions for validation
export const validateCoverLetterData = (data: unknown): CoverLetterFormValues => {
  const result = coverLetterSchema.safeParse(data)

  if (!result.success) {
    console.error('Cover letter validation failed:', result.error.errors)
    throw new Error('Form validation failed')
  }

  return result.data
}

// Schema for partial updates (when saving drafts)
export const partialCoverLetterSchema = coverLetterSchema.deepPartial()
export type PartialCoverLetterFormValues = z.infer<typeof partialCoverLetterSchema>
