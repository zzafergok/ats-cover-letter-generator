'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Zap, Settings, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'

export default function CoverLetterPage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-foreground'>Ön Yazı Oluşturucu</h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          CV'nizden yararlanarak profesyonel ön yazılar oluşturun ve iş başvurularınızda öne çıkın
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Basic Cover Letter Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                <Zap className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>Temel Ön Yazı</CardTitle>
                <CardDescription>Hızlı ve basit ön yazı oluşturun</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <FileText className='w-4 h-4' />
                <span>CV'nizden otomatik bilgi çekme</span>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                <span>İş ilanına uygun özelleştirme</span>
              </div>
              <div className='flex items-center gap-2'>
                <Settings className='w-4 h-4' />
                <span>Türkçe ve İngilizce dil desteği</span>
              </div>
            </div>
            <Link href='/cover-letter/basic' className='block'>
              <Button className='w-full'>Temel Ön Yazı Oluştur</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Template Cover Letter Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                <FileText className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>Şablon Ön Yazı</CardTitle>
                <CardDescription>Hazır şablonlarla ön yazı oluşturun</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <FileText className='w-4 h-4' />
                <span>Teknoloji ve Finans sektör şablonları</span>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                <span>Türkçe ve İngilizce dil seçenekleri</span>
              </div>
              <div className='flex items-center gap-2'>
                <Settings className='w-4 h-4' />
                <span>Kolay filtreleme ve arama</span>
              </div>
            </div>
            <Link href='/cover-letter/template' className='block'>
              <Button className='w-full'>Şablon Tabanlı Ön Yazı Oluştur</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Detailed Cover Letter Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                <Settings className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>Detaylı Ön Yazı</CardTitle>
                <CardDescription>Kapsamlı ve özelleştirilmiş ön yazı</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <FileText className='w-4 h-4' />
                <span>Detaylı kişiselleştirme</span>
              </div>
              <div className='flex items-center gap-2'>
                <Mail className='w-4 h-4' />
                <span>Şirket ve pozisyon motivasyonu</span>
              </div>
              <div className='flex items-center gap-2'>
                <Settings className='w-4 h-4' />
                <span>Kapsamlı form alanları</span>
              </div>
            </div>
            <Link href='/cover-letter/detailed' className='block'>
              <Button className='w-full'>Detaylı Ön Yazı Oluştur</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
