'use client'

import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import {
  X,
  Eye,
  Key,
  User,
  Bell,
  Save,
  Lock,
  Check,
  Shield,
  Trash2,
  EyeOff,
  Palette,
  Download,
  RefreshCw,
  Smartphone,
  AlertTriangle,
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
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/core/alert-dialog'
import { Input } from '@/components/core/input'
import { Badge } from '@/components/core/badge'
import { Button } from '@/components/core/button'
import { Switch } from '@/components/core/switch'
import { Textarea } from '@/components/core/textarea'
import { Separator } from '@/components/core/seperator'
import { Avatar, AvatarFallback } from '@/components/core/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/core/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'

import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useLocale } from '@/hooks/useLocale'

import { cn } from '@/lib/utils'

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  securityAlerts: boolean
  productUpdates: boolean
  weeklyDigest: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showEmail: boolean
  showPhone: boolean
  allowIndexing: boolean
  dataProcessing: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  loginAlerts: boolean
  deviceTracking: boolean
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { currentLocale, changeLocale } = useLocale()

  // State management
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.username || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    website: '',
    location: '',
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    productUpdates: true,
    weeklyDigest: false,
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowIndexing: true,
    dataProcessing: true,
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    deviceTracking: true,
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Utility functions
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  // Event handlers
  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
  }

  const handleNotificationChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
    setHasUnsavedChanges(true)
  }

  const handlePrivacyChange = (setting: keyof PrivacySettings, value: any) => {
    setPrivacySettings((prev) => ({ ...prev, [setting]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSecurityChange = (setting: keyof SecuritySettings, value: any) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }))
    setHasUnsavedChanges(true)
  }

  const handleSaveChanges = () => {
    console.log('Saving changes...')
    setHasUnsavedChanges(false)
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Yeni şifreler eşleşmiyor!')
      return
    }
    console.log('Changing password...')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setShowPasswordDialog(false)
  }

  const handleDeleteAccount = () => {
    console.log('Deleting account...')
    logout()
  }

  const handleExportData = () => {
    console.log('Exporting user data...')
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100/50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950/80'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto space-y-8'>
          {/* Page Header */}
          <div className='space-y-4'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold text-neutral-900 dark:text-neutral-50'>{t('navigation.settings')}</h1>
                <p className='text-neutral-600 dark:text-neutral-400'>Hesap ayarlarınızı ve tercihlerinizi yönetin</p>
              </div>
              {hasUnsavedChanges && (
                <div className='flex items-center gap-3'>
                  <Badge variant='outline' className='text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20'>
                    Kaydedilmemiş değişiklikler
                  </Badge>
                  <Button onClick={handleSaveChanges} className='flex items-center gap-2'>
                    <Save className='h-4 w-4' />
                    Kaydet
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
            <TabsList className='w-full h-auto p-1 bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-1'>
              <TabsTrigger
                value='profile'
                className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-lg h-auto whitespace-nowrap'
              >
                <User className='h-4 w-4' />
                <span>Profil</span>
              </TabsTrigger>

              <TabsTrigger
                value='notifications'
                className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-lg h-auto whitespace-nowrap'
              >
                <Bell className='h-4 w-4' />
                <span className='hidden xs:block sm:hidden md:block'>Bildirimler</span>
                <span className='xs:hidden sm:block md:hidden'>Bildirim</span>
              </TabsTrigger>

              <TabsTrigger
                value='privacy'
                className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-lg h-auto whitespace-nowrap'
              >
                <Shield className='h-4 w-4' />
                <span>Gizlilik</span>
              </TabsTrigger>

              <TabsTrigger
                value='appearance'
                className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-lg h-auto whitespace-nowrap'
              >
                <Palette className='h-4 w-4' />
                <span>Görünüm</span>
              </TabsTrigger>

              <TabsTrigger
                value='security'
                className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-700 data-[state=active]:shadow-sm rounded-lg h-auto whitespace-nowrap col-span-2 sm:col-span-1'
              >
                <Key className='h-4 w-4' />
                <span>Güvenlik</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Settings */}
            <TabsContent value='profile' className='space-y-6'>
              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Profil Bilgileri
                  </CardTitle>
                  <CardDescription>Kişisel bilgilerinizi ve profil ayarlarınızı güncelleyin</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Avatar Section */}
                  <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
                    <Avatar className='h-20 w-20'>
                      <AvatarFallback className='bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-2xl'>
                        {getInitials(profileData.name || 'U U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='space-y-2'>
                      <div className='flex flex-col sm:flex-row gap-2'>
                        <Button variant='outline' size='sm'>
                          Fotoğraf Yükle
                        </Button>
                        <Button variant='ghost' size='sm' className='text-red-600'>
                          Kaldır
                        </Button>
                      </div>
                      <p className='text-xs text-neutral-500 dark:text-neutral-400'>JPG, PNG veya GIF. Maksimum 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Form */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Ad Soyad *</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        placeholder='Adınızı ve soyadınızı girin'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                        Kullanıcı Adı *
                      </label>
                      <Input
                        value={profileData.username}
                        onChange={(e) => handleProfileChange('username', e.target.value)}
                        placeholder='kullanici_adi'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>E-posta *</label>
                      <Input
                        type='email'
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        placeholder='email@example.com'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Telefon</label>
                      <Input
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        placeholder='+90 555 123 45 67'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Website</label>
                      <Input
                        value={profileData.website}
                        onChange={(e) => handleProfileChange('website', e.target.value)}
                        placeholder='https://website.com'
                      />
                    </div>

                    <div className='space-y-2'>
                      <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Konum</label>
                      <Input
                        value={profileData.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        placeholder='İstanbul, Türkiye'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>Biyografi</label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      placeholder='Kendinizden bahsedin...'
                      className='resize-none'
                      rows={3}
                    />
                    <p className='text-xs text-neutral-500 dark:text-neutral-400'>Maksimum 160 karakter</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value='notifications' className='space-y-6'>
              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Bell className='h-5 w-5' />
                    Bildirim Tercihleri
                  </CardTitle>
                  <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Email Notifications */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>E-posta Bildirimleri</h3>
                    <div className='space-y-3'>
                      {[
                        {
                          key: 'emailNotifications' as keyof NotificationSettings,
                          label: 'E-posta bildirimleri',
                          description: 'Genel e-posta bildirimlerini alın',
                        },
                        {
                          key: 'securityAlerts' as keyof NotificationSettings,
                          label: 'Güvenlik uyarıları',
                          description: 'Hesap güvenliği ile ilgili önemli bildirimleri alın',
                        },
                        {
                          key: 'productUpdates' as keyof NotificationSettings,
                          label: 'Ürün güncellemeleri',
                          description: 'Yeni özellikler ve güncellemeler hakkında bilgi alın',
                        },
                        {
                          key: 'marketingEmails' as keyof NotificationSettings,
                          label: 'Pazarlama e-postaları',
                          description: 'Özel teklifler ve kampanyalar hakkında bilgi alın',
                        },
                        {
                          key: 'weeklyDigest' as keyof NotificationSettings,
                          label: 'Haftalık özet',
                          description: 'Haftalık aktivite özetini e-posta ile alın',
                        },
                      ].map((item) => (
                        <div key={item.key} className='flex items-center justify-between py-2'>
                          <div className='space-y-1'>
                            <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                              {item.label}
                            </div>
                            <div className='text-xs text-neutral-600 dark:text-neutral-400'>{item.description}</div>
                          </div>
                          <Switch
                            checked={notificationSettings[item.key]}
                            onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Push Notifications */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Anlık Bildirimler</h3>
                    <div className='space-y-3'>
                      {[
                        {
                          key: 'pushNotifications' as keyof NotificationSettings,
                          label: 'Push bildirimleri',
                          description: 'Tarayıcı bildirimleri alın',
                        },
                        {
                          key: 'smsNotifications' as keyof NotificationSettings,
                          label: 'SMS bildirimleri',
                          description: 'Önemli güncellemeler için SMS alın',
                        },
                      ].map((item) => (
                        <div key={item.key} className='flex items-center justify-between py-2'>
                          <div className='space-y-1'>
                            <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                              {item.label}
                            </div>
                            <div className='text-xs text-neutral-600 dark:text-neutral-400'>{item.description}</div>
                          </div>
                          <Switch
                            checked={notificationSettings[item.key]}
                            onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value='privacy' className='space-y-6'>
              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Shield className='h-5 w-5' />
                    Gizlilik Ayarları
                  </CardTitle>
                  <CardDescription>Kişisel bilgilerinizin nasıl kullanıldığını kontrol edin</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Profile Visibility */}
                  <div className='space-y-3'>
                    <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                      Profil Görünürlüğü
                    </label>
                    <Select
                      value={privacySettings.profileVisibility}
                      onValueChange={(value: 'public' | 'private' | 'friends') =>
                        handlePrivacyChange('profileVisibility', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='public'>Herkese Açık</SelectItem>
                        <SelectItem value='friends'>Sadece Arkadaşlar</SelectItem>
                        <SelectItem value='private'>Özel</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className='text-xs text-neutral-600 dark:text-neutral-400'>
                      Profilinizi kimlerin görebileceğini seçin
                    </p>
                  </div>
                  <Separator />

                  {/* Contact Information */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>İletişim Bilgileri</h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                            E-posta adresini göster
                          </div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            E-posta adresinizin profilinizde görünmesine izin verin
                          </div>
                        </div>
                        <Switch
                          checked={privacySettings.showEmail}
                          onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                        />
                      </div>

                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                            Telefon numarasını göster
                          </div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            Telefon numaranızın profilinizde görünmesine izin verin
                          </div>
                        </div>
                        <Switch
                          checked={privacySettings.showPhone}
                          onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Data Usage */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Veri Kullanımı</h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                            Arama motorlarında indeksleme
                          </div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            Profilinizin arama motorlarında görünmesine izin verin
                          </div>
                        </div>
                        <Switch
                          checked={privacySettings.allowIndexing}
                          onCheckedChange={(checked) => handlePrivacyChange('allowIndexing', checked)}
                        />
                      </div>

                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                            Veri işleme ve analitik
                          </div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            Hizmet iyileştirme için verilerinizin analiz edilmesine izin verin
                          </div>
                        </div>
                        <Switch
                          checked={privacySettings.dataProcessing}
                          onCheckedChange={(checked) => handlePrivacyChange('dataProcessing', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Data Export */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Veri Yönetimi</h3>
                    <div className='flex flex-col sm:flex-row gap-3'>
                      <Button variant='outline' onClick={handleExportData} className='flex items-center gap-2'>
                        <Download className='h-4 w-4' />
                        Verilerimi İndir
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => setShowDeleteDialog(true)}
                        className='flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/20'
                      >
                        <Trash2 className='h-4 w-4' />
                        Hesabı Sil
                      </Button>
                    </div>
                    <p className='text-xs text-neutral-600 dark:text-neutral-400'>
                      Tüm kişisel verilerinizi JSON formatında indirebilir veya hesabınızı kalıcı olarak silebilirsiniz.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value='security' className='space-y-6'>
              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Key className='h-5 w-5' />
                    Güvenlik Ayarları
                  </CardTitle>
                  <CardDescription>Hesabınızın güvenliğini artırmak için ayarları yapılandırın</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Password Section */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Şifre ve Oturum</h3>
                    <div className='flex flex-col sm:flex-row gap-3'>
                      <Button
                        variant='outline'
                        onClick={() => setShowPasswordDialog(true)}
                        className='flex items-center gap-2'
                      >
                        <Lock className='h-4 w-4' />
                        Şifre Değiştir
                      </Button>
                      <Button variant='outline' className='flex items-center gap-2'>
                        <RefreshCw className='h-4 w-4' />
                        Tüm Oturumları Sonlandır
                      </Button>
                    </div>
                    <div className='text-xs text-neutral-600 dark:text-neutral-400 space-y-1'>
                      <p>• Son şifre değişikliği: 30 gün önce</p>
                      <p>• Aktif oturum sayısı: 3 cihaz</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Two-Factor Authentication */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>İki Faktörlü Doğrulama (2FA)</h3>
                    <div className='flex items-center justify-between py-2'>
                      <div className='space-y-1'>
                        <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>2FA Etkinleştir</div>
                        <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                          Hesabınız için ek güvenlik katmanı ekleyin
                        </div>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                      />
                    </div>
                    {securitySettings.twoFactorAuth && (
                      <div className='p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
                        <div className='flex items-center gap-2 text-green-800 dark:text-green-300'>
                          <Check className='h-4 w-4' />
                          <span className='text-sm font-medium'>2FA aktif</span>
                          <Badge variant='outline' className='text-xs'>
                            Google Authenticator ile yapılandırılmış
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Session Settings */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Oturum Ayarları</h3>
                    <div className='space-y-3'>
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
                          Otomatik oturum kapatma (dakika)
                        </label>
                        <Select
                          value={securitySettings.sessionTimeout.toString()}
                          onValueChange={(value) => handleSecurityChange('sessionTimeout', parseInt(value))}
                        >
                          <SelectTrigger className='w-full sm:w-[200px]'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='15'>15 dakika</SelectItem>
                            <SelectItem value='30'>30 dakika</SelectItem>
                            <SelectItem value='60'>1 saat</SelectItem>
                            <SelectItem value='120'>2 saat</SelectItem>
                            <SelectItem value='480'>8 saat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                            Giriş uyarıları
                          </div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            Yeni cihazdan giriş yapıldığında e-posta ile bildirim alın
                          </div>
                        </div>
                        <Switch
                          checked={securitySettings.loginAlerts}
                          onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}
                        />
                      </div>

                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>Cihaz takibi</div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            Giriş yapılan cihazları kaydet ve izle
                          </div>
                        </div>
                        <Switch
                          checked={securitySettings.deviceTracking}
                          onCheckedChange={(checked) => handleSecurityChange('deviceTracking', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Active Sessions */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Aktif Oturumlar</h3>
                    <div className='space-y-3'>
                      {[
                        {
                          device: 'Chrome - Windows',
                          location: 'İstanbul, Türkiye',
                          lastActive: '2 dakika önce',
                          current: true,
                        },
                        {
                          device: 'Safari - iPhone',
                          location: 'İstanbul, Türkiye',
                          lastActive: '1 saat önce',
                          current: false,
                        },
                        {
                          device: 'Firefox - Ubuntu',
                          location: 'Ankara, Türkiye',
                          lastActive: '2 gün önce',
                          current: false,
                        },
                      ].map((session, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-3 bg-neutral-50/50 dark:bg-neutral-800/50 rounded-lg'
                        >
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-white dark:bg-neutral-700 rounded-lg'>
                              <Smartphone className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                            </div>
                            <div>
                              <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50 flex items-center gap-2'>
                                {session.device}
                                {session.current && (
                                  <Badge variant='outline' className='text-xs'>
                                    Bu cihaz
                                  </Badge>
                                )}
                              </div>
                              <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                                {session.location} • {session.lastActive}
                              </div>
                            </div>
                          </div>
                          {!session.current && (
                            <Button variant='ghost' size='sm' className='text-red-600'>
                              <X className='h-4 w-4' />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value='appearance' className='space-y-6'>
              <Card className='bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm border-neutral-200/80 dark:border-neutral-700/50'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Palette className='h-5 w-5' />
                    Görünüm ve Tema
                  </CardTitle>
                  <CardDescription>Arayüz temasını ve dil tercihlerinizi özelleştirin</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Theme Selection */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Tema Seçimi</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      {[
                        {
                          value: 'light',
                          label: 'Açık Tema',
                          description: 'Klasik açık renk teması',
                          preview: 'bg-white border-2',
                        },
                        {
                          value: 'dark',
                          label: 'Koyu Tema',
                          description: 'Göz yormayan koyu tema',
                          preview: 'bg-neutral-900 border-2',
                        },
                      ].map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => setTheme(themeOption.value as 'light' | 'dark' | 'system')}
                          className={cn(
                            'p-4 rounded-lg border-2 text-left transition-all hover:shadow-md',
                            theme === themeOption.value
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                              : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
                          )}
                        >
                          <div className='space-y-3'>
                            <div className={cn('h-16 rounded-md', themeOption.preview)} />
                            <div>
                              <div className='font-medium text-neutral-900 dark:text-neutral-50'>
                                {themeOption.label}
                              </div>
                              <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                                {themeOption.description}
                              </div>
                            </div>
                            {theme === themeOption.value && (
                              <div className='flex items-center gap-1 text-primary-600 dark:text-primary-400'>
                                <Check className='h-4 w-4' />
                                <span className='text-xs font-medium'>Seçili</span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Language Selection */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Dil Tercihi</h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <button
                        onClick={() => changeLocale('tr')}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left transition-all hover:shadow-md',
                          currentLocale === 'tr'
                            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
                        )}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='text-2xl'>🇹🇷</div>
                          <div>
                            <div className='font-medium text-neutral-900 dark:text-neutral-50'>Türkçe</div>
                            <div className='text-xs text-neutral-600 dark:text-neutral-400'>Varsayılan dil</div>
                          </div>
                          {currentLocale === 'tr' && (
                            <Check className='h-4 w-4 text-primary-600 dark:text-primary-400 ml-auto' />
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => changeLocale('en')}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left transition-all hover:shadow-md',
                          currentLocale === 'en'
                            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
                        )}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='text-2xl'>🇺🇸</div>
                          <div>
                            <div className='font-medium text-neutral-900 dark:text-neutral-50'>English</div>
                            <div className='text-xs text-neutral-600 dark:text-neutral-400'>International language</div>
                          </div>
                          {currentLocale === 'en' && (
                            <Check className='h-4 w-4 text-primary-600 dark:text-primary-400 ml-auto' />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  <Separator />

                  {/* Display Settings */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-neutral-900 dark:text-neutral-50'>Görüntüleme Ayarları</h3>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>Kompakt mod</div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            Daha fazla içerik görmek için sıkıştırılmış görünüm
                          </div>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>

                      <div className='flex items-center justify-between py-2'>
                        <div className='space-y-1'>
                          <div className='text-sm font-medium text-neutral-900 dark:text-neutral-50'>
                            Animasyonları azalt
                          </div>
                          <div className='text-xs text-neutral-600 dark:text-neutral-400'>
                            Performans için animasyonları sınırla
                          </div>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className='max-w-md p-6'>
          <DialogHeader>
            <DialogTitle>Şifre Değiştir</DialogTitle>
            <DialogDescription>Hesabınızın güvenliği için güçlü bir şifre seçin.</DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Mevcut Şifre</label>
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder='Mevcut şifrenizi girin'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                >
                  {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Yeni Şifre</label>
              <Input
                type='password'
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                placeholder='Yeni şifrenizi girin'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Yeni Şifre (Tekrar)</label>
              <Input
                type='password'
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder='Yeni şifrenizi tekrar girin'
              />
            </div>

            <div className='text-xs text-neutral-600 dark:text-neutral-400 space-y-1'>
              <p>Şifreniz en az:</p>
              <ul className='list-disc list-inside space-y-1 ml-2'>
                <li>8 karakter uzunluğunda olmalı</li>
                <li>Büyük ve küçük harf içermeli</li>
                <li>En az bir rakam içermeli</li>
                <li>En az bir özel karakter içermeli</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setShowPasswordDialog(false)}>
              İptal
            </Button>
            <Button onClick={handlePasswordChange}>Şifreyi Değiştir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2 text-red-600'>
              <AlertTriangle className='h-5 w-5' />
              Hesabı Kalıcı Olarak Sil
            </AlertDialogTitle>
            <AlertDialogDescription className='space-y-2'>
              <p>
                Bu işlem <strong>geri alınamaz</strong>. Hesabınızı sildiğinizde:
              </p>
              <ul className='list-disc list-inside space-y-1 text-sm'>
                <li>Tüm kişisel verileriniz kalıcı olarak silinecek</li>
                <li>Profil bilgileriniz ve içerikleriniz kaldırılacak</li>
                <li>Bu hesapla ilişkili tüm abonelikler iptal edilecek</li>
                <li>Bu işlem geri alınamayacak</li>
              </ul>
              <p className='text-red-600 dark:text-red-400 font-medium'>Devam etmek istediğinizden emin misiniz?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className='bg-red-600 hover:bg-red-700 text-white'>
              Evet, Hesabı Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
