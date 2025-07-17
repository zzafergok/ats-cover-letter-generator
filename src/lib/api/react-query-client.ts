/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApiInstance } from '@/services/apiService'
import { API_ENDPOINTS, ApiResponse } from '@/services/utils'

// Mevcut axios instance kullanımı
const api = createApiInstance()

/**
 * React Query için API fonksiyonları
 * Mevcut axios altyapısı ile uyumlu wrapper fonksiyonlar
 * Token yönetimi, interceptor'lar ve error handling korunuyor
 */

// Auth API fonksiyonları
export const authApi = {
  // Login - mutation için kullanılacak
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response
  },

  // User profile - query için kullanılacak
  getProfile: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.USER.PROFILE)
    return response
  },

  // Refresh token - mevcut logic korunuyor
  refreshToken: async (): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.REFRESH)
    return response
  },

  // Logout - mutation için kullanılacak
  logout: async (): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    return response
  },

  // Register - mutation için kullanılacak
  register: async (userData: { email: string; password: string; name: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response
  },
}

// Tasks API fonksiyonları (Posts yerine Tasks kullanarak build hatasını çözüyoruz)
export const tasksApi = {
  // Get all tasks - query için kullanılacak
  getTasks: async (params?: { page?: number; limit?: number; projectId?: string }): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.projectId) queryParams.append('projectId', params.projectId)

    const baseUrl = params?.projectId ? API_ENDPOINTS.TASKS.BY_PROJECT(params.projectId) : '/tasks'

    const url = `${baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response: any = await api.get(url)
    return response
  },

  // Get single task - query için kullanılacak
  getTask: async (id: string): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.TASKS.GET_BY_ID(id))
    return response
  },

  // Create task - mutation için kullanılacak
  createTask: async (taskData: {
    title: string
    description?: string
    priority: string
    projectId: string
    status?: string
    columnId?: string
    assignedTo?: string[]
    tags?: string[]
    dueDate?: string
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.TASKS.CREATE(taskData.projectId), taskData)
    return response
  },

  // Update task - mutation için kullanılacak
  updateTask: async ({
    id,
    data,
  }: {
    id: string
    data: Partial<{
      title: string
      description: string
      priority: string
      status: string
      columnId: string
      assignedTo: string[]
      tags: string[]
      dueDate: string
    }>
  }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.TASKS.UPDATE(id), data)
    return response
  },

  // Delete task - mutation için kullanılacak
  deleteTask: async (id: string): Promise<ApiResponse> => {
    const response: any = await api.delete(API_ENDPOINTS.TASKS.DELETE(id))
    return response
  },

  // Move task - mutation için kullanılacak
  moveTask: async (id: string, moveData: { columnId: string; position?: number }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.TASKS.MOVE(id), moveData)
    return response
  },

  // Bulk create tasks (JSON import özelliği için)
  bulkCreateTasks: async (
    projectId: string,
    tasks: Array<{
      title: string
      description?: string
      priority: string
      status?: string
      columnId?: string
    }>,
  ): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.TASKS.UPLOAD_JSON(projectId), { tasks })
    return response
  },

  // Get tasks by project with filtering
  getTasksByProject: async (
    projectId: string,
    filters?: {
      status?: string
      priority?: string
      assignedTo?: string
      tags?: string[]
      search?: string
    },
  ): Promise<ApiResponse> => {
    const queryParams = new URLSearchParams()
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.priority) queryParams.append('priority', filters.priority)
    if (filters?.assignedTo) queryParams.append('assignedTo', filters.assignedTo)
    if (filters?.search) queryParams.append('search', filters.search)
    if (filters?.tags) filters.tags.forEach((tag) => queryParams.append('tags', tag))

    const url = `${API_ENDPOINTS.TASKS.BY_PROJECT(projectId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response: any = await api.get(url)
    return response
  },
}

// Tags API fonksiyonları
export const tagsApi = {
  // Get tags by project - query için kullanılacak
  getTagsByProject: async (projectId: string): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.TASKS.TAGS(projectId))
    return response
  },

  // Create tag - mutation için kullanılacak
  createTag: async (projectId: string, tagData: { name: string; color?: string }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.TASKS.CREATE_TAG(projectId), tagData)
    return response
  },

  // Update tag - mutation için kullanılacak
  updateTag: async (id: string, tagData: { name?: string; color?: string }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.TAGS.UPDATE(id), tagData)
    return response
  },

  // Delete tag - mutation için kullanılacak
  deleteTag: async (id: string): Promise<ApiResponse> => {
    const response: any = await api.delete(API_ENDPOINTS.TAGS.DELETE(id))
    return response
  },
}

// User API fonksiyonları
export const userApi = {
  // Get user profile - query için kullanılacak
  getProfile: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.USER.PROFILE)
    return response
  },

  // Update user profile - mutation için kullanılacak
  updateProfile: async (userData: { name?: string; email?: string }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.USER.UPDATE, userData)
    return response
  },

  // Upload avatar - mutation için kullanılacak
  uploadAvatar: async (file: FormData): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.USER.UPLOAD_AVATAR, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response
  },

  // Change password - mutation için kullanılacak
  changePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, passwordData)
    return response
  },
}

// Projects API fonksiyonları
export const projectsApi = {
  // Get all projects - query için kullanılacak
  getProjects: async (): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.PROJECTS.LIST)
    return response
  },

  // Get single project - query için kullanılacak
  getProject: async (id: string): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.PROJECTS.GET_BY_ID(id))
    return response
  },

  // Create project - mutation için kullanılacak
  createProject: async (projectData: {
    name: string
    description?: string
    color?: string
    isPublic?: boolean
  }): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.PROJECTS.CREATE, projectData)
    return response
  },

  // Update project - mutation için kullanılacak
  updateProject: async ({
    id,
    data,
  }: {
    id: string
    data: Partial<{
      name: string
      description: string
      color: string
      isPublic: boolean
    }>
  }): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.PROJECTS.UPDATE(id), data)
    return response
  },

  // Delete project - mutation için kullanılacak
  deleteProject: async (id: string): Promise<ApiResponse> => {
    const response: any = await api.delete(API_ENDPOINTS.PROJECTS.DELETE(id))
    return response
  },
}

// Columns API fonksiyonları
export const columnsApi = {
  // Get columns by project - query için kullanılacak
  getColumnsByProject: async (projectId: string): Promise<ApiResponse> => {
    const response: any = await api.get(API_ENDPOINTS.COLUMNS.BY_PROJECT(projectId))
    return response
  },

  // Create column - mutation için kullanılacak
  createColumn: async (
    projectId: string,
    columnData: {
      name: string
      position?: number
      color?: string
    },
  ): Promise<ApiResponse> => {
    const response: any = await api.post(API_ENDPOINTS.COLUMNS.CREATE(projectId), columnData)
    return response
  },

  // Update column - mutation için kullanılacak
  updateColumn: async (
    id: string,
    columnData: {
      name?: string
      position?: number
      color?: string
    },
  ): Promise<ApiResponse> => {
    const response: any = await api.put(API_ENDPOINTS.COLUMNS.UPDATE(id), columnData)
    return response
  },

  // Delete column - mutation için kullanılacak
  deleteColumn: async (id: string): Promise<ApiResponse> => {
    const response: any = await api.delete(API_ENDPOINTS.COLUMNS.DELETE(id))
    return response
  },
}

// Backward compatibility için postsApi alias'ı
export const postsApi = tasksApi
