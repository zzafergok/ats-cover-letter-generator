import React from 'react'
import {
  FileText,
  Settings,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Languages,
  Users,
} from 'lucide-react'

// Step type definition
export type StepItem = {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

// Base step definitions
export const BASE_STEPS: StepItem[] = [
  {
    id: 'template',
    title: 'Template Seçimi',
    description: 'CV template ve ayarlarını seçin',
    icon: Settings,
  },
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    description: 'İletişim bilgilerinizi girin',
    icon: User,
  },
  {
    id: 'objective',
    title: 'Kariyer Hedefi',
    description: 'Profesyonel özetinizi yazın',
    icon: FileText,
  },
  {
    id: 'experience',
    title: 'İş Deneyimi',
    description: 'Çalışma geçmişinizi ekleyin',
    icon: Briefcase,
  },
  {
    id: 'education',
    title: 'Eğitim',
    description: 'Eğitim bilgilerinizi girin',
    icon: GraduationCap,
  },
]

// Dynamic steps based on template and version
export const TURKEY_STEPS: StepItem[] = [
  {
    id: 'skills',
    title: 'Teknik Yetenekler',
    description: 'Teknik becerilerinizi listeleyin',
    icon: Code,
  },
  {
    id: 'projects',
    title: 'Projeler',
    description: 'Önemli projelerinizi ekleyin',
    icon: FolderOpen,
  },
  {
    id: 'certificates',
    title: 'Sertifikalar',
    description: 'Sertifikalarınızı listeleyin',
    icon: Award,
  },
  {
    id: 'languages',
    title: 'Diller',
    description: 'Yabancı dil bilginizi ekleyin',
    icon: Languages,
  },
  {
    id: 'references',
    title: 'Referanslar',
    description: 'İş referanslarınızı ekleyin',
    icon: Users,
  },
]

export const GLOBAL_STEPS: StepItem[] = [
  {
    id: 'soft_skills',
    title: 'İletişim & Liderlik',
    description: 'Soft skills becerilerinizi yazın',
    icon: Users,
  },
]

export const OFFICE_MANAGER_STEPS: StepItem[] = [
  {
    id: 'simple_skills',
    title: 'Yetenekler',
    description: 'Beceri ve yeteneklerinizi listeleyin',
    icon: Code,
  },
]