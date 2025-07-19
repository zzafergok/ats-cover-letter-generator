'use client'

import { AuthHeader } from '@/components/layout/AuthNavbar'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className='min-h-screen bg-gray-50'>
        <AuthHeader />
        <main className='min-h-screen bg-background'>{children}</main>
      </div>
    </ProtectedRoute>
  )
}
