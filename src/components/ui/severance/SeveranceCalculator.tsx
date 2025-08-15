'use client'

import React, { useState } from 'react'
import {
  Calculator,
  Calendar,
  CreditCard,
  Receipt,
  TrendingUp,
  AlertCircle,
  Building2,
  Info,
  Users,
  Clock,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/core/select'
import { Alert } from '@/components/core/alert'
import { formatNumberInput, parseFormattedNumber } from '@/lib/utils'
import { calculateSeveranceCompensation } from '@/lib/severance-calculator'
import { SeveranceFormData, SeveranceCalculationData } from '@/types/severance.types'

export function SeveranceCalculator() {
  // State
  const [formData, setFormData] = useState<SeveranceFormData>({
    workStartDay: 1,
    workStartMonth: 1,
    workStartYear: 2020,
    workEndDay: new Date().getDate(),
    workEndMonth: new Date().getMonth() + 1,
    workEndYear: new Date().getFullYear(),
    monthlyGrossSalary: '',
    cumulativeTaxBase: '',
    calculationBasisDays: 30,
  })

  const [displaySalary, setDisplaySalary] = useState('')
  const [displayTaxBase, setDisplayTaxBase] = useState('')
  const [result, setResult] = useState<SeveranceCalculationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Handle amount input changes
  const handleSalaryChange = (value: string) => {
    const rawValue = parseFormattedNumber(value)
    setFormData((prev) => ({ ...prev, monthlyGrossSalary: rawValue }))
    setDisplaySalary(rawValue ? formatNumberInput(rawValue) : '')
  }

  const handleTaxBaseChange = (value: string) => {
    const rawValue = parseFormattedNumber(value)
    setFormData((prev) => ({ ...prev, cumulativeTaxBase: rawValue }))
    setDisplayTaxBase(rawValue ? formatNumberInput(rawValue) : '')
  }

  // Generate day/month/year options
  const getDayOptions = () => Array.from({ length: 31 }, (_, i) => i + 1)
  const _getMonthOptions = () => Array.from({ length: 12 }, (_, i) => i + 1)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 50 }, (_, i) => currentYear - i)
  }

  const monthNames = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ]

  // Handle calculation
  const handleCalculate = () => {
    if (!formData.monthlyGrossSalary || parseFloat(formData.monthlyGrossSalary) <= 0) {
      setError('Lütfen geçerli bir maaş tutarı girin')
      return
    }

    try {
      setError(null)
      const calculationResult = calculateSeveranceCompensation(formData)
      setResult(calculationResult)
    } catch (error) {
      console.error('Calculation error:', error)
      setError('Hesaplama sırasında hata oluştu')
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <Building2 className='h-10 w-10 text-primary' />
          <h1 className='text-4xl font-bold'>Kıdem ve İhbar Tazminatı Hesaplama</h1>
        </div>
        <p className='text-muted-foreground text-lg'>2025 Yılı Güncel Vergi Oranları ve Yasal Düzenlemeler</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className='bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'>
          <AlertCircle className='h-4 w-4 text-red-600 dark:text-red-400' />
          <div className='text-red-800 dark:text-red-200'>{error}</div>
        </Alert>
      )}

      {/* Main Calculation Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calculator className='h-6 w-6' />
            Hesaplama Bilgileri
          </CardTitle>
          <CardDescription>İş başlama tarihi, ayrılma tarihi ve maaş bilgilerini girin</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* İş Başlama Tarihi */}
          <div className='space-y-3'>
            <Label className='text-base font-medium flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              İşe Başlama Tarihi
            </Label>
            <div className='grid grid-cols-3 gap-3'>
              <div>
                <Label htmlFor='start-day' className='text-sm'>
                  Gün
                </Label>
                <Select
                  value={formData.workStartDay.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, workStartDay: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getDayOptions().map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='start-month' className='text-sm'>
                  Ay
                </Label>
                <Select
                  value={formData.workStartMonth.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, workStartMonth: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='start-year' className='text-sm'>
                  Yıl
                </Label>
                <Select
                  value={formData.workStartYear.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, workStartYear: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearOptions().map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* İşten Ayrılma Tarihi */}
          <div className='space-y-3'>
            <Label className='text-base font-medium flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              İşten Ayrılma Tarihi
            </Label>
            <div className='grid grid-cols-3 gap-3'>
              <div>
                <Label htmlFor='end-day' className='text-sm'>
                  Gün
                </Label>
                <Select
                  value={formData.workEndDay.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, workEndDay: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getDayOptions().map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='end-month' className='text-sm'>
                  Ay
                </Label>
                <Select
                  value={formData.workEndMonth.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, workEndMonth: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor='end-year' className='text-sm'>
                  Yıl
                </Label>
                <Select
                  value={formData.workEndYear.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, workEndYear: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getYearOptions().map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Maaş Bilgileri */}
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-3'>
              <Label htmlFor='salary' className='text-base font-medium'>
                Aylık Brüt Maaş (TL)
              </Label>
              <Input
                id='salary'
                type='text'
                value={displaySalary}
                onChange={(e) => handleSalaryChange(e.target.value)}
                placeholder='Örn: 50.000'
                className='h-12 text-lg'
              />
            </div>
            <div className='space-y-3'>
              <Label htmlFor='tax-base' className='text-base font-medium'>
                Kümülatif Vergi Matrahı (TL)
              </Label>
              <Input
                id='tax-base'
                type='text'
                value={displayTaxBase}
                onChange={(e) => handleTaxBaseChange(e.target.value)}
                placeholder='Örn: 600.000'
                className='h-12 text-lg'
              />
              <p className='text-sm text-muted-foreground'>Yıl başından bu aya kadar toplam vergi matrahı</p>
            </div>
          </div>

          {/* Hesaplama Parametresi */}
          <div className='space-y-3'>
            <Label className='text-base font-medium flex items-center gap-2'>
              <Clock className='h-4 w-4' />
              Hesaplamaya Esas Gün Sayısı
            </Label>
            <Select
              value={formData.calculationBasisDays.toString()}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, calculationBasisDays: parseInt(value) }))}
            >
              <SelectTrigger className='w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='30'>30 Gün (Varsayılan)</SelectItem>
                <SelectItem value='31'>31 Gün</SelectItem>
                <SelectItem value='29'>29 Gün</SelectItem>
                <SelectItem value='28'>28 Gün</SelectItem>
              </SelectContent>
            </Select>
            <p className='text-sm text-muted-foreground'>Günlük ücret hesaplamak için kullanılır</p>
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculate} className='w-full h-14 text-lg font-semibold' size='lg'>
            <Calculator className='mr-3 h-5 w-5' />
            Kıdem ve İhbar Tazminatını Hesapla
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className='space-y-6'>
          {/* Work Period Summary */}
          <Card className='bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-blue-900 dark:text-blue-100'>
                <Users className='h-5 w-5' />
                Çalışma Süresi Özeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid md:grid-cols-3 gap-4 text-center'>
                <div>
                  <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{result.totalWorkDays}</p>
                  <p className='text-sm text-blue-700 dark:text-blue-300'>Toplam Gün</p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{result.totalWorkYears}</p>
                  <p className='text-sm text-blue-700 dark:text-blue-300'>Yıl</p>
                </div>
                <div>
                  <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{result.totalWorkMonths}</p>
                  <p className='text-sm text-blue-700 dark:text-blue-300'>Ay</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className='grid md:grid-cols-3 gap-4'>
            <Card className='border-t-4 border-t-green-500 dark:border-t-green-400'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>Kıdem Tazminatı (Net)</span>
                  <CreditCard className='h-5 w-5 text-green-500 dark:text-green-400' />
                </div>
                <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.severanceNetAmount)}</p>
                <p className='text-xs text-muted-foreground mt-1'>{result.severanceEligibleDays} gün hak kazanıldı</p>
              </CardContent>
            </Card>

            <Card className='border-t-4 border-t-blue-500 dark:border-t-blue-400'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>İhbar Tazminatı (Net)</span>
                  <Receipt className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                </div>
                <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.noticeNetAmount)}</p>
                <p className='text-xs text-muted-foreground mt-1'>{result.noticeEligibleDays} gün ihbar süresi</p>
              </CardContent>
            </Card>

            <Card className='border-t-4 border-t-purple-500 dark:border-t-purple-400'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>Toplam Net</span>
                  <TrendingUp className='h-5 w-5 text-purple-500 dark:text-purple-400' />
                </div>
                <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.totalNetAmount)}</p>
                <p className='text-xs text-muted-foreground mt-1'>Vergiler düşüldükten sonra</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <div className='grid md:grid-cols-2 gap-6'>
            {/* Kıdem Tazminatı Detay */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <CreditCard className='h-5 w-5 text-green-600 dark:text-green-400' />
                  Kıdem Tazminatı Detayı
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Hak Kazanılan Gün</span>
                  <span className='font-medium'>{result.severanceEligibleDays} gün</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Brüt Tutar</span>
                  <span className='font-medium'>{formatCurrency(result.severanceGrossAmount)}</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Damga Vergisi (%0.759)</span>
                  <span className='font-medium text-red-600 dark:text-red-400'>
                    -{formatCurrency(result.severanceStampTax)}
                  </span>
                </div>
                <div className='flex justify-between items-center py-2 font-semibold text-lg'>
                  <span>Net Kıdem Tazminatı</span>
                  <span className='text-green-600 dark:text-green-400'>
                    {formatCurrency(result.severanceNetAmount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* İhbar Tazminatı Detay */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Receipt className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                  İhbar Tazminatı Detayı
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>İhbar Süresi</span>
                  <span className='font-medium'>{result.noticeEligibleDays} gün</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Brüt Tutar</span>
                  <span className='font-medium'>{formatCurrency(result.noticeGrossAmount)}</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Gelir Vergisi</span>
                  <span className='font-medium text-red-600 dark:text-red-400'>
                    -{formatCurrency(result.noticeIncomeTax)}
                  </span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Damga Vergisi (%0.759)</span>
                  <span className='font-medium text-red-600 dark:text-red-400'>
                    -{formatCurrency(result.noticeStampTax)}
                  </span>
                </div>
                <div className='flex justify-between items-center py-2 font-semibold text-lg'>
                  <span>Net İhbar Tazminatı</span>
                  <span className='text-blue-600 dark:text-blue-400'>{formatCurrency(result.noticeNetAmount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Information */}
          <Card className='bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-yellow-900 dark:text-yellow-100'>
                <Info className='h-5 w-5' />
                Yasal Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm text-yellow-800 dark:text-yellow-200'>
                <p>• Kıdem tazminatı sadece damga vergisine tabidir, gelir vergisi ve SGK primi kesilmez.</p>
                <p>• İhbar tazminatından gelir vergisi ve damga vergisi kesilir (muafiyet yoktur).</p>
                <p>
                  • Kıdem tazminatı tavan tutarı: Ocak-Haziran 2025 için 46.655,43 TL, Temmuz-Aralık için 53.919,68 TL.
                </p>
                <p>• Hesaplama 2025 yılı güncel vergi oranları ile yapılmıştır.</p>
                <p>• Kıdem tazminatı hakkı için en az 1 yıl çalışmış olmak gerekir.</p>
                <p>• İhbar süreleri İş Kanunu'na göre hesaplanmıştır.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
