import { z } from 'zod'

// Password güvenlik seviyesi enum'u
export enum PasswordStrength {
  WEAK = 'weak',
  MEDIUM = 'medium',
  STRONG = 'strong',
}

// Güçlü şifre regex pattern'ı
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/

// Email domain whitelist (opsiyonel)
const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'outlook.com', 'example.com'] as const

// Login şeması - development friendly
export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'E-posta adresi gereklidir',
    })
    .min(1, { message: 'E-posta adresi gereklidir' })
    .email({ message: 'Geçerli bir e-posta adresi girin' })
    .max(254, { message: 'E-posta adresi çok uzun' })
    .transform((email) => email.toLowerCase().trim())
    .refine(
      (email) => {
        // Development ortamında domain kontrolü yapmıyoruz
        if (process.env.NODE_ENV === 'development') return true

        const domain = email.split('@')[1]
        return ALLOWED_EMAIL_DOMAINS.includes(domain as (typeof ALLOWED_EMAIL_DOMAINS)[number])
      },
      { message: 'Bu e-posta domaini desteklenmiyor' },
    ),

  password: z
    .string({
      required_error: 'Şifre gereklidir',
    })
    .min(1, { message: 'Şifre gereklidir' })
    .min(6, { message: 'Şifre en az 6 karakter olmalıdır' }) // Development için kısaltıldı
    .max(128, { message: 'Şifre çok uzun' })
    .refine(
      (password) => {
        // Development ortamında basit şifrelere izin veriyoruz
        if (process.env.NODE_ENV === 'development') return true
        return STRONG_PASSWORD_REGEX.test(password)
      },
      {
        message: 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir',
      },
    ),

  rememberMe: z.boolean().optional().default(false),
})

// Register şeması - geliştirilmiş
export const registerSchema = z
  .object({
    name: z
      .string({
        required_error: 'Ad soyad gereklidir',
      })
      .min(1, { message: 'Ad soyad gereklidir' })
      .min(2, { message: 'Ad soyad en az 2 karakter olmalıdır' })
      .max(100, { message: 'Ad soyad çok uzun' })
      .regex(/^[a-zA-ZçğıöşüÇĞIİÖŞÜ\s]+$/, { message: 'Ad soyad sadece harf içerebilir' })
      .transform((name) => name.trim().replace(/\s+/g, ' ')),

    email: z
      .string({
        required_error: 'E-posta adresi gereklidir',
      })
      .min(1, { message: 'E-posta adresi gereklidir' })
      .email({ message: 'Geçerli bir e-posta adresi girin' })
      .max(254, { message: 'E-posta adresi çok uzun' })
      .transform((email) => email.toLowerCase().trim()),

    password: z
      .string({
        required_error: 'Şifre gereklidir',
      })
      .min(1, { message: 'Şifre gereklidir' })
      .min(8, { message: 'Şifre en az 8 karakter olmalıdır' })
      .max(128, { message: 'Şifre çok uzun' })
      .regex(/[A-Z]/, { message: 'Şifre en az bir büyük harf içermelidir' })
      .regex(/[a-z]/, { message: 'Şifre en az bir küçük harf içermelidir' })
      .regex(/[0-9]/, { message: 'Şifre en az bir rakam içermelidir' })
      .regex(/[@$!%*?&]/, { message: 'Şifre en az bir özel karakter içermelidir' }),

    confirmPassword: z
      .string({
        required_error: 'Şifre tekrarı gereklidir',
      })
      .min(1, { message: 'Şifre tekrarı gereklidir' }),

    terms: z.literal(true, {
      errorMap: () => ({ message: 'Kullanım şartlarını kabul etmelisiniz' }),
    }),

    newsletter: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    // Şifre eşleşme kontrolü
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
      })
    }
  })

// Forgot password şeması
export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: 'E-posta adresi gereklidir',
    })
    .min(1, { message: 'E-posta adresi gereklidir' })
    .email({ message: 'Geçerli bir e-posta adresi girin' })
    .transform((email) => email.toLowerCase().trim()),
})

// Reset password şeması - tamamlanmış versiyonu
export const resetPasswordSchema = z
  .object({
    token: z
      .string({
        required_error: 'Reset token gereklidir',
      })
      .min(1, { message: 'Reset token gereklidir' }),

    newPassword: z
      .string({
        required_error: 'Şifre gereklidir',
      })
      .min(1, { message: 'Şifre gereklidir' })
      .min(8, { message: 'Şifre en az 8 karakter olmalıdır' })
      .max(128, { message: 'Şifre çok uzun' })
      .regex(/[A-Za-z]/, { message: 'Şifre en az bir harf içermelidir' })
      .regex(/[0-9]/, { message: 'Şifre en az bir rakam içermelidir' }),

    confirmPassword: z
      .string({
        required_error: 'Şifre tekrarı gereklidir',
      })
      .min(1, { message: 'Şifre tekrarı gereklidir' }),
  })
  .superRefine((data, ctx) => {
    // Şifre eşleşme kontrolü
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Şifreler eşleşmiyor',
        path: ['confirmPassword'],
      })
    }
  })

// Type exports
export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

// Password strength checker utility
export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0

  if (password.length >= 8) score += 1
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[@$!%*?&]/.test(password)) score += 1
  if (password.length >= 12) score += 1

  if (score < 3) return PasswordStrength.WEAK
  if (score < 5) return PasswordStrength.MEDIUM
  return PasswordStrength.STRONG
}

// Login için özel validator helper
export const validateLoginData = (data: unknown): LoginFormValues => {
  const result = loginSchema.safeParse(data)

  if (!result.success) {
    console.error('Login validation failed:', result.error.errors)
    throw new Error('Form validation failed')
  }

  return result.data
}
