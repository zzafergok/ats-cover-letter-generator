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
    description: "CV template'inizi ve ayarlarını seçin. Her template farklı sektörler için optimize edilmiştir",
    icon: Settings,
  },
  {
    id: 'personal',
    title: 'Kişisel Bilgiler',
    description: 'İletişim bilgilerinizi girin. Bu bilgiler otomatik olarak profilinizden doldurulmuştur',
    icon: User,
  },
  {
    id: 'objective',
    title: 'Kariyer Hedefi',
    description: 'Kariyer hedefinizi ve profesyonel özetinizi yazın. Bu bölüm isteğe bağlıdır',
    icon: FileText,
  },
  {
    id: 'experience',
    title: 'İş Deneyimi',
    description: 'Çalışma geçmişinizi ekleyin. En güncel pozisyonunuzdan başlayarak sıralayın',
    icon: Briefcase,
  },
  {
    id: 'education',
    title: 'Eğitim',
    description: 'Eğitim bilgilerinizi girin. En güncel eğitiminizden başlayarak sıralayın',
    icon: GraduationCap,
  },
]

// Dynamic steps based on template and version
export const TURKEY_STEPS: StepItem[] = [
  {
    id: 'skills',
    title: 'Teknik Yetenekler',
    description:
      "Teknik becerilerinizi kategoriler halinde listeleyin. Turkey template'leri için detaylı yetenek bölümü",
    icon: Code,
  },
  {
    id: 'projects',
    title: 'Projeler',
    description: 'Önemli projelerinizi ekleyin. Bu bölüm işverenler için değerli bilgiler içerir',
    icon: FolderOpen,
  },
  {
    id: 'certificates',
    title: 'Sertifikalar',
    description: 'Sahip olduğunuz sertifikaları listeleyin. Bu bölüm teknik yetkinliğinizi kanıtlar',
    icon: Award,
  },
  {
    id: 'languages',
    title: 'Diller',
    description: 'Yabancı dil bilginizi ekleyin. Çok uluslu şirketler için önemli bir avantajdır',
    icon: Languages,
  },
  {
    id: 'references',
    title: 'Referanslar',
    description: 'İş referanslarınızı ekleyin. Bu bölüm isteğe bağlıdır ancak güvenilirliğinizi artırır',
    icon: Users,
  },
]

export const GLOBAL_STEPS: StepItem[] = [
  {
    id: 'simple_skills',
    title: 'Yetenekler',
    description: "Beceri ve yeteneklerinizi listeleyin. Bu bölüm global template'ler için kullanılır",
    icon: Code,
  },
  {
    id: 'soft_skills',
    title: 'İletişim & Liderlik',
    description: "Soft skill becerilerinizi açıklayın. Bu bölüm global template'ler için kullanılır",
    icon: Users,
  },
  {
    id: 'references',
    title: 'Referanslar',
    description: 'İş referanslarınızı ekleyin. Bu bölüm isteğe bağlıdır ancak güvenilirliğinizi artırır',
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
