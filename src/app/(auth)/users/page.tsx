'use client'

import React, { useState, useMemo } from 'react'

import { useTranslation } from 'react-i18next'
import {
  X,
  User,
  Edit,
  Mail,
  Crown,
  Users,
  Search,
  Filter,
  Trash2,
  Shield,
  Upload,
  UserPlus,
  Calendar,
  Download,
  ChevronDown,
  MoreVertical,
  Table,
  Grid3X3,
} from 'lucide-react'

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/core/dialog'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/core/dropdown'
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/core/alert-dialog'
import { Badge } from '@/components/core/badge'
import { Input } from '@/components/core/input'
import { Button } from '@/components/core/button'
import { Card, CardContent } from '@/components/core/card'
import { Avatar, AvatarFallback } from '@/components/core/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'

import { cn } from '@/lib/utils'

// Mock kullanıcı verisi
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    username: 'ahmet.yilmaz',
    email: 'ahmet@example.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T00:00:00Z',
    avatar: null,
  },
  {
    id: '2',
    name: 'Zeynep Kaya',
    username: 'zeynep.kaya',
    email: 'zeynep@example.com',
    role: 'editor',
    status: 'active',
    lastLogin: '2024-01-14T15:20:00Z',
    createdAt: '2023-08-15T00:00:00Z',
    avatar: null,
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    username: 'mehmet.demir',
    email: 'mehmet@example.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-10T09:15:00Z',
    createdAt: '2023-10-20T00:00:00Z',
    avatar: null,
  },
  {
    id: '4',
    name: 'Ayşe Öztürk',
    username: 'ayse.ozturk',
    email: 'ayse@example.com',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-15T14:45:00Z',
    createdAt: '2023-12-05T00:00:00Z',
    avatar: null,
  },
  {
    id: '5',
    name: 'Can Arslan',
    username: 'can.arslan',
    email: 'can@example.com',
    role: 'editor',
    status: 'pending',
    lastLogin: null,
    createdAt: '2024-01-01T00:00:00Z',
    avatar: null,
  },
]

type ViewMode = 'grid' | 'table'
type UserRole = 'admin' | 'editor' | 'user'
type UserStatus = 'active' | 'inactive' | 'pending'

interface User {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  status: UserStatus
  lastLogin: string | null
  createdAt: string
  avatar: string | null
}

