'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Code,
  Award,
  Languages,
  Globe,
  Github,
  Linkedin,
  Users,
  Edit2,
} from 'lucide-react'

import { Button } from '@/components/core/button'

interface CVTemplateFormData {
  personalInfo: {
    firstName: string
    lastName: string
    jobTitle?: string
    linkedin?: string
    address?: string
    city?: string
    phone?: string
    email: string
    website?: string
    github?: string
    medium?: string
  }
  objective?: string
  experience?: Array<{
    jobTitle: string
    company: string
    location?: string
    startDate: string
    endDate?: string
    description?: string
    isCurrent?: boolean
  }>
  education?: Array<{
    degree: string
    university: string
    field: string
    location?: string
    startDate: string
    graduationDate: string
    details?: string
  }>
  technicalSkills?: {
    frontend?: string[]
    backend?: string[]
    database?: string[]
    tools?: string[]
  }
  projects?: Array<{
    name: string
    description?: string
    technologies?: string[]
  }>
  certificates?: Array<{
    name: string
    issuer?: string
    date?: string
  }>
  languages?: Array<{
    language: string
    level: string
  }>
  skills?: string[]
  communication?: string
  leadership?: string
  templateType?: string
  version?: string
  [key: string]: any
}

interface PreviewStepProps {
  form: UseFormReturn<CVTemplateFormData>
  onGoToStep?: (stepIndex: number) => void
}

