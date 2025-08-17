'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Badge } from '@/components/core/badge'
import { Alert, AlertDescription } from '@/components/core/alert'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { BarChart3, Calendar, Trash2, Eye, TrendingUp, FileText, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { atsApi } from '@/lib/api/api'
import { ATSAnalysesResponse, ATSAnalysesFilter } from '@/types/api.types'
import Link from 'next/link'

export default function ATSAnalysesPage() {
  const [analyses, setAnalyses] = useState<ATSAnalysesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ATSAnalysesFilter>({
    page: 1,
    limit: 10,
    type: undefined,
  })

  const fetchAnalyses = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await atsApi.getMyAnalyses(filters)
      setAnalyses(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analizler yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!confirm('Bu analizi silmek istediğinizden emin misiniz?')) return

    try {
      await atsApi.deleteAnalysis(analysisId)
      fetchAnalyses() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analiz silinirken bir hata oluştu')
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
    if (score >= 80)
      return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    if (score >= 60)
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  }

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case 'JOB_POSTING':
      case 'job_analysis':
        return 'İş İlanı Analizi'
      case 'MATCH_ANALYSIS':
      case 'match_analysis':
        return 'Uyum Analizi'
      case 'OPTIMIZATION':
      case 'optimization':
        return 'Optimizasyon'
      case 'COMPLETE_ANALYSIS':
      case 'complete_analysis':
        return 'Komple Analiz'
      default:
        return type
    }
  }

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-4xl font-bold text-foreground'>ATS Analizlerim</h1>
          <p className='text-xl text-muted-foreground'>Geçmiş analiz sonuçlarınızı görüntüleyin ve yönetin</p>
        </div>
        <div className='flex gap-3'>
          <Link href='/cv/ats/job-analysis'>
            <Button variant='outline'>
              <FileText className='w-4 h-4 mr-2' />
              Yeni Analiz
            </Button>
          </Link>
          <Link href='/cv/ats/complete-analysis'>
            <Button>
              <TrendingUp className='w-4 h-4 mr-2' />
              Hızlı Analiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Filter className='w-5 h-5' />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium'>Tip:</label>
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    type: value === 'all' ? undefined : (value as ATSAnalysesFilter['type']),
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className='w-48'>
                  <SelectValue placeholder='Tümü' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Tümü</SelectItem>
                  <SelectItem value='job_analysis'>İş İlanı Analizi</SelectItem>
                  <SelectItem value='match_analysis'>Uyum Analizi</SelectItem>
                  <SelectItem value='optimization'>Optimizasyon</SelectItem>
                  <SelectItem value='complete_analysis'>Komple Analiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium'>Sayfa başına:</label>
              <Select
                value={filters.limit?.toString() || '10'}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, limit: Number(value), page: 1 }))}
              >
                <SelectTrigger className='w-24'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>5</SelectItem>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='20'>20</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className='flex items-center justify-center py-12'>
            <LoadingSpinner size='lg' className='mr-3' />
            <span>Analizler yükleniyor...</span>
          </CardContent>
        </Card>
      )}

      {/* Analyses List */}
      {!isLoading && analyses && (
        <div className='space-y-6'>
          {analyses.data.analyses.length === 0 ? (
            <Card>
              <CardContent className='text-center py-12'>
                <BarChart3 className='w-16 h-16 mx-auto mb-4 text-muted-foreground' />
                <h3 className='text-lg font-semibold mb-2'>Henüz analiz yok</h3>
                <p className='text-muted-foreground mb-4'>
                  İlk ATS analizinizi oluşturmak için aşağıdaki butonları kullanın
                </p>
                <div className='flex gap-3 justify-center'>
                  <Link href='/cv/ats/job-analysis'>
                    <Button variant='outline'>İş İlanı Analizi</Button>
                  </Link>
                  <Link href='/cv/ats/complete-analysis'>
                    <Button>Hızlı Analiz</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Analyses Grid */}
              <div className='grid gap-4'>
                {analyses.data.analyses.map((analysis) => (
                  <Card key={analysis.id} className='hover:shadow-md transition-shadow'>
                    <CardContent className='p-6'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-3 mb-2'>
                            <Badge variant='outline' className='text-xs'>
                              {getAnalysisTypeLabel(analysis.type)}
                            </Badge>
                            {(analysis.analysisStatus || analysis.status) && (
                              <Badge
                                variant={
                                  (analysis.analysisStatus || analysis.status) === 'COMPLETED' ? 'default' : 'secondary'
                                }
                                className='text-xs'
                              >
                                {analysis.analysisStatus || analysis.status}
                              </Badge>
                            )}
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                              <Calendar className='w-3 h-3' />
                              {formatDate(analysis.createdAt)}
                            </div>
                          </div>

                          <h3 className='font-semibold text-lg mb-1 truncate'>
                            {analysis.name || analysis.jobTitle || analysis.positionTitle || 'İsimsiz Analiz'}
                          </h3>

                          {analysis.companyName && (
                            <p className='text-muted-foreground text-sm mb-2'>{analysis.companyName}</p>
                          )}

                          {analysis.overallScore !== undefined && (
                            <div className='flex items-center gap-3'>
                              <span className='text-sm font-medium'>Uyum Skoru:</span>
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(analysis.overallScore)}`}
                              >
                                %{analysis.overallScore}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className='flex items-center gap-2 ml-4'>
                          <Link href={`/cv/ats/analyses/${analysis.id}`}>
                            <Button variant='outline' size='sm'>
                              <Eye className='w-4 h-4 mr-1' />
                              Görüntüle
                            </Button>
                          </Link>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDeleteAnalysis(analysis.id)}
                            className='text-destructive hover:text-destructive'
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {analyses.data.pagination && analyses.data.pagination.totalPages > 1 && (
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-muted-foreground'>
                    {analyses.data.pagination.total} analizden{' '}
                    {(analyses.data.pagination.page - 1) * analyses.data.pagination.limit + 1} -{' '}
                    {Math.min(
                      analyses.data.pagination.page * analyses.data.pagination.limit,
                      analyses.data.pagination.total,
                    )}{' '}
                    arası gösteriliyor
                  </p>

                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! - 1 }))}
                      disabled={analyses.data.pagination.page <= 1}
                    >
                      <ChevronLeft className='w-4 h-4 mr-1' />
                      Önceki
                    </Button>

                    <span className='text-sm px-3 py-1 border dark:border-border rounded bg-background dark:bg-background'>
                      {analyses.data.pagination.page} / {analyses.data.pagination.totalPages}
                    </span>

                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setFilters((prev) => ({ ...prev, page: prev.page! + 1 }))}
                      disabled={analyses.data.pagination.page >= analyses.data.pagination.totalPages}
                    >
                      Sonraki
                      <ChevronRight className='w-4 h-4 ml-1' />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Stats Cards */}
      {analyses && analyses.data.summary && (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Card className='border-dashed'>
            <CardContent className='p-4 text-center'>
              <div className='text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1'>
                {analyses.data.summary.jobAnalyses}
              </div>
              <div className='text-sm text-muted-foreground'>İş İlanı Analizi</div>
            </CardContent>
          </Card>

          <Card className='border-dashed'>
            <CardContent className='p-4 text-center'>
              <div className='text-2xl font-bold text-green-600 dark:text-green-400 mb-1'>
                {analyses.data.summary.matchAnalyses}
              </div>
              <div className='text-sm text-muted-foreground'>Uyum Analizi</div>
            </CardContent>
          </Card>

          <Card className='border-dashed'>
            <CardContent className='p-4 text-center'>
              <div className='text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1'>
                {analyses.data.summary.optimizations}
              </div>
              <div className='text-sm text-muted-foreground'>Optimizasyon</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
