/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { userProfileApi } from '@/lib/api/api'
import type { UserProfile, Education, WorkExperience, Course, Certificate, Hobby, Skill } from '@/types/api.types'

interface UserProfileState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

interface UserProfileActions {
  // Ana profil işlemleri
  getProfile: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>

  // Eğitim işlemleri
  addEducation: (data: Omit<Education, 'id'>) => Promise<Education>
  updateEducation: (id: string, data: Partial<Omit<Education, 'id'>>) => Promise<Education>
  deleteEducation: (id: string) => Promise<void>

  // İş deneyimi işlemleri
  addWorkExperience: (data: Omit<WorkExperience, 'id'>) => Promise<WorkExperience>
  updateWorkExperience: (id: string, data: Partial<Omit<WorkExperience, 'id'>>) => Promise<WorkExperience>
  deleteWorkExperience: (id: string) => Promise<void>

  // Kurs işlemleri
  addCourse: (data: Omit<Course, 'id'>) => Promise<Course>
  updateCourse: (id: string, data: Partial<Omit<Course, 'id'>>) => Promise<Course>
  deleteCourse: (id: string) => Promise<void>

  // Sertifika işlemleri
  addCertificate: (data: Omit<Certificate, 'id'>) => Promise<Certificate>
  updateCertificate: (id: string, data: Partial<Omit<Certificate, 'id'>>) => Promise<Certificate>
  deleteCertificate: (id: string) => Promise<void>

  // Hobi işlemleri
  addHobby: (data: Omit<Hobby, 'id'>) => Promise<Hobby>
  updateHobby: (id: string, data: Partial<Omit<Hobby, 'id'>>) => Promise<Hobby>
  deleteHobby: (id: string) => Promise<void>

  // Yetenek işlemleri
  addSkill: (data: Omit<Skill, 'id'>) => Promise<Skill>
  updateSkill: (id: string, data: Partial<Omit<Skill, 'id'>>) => Promise<Skill>
  deleteSkill: (id: string) => Promise<void>

  // Utility actions
  clearError: () => void
  reset: () => void
}

type UserProfileStore = UserProfileState & UserProfileActions

