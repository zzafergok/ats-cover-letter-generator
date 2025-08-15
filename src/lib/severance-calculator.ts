import { SeveranceFormData, SeveranceCalculationData } from '@/types/severance.types'
import { SEVERANCE_CONSTANTS, SEVERANCE_RULES } from '@/constants/severance.constants'

/**
 * Kıdem ve İhbar Tazminatı hesaplama fonksiyonları
 */

/**
 * İki tarih arasındaki gün farkını hesaplar
 */
export function calculateWorkDays(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime()
  return Math.floor(timeDiff / (1000 * 3600 * 24)) + 1 // +1 çünkü başlangıç günü dahil
}

/**
 * Çalışma süresini yıl, ay, gün olarak hesaplar
 */
export function calculateWorkPeriod(totalDays: number) {
  const years = Math.floor(totalDays / 365)
  const remainingDays = totalDays % 365
  const months = Math.floor(remainingDays / 30)
  const days = remainingDays % 30

  return { years, months, days }
}

/**
 * Kıdem tazminatına hak kazanılan gün sayısını hesaplar
 */
export function calculateSeveranceEligibleDays(totalWorkDays: number): number {
  if (totalWorkDays < SEVERANCE_RULES.minimumWorkDays) {
    return 0 // 1 yıldan az çalışanlara kıdem tazminatı yok
  }

  // Her tam yıl için 30 gün
  const fullYears = Math.floor(totalWorkDays / 365)
  const remainingDays = totalWorkDays % 365

  // Kalan günler için orantılı hesaplama
  const additionalDays = Math.floor((remainingDays / 365) * 30)

  return fullYears * 30 + additionalDays
}

/**
 * İhbar tazminatına hak kazanılan gün sayısını hesaplar
 */
export function calculateNoticeEligibleDays(totalWorkDays: number): number {
  if (totalWorkDays < 180) {
    // 6 aydan az
    return SEVERANCE_RULES.noticeRules.lessThan6Months
  } else if (totalWorkDays < 547) {
    // 1.5 yıldan az
    return SEVERANCE_RULES.noticeRules.lessThan18Months
  } else if (totalWorkDays < 1095) {
    // 3 yıldan az
    return SEVERANCE_RULES.noticeRules.lessThan3Years
  } else {
    // 3 yıldan fazla
    return SEVERANCE_RULES.noticeRules.moreThan3Years
  }
}

/**
 * Kıdem tazminatı tavanını tarihe göre getirir
 */
export function getSeveranceCeiling(date: Date): number {
  const month = date.getMonth() + 1 // JavaScript months are 0-indexed
  if (month >= 1 && month <= 6) {
    return SEVERANCE_CONSTANTS.severanceCeilingH1 // Ocak-Haziran
  } else {
    return SEVERANCE_CONSTANTS.severanceCeilingH2 // Temmuz-Aralık
  }
}

/**
 * Günlük brüt ücreti hesaplar (tavan kontrolü ile)
 */
export function calculateDailyGrossWage(monthlyGrossSalary: number, basisDays: number = 30, endDate: Date): number {
  const ceiling = getSeveranceCeiling(endDate)
  const cappedSalary = Math.min(monthlyGrossSalary, ceiling)
  return cappedSalary / basisDays
}

/**
 * Gelir vergisi hesaplar (kümülatif sistem)
 */
export function calculateIncomeTax(taxableAmount: number, cumulativeTaxBase: number): number {
  let totalTax = 0
  let remainingAmount = taxableAmount
  const currentYearBase = cumulativeTaxBase + taxableAmount

  for (const bracket of SEVERANCE_CONSTANTS.incomeTaxBrackets) {
    if (remainingAmount <= 0) break

    const bracketMin = Math.max(bracket.min, cumulativeTaxBase)
    const bracketMax = Math.min(bracket.max, currentYearBase)

    if (bracketMax > bracketMin) {
      const taxableInBracket = bracketMax - bracketMin
      totalTax += taxableInBracket * bracket.rate
      remainingAmount -= taxableInBracket
    }
  }

  return totalTax
}

/**
 * Damga vergisi hesaplar
 */
export function calculateStampTax(grossAmount: number): number {
  return grossAmount * SEVERANCE_CONSTANTS.stampTaxRate
}

/**
 * Kıdem ve İhbar Tazminatı ana hesaplama fonksiyonu
 */
export function calculateSeveranceCompensation(formData: SeveranceFormData): SeveranceCalculationData {
  // Tarihleri oluştur
  const workStartDate = new Date(formData.workStartYear, formData.workStartMonth - 1, formData.workStartDay)
  const workEndDate = new Date(formData.workEndYear, formData.workEndMonth - 1, formData.workEndDay)

  // Çalışma süresi hesapla
  const totalWorkDays = calculateWorkDays(workStartDate, workEndDate)
  const workPeriod = calculateWorkPeriod(totalWorkDays)

  // Maaş bilgileri
  const monthlyGrossSalary = parseFloat(formData.monthlyGrossSalary) || 0
  const cumulativeTaxBase = parseFloat(formData.cumulativeTaxBase) || 0
  const dailyGrossWage = calculateDailyGrossWage(monthlyGrossSalary, formData.calculationBasisDays, workEndDate)

  // Kıdem tazminatı hesaplama
  const severanceEligibleDays = calculateSeveranceEligibleDays(totalWorkDays)
  const severanceGrossAmount = severanceEligibleDays * dailyGrossWage
  const severanceStampTax = calculateStampTax(severanceGrossAmount)
  const severanceNetAmount = severanceGrossAmount - severanceStampTax

  // İhbar tazminatı hesaplama
  const noticeEligibleDays = calculateNoticeEligibleDays(totalWorkDays)
  const noticeGrossAmount = noticeEligibleDays * dailyGrossWage

  // İhbar tazminatı için gelir vergisi (muafiyet YOK - tam tutar vergiye tabi)
  const noticeIncomeTax = calculateIncomeTax(noticeGrossAmount, cumulativeTaxBase)
  const noticeStampTax = calculateStampTax(noticeGrossAmount)
  const noticeNetAmount = noticeGrossAmount - noticeIncomeTax - noticeStampTax

  // Toplam hesaplama
  const totalGrossAmount = severanceGrossAmount + noticeGrossAmount
  const totalTaxes = severanceStampTax + noticeIncomeTax + noticeStampTax
  const totalNetAmount = severanceNetAmount + noticeNetAmount

  return {
    // Çalışma bilgileri
    workStartDate,
    workEndDate,
    totalWorkDays,
    totalWorkYears: workPeriod.years,
    totalWorkMonths: workPeriod.months,

    // Maaş bilgileri
    monthlyGrossSalary,
    cumulativeTaxBase,

    // Kıdem tazminatı
    severanceEligibleDays,
    severanceGrossAmount,
    severanceStampTax,
    severanceNetAmount,

    // İhbar tazminatı
    noticeEligibleDays,
    noticeGrossAmount,
    noticeIncomeTax,
    noticeStampTax,
    noticeNetAmount,

    // Toplam
    totalGrossAmount,
    totalTaxes,
    totalNetAmount,
  }
}
