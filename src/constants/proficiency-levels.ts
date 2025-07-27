export const LANGUAGE_PROFICIENCY_LEVELS = [
  { value: 'Native' as const, label: 'Ana Dil (Native)' },
  { value: 'Fluent' as const, label: 'Akıcı (Fluent)' },
  { value: 'Advanced' as const, label: 'İleri (Advanced)' },
  { value: 'Intermediate' as const, label: 'Orta (Intermediate)' },
  { value: 'Basic' as const, label: 'Temel (Basic)' },
] as const

export const SKILL_PROFICIENCY_LEVELS = [
  { value: 'Beginner' as const, label: 'Başlangıç (Beginner)' },
  { value: 'Intermediate' as const, label: 'Orta (Intermediate)' },
  { value: 'Advanced' as const, label: 'İleri (Advanced)' },
  { value: 'Expert' as const, label: 'Uzman (Expert)' },
] as const

export const SKILL_CATEGORIES = [
  { value: 'TECHNICAL' as const, label: 'Teknik Yetenek' },
  { value: 'SOFT_SKILL' as const, label: 'Kişisel Yetenek' },
  { value: 'LANGUAGE' as const, label: 'Dil' },
  { value: 'TOOL' as const, label: 'Araç' },
  { value: 'FRAMEWORK' as const, label: 'Framework' },
  { value: 'OTHER' as const, label: 'Diğer' },
] as const