const initialState: UserProfileState = {
  profile: null,
  isLoading: false,
  error: null,
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, _get) => ({
      ...initialState,

      // Ana profil işlemleri
      getProfile: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.getProfile()
          console.log('Store: Profile loaded:', response.data)

          // Ensure avatar color has a fallback value
          const profileWithDefaults = {
            ...response.data,
            avatarColor:
              response.data.avatarColor && response.data.avatarColor !== '' ? response.data.avatarColor : '#3B82F6',
          }

          console.log('Store: Profile with avatar color fallback:', profileWithDefaults.avatarColor)
          set({ profile: profileWithDefaults, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Profil yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null })
        try {
          console.log('Store: Updating profile with data:', data)
          const response = await userProfileApi.updateProfile(data)
          console.log('Store: Profile update response:', response.data)

          set((state) => {
            if (!state.profile) return { isLoading: false }

            // Mevcut profil verisini koru ve sadece güncellenen alanları değiştir
            const updatedProfile = {
              ...state.profile, // Mevcut tüm profil verisini koru (deneyimler, eğitimler vb.)
              ...response.data, // API'den gelen yeni veriyi üzerine yaz
              avatarColor: response.data.avatarColor || data.avatarColor || state.profile.avatarColor || '#3B82F6',
              // Alt objeleri korumak için ayrıca kontrol et
              experiences: response.data.experiences || state.profile.experiences || [],
              educations: response.data.educations || state.profile.educations || [],
              skills: response.data.skills || state.profile.skills || [],
              courses: response.data.courses || state.profile.courses || [],
              certificates: response.data.certificates || state.profile.certificates || [],
              hobbies: response.data.hobbies || state.profile.hobbies || [],
            }

            console.log('Store: Final profile with preserved data:', updatedProfile)
            return { profile: updatedProfile, isLoading: false }
          })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Profil güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      // Eğitim işlemleri
      addEducation: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.education.add(data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  educations: [...(state.profile.educations || []).filter(Boolean), response.data],
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Eğitim bilgisi eklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateEducation: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.education.update(id, data)
          
          set((state) => {
            if (!state.profile) return { isLoading: false }
            
            const currentEducations = state.profile.educations || []
            const existingEducation = currentEducations.find((edu) => edu && edu.id === id)
            
            if (!existingEducation) {
              console.warn('Education not found for update:', id)
              return { isLoading: false }
            }
            
            // Create updated education by merging existing data with API response
            // Preserve all original fields and only update what's provided
            const updatedEducation: Education = {
              id: existingEducation.id, // Always preserve the original ID
              schoolName: response.data.schoolName || existingEducation.schoolName,
              degree: response.data.degree || existingEducation.degree,
              fieldOfStudy: response.data.fieldOfStudy || existingEducation.fieldOfStudy,
              grade: response.data.grade !== undefined ? response.data.grade : existingEducation.grade,
              gradeSystem: response.data.gradeSystem || existingEducation.gradeSystem,
              educationType: response.data.educationType || existingEducation.educationType || 'LISANS',
              startYear: response.data.startYear || existingEducation.startYear,
              endYear: response.data.endYear !== undefined ? response.data.endYear : existingEducation.endYear,
              isCurrent: response.data.isCurrent !== undefined ? response.data.isCurrent : existingEducation.isCurrent,
              description: response.data.description !== undefined ? response.data.description : existingEducation.description,
            }
            
            return {
              profile: {
                ...state.profile,
                educations: currentEducations.map((edu) => 
                  edu && edu.id === id ? updatedEducation : edu
                ),
              },
              isLoading: false,
            }
          })
          
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Eğitim bilgisi güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteEducation: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await userProfileApi.education.delete(id)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  educations: (state.profile.educations || []).filter((edu: Education) => edu && edu.id !== id),
                }
              : null,
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Eğitim bilgisi silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // İş deneyimi işlemleri
      addWorkExperience: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.experience.add(data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  experiences: [...(state.profile.experiences || []).filter(Boolean), response.data],
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'İş deneyimi eklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateWorkExperience: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.experience.update(id, data)
          console.log('Work experience update response:', response)
          
          set((state) => {
            if (!state.profile) return { isLoading: false }
            
            const currentExperiences = state.profile.experiences || []
            const existingExperience = currentExperiences.find((exp) => exp && exp.id === id)
            
            if (!existingExperience) {
              console.warn('Work experience not found for update:', id)
              return { isLoading: false }
            }
            
            // Eğer API response.data yoksa veya boşsa, mevcut veriyi koru
            if (!response || !response.data) {
              console.warn('Invalid API response for work experience update:', response)
              return { isLoading: false }
            }
            
            // Create updated experience by merging existing data with API response
            const responseData = response.data
            
            const updatedExperience: WorkExperience = {
              ...existingExperience, // Start with existing experience
              // Override only with provided values from API response
              ...(responseData.companyName && { companyName: responseData.companyName }),
              ...(responseData.position && { position: responseData.position }),
              ...(responseData.employmentType && { employmentType: responseData.employmentType }),
              ...(responseData.workMode && { workMode: responseData.workMode }),
              ...(responseData.location !== undefined && { location: responseData.location }),
              ...(responseData.startMonth && { startMonth: responseData.startMonth }),
              ...(responseData.startYear && { startYear: responseData.startYear }),
              ...(responseData.endMonth !== undefined && { endMonth: responseData.endMonth }),
              ...(responseData.endYear !== undefined && { endYear: responseData.endYear }),
              ...(responseData.isCurrent !== undefined && { isCurrent: responseData.isCurrent }),
              ...(responseData.description !== undefined && { description: responseData.description }),
              ...(responseData.achievements !== undefined && { achievements: responseData.achievements }),
            }
            
            return {
              profile: {
                ...state.profile,
                experiences: currentExperiences.map((exp) => 
                  exp && exp.id === id ? updatedExperience : exp
                ),
              },
              isLoading: false,
            }
          })
          
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'İş deneyimi güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteWorkExperience: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await userProfileApi.experience.delete(id)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  experiences: (state.profile.experiences || []).filter((exp: WorkExperience) => exp && exp.id !== id),
                }
              : null,
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'İş deneyimi silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Kurs işlemleri
      addCourse: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.course.add(data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  courses: [...(state.profile.courses || []).filter(Boolean), response.data],
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Kurs bilgisi eklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateCourse: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.course.update(id, data)
          console.log('Course update response:', response)
          
          // Update işleminden sonra profili yeniden fetch et
          const { getProfile } = _get()
          await getProfile()
          
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Kurs bilgisi güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteCourse: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await userProfileApi.course.delete(id)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  courses: (state.profile.courses || []).filter((course) => course && course.id !== id),
                }
              : null,
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Kurs bilgisi silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Sertifika işlemleri
      addCertificate: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.certificate.add(data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  certificates: [...(state.profile.certificates || []).filter(Boolean), response.data],
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Sertifika bilgisi eklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateCertificate: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.certificate.update(id, data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  certificates: (state.profile.certificates || [])
                    .filter(Boolean)
                    .map((cert) =>
                      cert && cert.id === id ? response.data : cert,
                    ),
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Sertifika bilgisi güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteCertificate: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await userProfileApi.certificate.delete(id)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  certificates: (state.profile.certificates || []).filter((cert) => cert && cert.id !== id),
                }
              : null,
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Sertifika bilgisi silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Hobi işlemleri
      addHobby: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.hobby.add(data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  hobbies: [...(state.profile.hobbies || []).filter(Boolean), response.data],
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Hobi bilgisi eklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateHobby: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.hobby.update(id, data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  hobbies: (state.profile.hobbies || [])
                    .filter(Boolean)
                    .map((hobby) => (hobby && hobby.id === id ? response.data : hobby)),
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Hobi bilgisi güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteHobby: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await userProfileApi.hobby.delete(id)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  hobbies: (state.profile.hobbies || []).filter((hobby) => hobby && hobby.id !== id),
                }
              : null,
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Hobi bilgisi silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Yetenek işlemleri
      addSkill: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.skill.add(data)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  skills: [...(state.profile.skills || []).filter(Boolean), response.data],
                }
              : null,
            isLoading: false,
          }))
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Yetenek bilgisi eklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      updateSkill: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.skill.update(id, data)
          console.log('Skill update response:', response)
          
          // Update işleminden sonra profili yeniden fetch et
          const { getProfile } = _get()
          await getProfile()
          
          return response.data
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Yetenek bilgisi güncellenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
          throw error
        }
      },

      deleteSkill: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await userProfileApi.skill.delete(id)
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  skills: (state.profile.skills || []).filter((skill) => skill && skill.id !== id),
                }
              : null,
            isLoading: false,
          }))
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Yetenek bilgisi silinirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      // Utility actions
      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: 'user-profile-store',
      partialize: (state) => ({
        profile: state.profile,
      }),
    },
  ),
)
