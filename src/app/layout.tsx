import type { Metadata, Viewport } from 'next'
import React from 'react'
import { ClientProviders } from '@/providers/ClientProviders'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Starkon Template - Modern React Component Library',
    template: '%s | Starkon Template',
  },
  description:
    'Enterprise seviyede React component kütüphanesi. Radix UI tabanlı, erişilebilir ve özelleştirilebilir komponentler.',
  keywords: ['React', 'Next.js', 'UI Kit', 'Components', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'Zafer Gök', url: 'https://github.com/zzafergok' }],
  creator: 'Zafer Gök',
  publisher: 'Starkon Template',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/tr',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: '/',
    title: 'Starkon Template - Modern React Component Library',
    description: 'Enterprise seviyede React component kütüphanesi.',
    siteName: 'Starkon Template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starkon Template - Modern React Component Library',
    description: 'Enterprise seviyede React component kütüphanesi.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='tr' suppressHydrationWarning className='theme-loading' style={{ scrollbarGutter: 'stable' }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Scrollbar-gutter desteği kontrol et ve uygula
                  if (CSS && CSS.supports && CSS.supports('scrollbar-gutter', 'stable')) {
                    document.documentElement.style.scrollbarGutter = 'stable';
                    document.body.style.scrollbarGutter = 'stable';
                  }
                  
                  // Tema başlatma
                  var html = document.documentElement;
                  var theme = localStorage.getItem('theme') || 'system';
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var effectiveTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
                  
                  html.classList.remove('light', 'dark', 'theme-loading');
                  html.classList.add(effectiveTheme);
                  html.style.colorScheme = effectiveTheme;
                  
                  requestAnimationFrame(function() {
                    html.style.visibility = 'visible';
                  });
                } catch (e) {
                  console.warn('Initialization failed:', e);
                  document.documentElement.classList.add('light');
                  document.documentElement.style.visibility = 'visible';
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className='bg-background text-foreground antialiased'>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