export default function UsersPage() {
  const { t } = useTranslation()

  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  // Filtreleme mantığı
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesRole = selectedRole === 'all' || user.role === selectedRole
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, selectedRole, selectedStatus])

  // Role ve status için seçenekler
  const roleOptions = [
    { value: 'all', label: 'Tüm Roller', count: users.length },
    { value: 'admin', label: 'Admin', count: users.filter((u) => u.role === 'admin').length },
    { value: 'editor', label: 'Editör', count: users.filter((u) => u.role === 'editor').length },
    { value: 'user', label: 'Kullanıcı', count: users.filter((u) => u.role === 'user').length },
  ]

  const statusOptions = [
    { value: 'all', label: 'Tüm Durumlar', count: users.length },
    { value: 'active', label: 'Aktif', count: users.filter((u) => u.status === 'active').length },
    { value: 'inactive', label: 'Pasif', count: users.filter((u) => u.status === 'inactive').length },
    { value: 'pending', label: 'Beklemede', count: users.filter((u) => u.status === 'pending').length },
  ]

  // Utility fonksiyonlar
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className='h-4 w-4' />
      case 'editor':
        return <Shield className='h-4 w-4' />
      default:
        return <User className='h-4 w-4' />
    }
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/50'
      case 'editor':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50'
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-950/30 dark:text-neutral-300 dark:border-neutral-800/50'
    }
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50'
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/50'
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50'
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-950/30 dark:text-neutral-300 dark:border-neutral-800/50'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Hiç giriş yapmadı'
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  // Event handlers
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowUserDialog(true)
  }

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      setUserToDelete(null)
      setShowDeleteDialog(false)
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setShowUserDialog(true)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedRole('all')
    setSelectedStatus('all')
  }

  const hasActiveFilters = searchQuery || selectedRole !== 'all' || selectedStatus !== 'all'

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100/50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950/80'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-7xl mx-auto space-y-8'>
          {/* Page Header */}
          <div className='space-y-4'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold text-neutral-900 dark:text-neutral-50'>{t('navigation.users')}</h1>
                <p className='text-neutral-600 dark:text-neutral-400'>Sistem kullanıcılarını yönetin ve izleyin</p>
              </div>
              <div className='flex flex-col sm:flex-row gap-3'>
                <Button variant='outline' className='flex items-center justify-center gap-2 min-h-[40px]'>
                  <Download className='h-4 w-4' />
                  Dışa Aktar
                </Button>
                <Button variant='outline' className='flex items-center justify-center gap-2 min-h-[40px]'>
                  <Upload className='h-4 w-4' />
                  İçe Aktar
                </Button>
                <Button onClick={handleAddUser} className='flex items-center justify-center gap-2 min-h-[40px]'>
                  <UserPlus className='h-4 w-4' />
                  Yeni Kullanıcı
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30'>
                      <Users className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>{users.length}</p>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>Toplam Kullanıcı</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30'>
                      <User className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
                        {users.filter((u) => u.status === 'active').length}
                      </p>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>Aktif Kullanıcı</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30'>
                      <Crown className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
                        {users.filter((u) => u.role === 'admin').length}
                      </p>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>Admin</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30'>
                      <Calendar className='h-5 w-5 text-amber-600 dark:text-amber-400' />
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-neutral-900 dark:text-neutral-50'>
                        {users.filter((u) => u.status === 'pending').length}
                      </p>
                      <p className='text-sm text-neutral-600 dark:text-neutral-400'>Beklemede</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
            <CardContent className='p-6'>
              <div className='space-y-6'>
                {/* Primary Controls */}
                <div className='flex flex-col sm:flex-row lg:flex-row gap-4'>
                  {/* Search */}
                  <div className='flex-1 relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400' />
                    <Input
                      placeholder='Kullanıcı ara...'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className='pl-10'
                    />
                    {searchQuery && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setSearchQuery('')}
                        className='absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>

                  {/* Desktop Filters */}
                  <div className='hidden lg:flex items-center gap-3'>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className='w-[200px]'>
                        <SelectValue placeholder='Rol filtrele' />
                      </SelectTrigger>
                      <SelectContent className='w-[200px]'>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                            <div className='flex items-center justify-between w-full pr-2'>
                              <span className='truncate'>{option.label}</span>
                              <Badge variant='secondary' className='ml-2 text-xs shrink-0 min-w-[24px] justify-center'>
                                {option.count}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Durum filtrele' />
                      </SelectTrigger>
                      <SelectContent className='w-[180px]'>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                            <div className='flex items-center justify-between w-full pr-2'>
                              <span className='truncate'>{option.label}</span>
                              <Badge variant='secondary' className='ml-2 text-xs shrink-0 min-w-[24px] justify-center'>
                                {option.count}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* View Mode Toggle */}
                    <div className='flex items-center gap-1 p-1 bg-neutral-100/70 dark:bg-neutral-700/70 rounded-lg'>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size='sm'
                        onClick={() => setViewMode('table')}
                        className='p-2'
                        title='Tablo görünümü'
                      >
                        <Table className='h-4 w-4' />
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size='sm'
                        onClick={() => setViewMode('grid')}
                        className='p-2'
                        title='Kart görünümü'
                      >
                        <Grid3X3 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <div className='lg:hidden sm:w-auto w-full'>
                    <Button
                      variant='outline'
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className='w-full sm:w-auto flex items-center justify-center gap-2 min-w-[120px]'
                    >
                      <Filter className='h-4 w-4' />
                      Filtreler
                      <ChevronDown className={cn('h-4 w-4 transition-transform', isFilterOpen && 'rotate-180')} />
                    </Button>
                  </div>
                </div>

                {/* Mobile Filters */}
                {isFilterOpen && (
                  <div className='lg:hidden space-y-4 p-4 bg-neutral-50/50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/50 dark:border-neutral-700/30'>
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Rol</label>
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                          <SelectTrigger>
                            <SelectValue placeholder='Rol seçin' />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                                <div className='flex items-center justify-between w-full'>
                                  <span>{option.label}</span>
                                  <Badge variant='secondary' className='ml-2 text-xs shrink-0'>
                                    {option.count}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Durum</label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder='Durum seçin' />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                                <div className='flex items-center justify-between w-full'>
                                  <span>{option.label}</span>
                                  <Badge variant='secondary' className='ml-2 text-xs shrink-0'>
                                    {option.count}
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-medium'>Görünüm</span>
                      <div className='flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-700 rounded-lg'>
                        <Button
                          variant={viewMode === 'table' ? 'default' : 'ghost'}
                          size='sm'
                          onClick={() => setViewMode('table')}
                          className='px-3 py-2 text-xs'
                        >
                          <Table className='h-4 w-4 mr-1' />
                          Tablo
                        </Button>
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size='sm'
                          onClick={() => setViewMode('grid')}
                          className='px-3 py-2 text-xs'
                        >
                          <Grid3X3 className='h-4 w-4 mr-1' />
                          Kart
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-sm font-medium text-neutral-600 dark:text-neutral-400'>Aktif filtreler:</span>
                    {searchQuery && (
                      <Badge variant='secondary' className='gap-1'>
                        Arama: &quot;{searchQuery}&quot;
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSearchQuery('')}
                          className='h-4 w-4 p-0 hover:bg-transparent'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </Badge>
                    )}
                    {selectedRole !== 'all' && (
                      <Badge variant='secondary' className='gap-1'>
                        Rol: {roleOptions.find((r) => r.value === selectedRole)?.label}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSelectedRole('all')}
                          className='h-4 w-4 p-0 hover:bg-transparent'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </Badge>
                    )}
                    {selectedStatus !== 'all' && (
                      <Badge variant='secondary' className='gap-1'>
                        Durum: {statusOptions.find((s) => s.value === selectedStatus)?.label}
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => setSelectedStatus('all')}
                          className='h-4 w-4 p-0 hover:bg-transparent'
                        >
                          <X className='h-3 w-3' />
                        </Button>
                      </Badge>
                    )}
                    <Button variant='ghost' size='sm' onClick={clearFilters} className='text-xs'>
                      Tümünü temizle
                    </Button>
                  </div>
                )}

                {/* Results Summary */}
                <div className='flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400'>
                  <span>
                    <strong className='text-neutral-900 dark:text-neutral-100'>{filteredUsers.length}</strong> kullanıcı
                    gösteriliyor
                    {filteredUsers.length !== users.length && <span className='ml-1'>({users.length} toplam)</span>}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Display */}
          {filteredUsers.length > 0 ? (
            viewMode === 'table' ? (
              /* Table View */
              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-neutral-200/50 dark:border-neutral-700/30'>
                        <th className='text-left p-4 font-semibold text-neutral-900 dark:text-neutral-50'>Kullanıcı</th>
                        <th className='text-left p-4 font-semibold text-neutral-900 dark:text-neutral-50 hidden md:table-cell'>
                          Rol
                        </th>
                        <th className='text-left p-4 font-semibold text-neutral-900 dark:text-neutral-50 hidden lg:table-cell'>
                          Durum
                        </th>
                        <th className='text-left p-4 font-semibold text-neutral-900 dark:text-neutral-50 hidden xl:table-cell'>
                          Son Giriş
                        </th>
                        <th className='text-right p-4 font-semibold text-neutral-900 dark:text-neutral-50'>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className='border-b border-neutral-200/30 dark:border-neutral-700/20 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors'
                        >
                          <td className='p-4'>
                            <div className='flex items-center gap-3'>
                              <Avatar>
                                <AvatarFallback className='bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'>
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className='min-w-0'>
                                <p className='font-medium text-neutral-900 dark:text-neutral-50 truncate'>
                                  {user.name}
                                </p>
                                <p className='text-sm text-neutral-600 dark:text-neutral-400 truncate'>{user.email}</p>
                                {/* Mobile: Show role and status */}
                                <div className='md:hidden mt-1 flex items-center gap-2'>
                                  <Badge className={cn('text-xs border', getRoleColor(user.role))}>
                                    <span className='flex items-center gap-1'>
                                      {getRoleIcon(user.role)}
                                      {user.role}
                                    </span>
                                  </Badge>
                                  <Badge className={cn('text-xs border', getStatusColor(user.status))}>
                                    {user.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className='p-4 hidden md:table-cell'>
                            <Badge className={cn('text-xs border', getRoleColor(user.role))}>
                              <span className='flex items-center gap-1'>
                                {getRoleIcon(user.role)}
                                {user.role}
                              </span>
                            </Badge>
                          </td>
                          <td className='p-4 hidden lg:table-cell'>
                            <Badge className={cn('text-xs border', getStatusColor(user.status))}>{user.status}</Badge>
                          </td>
                          <td className='p-4 hidden xl:table-cell'>
                            <div className='text-sm text-neutral-600 dark:text-neutral-400'>
                              {formatDate(user.lastLogin)}
                            </div>
                          </td>
                          <td className='p-4 text-right'>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                                  <MoreVertical className='h-4 w-4' />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className='h-4 w-4 mr-2' />
                                  Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className='h-4 w-4 mr-2' />
                                  E-posta Gönder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUser(user)}
                                  className='text-red-600 dark:text-red-400'
                                >
                                  <Trash2 className='h-4 w-4 mr-2' />
                                  Sil
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              /* Grid View */
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50 hover:shadow-lg transition-all duration-200'
                  >
                    <CardContent className='p-6'>
                      <div className='space-y-4'>
                        {/* User Info */}
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-12 w-12'>
                            <AvatarFallback className='bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-lg'>
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1 min-w-0'>
                            <p className='font-semibold text-neutral-900 dark:text-neutral-50 truncate'>{user.name}</p>
                            <p className='text-sm text-neutral-600 dark:text-neutral-400 truncate'>@{user.username}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                                <MoreVertical className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className='h-4 w-4 mr-2' />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className='h-4 w-4 mr-2' />
                                E-posta Gönder
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user)}
                                className='text-red-600 dark:text-red-400'
                              >
                                <Trash2 className='h-4 w-4 mr-2' />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Email */}
                        <div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
                          <Mail className='h-4 w-4 shrink-0' />
                          <span className='truncate'>{user.email}</span>
                        </div>

                        {/* Role and Status */}
                        <div className='flex items-center gap-2'>
                          <Badge className={cn('text-xs border flex-1', getRoleColor(user.role))}>
                            <span className='flex items-center gap-1 justify-center'>
                              {getRoleIcon(user.role)}
                              {user.role}
                            </span>
                          </Badge>
                          <Badge className={cn('text-xs border flex-1', getStatusColor(user.status))}>
                            <span className='text-center block'>{user.status}</span>
                          </Badge>
                        </div>

                        {/* Last Login */}
                        <div className='text-xs text-neutral-500 dark:text-neutral-400'>
                          <div className='flex items-center gap-1'>
                            <Calendar className='h-3 w-3' />
                            {formatDate(user.lastLogin)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            /* No Results */
            <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
              <CardContent className='p-12'>
                <div className='text-center space-y-4'>
                  <div className='text-neutral-400 dark:text-neutral-500'>
                    <Users className='h-16 w-16 mx-auto opacity-50' />
                  </div>
                  <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100'>Kullanıcı bulunamadı</h3>
                  <p className='text-neutral-600 dark:text-neutral-400 max-w-md mx-auto'>
                    Arama kriterlerinizi değiştirin veya yeni kullanıcı ekleyin.
                  </p>
                  <div className='flex flex-col sm:flex-row gap-3 justify-center items-center'>
                    <Button onClick={clearFilters} variant='outline'>
                      Filtreleri Temizle
                    </Button>
                    <Button onClick={handleAddUser} className='flex items-center gap-2'>
                      <UserPlus className='h-4 w-4' />
                      Yeni Kullanıcı Ekle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className='max-w-md p-6'>
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</DialogTitle>
            <DialogDescription>
              {selectedUser ? 'Kullanıcı bilgilerini güncelleyin.' : 'Yeni kullanıcı bilgilerini girin.'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Ad Soyad</label>
              <Input placeholder='Kullanıcının adını girin' />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>E-posta</label>
              <Input type='email' placeholder='email@example.com' />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Kullanıcı Adı</label>
              <Input placeholder='kullanici_adi' />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Rol</label>
              <Select defaultValue='user'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='user'>Kullanıcı</SelectItem>
                  <SelectItem value='editor'>Editör</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className='flex max-md:flex-col gap-4'>
            <Button variant='outline' onClick={() => setShowUserDialog(false)}>
              İptal
            </Button>
            <Button onClick={() => setShowUserDialog(false)}>{selectedUser ? 'Güncelle' : 'Ekle'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              {userToDelete && (
                <>
                  <strong>{userToDelete.name}</strong> kullanıcısını silmek istediğinizden emin misiniz? Bu işlem geri
                  alınamaz.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className='bg-red-600 hover:bg-red-700 text-white'>
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
