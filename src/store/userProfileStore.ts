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
          set({ profile: response.data, isLoading: false })
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Profil yüklenirken hata oluştu'
          set({ isLoading: false, error: errorMessage })
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userProfileApi.updateProfile(data)
          set({ profile: response.data, isLoading: false })
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
                  education: [...(state.profile.education || []), response.data],
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
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  education: (state.profile.education || []).map((edu: Education) =>
                    edu.id === id ? response.data : edu,
                  ),
                }
              : null,
            isLoading: false,
          }))
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
                  education: (state.profile.education || []).filter((edu: Education) => edu.id !== id),
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
                  experience: [...(state.profile.experience || []), response.data],
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
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  experience: (state.profile.experience || []).map((exp: WorkExperience) =>
                    exp.id === id ? response.data : exp,
                  ),
                }
              : null,
            isLoading: false,
          }))
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
                  experience: (state.profile.experience || []).filter((exp: WorkExperience) => exp.id !== id),
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
                  courses: [...(state.profile.courses || []), response.data],
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
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  courses: (state.profile.courses || []).map((course) => (course.id === id ? response.data : course)),
                }
              : null,
            isLoading: false,
          }))
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
                  courses: (state.profile.courses || []).filter((course) => course.id !== id),
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
                  certificates: [...(state.profile.certificates || []), response.data],
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
                  certificates: (state.profile.certificates || []).map((cert) =>
                    cert.id === id ? response.data : cert,
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
                  certificates: (state.profile.certificates || []).filter((cert) => cert.id !== id),
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
                  hobbies: [...(state.profile.hobbies || []), response.data],
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
                  hobbies: (state.profile.hobbies || []).map((hobby) => (hobby.id === id ? response.data : hobby)),
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
                  hobbies: (state.profile.hobbies || []).filter((hobby) => hobby.id !== id),
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
                  skills: [...(state.profile.skills || []), response.data],
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
          set((state) => ({
            profile: state.profile
              ? {
                  ...state.profile,
                  skills: (state.profile.skills || []).map((skill) => (skill.id === id ? response.data : skill)),
                }
              : null,
            isLoading: false,
          }))
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
                  skills: (state.profile.skills || []).filter((skill) => skill.id !== id),
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
