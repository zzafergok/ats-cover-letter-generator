import { z } from 'zod'

// CV types for generated CVs
export const cvTypes = ['ATS_OPTIMIZED', 'CREATIVE', 'TECHNICAL'] as const
export type CVType = (typeof cvTypes)[number]

// CV generator schema (for generating CV from uploaded CV)
export const cvFromUploadSchema = z.object({
  cvUploadId: z.string().min(1, 'CV seçimi gereklidir'),
  positionTitle: z.string().min(1, 'İş pozisyonu gereklidir').max(100, 'İş pozisyonu maksimum 100 karakter olabilir'),
  companyName: z.string().min(1, 'Şirket adı gereklidir').max(100, 'Şirket adı maksimum 100 karakter olabilir'),
  cvType: z.enum(cvTypes, {
    required_error: 'CV tipi seçimi gereklidir',
  }),
  jobDescription: z
    .string()
    .min(10, 'İş tanımı en az 10 karakter olmalıdır')
    .max(5000, 'İş tanımı maksimum 5000 karakter olabilir'),
  additionalRequirements: z
    .string()
    .optional()
    .refine((val) => !val || val.length <= 2000, 'Ek gereksinimler maksimum 2000 karakter olabilir'),
  targetKeywords: z
    .string()
    .optional()
    .refine((val) => !val || val.split(',').length <= 20, 'Maksimum 20 anahtar kelime ekleyebilirsiniz'),
})

// CV creation schema (for creating CV from scratch)
export const cvCreationSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, 'Ad soyad gereklidir'),
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    phone: z.string().min(1, 'Telefon numarası gereklidir'),
    city: z.string().min(1, 'Şehir gereklidir'),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
  }),
  professionalSummary: z.object({
    title: z.string().min(1, 'Başlık gereklidir'),
    summary: z.string().min(1, 'Özet gereklidir'),
  }),
  workExperience: z.array(
    z.object({
      company: z.string().min(1, 'Şirket adı gereklidir'),
      position: z.string().min(1, 'Pozisyon gereklidir'),
      startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
      endDate: z.string().optional(),
      isCurrentJob: z.boolean().default(false),
      description: z.string().min(1, 'Açıklama gereklidir'),
    }),
  ),
  education: z.array(
    z.object({
      school: z.string().min(1, 'Okul adı gereklidir'),
      degree: z.string().min(1, 'Derece gereklidir'),
      field: z.string().min(1, 'Alan gereklidir'),
      startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
      endDate: z.string().optional(),
      isCurrentEducation: z.boolean().default(false),
      description: z.string().optional(),
    }),
  ),
  skills: z.array(
    z.object({
      category: z.string().min(1, 'Kategori gereklidir'),
      skillList: z.array(z.string().min(1, 'Yetenek adı gereklidir')),
    }),
  ),
  languages: z
    .array(
      z.object({
        language: z.string().min(1, 'Dil gereklidir'),
        level: z.string().min(1, 'Seviye gereklidir'),
      }),
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string().min(1, 'Proje adı gereklidir'),
        description: z.string().min(1, 'Açıklama gereklidir'),
        technologies: z.array(z.string()).optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1, 'Sertifika adı gereklidir'),
        issuer: z.string().min(1, 'Veren kurum gereklidir'),
        date: z.string().min(1, 'Tarih gereklidir'),
        url: z.string().optional(),
      }),
    )
    .optional(),
})

// Type exports
export type CVFromUploadFormValues = z.infer<typeof cvFromUploadSchema>
export type CVCreationFormValues = z.infer<typeof cvCreationSchema>
export type CVPersonalInfo = z.infer<typeof cvCreationSchema>['personalInfo']
export type CVProfessionalSummary = z.infer<typeof cvCreationSchema>['professionalSummary']
export type CVWorkExperience = z.infer<typeof cvCreationSchema>['workExperience'][number]
export type CVEducation = z.infer<typeof cvCreationSchema>['education'][number]
export type CVSkillCategory = z.infer<typeof cvCreationSchema>['skills'][number]
export type CVLanguage = NonNullable<z.infer<typeof cvCreationSchema>['languages']>[number]
export type CVProject = NonNullable<z.infer<typeof cvCreationSchema>['projects']>[number]
export type CVCertification = NonNullable<z.infer<typeof cvCreationSchema>['certifications']>[number]

// Utility functions for validation
export const validateCVUploadData = (data: unknown): CVFromUploadFormValues => {
  const result = cvFromUploadSchema.safeParse(data)

  if (!result.success) {
    console.error('CV upload validation failed:', result.error.errors)
    throw new Error('Form validation failed')
  }

  return result.data
}

export const validateCVCreationData = (data: unknown): CVCreationFormValues => {
  const result = cvCreationSchema.safeParse(data)

  if (!result.success) {
    console.error('CV creation validation failed:', result.error.errors)
    throw new Error('Form validation failed')
  }

  return result.data
}

// Schema for partial updates (when saving drafts)
export const partialCVUploadSchema = cvFromUploadSchema.deepPartial()
export const partialCVCreationSchema = cvCreationSchema.deepPartial()
export type PartialCVUploadFormValues = z.infer<typeof partialCVUploadSchema>
export type PartialCVCreationFormValues = z.infer<typeof partialCVCreationSchema>
