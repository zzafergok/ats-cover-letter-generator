'use client'

import React from 'react'
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Button } from '@/components/core/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { LANGUAGE_PROFICIENCY_LEVELS, SKILL_PROFICIENCY_LEVELS, SKILL_CATEGORIES } from '@/constants/proficiency-levels'
import { ATSFormData } from '@/types/form.types'

interface SkillsSectionProps {
  register: UseFormRegister<ATSFormData>
  errors: FieldErrors<ATSFormData>
  watch: UseFormWatch<ATSFormData>
  setValue: UseFormSetValue<ATSFormData>
  getValues: UseFormGetValues<ATSFormData>
}

export function SkillsSection({ register, errors, watch, setValue, getValues }: SkillsSectionProps) {
  const technicalSkills = watch('skills.technical') || []
  const softSkills = watch('skills.soft') || []
  const languages = watch('skills.languages') || []

  const addTechnicalSkillCategory = () => {
    const current = getValues('skills.technical')
    setValue('skills.technical', [
      ...current,
      {
        category: '',
        items: [{ name: '', proficiencyLevel: 'Intermediate' as const }],
      },
    ])
  }

  const addTechnicalSkillItem = (categoryIndex: number) => {
    const current = getValues('skills.technical')
    const updatedCategories = [...current]
    updatedCategories[categoryIndex].items.push({ name: '', proficiencyLevel: 'Intermediate' as const })
    setValue('skills.technical', updatedCategories)
  }

  const removeTechnicalSkillItem = (categoryIndex: number, itemIndex: number) => {
    const current = getValues('skills.technical')
    const updatedCategories = [...current]
    if (updatedCategories[categoryIndex].items.length > 1) {
      updatedCategories[categoryIndex].items = updatedCategories[categoryIndex].items.filter(
        (_: any, i: number) => i !== itemIndex,
      )
      setValue('skills.technical', updatedCategories)
    }
  }

  const removeTechnicalSkillCategory = (categoryIndex: number) => {
    const current = getValues('skills.technical')
    if (current.length > 1) {
      setValue(
        'skills.technical',
        current.filter((_: any, i: number) => i !== categoryIndex),
      )
    }
  }

  const addSoftSkill = () => {
    const current = getValues('skills.soft')
    setValue('skills.soft', [...current, ''])
  }

  const removeSoftSkill = (index: number) => {
    const current = getValues('skills.soft')
    if (current.length > 1) {
      setValue(
        'skills.soft',
        current.filter((_: any, i: number) => i !== index),
      )
    }
  }

  const addLanguage = () => {
    const current = getValues('skills.languages') || []
    setValue('skills.languages', [...current, { language: '', proficiency: 'Intermediate' }])
  }

  const removeLanguage = (index: number) => {
    const current = getValues('skills.languages') || []
    setValue(
      'skills.languages',
      current.filter((_: any, i: number) => i !== index),
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yetenekler</CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Technical Skills */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label className='text-base font-medium'>
              Teknik Yetenekler * <span className='text-xs text-muted-foreground'>(En az 1 kategori gerekli)</span>
            </Label>
            <Button type='button' variant='outline' size='sm' onClick={addTechnicalSkillCategory}>
              <Plus className='h-4 w-4 mr-2' />
              Kategori Ekle
            </Button>
          </div>
          <div className='space-y-4'>
            {technicalSkills.map((category: any, catIndex: number) => (
              <div key={catIndex} className='border rounded-lg p-4 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col gap-4 w-full'>
                    <Label>Kategori Adı</Label>
                    <Select
                      value={watch(`skills.technical.${catIndex}.category`) || ''}
                      onValueChange={(value) => setValue(`skills.technical.${catIndex}.category`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Kategori seçin' />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.label}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {technicalSkills.length > 1 && (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeTechnicalSkillCategory(catIndex)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between mb-4'>
                    <Label className='text-sm font-medium'>Yetenekler</Label>
                    <Button type='button' variant='outline' size='sm' onClick={() => addTechnicalSkillItem(catIndex)}>
                      <Plus className='h-4 w-4 mr-2' />
                      Yetenek Ekle
                    </Button>
                  </div>
                  {category.items?.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className='flex gap-2'>
                      <div className='flex w-full'>
                        <Input
                          placeholder='React, Python, MySQL...'
                          {...register(`skills.technical.${catIndex}.items.${itemIndex}.name`)}
                        />
                      </div>
                      <div className='w-full'>
                        <Select
                          value={
                            watch(`skills.technical.${catIndex}.items.${itemIndex}.proficiencyLevel`) || 'Intermediate'
                          }
                          onValueChange={(value) =>
                            setValue(
                              `skills.technical.${catIndex}.items.${itemIndex}.proficiencyLevel`,
                              value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Seviye seçin' />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILL_PROFICIENCY_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {(watch(`skills.technical.${catIndex}.items`)?.length || 0) > 1 && (
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => removeTechnicalSkillItem(catIndex, itemIndex)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {errors.skills?.technical && <p className='text-sm text-red-500'>{errors.skills.technical.message}</p>}
        </div>

        {/* Soft Skills */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label className='text-base font-medium'>
              Kişisel Yetenekler * <span className='text-xs text-muted-foreground'>(En az 1 adet gerekli)</span>
            </Label>
            <Button type='button' variant='outline' size='sm' onClick={addSoftSkill}>
              <Plus className='h-4 w-4 mr-2' />
              Ekle
            </Button>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {softSkills.map((_, index) => (
              <div key={index} className='flex gap-2'>
                <Input placeholder='Takım çalışması, Liderlik, İletişim' {...register(`skills.soft.${index}`)} />
                {softSkills.length > 1 && (
                  <Button type='button' variant='outline' size='sm' onClick={() => removeSoftSkill(index)}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {errors.skills?.soft && <p className='text-sm text-red-500'>{errors.skills.soft.message}</p>}
        </div>

        {/* Languages */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <Label className='text-base font-medium'>Diller</Label>
            <Button type='button' variant='outline' size='sm' onClick={addLanguage}>
              <Plus className='h-4 w-4 mr-2' />
              Dil Ekle
            </Button>
          </div>
          <div className='space-y-2'>
            {languages.map((_, index) => (
              <div key={index} className='flex gap-2'>
                <Input
                  className='flex w-full'
                  placeholder='İngilizce, Almanca vs.'
                  {...register(`skills.languages.${index}.language`)}
                />
                <div className='w-full'>
                  <Select
                    value={watch(`skills.languages.${index}.proficiency`) || ''}
                    onValueChange={(value) =>
                      setValue(
                        `skills.languages.${index}.proficiency`,
                        value as 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic',
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Seviye seçin' />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {languages.length > 0 && (
                  <Button type='button' variant='outline' size='sm' onClick={() => removeLanguage(index)}>
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
