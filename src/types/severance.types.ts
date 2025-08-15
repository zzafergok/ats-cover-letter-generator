/**
 * Kıdem ve İhbar Tazminatı hesaplama için type definitions
 */

export interface SeveranceCalculationData {
  // Çalışma bilgileri
  workStartDate: Date
  workEndDate: Date
  totalWorkDays: number
  totalWorkYears: number
  totalWorkMonths: number

  // Maaş bilgileri
  monthlyGrossSalary: number
  cumulativeTaxBase: number

  // Hesaplama sonuçları
  severanceEligibleDays: number
  severanceGrossAmount: number
  severanceStampTax: number
  severanceNetAmount: number

  // İhbar tazminatı
  noticeEligibleDays: number
  noticeGrossAmount: number
  noticeIncomeTax: number
  noticeStampTax: number
  noticeNetAmount: number

  // Toplam
  totalGrossAmount: number
  totalTaxes: number
  totalNetAmount: number
}

export interface SeveranceFormData {
  // İş başlama tarihi
  workStartDay: number
  workStartMonth: number
  workStartYear: number

  // İşten ayrılma tarihi
  workEndDay: number
  workEndMonth: number
  workEndYear: number

  // Maaş bilgileri
  monthlyGrossSalary: string // String olarak tutacağız formatting için
  cumulativeTaxBase: string // String olarak tutacağız formatting için

  // Hesaplama parametresi
  calculationBasisDays: number // Kıdem tazminatına esas gün sayısı (default: 30)
}

export interface SeveranceConstants {
  // 2025 damga vergisi oranı
  stampTaxRate: number // 0.00759 (binde 7.59)

  // Gelir vergisi dilimleri (kıdem tazminatı tavanını aşan kısım için)
  incomeTaxBrackets: Array<{
    min: number
    max: number
    rate: number
  }>

  // 2025 kıdem tazminatı tavan tutarları
  severanceCeilingH1: number // Ocak-Haziran 2025
  severanceCeilingH2: number // Temmuz-Aralık 2025

  // İhbar tazminatı için gelir vergisi muafiyet tutarı
  noticeExemptionAmount: number
}
