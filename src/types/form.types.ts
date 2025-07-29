import { z } from 'zod'

export const atsFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır').max(50, 'Ad en fazla 50 karakter olabilir'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır').max(50, 'Soyad en fazla 50 karakter olabilir'),
    email: z.string().email('Geçerli bir email adresi girin'),
    phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, 'Geçerli bir telefon numarası girin'),
    address: z.object({
      street: z.string().optional(),
      city: z.string().min(2, 'Şehir gereklidir'),
      country: z.string().min(2, 'Ülke gereklidir'),
    }),
    linkedIn: z.string().url("Geçerli bir LinkedIn URL'si girin").optional().or(z.literal('')),
    github: z.string().url("Geçerli bir GitHub URL'si girin").optional().or(z.literal('')),
    portfolio: z.string().url("Geçerli bir portfolio URL'si girin").optional().or(z.literal('')),
  }),
  professionalSummary: z.object({
    summary: z
      .string()
      .min(100, 'Profesyonel özet en az 100 karakter olmalıdır')
      .max(1000, 'Profesyonel özet 1000 karakteri geçemez'),
    targetPosition: z
      .string()
      .min(2, 'Hedef pozisyon gereklidir')
      .max(100, 'Hedef pozisyon en fazla 100 karakter olabilir'),
    yearsOfExperience: z
      .number()
      .min(0, 'Deneyim yılı 0 veya daha fazla olmalıdır')
      .max(50, 'Deneyim yılı 50 yılı geçemez'),
    keySkills: z
      .array(z.string().min(1))
      .min(1, 'En az 1 anahtar yetenek ekleyin')
      .max(20, 'En fazla 20 anahtar yetenek ekleyebilirsiniz'),
  }),
  workExperience: z
    .array(
      z.object({
        id: z.string().optional(),
        companyName: z.string().min(2, 'Şirket adı gereklidir'),
        position: z.string().min(2, 'İş unvanı gereklidir'),
        location: z.string().min(2, 'Konum gereklidir'),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        isCurrentRole: z.boolean(),
        achievements: z
          .array(z.string().min(5, 'Başarı en az 5 karakter olmalıdır'))
          .min(1, 'En az 1 başarı/sorumluluk eklemelisiniz')
          .max(10, 'En fazla 10 başarı/sorumluluk ekleyebilirsiniz'),
        technologies: z.string().optional(),
        industryType: z.string().optional(),
      }),
    )
    .min(1, 'En az bir iş deneyimi ekleyin'),
  education: z
    .array(
      z.object({
        id: z.string().optional(),
        institution: z.string().min(2, 'Okul adı gereklidir'),
        degree: z.string().min(2, 'Derece gereklidir'),
        fieldOfStudy: z.string().min(2, 'Bölüm gereklidir'),
        location: z.string().min(2, 'Konum gereklidir'),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        gpa: z
          .number()
          .min(0, 'Not ortalaması 0 veya daha fazla olmalıdır')
          .max(4, 'Not ortalaması 4.0 üzerinde olamaz')
          .optional(),
        honors: z.string().optional(),
        relevantCoursework: z.string().optional(),
      }),
    )
    .min(1, 'En az bir eğitim bilgisi ekleyin'),
  skills: z.object({
    technical: z
      .array(
        z.object({
          category: z.string().min(1, 'Kategori gereklidir'),
          items: z
            .array(
              z.object({
                name: z.string().min(1, 'Yetenek adı gereklidir'),
                proficiencyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
              }),
            )
            .min(1, 'Her kategoride en az bir yetenek olmalıdır'),
        }),
      )
      .min(1, 'En az bir teknik yetenek kategorisi ekleyin'),
    languages: z
      .array(
        z.object({
          language: z.string().min(1, 'Dil adı gereklidir'),
          proficiency: z.enum(['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'], {
            errorMap: () => ({ message: 'Seviye: Native, Fluent, Advanced, Intermediate veya Basic olmalıdır' }),
          }),
        }),
      )
      .optional(),
    soft: z.array(z.string().min(1)).min(1, 'En az bir kişisel yetenek ekleyin'),
  }),
  configuration: z.object({
    targetCompany: z.string().optional(),
    jobDescription: z.string().optional(),
    language: z.enum(['TURKISH', 'ENGLISH']),
    cvType: z.enum(['ATS_OPTIMIZED', 'TECHNICAL', 'EXECUTIVE']),
    templateStyle: z.enum(['MINIMAL', 'PROFESSIONAL', 'MODERN']),
    useAI: z.boolean().optional(),
  }),
  certifications: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2, 'Sertifika adı gereklidir'),
        issuingOrganization: z.string().min(2, 'Veren kurum gereklidir'),
        issueDate: z.string().optional(),
        expirationDate: z.string().optional(),
        credentialId: z.string().optional(),
        verificationUrl: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
      }),
    )
    .optional(),
  projects: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(2, 'Proje adı gereklidir'),
        description: z.string().min(10, 'Proje açıklaması en az 10 karakter olmalıdır'),
        technologies: z.array(z.string().min(1)).min(1, 'En az bir teknoloji ekleyin'),
        startDate: z.string().min(1, 'Başlangıç tarihi gereklidir'),
        endDate: z.string().optional(),
        url: z.string().url('Geçerli bir URL girin').optional().or(z.literal('')),
        achievements: z
          .array(z.string().min(5, 'Başarı en az 5 karakter olmalıdır'))
          .min(1, 'En az bir başarı ekleyin'),
      }),
    )
    .optional(),
})

export type ATSFormData = z.infer<typeof atsFormSchema>
