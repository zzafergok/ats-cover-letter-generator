import { z } from 'zod'

// CV Template Form Schema
export const cvTemplateSchema = z.object({
  templateType: z.enum(['basic_hr', 'office_manager', 'simple_classic', 'stylish_accounting', 'minimalist_turkish']),
  version: z.enum(['global', 'turkey']).optional(),
  language: z.enum(['turkish', 'english']).optional(),
  personalInfo: z.object({
    fullName: z.string().min(1, 'İsim gereklidir'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    jobTitle: z.string().optional(),
    linkedin: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Geçerli email adresi gereklidir'),
  }),
  objective: z.string().optional(),
  experience: z
    .array(
      z.object({
        jobTitle: z.string().min(1, 'İş unvanı gereklidir'),
        company: z.string().min(1, 'Şirket adı gereklidir'),
        location: z.string().optional(),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        description: z.string().optional(),
        isCurrent: z.boolean().optional(),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string().min(1, 'Derece gereklidir'),
        university: z.string().min(1, 'Üniversite adı gereklidir'),
        location: z.string().optional(),
        graduationDate: z.string().optional(),
        details: z.string().optional(),
        isCurrent: z.boolean().optional(),
      }),
    )
    .optional(),
  technicalSkills: z
    .object({
      frontend: z.array(z.string()).optional(),
      backend: z.array(z.string()).optional(),
      database: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
    })
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        technologies: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string().optional(),
        date: z.string().optional(),
      }),
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        level: z.string(),
      }),
    )
    .optional(),
  communication: z.string().optional(),
  leadership: z.string().optional(),
  skills: z.array(z.string()).optional(),
  references: z
    .array(
      z.object({
        name: z.string().optional(),
        company: z.string().optional(),
        contact: z.string().optional(),
      }),
    )
    .optional(),
})

export type CVTemplateFormData = z.infer<typeof cvTemplateSchema>