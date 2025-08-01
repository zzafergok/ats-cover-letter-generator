import { Metadata } from 'next'

import { SalaryCalculator } from '@/components/ui/salary/SalaryCalculator'

export const metadata: Metadata = {
  title: 'Maaş Hesaplama - Türkiye 2025',
  description: 'Güncel vergi oranları ve SGK primleri ile brüt-net maaş hesaplama aracı. 2025 yılı parametreleri.',
}

export default function SalaryCalculatorPage() {
  return (
    <div className='container mx-auto py-8'>
      <SalaryCalculator />
    </div>
  )
}
