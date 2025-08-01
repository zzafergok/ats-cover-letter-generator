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

// Types
interface SalaryConstants {
  minimumWage: {
    gross: number
    net: number
    daily: number
  }
  sgkFloor: number
  sgkCeiling: number
  sgkRates: {
    employee: number
    unemploymentEmployee: number
    employer: number
    employerWithIncentive: number
    unemploymentEmployer: number
  }
  incomeTaxBrackets: Array<{
    min: number
    max: number
    rate: number
  }>
  stampTaxRate: number
  minimumWageSupportAmount: number
}

interface ExchangeRates {
  USD: { buying: number; selling: number }
  EUR: { buying: number; selling: number }
}

interface SalaryCalculationResult {
  gross: number
  net: number
  deductions: {
    sgkEmployee: number
    unemploymentEmployee: number
    incomeTax: number
    stampTax: number
    totalDeduction: number
  }
  employerCosts: {
    sgkEmployer: number
    unemploymentEmployer: number
    minimumWageSupport: number
    totalCost: number
  }
}

interface CalculationMode {
  mode: 'gross-to-net' | 'net-to-gross'
  grossAmount: string
  netAmount: string
  useSgkIncentive: boolean
  useMinimumWageSupport: boolean
}

export function SalaryCalculator() {
  // State
  const [calculationMode, setCalculationMode] = useState<CalculationMode>({
    mode: 'gross-to-net',
    grossAmount: '',
    netAmount: '',
    useSgkIncentive: true,
    useMinimumWageSupport: true,
  })

  const [result, setResult] = useState<SalaryCalculationResult | null>(null)
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showPaymentCalendar, setShowPaymentCalendar] = useState(false)
  const [showTaxBracketInfo, setShowTaxBracketInfo] = useState(false)

  // 2025 Constants
  const constants: SalaryConstants = {
    minimumWage: {
      gross: 26005.5,
      net: 22104.68,
      daily: 866.85,
    },
    sgkFloor: 26005.5,
    sgkCeiling: 195041.4,
    sgkRates: {
      employee: 0.14,
      unemploymentEmployee: 0.01,
      employer: 0.2075, // 5 points incentive
      employerWithIncentive: 0.1575, // Normal rate
      unemploymentEmployer: 0.02,
    },
    incomeTaxBrackets: [
      { min: 0, max: 158000, rate: 0.15 },
      { min: 158000, max: 330000, rate: 0.2 },
      { min: 330000, max: 870000, rate: 0.27 },
      { min: 870000, max: 3400000, rate: 0.35 },
      { min: 3400000, max: Infinity, rate: 0.4 },
    ],
    stampTaxRate: 0.00948,
    minimumWageSupportAmount: 800,
  }

  // Fetch TCMB exchange rates
  const fetchExchangeRates = async () => {
    setLoading(true)
    try {
      // Using allorigins as CORS proxy for TCMB XML
      const proxyUrl = 'https://api.allorigins.win/raw?url='
      const tcmbUrl = 'https://www.tcmb.gov.tr/kurlar/today.xml'

      const response = await fetch(proxyUrl + encodeURIComponent(tcmbUrl))
      const xmlText = await response.text()

      // Parse XML
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

      // Extract USD and EUR rates
      const currencies = xmlDoc.getElementsByTagName('Currency')
      const rates: Record<string, { buying: number; selling: number }> = {}

      for (const currency of currencies) {
        const code = currency.getAttribute('CurrencyCode')
        if (code === 'USD' || code === 'EUR') {
          const forexBuying = currency.getElementsByTagName('ForexBuying')[0]?.textContent
          const forexSelling = currency.getElementsByTagName('ForexSelling')[0]?.textContent

          rates[code] = {
            buying: parseFloat(forexBuying || '0'),
            selling: parseFloat(forexSelling || '0'),
          }
        }
      }

      setExchangeRates({
        USD: rates.USD || { buying: 0, selling: 0 },
        EUR: rates.EUR || { buying: 0, selling: 0 },
      })
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate income tax
  const calculateIncomeTax = (annualTaxBase: number): number => {
    let totalTax = 0
    let remainingBase = annualTaxBase

    for (const bracket of constants.incomeTaxBrackets) {
      if (remainingBase <= 0) break

      const bracketBase = Math.min(remainingBase, bracket.max - bracket.min)
      totalTax += bracketBase * bracket.rate
      remainingBase -= bracketBase
    }

    return totalTax
  }

  // Calculate gross to net
  const calculateGrossToNet = (gross: number): SalaryCalculationResult => {
    const sgkBase = Math.min(Math.max(gross, constants.sgkFloor), constants.sgkCeiling)

    // Deductions
    const sgkEmployee = sgkBase * constants.sgkRates.employee
    const unemploymentEmployee = sgkBase * constants.sgkRates.unemploymentEmployee
    const totalSgkDeduction = sgkEmployee + unemploymentEmployee

    // Income tax base
    const incomeTaxBase = gross - totalSgkDeduction

    // Annual income tax calculation (simplified)
    const monthlyIncomeTax = calculateIncomeTax(incomeTaxBase * 12) / 12

    // Stamp tax
    const stampTax =
      gross <= constants.minimumWage.gross ? 0 : (gross - constants.minimumWage.gross) * constants.stampTaxRate

    // Employer costs
    const sgkEmployer =
      sgkBase *
      (calculationMode.useSgkIncentive ? constants.sgkRates.employer : constants.sgkRates.employerWithIncentive)
    const unemploymentEmployer = sgkBase * constants.sgkRates.unemploymentEmployer

    // Minimum wage support
    const supportAmount =
      calculationMode.useMinimumWageSupport && gross === constants.minimumWage.gross
        ? constants.minimumWageSupportAmount
        : 0

    const net = gross - totalSgkDeduction - monthlyIncomeTax - stampTax
    const employerTotalCost = gross + sgkEmployer + unemploymentEmployer - supportAmount

    return {
      gross,
      net,
      deductions: {
        sgkEmployee,
        unemploymentEmployee,
        incomeTax: monthlyIncomeTax,
        stampTax,
        totalDeduction: totalSgkDeduction + monthlyIncomeTax + stampTax,
      },
      employerCosts: {
        sgkEmployer,
        unemploymentEmployer,
        minimumWageSupport: supportAmount,
        totalCost: employerTotalCost,
      },
    }
  }

  // Calculate net to gross (approximation)
  const calculateNetToGross = (targetNet: number): SalaryCalculationResult => {
    let estimatedGross = targetNet * 1.25 // Initial estimate
    let iteration = 0
    const maxIterations = 50
    const precision = 0.01

    while (iteration < maxIterations) {
      const calculation = calculateGrossToNet(estimatedGross)
      const difference = calculation.net - targetNet

      if (Math.abs(difference) < precision) {
        return calculation
      }

      // Adjustment factor
      estimatedGross = estimatedGross - difference * 0.8
      iteration++
    }

    return calculateGrossToNet(estimatedGross)
  }

  const handleCalculate = () => {
    if (calculationMode.mode === 'gross-to-net') {
      const gross = parseFloat(calculationMode.grossAmount)
      if (isNaN(gross) || gross <= 0) {
        return
      }
      setResult(calculateGrossToNet(gross))
    } else {
      const net = parseFloat(calculationMode.netAmount)
      if (isNaN(net) || net <= 0) {
        return
      }
      setResult(calculateNetToGross(net))
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (rate: number) => {
    return `%${(rate * 100).toFixed(1)}`
  }

  useEffect(() => {
    fetchExchangeRates()
  }, [])

  return (
    <div className='max-w-6xl mx-auto space-y-8'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <Calculator className='h-10 w-10 text-primary' />
          <h1 className='text-4xl font-bold'>Türkiye Maaş Hesaplama Sistemi</h1>
        </div>
        <p className='text-muted-foreground text-lg'>2025 Yılı Güncel Vergi Oranları ve SGK Primleri</p>
      </div>

      {/* Exchange Rates Info */}
      {exchangeRates && (
        <Alert className='bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'>
          <Info className='h-4 w-4 text-yellow-600 dark:text-yellow-400' />
          <div className='flex-1'>
            <p className='font-medium mb-2 text-yellow-800 dark:text-yellow-200'>Güncel Döviz Kurları (TCMB)</p>
            <div className='grid grid-cols-2 gap-4 text-sm text-yellow-700 dark:text-yellow-300'>
              <div>USD: {exchangeRates.USD?.selling?.toFixed(4)} TL</div>
              <div>EUR: {exchangeRates.EUR?.selling?.toFixed(4)} TL</div>
            </div>
          </div>
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
            value={calculationMode.mode}
            onValueChange={(value) =>
              setCalculationMode((prev) => ({
                ...prev,
                mode: value as 'gross-to-net' | 'net-to-gross',
              }))
            }
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='gross-to-net' className='flex items-center gap-2'>
                <TrendingDown className='h-4 w-4' />
                Brütten Nete
              </TabsTrigger>
              <TabsTrigger value='net-to-gross' className='flex items-center gap-2'>
                <TrendingUp className='h-4 w-4' />
                Netten Brüte
              </TabsTrigger>
            </TabsList>

            <TabsContent value='gross-to-net' className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='gross-amount'>Brüt Maaş</Label>
                <Input
                  id='gross-amount'
                  type='number'
                  value={calculationMode.grossAmount}
                  onChange={(e) =>
                    setCalculationMode((prev) => ({
                      ...prev,
                      grossAmount: e.target.value,
                    }))
                  }
                  placeholder='Örn: 30000'
                />
                <p className='text-xs text-muted-foreground'>
                  Asgari Ücret: {formatCurrency(constants.minimumWage.gross)}
                </p>
              </div>
            </TabsContent>

            <TabsContent value='net-to-gross' className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='net-amount'>Net Maaş</Label>
                <Input
                  id='net-amount'
                  type='number'
                  value={calculationMode.netAmount}
                  onChange={(e) =>
                    setCalculationMode((prev) => ({
                      ...prev,
                      netAmount: e.target.value,
                    }))
                  }
                  placeholder='Örn: 25000'
                />
                <p className='text-xs text-muted-foreground'>
                  Asgari Ücret: {formatCurrency(constants.minimumWage.net)}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Options */}
          <div className='grid md:grid-cols-2 gap-4'>
            <div className='flex items-center space-x-2'>
              <Switch
                id='sgk-incentive'
                checked={calculationMode.useSgkIncentive}
                onCheckedChange={(checked) =>
                  setCalculationMode((prev) => ({
                    ...prev,
                    useSgkIncentive: checked,
                  }))
                }
              />
              <div className='space-y-1'>
                <Label htmlFor='sgk-incentive' className='text-sm font-medium'>
                  5 Puanlık SGK İşveren Teşviki
                </Label>
                <p className='text-xs text-muted-foreground'>İşveren payında %5 indirim</p>
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <Switch
                id='min-wage-support'
                checked={calculationMode.useMinimumWageSupport}
                onCheckedChange={(checked) =>
                  setCalculationMode((prev) => ({
                    ...prev,
                    useMinimumWageSupport: checked,
                  }))
                }
              />
              <div className='space-y-1'>
                <Label htmlFor='min-wage-support' className='text-sm font-medium'>
                  Asgari Ücret Desteği (800 TL)
                </Label>
                <p className='text-xs text-muted-foreground'>Sadece asgari ücret için geçerli</p>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <Button onClick={handleCalculate} disabled={loading} className='w-full' size='lg'>
            {loading ? (
              <>
                <LoadingSpinner className='mr-2 h-4 w-4' />
                Hesaplanıyor...
              </>
            ) : (
              'Hesapla'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className='space-y-6'>
          {/* Summary Cards */}
          <div className='grid md:grid-cols-3 gap-6'>
            <Card className='border-t-4 border-t-green-500 dark:border-t-green-400'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>Net Maaş</span>
                  <CreditCard className='h-5 w-5 text-green-500 dark:text-green-400' />
                </div>
                <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.net)}</p>
              </CardContent>
            </Card>

            <Card className='border-t-4 border-t-blue-500 dark:border-t-blue-400'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>Brüt Maaş</span>
                  <Receipt className='h-5 w-5 text-blue-500 dark:text-blue-400' />
                </div>
                <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.gross)}</p>
              </CardContent>
            </Card>

            <Card className='border-t-4 border-t-purple-500 dark:border-t-purple-400'>
              <CardContent className='pt-6'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm text-muted-foreground'>İşveren Maliyeti</span>
                  <Building2 className='h-5 w-5 text-purple-500 dark:text-purple-400' />
                </div>
                <p className='text-2xl font-bold text-foreground'>{formatCurrency(result.employerCosts.totalCost)}</p>
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
                  <span className='text-sm'>SGK İşçi Payı ({formatPercentage(constants.sgkRates.employee)})</span>
                  <span className='font-medium'>{formatCurrency(result.deductions.sgkEmployee)}</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>
                    İşsizlik Sigortası ({formatPercentage(constants.sgkRates.unemploymentEmployee)})
                  </span>
                  <span className='font-medium'>{formatCurrency(result.deductions.unemploymentEmployee)}</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Gelir Vergisi</span>
                  <span className='font-medium'>{formatCurrency(result.deductions.incomeTax)}</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>Damga Vergisi ({formatPercentage(constants.stampTaxRate)})</span>
                  <span className='font-medium'>{formatCurrency(result.deductions.stampTax)}</span>
                </div>
                <div className='flex justify-between items-center py-2 font-semibold text-lg'>
                  <span>Toplam Kesinti</span>
                  <span className='text-red-600 dark:text-red-400'>
                    {formatCurrency(result.deductions.totalDeduction)}
                  </span>
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
                  <span className='text-sm'>
                    SGK İşveren Payı (
                    {formatPercentage(
                      calculationMode.useSgkIncentive
                        ? constants.sgkRates.employer
                        : constants.sgkRates.employerWithIncentive,
                    )}
                    )
                  </span>
                  <span className='font-medium'>{formatCurrency(result.employerCosts.sgkEmployer)}</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b'>
                  <span className='text-sm'>
                    İşsizlik Sigortası ({formatPercentage(constants.sgkRates.unemploymentEmployer)})
                  </span>
                  <span className='font-medium'>{formatCurrency(result.employerCosts.unemploymentEmployer)}</span>
                </div>
                {result.employerCosts.minimumWageSupport > 0 && (
                  <div className='flex justify-between items-center py-2 border-b'>
                    <span className='text-sm'>Asgari Ücret Desteği</span>
                    <span className='font-medium text-green-600 dark:text-green-400'>
                      -{formatCurrency(result.employerCosts.minimumWageSupport)}
                    </span>
                  </div>
                )}
                <div className='flex justify-between items-center py-2 font-semibold text-lg'>
                  <span>Toplam İşveren Maliyeti</span>
                  <span className='text-purple-600 dark:text-purple-400'>
                    {formatCurrency(result.employerCosts.totalCost)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Buttons */}
          <div className='flex flex-wrap gap-3 justify-center'>
            <Button variant='outline' onClick={() => setShowInfo(!showInfo)} className='flex items-center gap-2'>
              <Info className='h-4 w-4' />
              2025 Yılı Vergi Oranları
            </Button>

            <Button
              variant='outline'
              onClick={() => setShowPaymentCalendar(!showPaymentCalendar)}
              className='flex items-center gap-2'
            >
              <Calendar className='h-4 w-4' />
              Ödeme Takvimi
            </Button>

            <Button
              variant='outline'
              onClick={() => setShowTaxBracketInfo(!showTaxBracketInfo)}
              className='flex items-center gap-2'
            >
              <AlertCircle className='h-4 w-4' />
              Vergi Dilimleri Açıklama
            </Button>
          </div>
        </div>
      )}

      {/* Information Panels */}
      {showInfo && (
        <Card className='bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between text-blue-900 dark:text-blue-100'>
              <span>2025 Yılı Güncel Oranlar</span>
              <Button variant='ghost' size='icon' onClick={() => setShowInfo(false)}>
                <ChevronUp className='h-4 w-4' />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-2 gap-6 text-sm text-blue-800 dark:text-blue-200'>
              <div>
                <h4 className='font-semibold mb-2 text-blue-900 dark:text-blue-100'>SGK Prim Oranları:</h4>
                <ul className='space-y-1'>
                  <li>• İşçi Payı: %14</li>
                  <li>• İşveren Payı: %20.75 (Teşviksiz)</li>
                  <li>• İşveren Payı: %15.75 (5 puan teşvikli)</li>
                  <li>• İşsizlik Sigortası İşçi: %1</li>
                  <li>• İşsizlik Sigortası İşveren: %2</li>
                </ul>
              </div>
              <div>
                <h4 className='font-semibold mb-2 text-blue-900 dark:text-blue-100'>Gelir Vergisi Dilimleri:</h4>
                <ul className='space-y-1'>
                  <li>• 158.000 TL'ye kadar: %15</li>
                  <li>• 330.000 TL'ye kadar: %20</li>
                  <li>• 870.000 TL'ye kadar: %27</li>
                  <li>• 3.400.000 TL'ye kadar: %35</li>
                  <li>• 3.400.000 TL üzeri: %40</li>
                </ul>
              </div>
            </div>
            <div className='mt-4 text-sm text-blue-800 dark:text-blue-200'>
              <p>• Damga Vergisi: Binde 9,48</p>
              <p>• Asgari ücret gelir ve damga vergisinden muaftır</p>
              <p>
                • SGK Taban/Tavan: {formatCurrency(constants.sgkFloor)} / {formatCurrency(constants.sgkCeiling)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Calendar Panel */}
      {showPaymentCalendar && (
        <Card className='bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between text-purple-900 dark:text-purple-100'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                Yıllık Vergi ve SGK Ödeme Takvimi
              </div>
              <Button variant='ghost' size='icon' onClick={() => setShowPaymentCalendar(false)}>
                <ChevronUp className='h-4 w-4' />
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
        <Card className='bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between text-green-900 dark:text-green-100'>
              <div className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                Gelir Vergisi Dilimleri Nasıl Çalışır?
              </div>
              <Button variant='ghost' size='icon' onClick={() => setShowTaxBracketInfo(false)}>
                <ChevronUp className='h-4 w-4' />
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
                {constants.incomeTaxBrackets.map((bracket, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600'
                  >
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      {index === 0 ? '0' : formatCurrency(constants.incomeTaxBrackets[index - 1].max)} -
                      {bracket.max === Infinity ? '∞' : formatCurrency(bracket.max)} TL
                    </span>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded ${
                        bracket.rate <= 0.2
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                          : bracket.rate <= 0.3
                            ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400'
                            : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
                      }`}
                    >
                      %{(bracket.rate * 100).toFixed(0)}
                    </span>
                  </div>
                ))}
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
