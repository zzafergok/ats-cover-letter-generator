import { Metadata } from 'next'

import { SeveranceCalculator } from '@/components/ui/severance/SeveranceCalculator'

export const metadata: Metadata = {
  title: 'Kıdem ve İhbar Tazminatı Hesaplama | Talent Architect',
  description:
    '2025 yılı güncel vergi oranları ile kıdem ve ihbar tazminatı hesaplama aracı. Yasal düzenlemeler ve vergi hesaplamaları dahil.',
}

export default function SeveranceCalculatorPage() {
  return (
    <div className='container mx-auto py-8'>
      <SeveranceCalculator />
    </div>
  )
}
