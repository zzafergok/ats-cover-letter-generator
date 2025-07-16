/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // CSS optimizasyonlarını devre dışı bırak
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // optimizeCss seçeneğini geçici olarak kaldır
  },

  // Turbopack için basit konfigürasyon
  turbopack: {
    // CSS loader'larını kaldır
  },

  // Webpack konfigürasyonunu minimal tut
  webpack: (config, { isServer }) => {
    // Bundle analyzer sadece production için
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        }),
      )
    }

    // Server-side için fallback ayarları
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },

  // Environment variables
  env: {
    CUSTOM_BUILD_ID: process.env.BUILD_ID || 'development',
  },
}

export default nextConfig
