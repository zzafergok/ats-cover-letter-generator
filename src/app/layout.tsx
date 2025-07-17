import type { Metadata } from 'next'

import I18nProvider from '@/providers/I18nProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Starkon Kanban',
  description: 'Modern task management platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='tr'>
      <body className=''>
        <ReactQueryProvider>
          {/* Mevcut AuthProvider korunuyor */}
          <AuthProvider>
            <ThemeProvider>
              <I18nProvider>
                <ToastProvider>{children}</ToastProvider>
              </I18nProvider>
            </ThemeProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
