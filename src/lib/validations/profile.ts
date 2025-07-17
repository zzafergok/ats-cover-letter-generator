import { z } from 'zod'

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır').max(50, 'Ad soyad en fazla 50 karakter olabilir'),
  email: z.string().email('Geçerli bir email adresi giriniz').max(255, 'Email adresi en fazla 255 karakter olabilir'),
})

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mevcut şifre gereklidir'),
    newPassword: z
      .string()
      .min(8, 'Yeni şifre en az 8 karakter olmalıdır')
      .max(100, 'Yeni şifre en fazla 100 karakter olabilir')
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, 'Yeni şifre en az bir harf ve bir rakam içermelidir'),
    confirmPassword: z.string().min(1, 'Şifre tekrarı gereklidir'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Yeni şifre ve şifre tekrarı eşleşmiyor',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Yeni şifre mevcut şifreden farklı olmalıdır',
    path: ['newPassword'],
  })

export interface UpdateUserProfileRequest {
  name: string
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