export function PreviewStep({ form, onGoToStep }: PreviewStepProps) {
  const data = form.getValues()
  const isGlobalVersion = data.version === 'global'
  const isTurkeyVersion = data.version === 'turkey'

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
  }

  // Step mapping - hangi bölümün hangi step'e karşılık geldiği
  const getStepIndex = (stepId: string) => {
    const stepMappings = {
      personal: 1, // Kişisel Bilgiler
      objective: 2, // Kariyer Hedefi
      experience: 3, // İş Deneyimi
      education: 4, // Eğitim
      skills: isTurkeyVersion ? 5 : 5, // Yetenekler/Teknik Yetenekler
      projects: 6, // Projeler (sadece Turkey)
      certificates: 7, // Sertifikalar (sadece Turkey)
      languages: 8, // Diller (sadece Turkey)
      soft_skills: isGlobalVersion ? 6 : -1, // İletişim & Liderlik (sadece Global)
    }
    return stepMappings[stepId as keyof typeof stepMappings] || 0
  }

  const handleEditClick = (stepId: string) => {
    const stepIndex = getStepIndex(stepId)
    if (stepIndex !== -1 && onGoToStep) {
      onGoToStep(stepIndex)
    }
  }

  const renderPersonalInfo = () => (
    <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border relative'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center'>
            <User className='h-5 w-5 text-blue-600 dark:text-blue-400' />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Kişisel Bilgiler</h3>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleEditClick('personal')}
          className='flex items-center gap-2'
        >
          <Edit2 className='h-4 w-4' />
          Düzenle
        </Button>
      </div>

      <div className='space-y-3'>
        <div className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
          {data.personalInfo?.firstName} {data.personalInfo?.lastName}
        </div>
        {data.personalInfo?.jobTitle && (
          <div className='text-lg text-gray-600 dark:text-gray-400'>{data.personalInfo.jobTitle}</div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-4'>
          {data.personalInfo?.email && (
            <div className='flex items-center gap-2'>
              <Mail className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-700 dark:text-gray-300'>{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo?.phone && (
            <div className='flex items-center gap-2'>
              <Phone className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-700 dark:text-gray-300'>{data.personalInfo.phone}</span>
            </div>
          )}
          {data.personalInfo?.city && (
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-700 dark:text-gray-300'>{data.personalInfo.city}</span>
            </div>
          )}
          {data.personalInfo?.linkedin && (
            <div className='flex items-center gap-2'>
              <Linkedin className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-700 dark:text-gray-300'>{data.personalInfo.linkedin}</span>
            </div>
          )}
          {data.personalInfo?.website && (
            <div className='flex items-center gap-2'>
              <Globe className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-700 dark:text-gray-300'>{data.personalInfo.website}</span>
            </div>
          )}
          {data.personalInfo?.github && (
            <div className='flex items-center gap-2'>
              <Github className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-700 dark:text-gray-300'>{data.personalInfo.github}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderExperience = () => {
    if (!data.experience?.length) return null

    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center'>
              <Building className='h-5 w-5 text-green-600 dark:text-green-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>İş Deneyimi</h3>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEditClick('experience')}
            className='flex items-center gap-2'
          >
            <Edit2 className='h-4 w-4' />
            Düzenle
          </Button>
        </div>

        <div className='space-y-4'>
          {data.experience?.map((exp, index) => (
            <div key={index} className='border-l-2 border-green-200 dark:border-green-700 pl-4'>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h4 className='font-semibold text-gray-900 dark:text-gray-100'>{exp.jobTitle}</h4>
                  <p className='text-gray-600 dark:text-gray-400'>{exp.company}</p>
                </div>
                <div className='text-sm text-gray-500 flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(exp.startDate)} - {exp.isCurrent ? 'Devam ediyor' : formatDate(exp.endDate || '')}
                </div>
              </div>
              {exp.description && <p className='text-sm text-gray-700 dark:text-gray-300 mt-2'>{exp.description}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderEducation = () => {
    if (!data.education?.length) return null

    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center'>
              <GraduationCap className='h-5 w-5 text-purple-600 dark:text-purple-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Eğitim</h3>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEditClick('education')}
            className='flex items-center gap-2'
          >
            <Edit2 className='h-4 w-4' />
            Düzenle
          </Button>
        </div>

        <div className='space-y-4'>
          {data.education?.map((edu, index) => (
            <div key={index} className='border-l-2 border-purple-200 dark:border-purple-700 pl-4'>
              <div className='flex justify-between items-start mb-2'>
                <div>
                  <h4 className='font-semibold text-gray-900 dark:text-gray-100'>{edu.degree}</h4>
                  <p className='text-gray-600 dark:text-gray-400'>{edu.university}</p>
                  {edu.field && <p className='text-sm text-gray-500'>{edu.field}</p>}
                </div>
                <div className='text-sm text-gray-500 flex items-center gap-1'>
                  <Calendar className='h-4 w-4' />
                  {formatDate(edu.startDate)} - {formatDate(edu.graduationDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderSkills = () => {
    // Turkey version - Technical Skills
    if (isTurkeyVersion && data.technicalSkills) {
      return (
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center'>
                <Code className='h-5 w-5 text-orange-600 dark:text-orange-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Teknik Yetenekler</h3>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEditClick('skills')}
              className='flex items-center gap-2'
            >
              <Edit2 className='h-4 w-4' />
              Düzenle
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {Object.entries(data.technicalSkills).map(([category, skills]) => {
              const skillArray = skills as string[]
              if (!skillArray?.length || skillArray.every((skill) => !skill.trim())) return null

              return (
                <div key={category}>
                  <h5 className='font-medium text-gray-900 dark:text-gray-100 capitalize mb-2'>
                    {category === 'frontend'
                      ? 'Frontend'
                      : category === 'backend'
                        ? 'Backend'
                        : category === 'database'
                          ? 'Database'
                          : 'Araçlar'}
                  </h5>
                  <div className='flex flex-wrap gap-2'>
                    {skillArray
                      .filter((skill) => skill.trim())
                      .map((skill, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full'
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    // Global version - Simple Skills
    if (isGlobalVersion && data.skills?.length) {
      return (
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center'>
                <Code className='h-5 w-5 text-orange-600 dark:text-orange-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Yetenekler</h3>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEditClick('skills')}
              className='flex items-center gap-2'
            >
              <Edit2 className='h-4 w-4' />
              Düzenle
            </Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            {data.skills
              .filter((skill) => skill.trim())
              .map((skill, index) => (
                <span
                  key={index}
                  className='px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full'
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>
      )
    }

    return null
  }

  const renderProjects = () => {
    // Only show projects for Turkey version
    if (!isTurkeyVersion || !data.projects?.length) return null

    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center'>
              <Code className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Projeler</h3>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEditClick('projects')}
            className='flex items-center gap-2'
          >
            <Edit2 className='h-4 w-4' />
            Düzenle
          </Button>
        </div>

        <div className='space-y-4'>
          {data.projects?.map((project, index) => (
            <div key={index} className='border-l-2 border-blue-200 dark:border-blue-700 pl-4'>
              <h4 className='font-semibold text-gray-900 dark:text-gray-100'>{project.name}</h4>
              {project.description && (
                <p className='text-sm text-gray-700 dark:text-gray-300 mt-1'>{project.description}</p>
              )}
              {project.technologies?.length && (
                <div className='flex flex-wrap gap-2 mt-2'>
                  {project.technologies
                    .filter((tech) => tech.trim())
                    .map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className='px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded'
                      >
                        {tech}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCertificates = () => {
    // Only show certificates for Turkey version
    if (!isTurkeyVersion || !data.certificates?.length) return null

    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center'>
              <Award className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Sertifikalar</h3>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEditClick('certificates')}
            className='flex items-center gap-2'
          >
            <Edit2 className='h-4 w-4' />
            Düzenle
          </Button>
        </div>

        <div className='space-y-3'>
          {data.certificates?.map((cert, index) => (
            <div key={index} className='border-l-2 border-yellow-200 dark:border-yellow-700 pl-4'>
              <h4 className='font-semibold text-gray-900 dark:text-gray-100'>{cert.name}</h4>
              <div className='flex justify-between items-center'>
                {cert.issuer && <p className='text-sm text-gray-600 dark:text-gray-400'>{cert.issuer}</p>}
                {cert.date && <p className='text-sm text-gray-500'>{cert.date}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderLanguages = () => {
    // Only show languages for Turkey version
    if (!isTurkeyVersion || !data.languages?.length) return null

    return (
      <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center'>
              <Languages className='h-5 w-5 text-indigo-600 dark:text-indigo-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Diller</h3>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleEditClick('languages')}
            className='flex items-center gap-2'
          >
            <Edit2 className='h-4 w-4' />
            Düzenle
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {data.languages?.map((lang, index) => (
            <div key={index} className='flex justify-between items-center'>
              <span className='text-gray-900 dark:text-gray-100'>{lang.language}</span>
              <span className='px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm rounded-full'>
                {lang.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='text-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
          CV Önizleme - {isTurkeyVersion ? 'Turkey Version' : 'Global Version'}
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          {isTurkeyVersion
            ? 'Detaylı CV formatınızın son hali aşağıda görüntülenmektedir. Herhangi bir değişiklik yapmak için önceki adımlara dönebilirsiniz.'
            : 'Basit CV formatınızın son hali aşağıda görüntülenmektedir. Herhangi bir değişiklik yapmak için önceki adımlara dönebilirsiniz.'}
        </p>
      </div>

      {renderPersonalInfo()}

      {data.objective && (
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Kariyer Hedefi</h3>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEditClick('objective')}
              className='flex items-center gap-2'
            >
              <Edit2 className='h-4 w-4' />
              Düzenle
            </Button>
          </div>
          <p className='text-gray-700 dark:text-gray-300'>{data.objective}</p>
        </div>
      )}

      {renderExperience()}
      {renderEducation()}
      {renderSkills()}
      {renderProjects()}
      {renderCertificates()}
      {renderLanguages()}

      {/* Global version - Communication & Leadership */}
      {isGlobalVersion && (data.communication || data.leadership) && (
        <div className='bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center'>
                <Users className='h-5 w-5 text-teal-600 dark:text-teal-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>İletişim ve Liderlik</h3>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleEditClick('soft_skills')}
              className='flex items-center gap-2'
            >
              <Edit2 className='h-4 w-4' />
              Düzenle
            </Button>
          </div>
          <div className='space-y-3'>
            {data.communication && (
              <div>
                <h4 className='font-medium text-gray-900 dark:text-gray-100 mb-1'>İletişim</h4>
                <p className='text-sm text-gray-700 dark:text-gray-300'>{data.communication}</p>
              </div>
            )}
            {data.leadership && (
              <div>
                <h4 className='font-medium text-gray-900 dark:text-gray-100 mb-1'>Liderlik</h4>
                <p className='text-sm text-gray-700 dark:text-gray-300'>{data.leadership}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800'>
        <div className='flex items-start gap-3'>
          <div className='flex-shrink-0'>
            <div className='w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center'>
              <User className='h-4 w-4 text-blue-600 dark:text-blue-400' />
            </div>
          </div>
          <div className='space-y-1'>
            <h4 className='font-medium text-sm text-blue-800 dark:text-blue-200'>
              {isTurkeyVersion ? 'Detaylı CV Hazır!' : 'CV Hazır!'}
            </h4>
            <p className='text-xs text-blue-700 dark:text-blue-300'>
              {isTurkeyVersion
                ? 'Türkiye versiyonu CV\'niz tüm detaylarıyla oluşturulmaya hazır. "CV Oluştur" butonuna tıklayarak PDF formatında indirebilirsiniz.'
                : 'Global versiyonu CV\'niz oluşturulmaya hazır. "CV Oluştur" butonuna tıklayarak PDF formatında indirebilirsiniz.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
