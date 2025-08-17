'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Badge } from '@/components/core/badge'
import { Alert, AlertDescription } from '@/components/core/alert'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Progress } from '@/components/core/progress'
import {
  BarChart3,
  Calendar,
  ArrowLeft,
  Download,
  Share,
  TrendingUp,
  FileText,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { atsApi, userProfileApi } from '@/lib/api/api'
import { ATSJobPostingAnalysisResponse } from '@/types/api.types'
import { useToast } from '@/store/toastStore'

export default function AnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<ATSJobPostingAnalysisResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllRequiredSkills, setShowAllRequiredSkills] = useState(false)
  const [showAllPreferredSkills, setShowAllPreferredSkills] = useState(false)
  const [showAllAtsKeywords, setShowAllAtsKeywords] = useState(false)
  const [isApplyingToProfile, setIsApplyingToProfile] = useState(false)
  const toast = useToast()

  const analysisId = params.id as string

  const fetchAnalysis = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await atsApi.getAnalysis(analysisId)
      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analiz yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [analysisId])

  useEffect(() => {
    if (analysisId) {
      fetchAnalysis()
    }
  }, [analysisId, fetchAnalysis])

  const handleShare = async () => {
    const shareUrl = window.location.href

    if (navigator.share) {
      // Web Share API destekleniyor (mobil cihazlar)
      try {
        await navigator.share({
          title: `${analysis?.data.positionTitle || 'ATS Analizi'} - İş İlanı Analizi`,
          text: `${analysis?.data.companyName || ''} şirketindeki ${analysis?.data.positionTitle || ''} pozisyonu için ATS analizi sonuçları`,
          url: shareUrl,
        })
      } catch {
        // Kullanıcı paylaşımı iptal etti
      }
    } else {
      // Web Share API desteklenmiyor, URL'yi panoya kopyala
      try {
        await navigator.clipboard.writeText(shareUrl)
        alert('Analiz linki panoya kopyalandı!')
      } catch {
        // Fallback: prompt ile göster
        prompt('Analiz linkini kopyalayın:', shareUrl)
      }
    }
  }

  const handleDownload = async () => {
    if (!analysis) return

    try {
      // HTML2Canvas + jsPDF ile Türkçe karakter desteği
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      // Geçici HTML element oluştur
      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 800px;
        padding: 40px;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
      `

      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #2563eb;">
            ATS İş İlanı Analizi Raporu
          </h1>
        </div>
        
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            Analiz Bilgileri
          </h2>
          ${analysis.data.positionTitle ? `<p style="margin: 8px 0;"><strong>Pozisyon:</strong> ${analysis.data.positionTitle}</p>` : ''}
          ${analysis.data.companyName ? `<p style="margin: 8px 0;"><strong>Şirket:</strong> ${analysis.data.companyName}</p>` : ''}
          ${analysis.data.industryType ? `<p style="margin: 8px 0;"><strong>Sektör:</strong> ${analysis.data.industryType}</p>` : ''}
          ${analysis.data.seniorityLevel ? `<p style="margin: 8px 0;"><strong>Deneyim Seviyesi:</strong> ${analysis.data.seniorityLevel}</p>` : ''}
          <p style="margin: 8px 0;"><strong>Analiz Tarihi:</strong> ${formatDate(analysis.data.createdAt)}</p>
        </div>

        ${
          analysis.data.requiredSkills && analysis.data.requiredSkills.length > 0
            ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
              Gerekli Beceriler
            </h2>
            <p style="font-size: 14px; line-height: 1.6;">${analysis.data.requiredSkills.join(', ')}</p>
          </div>
        `
            : ''
        }

        ${
          analysis.data.preferredSkills && analysis.data.preferredSkills.length > 0
            ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
              Tercih Edilen Beceriler
            </h2>
            <p style="font-size: 14px; line-height: 1.6;">${analysis.data.preferredSkills.join(', ')}</p>
          </div>
        `
            : ''
        }

        ${
          analysis.data.atsKeywords && analysis.data.atsKeywords.length > 0
            ? `
          <div style="margin-bottom: 25px;">
            <h2 style="font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
              ATS Anahtar Kelimeler
            </h2>
            <p style="font-size: 14px; line-height: 1.6;">${analysis.data.atsKeywords.join(', ')}</p>
          </div>
        `
            : ''
        }

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Talent Architect ATS - talent-architect.com</p>
          <p>${new Date().toLocaleDateString('tr-TR')}</p>
        </div>
      `

      document.body.appendChild(tempDiv)

      // Canvas'a çevir
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      })

      // Geçici elementi kaldır
      document.body.removeChild(tempDiv)

      // PDF oluştur
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const imgWidth = 210 // A4 genişliği
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

      // PDF'i indir
      const fileName =
        `${analysis.data.positionTitle || 'analiz'}_${analysis.data.companyName || ''}_raporu.pdf`.replace(
          /[^a-zA-Z0-9çğıöşüÇĞIİÖŞÜ._-]/g,
          '_',
        )

      pdf.save(fileName)
    } catch (error) {
      console.error('PDF oluşturulurken hata:', error)
      alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  const handleApplyToProfile = async () => {
    if (!analysis) return

    setIsApplyingToProfile(true)
    try {
      // Extract skills from the analysis to apply to user profile
      const skillsToAdd = [
        ...(analysis.data.requiredSkills || []),
        ...(analysis.data.preferredSkills || []),
        ...(analysis.data.atsKeywords || []),
      ].filter((skill, index, array) => array.indexOf(skill) === index) // Remove duplicates

      if (skillsToAdd.length === 0) {
        toast.info('Profilinize eklenecek beceri bulunamadı')
        return
      }

      // Categorize skills based on common patterns
      const categorizeSkill = (
        skillName: string,
      ): 'TECHNICAL' | 'SOFT_SKILL' | 'LANGUAGE' | 'TOOL' | 'FRAMEWORK' | 'OTHER' => {
        const lowerSkill = skillName.toLowerCase()
        if (
          lowerSkill.includes('react') ||
          lowerSkill.includes('vue') ||
          lowerSkill.includes('angular') ||
          lowerSkill.includes('next') ||
          lowerSkill.includes('framework')
        ) {
          return 'FRAMEWORK'
        }
        if (
          lowerSkill.includes('javascript') ||
          lowerSkill.includes('typescript') ||
          lowerSkill.includes('python') ||
          lowerSkill.includes('java') ||
          lowerSkill.includes('programming')
        ) {
          return 'TECHNICAL'
        }
        if (
          lowerSkill.includes('communication') ||
          lowerSkill.includes('leadership') ||
          lowerSkill.includes('teamwork') ||
          lowerSkill.includes('problem solving') ||
          lowerSkill.includes('management')
        ) {
          return 'SOFT_SKILL'
        }
        if (
          lowerSkill.includes('git') ||
          lowerSkill.includes('docker') ||
          lowerSkill.includes('tool') ||
          lowerSkill.includes('ide') ||
          lowerSkill.includes('editor')
        ) {
          return 'TOOL'
        }
        return 'OTHER'
      }

      // Prepare skills array for bulk addition
      const skillsData = skillsToAdd.map((skillName) => ({
        name: skillName,
        category: categorizeSkill(skillName),
        level: 'INTERMEDIATE' as const, // Default level
      }))

      // Add skills to profile using bulk API call
      const response = await userProfileApi.skill.add({
        skills: skillsData,
      })

      if (response.success) {
        toast.success(`${skillsToAdd.length} beceri başarıyla profilinize eklendi!`)
      } else {
        toast.warning('Bazı beceriler eklenirken sorun oluştu')
      }
    } catch (error: unknown) {
      console.error('Profil güncellenirken hata:', error)
      const errorResponse = error as { response?: { status?: number; data?: { message?: string } }; message?: string }

      if (errorResponse?.response?.status === 409) {
        toast.info('Bazı beceriler zaten profilinizde mevcut')
      } else if (errorResponse?.response?.data?.message) {
        toast.error(errorResponse.response.data.message)
      } else {
        toast.error('Profil güncellenirken bir hata oluştu')
      }
    } finally {
      setIsApplyingToProfile(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className='w-5 h-5 text-green-500 dark:text-green-400' />
      case 'PROCESSING':
        return <Clock className='w-5 h-5 text-blue-500 dark:text-blue-400' />
      case 'FAILED':
        return <XCircle className='w-5 h-5 text-red-500 dark:text-red-400' />
      default:
        return <AlertTriangle className='w-5 h-5 text-yellow-500 dark:text-yellow-400' />
    }
  }

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case 'JOB_POSTING':
        return 'İş İlanı Analizi'
      case 'MATCH_ANALYSIS':
        return 'Uyum Analizi'
      case 'OPTIMIZATION':
        return 'Optimizasyon'
      case 'COMPLETE_ANALYSIS':
        return 'Komple Analiz'
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto p-6'>
        <Card>
          <CardContent className='flex items-center justify-center py-12'>
            <LoadingSpinner size='lg' className='mr-3' />
            <span>Analiz detayları yükleniyor...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className='container mx-auto p-6 space-y-6'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' onClick={() => router.back()}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Geri
          </Button>
        </div>

        <Alert variant='destructive'>
          <AlertDescription>{error || 'Analiz bulunamadı veya erişim izniniz yok.'}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='ghost' onClick={() => router.back()}>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Geri
          </Button>
          <div>
            <h1 className='text-3xl font-bold text-foreground'>{analysis.data.positionTitle || 'Analiz Detayı'}</h1>
            <p className='text-muted-foreground'>
              {analysis.data.companyName && `${analysis.data.companyName} • `}
              {formatDate(analysis.data.createdAt)}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Button variant='outline' size='sm' onClick={handleShare}>
            <Share className='w-4 h-4 mr-2' />
            Paylaş
          </Button>
          <Button variant='outline' size='sm' onClick={handleDownload}>
            <Download className='w-4 h-4 mr-2' />
            İndir
          </Button>
        </div>
      </div>

      {/* Analysis Overview */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6 text-center'>
            <div className='flex items-center justify-center mb-4'>
              {getStatusIcon(analysis.data.analysisStatus || 'COMPLETED')}
            </div>
            <h3 className='font-semibold mb-2'>Durum</h3>
            <Badge variant='outline'>{analysis.data.analysisStatus || 'COMPLETED'}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6 text-center'>
            <BarChart3 className='w-12 h-12 mx-auto mb-4 text-blue-500 dark:text-blue-400' />
            <h3 className='font-semibold mb-2'>Analiz Tipi</h3>
            <div className='text-sm text-muted-foreground'>{getAnalysisTypeLabel('JOB_POSTING')}</div>
          </CardContent>
        </Card>

        {false && (
          <Card>
            <CardContent className='p-6 text-center'>
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(0)}`}>%{0}</div>
              <h3 className='font-semibold mb-2'>Uyum Skoru</h3>
              <Progress value={0} className='h-2' />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className='p-6 text-center'>
            <Calendar className='w-12 h-12 mx-auto mb-4 text-purple-500 dark:text-purple-400' />
            <h3 className='font-semibold mb-2'>Oluşturulma</h3>
            <div className='text-sm text-muted-foreground'>{formatDate(analysis.data.createdAt)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Job Analysis Details */}
      {analysis.data && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building className='w-5 h-5' />
              İş İlanı Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <h3 className='font-medium text-sm text-muted-foreground mb-1'>Pozisyon</h3>
                  <p className='font-semibold'>{analysis.data.positionTitle}</p>
                </div>

                <div>
                  <h3 className='font-medium text-sm text-muted-foreground mb-1'>Şirket</h3>
                  <p>{analysis.data.companyName}</p>
                </div>

                <div>
                  <h3 className='font-medium text-sm text-muted-foreground mb-1'>Sektör</h3>
                  <p>{analysis.data.industryType}</p>
                </div>

                <div>
                  <h3 className='font-medium text-sm text-muted-foreground mb-1'>Deneyim Seviyesi</h3>
                  <Badge variant='outline'>{analysis.data.seniorityLevel}</Badge>
                </div>
              </div>

              <div className='space-y-4'>
                {/* Required Skills */}
                {analysis.data.requiredSkills && (
                  <div>
                    <h3 className='font-medium text-sm text-muted-foreground mb-2'>Gerekli Beceriler</h3>
                    <div className='flex flex-wrap gap-2'>
                      {(showAllRequiredSkills
                        ? analysis.data.requiredSkills
                        : analysis.data.requiredSkills.slice(0, 8)
                      ).map((skill: string, index: number) => (
                        <Badge key={index} variant='default' className='text-xs'>
                          {skill}
                        </Badge>
                      ))}
                      {analysis.data.requiredSkills.length > 8 && !showAllRequiredSkills && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllRequiredSkills(true)}
                        >
                          +{analysis.data.requiredSkills.length - 8} daha
                        </Badge>
                      )}
                      {showAllRequiredSkills && analysis.data.requiredSkills.length > 8 && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllRequiredSkills(false)}
                        >
                          Daha az göster
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Preferred Skills */}
                {analysis.data.preferredSkills && (
                  <div>
                    <h3 className='font-medium text-sm text-muted-foreground mb-2'>Tercih Edilen Beceriler</h3>
                    <div className='flex flex-wrap gap-2'>
                      {(showAllPreferredSkills
                        ? analysis.data.preferredSkills
                        : analysis.data.preferredSkills.slice(0, 6)
                      ).map((skill: string, index: number) => (
                        <Badge key={index} variant='secondary' className='text-xs'>
                          {skill}
                        </Badge>
                      ))}
                      {analysis.data.preferredSkills.length > 6 && !showAllPreferredSkills && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllPreferredSkills(true)}
                        >
                          +{analysis.data.preferredSkills.length - 6} daha
                        </Badge>
                      )}
                      {showAllPreferredSkills && analysis.data.preferredSkills.length > 6 && (
                        <Badge
                          variant='outline'
                          className='text-xs cursor-pointer hover:bg-muted'
                          onClick={() => setShowAllPreferredSkills(false)}
                        >
                          Daha az göster
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ATS Keywords */}
            {analysis.data.atsKeywords && (
              <div>
                <h3 className='font-medium text-sm text-muted-foreground mb-2'>ATS Anahtar Kelimeler</h3>
                <div className='flex flex-wrap gap-2'>
                  {(showAllAtsKeywords ? analysis.data.atsKeywords : analysis.data.atsKeywords.slice(0, 12)).map(
                    (keyword: string, index: number) => (
                      <Badge key={index} variant='outline' className='text-xs'>
                        {keyword}
                      </Badge>
                    ),
                  )}
                  {analysis.data.atsKeywords.length > 12 && !showAllAtsKeywords && (
                    <Badge
                      variant='outline'
                      className='text-xs cursor-pointer hover:bg-muted'
                      onClick={() => setShowAllAtsKeywords(true)}
                    >
                      +{analysis.data.atsKeywords.length - 12} daha
                    </Badge>
                  )}
                  {showAllAtsKeywords && analysis.data.atsKeywords.length > 12 && (
                    <Badge
                      variant='outline'
                      className='text-xs cursor-pointer hover:bg-muted'
                      onClick={() => setShowAllAtsKeywords(false)}
                    >
                      Daha az göster
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Optimization Details */}
      {false && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <TrendingUp className='w-5 h-5' />
              Optimizasyon Önerileri
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
              <h3 className='font-semibold text-green-800 dark:text-green-300 mb-3'>Önerilen İyileştirmeler</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <h4 className='font-medium mb-2'>Anahtar Kelime Önerileri</h4>
                  <div className='flex flex-wrap gap-2'>
                    {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes'].map((keyword) => (
                      <Badge key={keyword} variant='secondary' className='text-xs'>
                        +{keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className='font-medium mb-2'>İyileştirme Alanları</h4>
                  <div className='text-sm text-muted-foreground space-y-1'>
                    <div>• Teknik beceriler daha detaylı vurgulanacak</div>
                    <div>• Proje deneyimleri somut örneklerle güçlendirilecek</div>
                    <div>• ATS dostu anahtar kelimeler eklenecek</div>
                    <div>• İş deneyimi tanımları optimize edilecek</div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-between p-4 border rounded-lg'>
              <div>
                <h3 className='font-medium mb-1'>Beklenen İyileşme</h3>
                <p className='text-sm text-muted-foreground'>
                  Bu öneriler uygulandığında uyum skorunuzun artması bekleniyor
                </p>
              </div>
              <div className='text-right'>
                <div className='text-2xl font-bold text-green-600 dark:text-green-400'>+15%</div>
                <div className='text-sm text-muted-foreground'>Tahmini artış</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
              <h3 className='font-medium mb-2'>Sonraki Adımlar</h3>
              <p className='text-sm text-muted-foreground'>
                Bu analiz sonuçlarını kullanarak CV'nizi iyileştirebilir veya yeni analizler yapabilirsiniz
              </p>
            </div>
            <div className='flex gap-3'>
              <Button variant='outline'>
                <FileText className='w-4 h-4 mr-2' />
                Yeni Analiz
              </Button>
              <Button onClick={handleApplyToProfile} disabled={isApplyingToProfile}>
                <User className='w-4 h-4 mr-2' />
                {isApplyingToProfile ? 'Uygulanıyor...' : 'Profile Uygula'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
