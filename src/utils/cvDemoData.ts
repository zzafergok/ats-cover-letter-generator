import { UseFormSetValue } from 'react-hook-form'
import { CVTemplateFormData } from '@/schemas/cvTemplate.schema'

type TemplateType = 'basic_hr' | 'office_manager' | 'simple_classic' | 'stylish_accounting' | 'minimalist_turkish'
type VersionType = 'global' | 'turkey'

export const fillDemoData = (
  setValue: UseFormSetValue<CVTemplateFormData>,
  selectedTemplate: TemplateType,
  selectedVersion: VersionType,
) => {
  console.log('🎯 Filling demo data, overriding any profile auto-fill')

  // Common personal info - same for all templates (based on simple_classic)
  setValue('personalInfo.firstName', 'Mehmet')
  setValue('personalInfo.lastName', 'Yıldırım')
  setValue('personalInfo.jobTitle', 'Senior Software Developer')
  setValue('personalInfo.email', 'mehmet.yildirim@email.com')
  setValue('personalInfo.phone', '+90 555 123 4567')
  setValue('personalInfo.address', 'Beşiktaş Mah. Teknoloji Cad. No:42/8')
  setValue('personalInfo.city', 'İstanbul')
  setValue('personalInfo.linkedin', 'linkedin.com/in/mehmetyildirim')
  setValue('personalInfo.website', 'mehmetyildirim.dev')
  setValue('personalInfo.github', 'github.com/mehmetyildirim')
  setValue('personalInfo.medium', 'medium.com/@mehmetyildirim')

  // Experience - same for all templates (2 entries)
  setValue('experience', [
    {
      jobTitle: 'Senior Full Stack Developer',
      company: 'Tech Solutions Inc.',
      location: 'İstanbul',
      startDate: '2022-01',
      endDate: '',
      description:
        'React, Node.js ve AWS ile modern web uygulamaları geliştirme. Mikroservis mimarisi tasarımı ve implementasyonu.',
      isCurrent: true,
    },
    {
      jobTitle: 'Full Stack Developer',
      company: 'Digital Agency Co.',
      location: 'İstanbul',
      startDate: '2020-06',
      endDate: '2021-12',
      description:
        'E-commerce ve kurumsal web uygulamaları geliştirme. RESTful API tasarımı ve frontend optimizasyonu.',
      isCurrent: false,
    },
  ])

  // Education - same for all templates (2 entries)
  setValue('education', [
    {
      degree: 'Lisans',
      university: 'İstanbul Teknik Üniversitesi',
      field: 'Bilgisayar Mühendisliği',
      location: 'İstanbul',
      startDate: '2016-09',
      graduationDate: '2020-06',
      details: 'GPA: 3.7/4.0 - Software Engineering focus',
    },
    {
      degree: 'Lise',
      university: 'İstanbul Anadolu Lisesi',
      field: 'Fen Bilimleri',
      location: 'İstanbul',
      startDate: '2012-09',
      graduationDate: '2016-06',
      details: 'Matematik ve Fen Bilimleri ağırlıklı eğitim',
    },
  ])

  // Objective - same for all templates
  setValue(
    'objective',
    '5+ yıl deneyimli Full Stack Developer. Modern web teknolojileri ile kullanıcı odaklı çözümler geliştirme konusunda uzman.',
  )

  // Version-specific demo data - same parameters for all templates
  if (selectedVersion === 'turkey') {
    // Turkey version: detailed fields
    setValue('technicalSkills', {
      frontend: ['React', 'Vue.js', 'TypeScript', 'JavaScript'],
      backend: ['Node.js', 'Python', 'Express.js', 'Django'],
      database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
      tools: ['AWS', 'Docker', 'Git', 'Jenkins'],
    })

    setValue('projects', [
      {
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration',
        technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      },
      {
        name: 'Task Management System',
        description: 'Real-time collaboration tool for project management',
        technologies: ['Vue.js', 'Express.js', 'Socket.io', 'PostgreSQL'],
      },
    ])

    setValue('certificates', [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
      },
      {
        name: 'React Developer Certificate',
        issuer: 'Meta',
        date: '2022',
      },
    ])

    setValue('languages', [
      {
        language: 'Turkish',
        level: 'Native',
      },
      {
        language: 'English',
        level: 'Advanced',
      },
      {
        language: 'German',
        level: 'Intermediate',
      },
    ])

    setValue('references', [
      {
        name: 'Ahmet Demir',
        company: 'Tech Solutions Inc.',
        contact: 'ahmet.demir@techsolutions.com | +90 555 987 6543',
      },
      {
        name: 'Fatma Kaya',
        company: 'Digital Agency Co.',
        contact: 'fatma.kaya@digitalagency.com | +90 555 456 7890',
      },
    ])
  } else {
    // Global version: simplified fields - same for all templates
    setValue('skills', [
      'JavaScript',
      'React',
      'Node.js',
      'TypeScript',
      'AWS',
      'Docker',
      'MongoDB',
      'PostgreSQL',
    ])
    
    setValue(
      'communication',
      'Excellent written and verbal communication skills in Turkish and English. Experience in client presentations and technical documentation.',
    )
    setValue(
      'leadership',
      'Led cross-functional teams of 5+ developers. Mentored junior developers and implemented agile development processes.',
    )

    // References for Global version too
    setValue('references', [
      {
        name: 'Ahmet Demir',
        company: 'Tech Solutions Inc.',
        contact: 'ahmet.demir@techsolutions.com | +90 555 987 6543',
      },
      {
        name: 'Fatma Kaya',
        company: 'Digital Agency Co.',
        contact: 'fatma.kaya@digitalagency.com | +90 555 456 7890',
      },
    ])
  }
}
