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
          <div className='w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center'>
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
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
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
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
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

        {/* ATS Validation Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-muted/20 opacity-75'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center'>
                <BarChart3 className='w-6 h-6 text-muted-foreground' />
              </div>
              <div>
                <CardTitle className='text-xl text-muted-foreground'>ATS Analizi</CardTitle>
                <CardDescription>CV'nizi analiz edin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                <span>ATS uyumluluk skoru</span>
              </div>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                <span>Anahtar kelime analizi</span>
              </div>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                <span>İyileştirme önerileri</span>
              </div>
            </div>
            <Button className='w-full' disabled>
              Yakında
            </Button>
          </CardContent>
        </Card>

        {/* CV Optimization Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-muted/20 opacity-75'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center'>
                <Zap className='w-6 h-6 text-muted-foreground' />
              </div>
              <div>
                <CardTitle className='text-xl text-muted-foreground'>Optimizasyon</CardTitle>
                <CardDescription>CV'nizi optimize edin</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                <span>İş ilanına özel optimizasyon</span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                <span>Anahtar kelime önerileri</span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4' />
                <span>Eşleşme yüzdesi artırma</span>
              </div>
            </div>
            <Button className='w-full' disabled>
              Yakında
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
