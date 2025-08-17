'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Bot, Upload, FileText, BarChart3, Zap, CheckCircle, Target, TrendingUp } from 'lucide-react'

export default function ATSCVPage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <div className='w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
            <Bot className='w-8 h-8 text-primary' />
          </div>
          <div>
            <h1 className='text-4xl font-bold text-foreground'>ATS Uyumlu CV</h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Başvuru takip sistemleri için optimize edilmiş profesyonel CV oluşturun ve iş başvurularınızda öne çıkın
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* CV Upload Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
                <Upload className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>CV Yükle</CardTitle>
                <CardDescription>Mevcut CV'nizi yükleyin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>PDF ve Word formatı desteği</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>Otomatik bilgi çıkarma</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>Güvenli dosya işleme</span>
              </div>
            </div>
            <Link href='/cv/ats/upload' className='block'>
              <Button className='w-full'>CV Yükle</Button>
            </Link>
          </CardContent>
        </Card>

        {/* CV Generate Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
                <FileText className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>CV Oluştur</CardTitle>
                <CardDescription>ATS uyumlu CV oluşturun</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>Profil bilgilerinden otomatik doldurma</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>ATS dostu formatlar</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>PDF çıktı alabilme</span>
              </div>
            </div>
            <Link href='/cv/ats/generate' className='block'>
              <Button className='w-full'>CV Oluştur</Button>
            </Link>
          </CardContent>
        </Card>

        {/* ATS Job Analysis Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center'>
                <BarChart3 className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>İş İlanı Analizi</CardTitle>
                <CardDescription>İş ilanını analiz edin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                <span>Anahtar kelime çıkarma</span>
              </div>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                <span>Gerekli becerileri tespit</span>
              </div>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                <span>ATS optimizasyon hazırlığı</span>
              </div>
            </div>
            <Link href='/cv/ats/job-analysis' className='block'>
              <Button className='w-full'>İş İlanı Analizi</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick ATS Analysis Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-600/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center'>
                <Zap className='w-6 h-6 text-green-600 dark:text-green-400' />
              </div>
              <div>
                <CardTitle className='text-xl text-green-800 dark:text-green-300'>Hızlı ATS Analizi</CardTitle>
                <CardDescription className='text-green-700 dark:text-green-400'>
                  Tek adımda komple analiz
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-green-700 dark:text-green-400'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                <span>İş ilanı + CV uyum analizi</span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                <span>Otomatik optimizasyon önerileri</span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                <span>Profile direkt uygulama</span>
              </div>
            </div>
            <Link href='/cv/ats/complete-analysis' className='block'>
              <Button className='w-full bg-green-600 hover:bg-green-700'>
                <Zap className='w-4 h-4 mr-2' />
                Hızlı Analiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className='grid grid-cols-1 md:grid-cols-1 gap-6 mt-8'>
        {/* My Analyses Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-600/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center'>
                <BarChart3 className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              </div>
              <div>
                <CardTitle className='text-xl text-blue-800 dark:text-blue-300'>Analizlerim</CardTitle>
                <CardDescription className='text-blue-700 dark:text-blue-400'>
                  Geçmiş analiz sonuçlarınızı görün
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-blue-700 dark:text-blue-400'>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>Tüm analiz geçmişi</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>Detaylı sonuçlar</span>
              </div>
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4' />
                <span>İstatistikler ve trendler</span>
              </div>
            </div>
            <Link href='/cv/ats/analyses' className='block'>
              <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                <BarChart3 className='w-4 h-4 mr-2' />
                Analizlerime Git
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
