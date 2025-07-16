import React from 'react'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-neutral-900'>
      <PublicNavbar />
      <main className='flex-1 w-full bg-white dark:bg-neutral-900'>{children}</main>
      <PublicFooter />
    </div>
  )
}
