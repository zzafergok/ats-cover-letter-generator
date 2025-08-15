import { SeveranceConstants } from '@/types/severance.types'

/**
 * 2025 yılı Kıdem ve İhbar Tazminatı hesaplama sabitleri
 */
export const SEVERANCE_CONSTANTS: SeveranceConstants = {
  // 2025 damga vergisi oranı (binde 7.59)
  stampTaxRate: 0.00759,

  // 2025 gelir vergisi dilimleri (kıdem tazminatı tavanını aşan kısım ve ihbar tazminatı için)
  incomeTaxBrackets: [
    { min: 0, max: 158000, rate: 0.15 }, // %15
    { min: 158000, max: 330000, rate: 0.2 }, // %20
    { min: 330000, max: 870000, rate: 0.27 }, // %27
    { min: 870000, max: 3400000, rate: 0.35 }, // %35
    { min: 3400000, max: Infinity, rate: 0.4 }, // %40
  ],

  // 2025 kıdem tazminatı tavan tutarları (resmi kaynaklardan)
  severanceCeilingH1: 46655.43, // Ocak-Haziran 2025
  severanceCeilingH2: 53919.68, // Temmuz-Aralık 2025

  // İhbar tazminatı için gelir vergisi muafiyeti
  // DİKKAT: İhbar tazminatı gelir vergisinden muaf DEĞİLDİR!
  // Bu değer kullanılmayacak, sadece referans için bırakıldı
  noticeExemptionAmount: 0, // İhbar tazminatı muaf değil
}

/**
 * Kıdem tazminatı hesaplama kuralları
 */
export const SEVERANCE_RULES = {
  // Kıdem tazminatı için minimum çalışma süresi (gün)
  minimumWorkDays: 365,

  // Kıdem tazminatına esas günlük ücret hesaplama (varsayılan 30 gün)
  defaultBasisDays: 30,

  // İhbar süresi hesaplaması
  noticeRules: {
    // Çalışma süresine göre ihbar süreleri (gün)
    lessThan6Months: 0, // 6 aydan az
    lessThan18Months: 15, // 6 ay - 1.5 yıl: 2 hafta
    lessThan3Years: 30, // 1.5 - 3 yıl: 4 hafta
    moreThan3Years: 45, // 3 yıldan fazla: 6 hafta
  },
}
