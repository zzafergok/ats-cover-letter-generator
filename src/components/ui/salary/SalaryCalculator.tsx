'use client'

import React, { useState, useEffect } from 'react'
import {
  Calculator,
  Info,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Building2,
  Users,
  Receipt,
  Calendar,
  ChevronUp,
  AlertCircle,
  Banknote,
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Input } from '@/components/core/input'
import { Label } from '@/components/core/label'
import { Switch } from '@/components/core/switch'
import { LoadingSpinner } from '@/components/core/loading-spinner'
import { Alert } from '@/components/core/alert'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/core/tabs'
import { salaryApi } from '@/lib/api/api'
import { SalaryCalculationData, SalaryLimitsData, TaxConfigurationData } from '@/types/salary.types'
import { formatNumberInput, parseFormattedNumber } from '@/lib/utils'

// Form Data Interface
interface SalaryFormData {
  calculationType: 'gross-to-net' | 'net-to-gross'
  amount: string
  year: number
  month: number
  isMarried: boolean
  dependentCount: number
  isDisabled: boolean
  disabilityDegree: 1 | 2 | 3
}

// Chart Data Interface
interface ChartDataItem {
  name: string
  amount: number
  percentage: number
  color: string
}

export function SalaryCalculator() {
  // State
  const [formData, setFormData] = useState<SalaryFormData>({
    calculationType: 'gross-to-net',
    amount: '',
    year: 2025,
    month: new Date().getMonth() + 1,
    isMarried: false,
    dependentCount: 0,
    isDisabled: false,
    disabilityDegree: 1,
  })

  const [displayAmount, setDisplayAmount] = useState('')

  const [result, setResult] = useState<SalaryCalculationData | null>(null)
  const [limits, setLimits] = useState<SalaryLimitsData | null>(null)
  const [_taxConfig, setTaxConfig] = useState<TaxConfigurationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showPaymentCalendar, setShowPaymentCalendar] = useState(false)
  const [showTaxBracketInfo, setShowTaxBracketInfo] = useState(false)

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        const [limitsResponse, taxConfigResponse] = await Promise.all([
          salaryApi.getLimits(formData.year),
          salaryApi.getTaxConfiguration(formData.year),
        ])

        if (limitsResponse.success) {
          setLimits(limitsResponse.data)
        }

        if (taxConfigResponse.success) {
          setTaxConfig(taxConfigResponse.data)
        }
      } catch (error) {
        console.error('Failed to load initial data:', error)
        setError('Veriler yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [formData.year])

  // Handle form field changes
  const _handleFormChange = (field: keyof SalaryFormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    // Remove any non-numeric characters for storage
    const rawValue = parseFormattedNumber(value)

    // Update form data with raw numeric value
    setFormData((prev) => ({ ...prev, amount: rawValue }))

    // Update display with formatted value
    if (rawValue) {
      setDisplayAmount(formatNumberInput(rawValue))
    } else {
      setDisplayAmount('')
    }
  }

  // Handle calculation type change (clear everything when switching tabs)
  const handleCalculationTypeChange = (newType: 'gross-to-net' | 'net-to-gross') => {
    setFormData((prev) => ({
      ...prev,
      calculationType: newType,
      amount: '', // Clear amount
    }))
    setDisplayAmount('') // Clear display amount
    setResult(null) // Clear results
    setError(null) // Clear any errors
  }

  // Handle calculation
  const handleCalculate = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Lütfen geçerli bir maaş tutarı girin')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const amount = parseFloat(formData.amount)

      let response
      if (formData.calculationType === 'gross-to-net') {
        response = await salaryApi.grossToNet({
          grossSalary: amount,
          year: formData.year,
          month: formData.month,
          isMarried: formData.isMarried,
          dependentCount: formData.dependentCount,
          isDisabled: formData.isDisabled,
          disabilityDegree: formData.disabilityDegree,
        })
      } else {
        response = await salaryApi.netToGross({
          netSalary: amount,
          year: formData.year,
          month: formData.month,
          isMarried: formData.isMarried,
          dependentCount: formData.dependentCount,
          isDisabled: formData.isDisabled,
          disabilityDegree: formData.disabilityDegree,
        })
      }

      if (response.success) {
        setResult(response.data)
        // Scroll to results after successful calculation
        setTimeout(() => {
          const resultsSection = document.getElementById('salary-results')
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 300)
      } else {
        setError('Hesaplama sırasında hata oluştu')
      }
    } catch (error) {
      console.error('Calculation error:', error)
      setError('Hesaplama sırasında hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Generate chart data for deductions
  const _getDeductionsChartData = (): ChartDataItem[] => {
    if (!result) return []

    const total = result.totalDeductions

    return [
      {
        name: 'SGK İşçi Payı',
        amount: result.sgkEmployeeShare,
        percentage: (result.sgkEmployeeShare / total) * 100,
        color: '#3b82f6',
      },
      {
        name: 'İşsizlik Sigortası',
        amount: result.unemploymentInsurance,
        percentage: (result.unemploymentInsurance / total) * 100,
        color: '#10b981',
      },
      {
        name: 'Gelir Vergisi',
        amount: result.incomeTax,
        percentage: (result.incomeTax / total) * 100,
        color: '#f59e0b',
      },
      {
        name: 'Damga Vergisi',
        amount: result.stampTax,
        percentage: (result.stampTax / total) * 100,
        color: '#ef4444',
      },
    ]
  }

  // Get salary distribution chart data
  const _getSalaryDistributionData = (): ChartDataItem[] => {
    if (!result) return []

    const gross = result.grossSalary

    return [
      {
        name: 'Net Maaş',
        amount: result.netSalary,
        percentage: (result.netSalary / gross) * 100,
        color: '#10b981',
      },
      {
        name: 'Toplam Kesinti',
        amount: result.totalDeductions,
        percentage: (result.totalDeductions / gross) * 100,
        color: '#ef4444',
      },
    ]
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

  // Format percentage
  const _formatPercentage = (rate: number) => {
    return `%${(rate * 100).toFixed(1)}`
  }

  return (
    <div className='max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <Calculator className='h-10 w-10 text-primary' />
          <h1 className='text-4xl font-bold'>Türkiye Maaş Hesaplama Sistemi</h1>
        </div>
        <p className='text-muted-foreground text-lg'>2025 Yılı Güncel Vergi Oranları ve SGK Primleri</p>
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
            <Banknote className='h-6 w-6' />
            Maaş Hesaplama
          </CardTitle>
          <CardDescription>Brütten nete veya netten brüte maaş hesaplama aracı</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Calculation Mode Toggle */}
          <Tabs
            value={formData.calculationType}
            onValueChange={(value) => handleCalculationTypeChange(value as 'gross-to-net' | 'net-to-gross')}
          >
            <TabsList className='grid w-full grid-cols-2 h-14'>
              <TabsTrigger value='gross-to-net' className='flex items-center gap-2 h-12 text-base font-medium'>
                <TrendingDown className='h-5 w-5' />
                Brütten Nete
              </TabsTrigger>
              <TabsTrigger value='net-to-gross' className='flex items-center gap-2 h-12 text-base font-medium'>
                <TrendingUp className='h-5 w-5' />
                Netten Brüte
              </TabsTrigger>
            </TabsList>

            <TabsContent value='gross-to-net' className='space-y-6 pt-6'>
              <div className='space-y-3'>
                <Label htmlFor='gross-amount' className='text-base font-medium'>
                  Brüt Maaş (TL)
                </Label>
                <Input
                  id='gross-amount'
                  type='text'
                  value={displayAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder='Örn: 50.000'
                  className='h-12 text-lg'
                />
                {limits && (
                  <p className='text-sm text-muted-foreground'>Asgari Ücret: {formatCurrency(limits.minGrossSalary)}</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value='net-to-gross' className='space-y-6 pt-6'>
              <div className='space-y-3'>
                <Label htmlFor='net-amount' className='text-base font-medium'>
                  Net Maaş (TL)
                </Label>
                <Input
                  id='net-amount'
                  type='text'
                  value={displayAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder='Örn: 40.000'
                  className='h-12 text-lg'
                />
                {limits && (
                  <p className='text-sm text-muted-foreground'>Asgari Ücret: {formatCurrency(limits.minNetSalary)}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Personal Information */}
          <div className='bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Users className='h-5 w-5 text-gray-600 dark:text-gray-400' />
              <h3 className='font-semibold text-gray-900 dark:text-gray-100'>Kişisel Bilgiler</h3>
              <span className='text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full'>
                Vergi hesaplamasını etkiler
              </span>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div className='space-y-3'>
                  <Label htmlFor='married' className='text-base font-medium text-gray-900 dark:text-gray-100'>
                    Medeni Durum
                  </Label>
                  <div className='flex items-center justify-start gap-3'>
                    <span
                      className={`text-sm ${formData.isMarried ? 'text-gray-400' : 'font-medium text-gray-900 dark:text-gray-100'}`}
                    >
                      Bekar
                    </span>
                    <Switch
                      id='married'
                      checked={formData.isMarried}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isMarried: checked,
                        }))
                      }
                    />
                    <span
                      className={`text-sm ${formData.isMarried ? 'font-medium text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}
                    >
                      Evli
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400 text-start'>
                    Evli işçiler için vergi avantajı
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                <Label htmlFor='dependents' className='text-base font-medium text-gray-900 dark:text-gray-100'>
                  Bakmakla Yükümlü Kişi Sayısı
                </Label>
                <div className='space-y-2'>
                  <Input
                    id='dependents'
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                    value={formData.dependentCount === 0 ? '' : formData.dependentCount.toString()}
                    onChange={(e) => {
                      const value = e.target.value
                      // Only allow numbers and empty string
                      if (value === '' || /^\d+$/.test(value)) {
                        const numValue = value === '' ? 0 : parseInt(value)
                        // Limit between 0-10
                        if (numValue >= 0 && numValue <= 10) {
                          setFormData((prev) => ({
                            ...prev,
                            dependentCount: numValue,
                          }))
                        }
                      }
                    }}
                    placeholder='0'
                    className='h-11'
                  />
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Her bakmakla yükümlü kişi için ek vergi indirimi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <div className='pt-4'>
            <Button
              onClick={handleCalculate}
              disabled={loading || !formData.amount}
              className='w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
              size='lg'
            >
              {loading ? (
                <>
                  <LoadingSpinner className='mr-3 h-5 w-5' />
                  Hesaplanıyor...
                </>
              ) : (
                <>
                  <Calculator className='mr-3 h-5 w-5' />
                  Maaşı Hesapla
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div id='salary-results' className='grid lg:grid-cols-3 gap-8'>
          {/* Main Results Area */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Summary Cards */}
            <div className='grid md:grid-cols-2 gap-4'>
              <Card className='border-t-4 border-t-green-500 dark:border-t-green-400'>
                <CardContent className='pt-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm text-muted-foreground'>Net Maaş</span>
                    <CreditCard className='h-5 w-5 text-green-500 dark:text-green-400' />
                  </div>
                  <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.netSalary)}</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {((result.netSalary / result.grossSalary) * 100).toFixed(1)}% brütün
                  </p>
                </CardContent>
              </Card>

              <Card className='border-t-4 border-t-blue-500 dark:border-t-blue-400'>
                <CardContent className='pt-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm text-muted-foreground'>Brüt Maaş</span>
                    <Receipt className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                  </div>
                  <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.grossSalary)}</p>
                  <p className='text-xs text-muted-foreground mt-1'>Temel hesaplama</p>
                </CardContent>
              </Card>

              <Card className='border-t-4 border-t-red-500 dark:border-t-red-400'>
                <CardContent className='pt-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm text-muted-foreground'>Toplam Kesinti</span>
                    <AlertCircle className='h-5 w-5 text-red-500 dark:text-red-400' />
                  </div>
                  <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.totalDeductions)}</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {((result.totalDeductions / result.grossSalary) * 100).toFixed(1)}% brütün
                  </p>
                </CardContent>
              </Card>

              <Card className='border-t-4 border-t-purple-500 dark:border-t-purple-400'>
                <CardContent className='pt-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm text-muted-foreground'>İşveren Maliyeti</span>
                    <Building2 className='h-5 w-5 text-purple-500 dark:text-purple-400' />
                  </div>
                  <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.employerCost)}</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    +{(((result.employerCost - result.grossSalary) / result.grossSalary) * 100).toFixed(1)}% brütün üstü
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className='grid md:grid-cols-2 gap-6'>
              {/* Employee Deductions */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    Çalışan Kesintileri
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex justify-between items-center py-2 border-b'>
                    <span className='text-sm'>SGK İşçi Payı (%14)</span>
                    <span className='font-medium'>{formatCurrency(result.sgkEmployeeShare)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b'>
                    <span className='text-sm'>İşsizlik Sigortası (%1)</span>
                    <span className='font-medium'>{formatCurrency(result.unemploymentInsurance)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b'>
                    <span className='text-sm'>Gelir Vergisi</span>
                    <span className='font-medium'>{formatCurrency(result.incomeTax)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b'>
                    <span className='text-sm'>Damga Vergisi (%0.948)</span>
                    <span className='font-medium'>{formatCurrency(result.stampTax)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 font-semibold text-lg'>
                    <span>Toplam Kesinti</span>
                    <span className='text-red-600 dark:text-red-400'>{formatCurrency(result.totalDeductions)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Employer Costs */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Building2 className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                    İşveren Maliyetleri
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex justify-between items-center py-2 border-b'>
                    <span className='text-sm'>SGK İşveren Payı (%20.75)</span>
                    <span className='font-medium'>{formatCurrency(result.employerSgkShare)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b'>
                    <span className='text-sm'>İşsizlik Sigortası (%2)</span>
                    <span className='font-medium'>{formatCurrency(result.employerUnemploymentInsurance)}</span>
                  </div>
                  <div className='flex justify-between items-center py-2 font-semibold text-lg'>
                    <span>Toplam İşveren Maliyeti</span>
                    <span className='text-purple-600 dark:text-purple-400'>{formatCurrency(result.employerCost)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 space-y-4'>
              {/* Info Navigation Cards */}
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  showInfo ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50' : 'border-border hover:border-blue-300'
                }`}
                onClick={() => {
                  setShowInfo(!showInfo)
                  setShowPaymentCalendar(false)
                  setShowTaxBracketInfo(false)
                  // Scroll to info panel after a brief delay to allow state update
                  setTimeout(() => {
                    const infoPanel = document.getElementById('info-panel')
                    if (infoPanel && !showInfo) {
                      infoPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }, 100)
                }}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`p-2 rounded-lg ${
                        showInfo
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <Info className='h-5 w-5' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-sm'>2025 Yılı Vergi Oranları</h3>
                      <p className='text-xs text-muted-foreground'>SGK ve gelir vergisi oranları</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  showPaymentCalendar
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50'
                    : 'border-border hover:border-purple-300'
                }`}
                onClick={() => {
                  setShowPaymentCalendar(!showPaymentCalendar)
                  setShowInfo(false)
                  setShowTaxBracketInfo(false)
                  // Scroll to payment calendar panel after a brief delay
                  setTimeout(() => {
                    const paymentPanel = document.getElementById('payment-calendar-panel')
                    if (paymentPanel && !showPaymentCalendar) {
                      paymentPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }, 100)
                }}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`p-2 rounded-lg ${
                        showPaymentCalendar
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                      }`}
                    >
                      <Calendar className='h-5 w-5' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-sm'>Ödeme Takvimi</h3>
                      <p className='text-xs text-muted-foreground'>Vergi ve SGK ödeme tarihleri</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  showTaxBracketInfo
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/50'
                    : 'border-border hover:border-green-300'
                }`}
                onClick={() => {
                  setShowTaxBracketInfo(!showTaxBracketInfo)
                  setShowInfo(false)
                  setShowPaymentCalendar(false)
                  // Scroll to tax bracket panel after a brief delay
                  setTimeout(() => {
                    const taxPanel = document.getElementById('tax-bracket-panel')
                    if (taxPanel && !showTaxBracketInfo) {
                      taxPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }, 100)
                }}
              >
                <CardContent className='p-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`p-2 rounded-lg ${
                        showTaxBracketInfo
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
                      }`}
                    >
                      <AlertCircle className='h-5 w-5' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-sm'>Vergi Dilimleri</h3>
                      <p className='text-xs text-muted-foreground'>Vergi dilimi hesaplaması</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Summary Card */}
              <Card className='bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/30 border-gray-200 dark:border-gray-700'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base flex items-center gap-2 text-gray-900 dark:text-gray-100'>
                    <Banknote className='h-5 w-5 text-gray-600 dark:text-gray-400' />
                    Hızlı Özet
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-600 dark:text-gray-400'>Net Maaş</span>
                    <span className='font-semibold text-green-600 dark:text-green-400'>
                      {formatCurrency(result.netSalary)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center text-sm'>
                    <span className='text-gray-600 dark:text-gray-400'>Toplam Kesinti</span>
                    <span className='font-semibold text-red-600 dark:text-red-400'>
                      {formatCurrency(result.totalDeductions)}
                    </span>
                  </div>
                  <div className='flex justify-between items-center text-sm border-t border-gray-200 dark:border-gray-600 pt-2'>
                    <span className='text-gray-600 dark:text-gray-400'>İşveren Maliyeti</span>
                    <span className='font-semibold text-purple-600 dark:text-purple-400'>
                      {formatCurrency(result.employerCost)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Indicator */}
      {(showInfo || showPaymentCalendar || showTaxBracketInfo) && (
        <div className='fixed bottom-8 right-8 z-50'>
          <Button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className='rounded-full w-12 h-12 shadow-lg bg-primary hover:bg-primary/90'
            size='icon'
          >
            <ChevronUp className='h-5 w-5' />
          </Button>
        </div>
      )}

      {/* Information Panels */}
      {showInfo && (
        <Card
          id='info-panel'
          className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800 shadow-lg animate-in slide-in-from-top-2 duration-300'
        >
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center justify-between text-blue-900 dark:text-blue-100'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-500 text-white rounded-lg'>
                  <Info className='h-5 w-5' />
                </div>
                <span className='text-xl'>2025 Yılı Güncel Oranlar</span>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowInfo(false)}
                className='hover:bg-blue-200 dark:hover:bg-blue-800'
              >
                <ChevronUp className='h-5 w-5' />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-blue-200 dark:border-blue-700'>
                <h4 className='font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  SGK Prim Oranları
                </h4>
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>İşçi Payı</span>
                    <span className='font-semibold text-blue-900 dark:text-blue-100'>%14</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>İşveren Payı (Teşviksiz)</span>
                    <span className='font-semibold text-blue-900 dark:text-blue-100'>%20.75</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>İşveren Payı (Teşvikli)</span>
                    <span className='font-semibold text-blue-900 dark:text-blue-100'>%15.75</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>İşsizlik İşçi</span>
                    <span className='font-semibold text-blue-900 dark:text-blue-100'>%1</span>
                  </div>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-blue-700 dark:text-blue-300'>İşsizlik İşveren</span>
                    <span className='font-semibold text-blue-900 dark:text-blue-100'>%2</span>
                  </div>
                </div>
              </div>

              <div className='bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-blue-200 dark:border-blue-700'>
                <h4 className='font-semibold mb-4 text-blue-900 dark:text-blue-100 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  Gelir Vergisi Dilimleri
                </h4>
                <div className='space-y-3 text-sm'>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>158.000 TL'ye kadar</span>
                    <span className='font-semibold text-green-600 dark:text-green-400'>%15</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>330.000 TL'ye kadar</span>
                    <span className='font-semibold text-green-600 dark:text-green-400'>%20</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>870.000 TL'ye kadar</span>
                    <span className='font-semibold text-yellow-600 dark:text-yellow-400'>%27</span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-blue-100 dark:border-blue-800'>
                    <span className='text-blue-700 dark:text-blue-300'>3.400.000 TL'ye kadar</span>
                    <span className='font-semibold text-orange-600 dark:text-orange-400'>%35</span>
                  </div>
                  <div className='flex justify-between items-center py-2'>
                    <span className='text-blue-700 dark:text-blue-300'>3.400.000 TL üzeri</span>
                    <span className='font-semibold text-red-600 dark:text-red-400'>%40</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10 p-4 rounded-xl border border-blue-200 dark:border-blue-700'>
              <h5 className='font-semibold mb-3 text-blue-900 dark:text-blue-100'>Diğer Önemli Bilgiler</h5>
              <div className='grid md:grid-cols-3 gap-4 text-sm'>
                <div className='flex flex-col items-center text-center'>
                  <span className='text-blue-700 dark:text-blue-300'>Damga Vergisi</span>
                  <span className='font-semibold text-blue-900 dark:text-blue-100'>Binde 9,48</span>
                </div>
                <div className='flex flex-col items-center text-center'>
                  <span className='text-blue-700 dark:text-blue-300'>SGK Taban</span>
                  <span className='font-semibold text-blue-900 dark:text-blue-100'>22.104 TL</span>
                </div>
                <div className='flex flex-col items-center text-center'>
                  <span className='text-blue-700 dark:text-blue-300'>SGK Tavan</span>
                  <span className='font-semibold text-blue-900 dark:text-blue-100'>165.780 TL</span>
                </div>
              </div>
              <div className='mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700'>
                <p className='text-sm text-yellow-800 dark:text-yellow-200 font-medium text-center'>
                  📝 Asgari ücret gelir ve damga vergisinden muaftır
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Calendar Panel */}
      {showPaymentCalendar && (
        <Card
          id='payment-calendar-panel'
          className='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800 shadow-lg animate-in slide-in-from-top-2 duration-300'
        >
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center justify-between text-purple-900 dark:text-purple-100'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-purple-500 text-white rounded-lg'>
                  <Calendar className='h-5 w-5' />
                </div>
                <span className='text-xl'>Yıllık Vergi ve SGK Ödeme Takvimi</span>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowPaymentCalendar(false)}
                className='hover:bg-purple-200 dark:hover:bg-purple-800'
              >
                <ChevronUp className='h-5 w-5' />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h4 className='font-semibold text-purple-900 dark:text-purple-100 mb-3'>Aylık Ödemeler</h4>
                <div className='space-y-2 text-sm'>
                  <div className='bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-purple-700'>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>Her Ayın 26'sı</p>
                    <p className='text-gray-600 dark:text-gray-400'>• Muhtasar Beyanname (Gelir Vergisi Stopajı)</p>
                    <p className='text-gray-600 dark:text-gray-400'>• Damga Vergisi</p>
                  </div>
                  <div className='bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-purple-700'>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>Takip Eden Ayın Son Günü</p>
                    <p className='text-gray-600 dark:text-gray-400'>• SGK Primleri (İşçi + İşveren)</p>
                    <p className='text-gray-600 dark:text-gray-400'>• İşsizlik Sigortası Primleri</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className='font-semibold text-purple-900 dark:text-purple-100 mb-3'>Örnek: Ocak 2025 Maaşı İçin</h4>
                <div className='space-y-2 text-sm'>
                  <div className='bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-purple-400'>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>26 Şubat 2025</p>
                    <p className='text-gray-600 dark:text-gray-400'>• Gelir Vergisi ödemesi</p>
                    <p className='text-gray-600 dark:text-gray-400'>• Damga Vergisi ödemesi</p>
                  </div>
                  <div className='bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-purple-400'>
                    <p className='font-medium text-gray-800 dark:text-gray-200'>28 Şubat 2025</p>
                    <p className='text-gray-600 dark:text-gray-400'>• SGK primleri ödemesi</p>
                    <p className='text-gray-600 dark:text-gray-400'>• İşsizlik sigortası ödemesi</p>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700'>
                  <p className='text-xs text-yellow-800 dark:text-yellow-200'>
                    <strong>Not:</strong> Ödeme günü hafta sonu veya resmi tatile denk gelirse, takip eden ilk iş günü
                    son ödeme tarihidir.
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-4 grid md:grid-cols-3 gap-3'>
              <div className='bg-white dark:bg-gray-800 p-3 rounded-lg text-center border border-purple-200 dark:border-purple-700'>
                <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>12</p>
                <p className='text-xs text-gray-600 dark:text-gray-400'>Muhtasar Beyanname/Yıl</p>
              </div>
              <div className='bg-white dark:bg-gray-800 p-3 rounded-lg text-center border border-purple-200 dark:border-purple-700'>
                <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>12</p>
                <p className='text-xs text-gray-600 dark:text-gray-400'>SGK Bildirimi/Yıl</p>
              </div>
              <div className='bg-white dark:bg-gray-800 p-3 rounded-lg text-center border border-purple-200 dark:border-purple-700'>
                <p className='text-2xl font-bold text-purple-600 dark:text-purple-400'>1</p>
                <p className='text-xs text-gray-600 dark:text-gray-400'>Yıllık Gelir Vergisi Beyanı</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Bracket Info Panel */}
      {showTaxBracketInfo && (
        <Card
          id='tax-bracket-panel'
          className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800 shadow-lg animate-in slide-in-from-top-2 duration-300'
        >
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center justify-between text-green-900 dark:text-green-100'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-500 text-white rounded-lg'>
                  <AlertCircle className='h-5 w-5' />
                </div>
                <span className='text-xl'>Gelir Vergisi Dilimleri Nasıl Çalışır?</span>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowTaxBracketInfo(false)}
                className='hover:bg-green-200 dark:hover:bg-green-800'
              >
                <ChevronUp className='h-5 w-5' />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700'>
              <h4 className='font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                Kümülatif (Artan Oranlı) Vergi Sistemi
              </h4>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                Türkiye'de gelir vergisi kümülatif olarak hesaplanır. Yani yıl içinde kazancınız arttıkça, vergi
                oranınız da kademeli olarak artar. Her dilim kendi oranıyla vergilendirilir.
              </p>

              <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-3 border border-gray-200 dark:border-gray-600'>
                <p className='text-sm font-medium text-gray-800 dark:text-gray-200 mb-2'>
                  Örnek: Yıllık 400.000 TL Gelir İçin:
                </p>
                <div className='space-y-1 text-xs text-gray-700 dark:text-gray-300'>
                  <p>• İlk 158.000 TL → %15 = 23.700 TL</p>
                  <p>• Sonraki 172.000 TL (330.000-158.000) → %20 = 34.400 TL</p>
                  <p>• Kalan 70.000 TL (400.000-330.000) → %27 = 18.900 TL</p>
                  <p className='font-semibold text-green-700 dark:text-green-400 mt-2'>Toplam Vergi: 77.000 TL</p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700'>
              <h4 className='font-semibold text-gray-800 dark:text-gray-200 mb-2'>2025 Vergi Dilimleri</h4>
              <div className='space-y-2'>
                <div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600'>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>0 - 158.000 TL</span>
                  <span className='text-sm font-semibold px-3 py-1 rounded bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'>
                    %15
                  </span>
                </div>
                <div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600'>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>158.001 - 330.000 TL</span>
                  <span className='text-sm font-semibold px-3 py-1 rounded bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'>
                    %20
                  </span>
                </div>
                <div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600'>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>330.001 - 870.000 TL</span>
                  <span className='text-sm font-semibold px-3 py-1 rounded bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400'>
                    %27
                  </span>
                </div>
                <div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600'>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>870.001 - 3.400.000 TL</span>
                  <span className='text-sm font-semibold px-3 py-1 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'>
                    %35
                  </span>
                </div>
                <div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600'>
                  <span className='text-sm text-gray-700 dark:text-gray-300'>3.400.001 TL ve üzeri</span>
                  <span className='text-sm font-semibold px-3 py-1 rounded bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'>
                    %40
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700'>
              <h4 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2'>
                <AlertCircle size={20} />
                Önemli Noktalar
              </h4>
              <ul className='space-y-1 text-sm text-yellow-700 dark:text-yellow-300'>
                <li>• Asgari ücret gelir vergisinden muaftır</li>
                <li>• Yıl içinde terfi veya zam aldığınızda vergi diliminiz değişebilir</li>
                <li>• İş değişikliğinde kümülatif matrah sıfırlanabilir</li>
                <li>• Ek ödemeler (ikramiye, prim vb.) vergi matrahınızı artırır</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
