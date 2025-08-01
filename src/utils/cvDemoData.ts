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

  // Common personal info based on template type
  if (selectedTemplate === 'office_manager') {
    setValue('personalInfo.firstName', 'Ahmet')
    setValue('personalInfo.lastName', 'Yılmaz')
    setValue('personalInfo.jobTitle', 'Office Manager')
    setValue('personalInfo.email', 'ahmet.yilmaz@email.com')
    setValue('personalInfo.phone', '+90 555 123 4567')
    setValue('personalInfo.linkedin', 'linkedin.com/in/ahmetyilmaz')
  } else {
    setValue('personalInfo.email', 'ahmet.yilmaz@email.com')
    setValue('personalInfo.phone', '+90 555 123 4567')
    setValue('personalInfo.address', 'Beşiktaş Mah. Teknoloji Cad. No:42/8')
    setValue('personalInfo.city', 'İstanbul')
  }

  // Experience and education
  if (selectedTemplate === 'office_manager') {
    setValue('experience', [
      {
        jobTitle: 'Senior Office Manager',
        company: 'Tech Solutions Inc.',
        location: 'İstanbul',
        startDate: '2022-01',
        endDate: '',
        description:
          'Ofis operasyonlarını yönetme ve takım koordinasyonu. Bütçe planlama ve satın alma süreçlerinin yönetimi.',
        isCurrent: true,
      },
    ])

    setValue('education', [
      {
        degree: 'Bachelor in Business Administration',
        university: 'İstanbul Üniversitesi',
        location: 'İstanbul',
        graduationDate: '2020-06',
        details: 'GPA: 3.5/4.0 - Management and Organization focus',
        isCurrent: false,
      },
    ])
  } else {
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
    ])

    setValue('education', [
      {
        degree: 'Computer Engineering',
        university: 'İstanbul Teknik Üniversitesi',
        location: 'İstanbul',
        graduationDate: '2020-06',
        details: 'GPA: 3.7/4.0 - Software Engineering focus',
        isCurrent: false,
      },
    ])
  }

  // Version-specific demo data
  if (selectedVersion === 'turkey') {
    setValue('technicalSkills', {
      frontend: ['React', 'Vue.js', 'TypeScript'],
      backend: ['Node.js', 'Python', 'Express.js'],
      database: ['MongoDB', 'PostgreSQL', 'MySQL'],
      tools: ['AWS', 'Docker', 'Git'],
    })

    setValue('projects', [
      {
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration',
        technologies: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      },
    ])

    setValue('certificates', [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2023',
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
    ])

    setValue('references', [
      {
        name: 'Mehmet Demir',
        company: 'Tech Solutions Inc.',
        contact: 'mehmet.demir@techsolutions.com | +90 555 987 6543',
      },
    ])
  } else {
    // Global version: simplified fields - all templates have skills array
    if (selectedTemplate === 'office_manager') {
      setValue('skills', [
        'Project Management',
        'Team Leadership',
        'Microsoft Office',
        'Budget Planning',
        'Customer Relations',
        'Office Administration',
      ])
    } else {
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
    }
    
    setValue(
      'communication',
      'Excellent written and verbal communication skills in Turkish and English. Experience in client presentations and technical documentation.',
    )
    setValue(
      'leadership',
      'Led cross-functional teams of 5+ developers. Mentored junior developers and implemented agile development processes.',
    )
  }

  // Objective - only for non-office_manager templates
  if (selectedTemplate !== 'office_manager') {
    setValue(
      'objective',
      '5+ yıl deneyimli Full Stack Developer. Modern web teknolojileri ile kullanıcı odaklı çözümler geliştirme konusunda uzman.',
    )
  }
}
