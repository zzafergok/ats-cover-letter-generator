export const skillLevels = [
  { value: 'BEGINNER', label: 'Başlangıç', color: 'bg-slate-100 text-slate-800' },
  { value: 'INTERMEDIATE', label: 'Orta', color: 'bg-blue-100 text-blue-800' },
  { value: 'ADVANCED', label: 'İleri', color: 'bg-orange-100 text-orange-800' },
  { value: 'EXPERT', label: 'Uzman', color: 'bg-green-100 text-green-800' },
] as const

export const employmentTypeLabels = {
  FULL_TIME: 'Tam Zamanlı',
  PART_TIME: 'Yarı Zamanlı',
  CONTRACT: 'Sözleşmeli',
  FREELANCE: 'Serbest Çalışan',
  INTERNSHIP: 'Staj',
  TEMPORARY: 'Geçici',
} as const

export const workModeLabels = {
  ONSITE: 'Ofiste',
  REMOTE: 'Uzaktan',
  HYBRID: 'Hibrit',
} as const

export const avatarColors = [
  { name: 'Mavi', color: '#3B82F6', textColor: '#ffffff' },
  { name: 'Yeşil', color: '#10B981', textColor: '#ffffff' },
  { name: 'Mor', color: '#8B5CF6', textColor: '#ffffff' },
  { name: 'Kırmızı', color: '#EF4444', textColor: '#ffffff' },
  { name: 'Turuncu', color: '#F97316', textColor: '#ffffff' },
  { name: 'Pembe', color: '#EC4899', textColor: '#ffffff' },
  { name: 'İndigo', color: '#6366F1', textColor: '#ffffff' },
  { name: 'Gri', color: '#6B7280', textColor: '#ffffff' },
  { name: 'Cyan', color: '#06B6D4', textColor: '#ffffff' },
  { name: 'Sarı', color: '#EAB308', textColor: '#000000' },
] as const
