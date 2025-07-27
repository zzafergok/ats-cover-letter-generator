/* eslint-disable react/no-unescaped-entities */
'use client'

import React from 'react'
import Link from 'next/link'
import { FileUser, Bot, Zap, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'

export default function CVPage() {
  return (
    <div className='container mx-auto p-6 space-y-8'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold text-foreground'>CV Oluşturucu</h1>
        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
          ATS uyumlu ve profesyonel CV'ler oluşturun, iş başvurularınızda öne çıkın
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* ATS Optimized CV Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                <Bot className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>ATS Uyumlu CV</CardTitle>
                <CardDescription>Başvuru takip sistemlerine uygun CV</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <FileUser className='w-4 h-4' />
                <span>ATS tarama sistemleri için optimize</span>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='w-4 h-4' />
                <span>Anahtar kelime optimizasyonu</span>
              </div>
              <div className='flex items-center gap-2'>
                <Settings className='w-4 h-4' />
                <span>İş ilanına uygun özelleştirme</span>
              </div>
            </div>
            <Link href='/cv/ats' className='block'>
              <Button className='w-full'>ATS CV Oluştur</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Creative CV Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                <FileUser className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>Yaratıcı CV</CardTitle>
                <CardDescription>Görsel ve etkileyici tasarım</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <FileUser className='w-4 h-4' />
                <span>Tasarım odaklı sektörler için</span>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='w-4 h-4' />
                <span>Görsel portfolyo desteği</span>
              </div>
              <div className='flex items-center gap-2'>
                <Settings className='w-4 h-4' />
                <span>Yaratıcı düzen seçenekleri</span>
              </div>
            </div>
            <Button className='w-full' variant='outline' disabled>
              Yakında
            </Button>
          </CardContent>
        </Card>

        {/* Technical CV Card */}
        <Card className='hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/20'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center'>
                <Settings className='w-6 h-6 text-primary' />
              </div>
              <div>
                <CardTitle className='text-xl'>Teknik CV</CardTitle>
                <CardDescription>Teknik pozisyonlar için detaylı CV</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2 text-sm text-muted-foreground'>
              <div className='flex items-center gap-2'>
                <FileUser className='w-4 h-4' />
                <span>Teknik beceri odaklı</span>
              </div>
              <div className='flex items-center gap-2'>
                <Zap className='w-4 h-4' />
                <span>Proje ve teknoloji detayları</span>
              </div>
              <div className='flex items-center gap-2'>
                <Settings className='w-4 h-4' />
                <span>Gelişmiş formatlar</span>
              </div>
            </div>
            <Button className='w-full' variant='outline' disabled>
              Yakında
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
