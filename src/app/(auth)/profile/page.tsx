/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, GraduationCap, Briefcase, Award, BookOpen, Star, X, ArrowLeft } from 'lucide-react'

import { useUserProfileStore } from '@/store/userProfileStore'

import { Button } from '@/components/core/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { EducationModal } from '@/components/ui/profile/EducationModal'
import { WorkExperienceModal } from '@/components/ui/profile/WorkExperienceModal'
import { SkillModal } from '@/components/ui/profile/SkillModal'
import { ProfileHeader } from '@/components/ui/profile/ProfileHeader'
import { OverviewTab } from '@/components/ui/profile/OverviewTab'
import { EducationTab } from '@/components/ui/profile/EducationTab'
import { ExperienceTab } from '@/components/ui/profile/ExperienceTab'
import { SkillsTab } from '@/components/ui/profile/SkillsTab'
import { CoursesTab } from '@/components/ui/profile/CoursesTab'
import { CertificatesTab } from '@/components/ui/profile/CertificatesTab'
import { ConfirmDeleteModal } from '@/components/ui/profile/ConfirmDeleteModal'
import { CourseModal } from '@/components/ui/profile/CourseModal'

import type { Education, WorkExperience, Skill, Course } from '@/types/api.types'

export default function ProfilePage() {
  const router = useRouter()

  const {
    profile,
    isLoading,
    error,
    getProfile,
    updateProfile,
    clearError,
    addEducation,
    addWorkExperience,
    addSkill,
    updateEducation,
    updateWorkExperience,
    updateSkill,
    deleteEducation,
    deleteWorkExperience,
    deleteSkill,
    addCourse,
    updateCourse,
    deleteCourse,
  } = useUserProfileStore()

  const [activeTab, setActiveTab] = useState('overview')
  const [editingItem, setEditingItem] = useState<{ type: string; id: string; data: unknown } | null>(null)
  const [modalStates, setModalStates] = useState({
    education: false,
    experience: false,
    skill: false,
    course: false,
  })

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean
    type: 'skill' | 'education' | 'experience' | 'course' | null
    id: string
    name: string
  }>({
    isOpen: false,
    type: null,
    id: '',
    name: '',
  })

  useEffect(() => {
    getProfile()
  }, [getProfile])

  // Modal açma/kapama handler'ları
  const openModal = (type: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [type]: true }))
    setEditingItem(null)
  }

  const closeModal = (type: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [type]: false }))
    setEditingItem(null)
  }

  const openEditModal = (type: keyof typeof modalStates, id: string, data: unknown) => {
    setEditingItem({ type, id, data })
    setModalStates((prev) => ({ ...prev, [type]: true }))
  }

  // Eğitim işlemleri
  const handleSaveEducation = async (data: Omit<Education, 'id'>) => {
    try {
      if (editingItem && editingItem.type === 'education') {
        await updateEducation(editingItem.id, data)
      } else {
        await addEducation(data)
      }
      closeModal('education')
    } catch (error) {
      console.error('Eğitim kaydedilirken hata:', error)
      throw error
    }
  }

  // İş deneyimi işlemleri
  const handleSaveWorkExperience = async (data: Omit<WorkExperience, 'id'>) => {
    try {
      if (editingItem && editingItem.type === 'experience') {
        await updateWorkExperience(editingItem.id, data)
      } else {
        await addWorkExperience(data)
      }
      closeModal('experience')
    } catch (error) {
      console.error('Deneyim kaydedilirken hata:', error)
      throw error
    }
  }

  // Yetenek işlemleri
  const handleSaveSkill = async (data: Omit<Skill, 'id'>) => {
    try {
      if (editingItem && editingItem.type === 'skill') {
        await updateSkill(editingItem.id, data)
      } else {
        await addSkill(data)
      }
      closeModal('skill')
    } catch (error) {
      console.error('Yetenek kaydedilirken hata:', error)
      throw error
    }
  }

  // Kurs işlemleri
  const handleSaveCourse = async (data: Omit<Course, 'id'>) => {
    try {
      if (editingItem && editingItem.type === 'course') {
        await updateCourse(editingItem.id, data)
      } else {
        await addCourse(data)
      }
      closeModal('course')
    } catch (error) {
      console.error('Kurs kaydedilirken hata:', error)
      throw error
    }
  }

  const openDeleteConfirmModal = (type: 'skill' | 'education' | 'experience' | 'course', id: string, name: string) => {
    setDeleteConfirmModal({
      isOpen: true,
      type,
      id,
      name,
    })
  }

  const closeDeleteConfirmModal = () => {
    setDeleteConfirmModal({
      isOpen: false,
      type: null,
      id: '',
      name: '',
    })
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmModal.type || !deleteConfirmModal.id) return

    try {
      switch (deleteConfirmModal.type) {
        case 'skill':
          await deleteSkill(deleteConfirmModal.id)
          break
        case 'education':
          await deleteEducation(deleteConfirmModal.id)
          break
        case 'experience':
          await deleteWorkExperience(deleteConfirmModal.id)
          break
        case 'course':
          await deleteCourse(deleteConfirmModal.id)
          break
      }
      closeDeleteConfirmModal()
    } catch (error) {
      console.error('Silme işlemi sırasında hata:', error)
    }
  }

  if (isLoading && !profile) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <LoadingSpinner size='lg' className='mx-auto mb-4' />
          <p className='text-muted-foreground'>Profil yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push('/dashboard')}
              className='flex items-center space-x-2'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>Dashboard'a Dön</span>
            </Button>
          </div>

          {error && (
            <div className='bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2'>
              <p className='text-sm text-destructive'>{error}</p>
              <Button variant='ghost' size='sm' onClick={clearError}>
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>

        <ProfileHeader profile={profile} isLoading={isLoading} onUpdateProfile={updateProfile} />

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
          <TabsList className='grid w-full grid-cols-6 lg:w-fit'>
            <TabsTrigger value='overview' className='flex items-center space-x-2'>
              <User className='h-4 w-4' />
              <span className='hidden sm:inline'>Genel</span>
            </TabsTrigger>
            <TabsTrigger value='education' className='flex items-center space-x-2'>
              <GraduationCap className='h-4 w-4' />
              <span className='hidden sm:inline'>Eğitim</span>
            </TabsTrigger>
            <TabsTrigger value='experience' className='flex items-center space-x-2'>
              <Briefcase className='h-4 w-4' />
              <span className='hidden sm:inline'>Deneyim</span>
            </TabsTrigger>
            <TabsTrigger value='skills' className='flex items-center space-x-2'>
              <Star className='h-4 w-4' />
              <span className='hidden sm:inline'>Yetenekler</span>
            </TabsTrigger>
            <TabsTrigger value='courses' className='flex items-center space-x-2'>
              <BookOpen className='h-4 w-4' />
              <span className='hidden sm:inline'>Kurslar</span>
            </TabsTrigger>
            <TabsTrigger value='certificates' className='flex items-center space-x-2'>
              <Award className='h-4 w-4' />
              <span className='hidden sm:inline'>Sertifikalar</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value='overview' className='space-y-6'>
            <OverviewTab profile={profile} />
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value='education' className='space-y-6'>
            <EducationTab
              profile={profile}
              onOpenModal={() => openModal('education')}
              onOpenEditModal={(id, data) => openEditModal('education', id, data)}
              onDeleteEducation={(id, name) => openDeleteConfirmModal('education', id, name)}
            />
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value='experience' className='space-y-6'>
            <ExperienceTab
              profile={profile}
              onOpenModal={() => openModal('experience')}
              onOpenEditModal={(id, data) => openEditModal('experience', id, data)}
              onDeleteExperience={(id, name) => openDeleteConfirmModal('experience', id, name)}
            />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value='skills' className='space-y-6'>
            <SkillsTab
              profile={profile}
              onOpenModal={() => openModal('skill')}
              onOpenEditModal={(id, data) => openEditModal('skill', id, data)}
              onDeleteSkill={(id, name) => openDeleteConfirmModal('skill', id, name)}
            />
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value='courses' className='space-y-6'>
            <CoursesTab
              profile={profile}
              onOpenModal={() => openModal('course')}
              onOpenEditModal={(id, data) => openEditModal('course', id, data)}
              onDeleteCourse={(id, name) => openDeleteConfirmModal('course', id, name)}
            />
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value='certificates' className='space-y-6'>
            <CertificatesTab
              profile={profile}
              onOpenModal={() => console.log('Certificate modal not implemented yet')}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <EducationModal
        isOpen={modalStates.education}
        onClose={() => closeModal('education')}
        onSave={handleSaveEducation}
        education={editingItem?.type === 'education' ? (editingItem.data as Education) : null}
        isLoading={isLoading}
      />

      <WorkExperienceModal
        isOpen={modalStates.experience}
        onClose={() => closeModal('experience')}
        onSave={handleSaveWorkExperience}
        experience={editingItem?.type === 'experience' ? (editingItem.data as WorkExperience) : null}
        isLoading={isLoading}
      />

      <SkillModal
        isOpen={modalStates.skill}
        onClose={() => closeModal('skill')}
        onSave={handleSaveSkill}
        skill={editingItem?.type === 'skill' ? (editingItem.data as Skill) : null}
        isLoading={isLoading}
      />

      <CourseModal
        isOpen={modalStates.course}
        onClose={() => closeModal('course')}
        onSave={handleSaveCourse}
        course={editingItem?.type === 'course' ? (editingItem.data as Course) : null}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
        title='Silme Onayı'
        message={`Bu ${deleteConfirmModal.type === 'skill' ? 'yeteneği' : deleteConfirmModal.type === 'education' ? 'eğitimi' : deleteConfirmModal.type === 'experience' ? 'deneyimi' : 'kursu'} silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        itemName={deleteConfirmModal.name}
        isLoading={isLoading}
      />
    </div>
  )
}
