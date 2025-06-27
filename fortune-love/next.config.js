const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
        },
      },
    },
    {
      urlPattern: /\/api\/fortune/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'fortune-api',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60, // 1時間
        },
      },
    },
    {
      urlPattern: /\/api\/og/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'og-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7日間
        },
      },
    },
  ],
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // パフォーマンス最適化設定
  compress: true,
  poweredByHeader: false,
  
  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 実験的機能の有効化
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // Turbopack設定
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // webpack最適化
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // プロダクション環境でのバンドル最適化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Common code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      }
    }

    return config
  },

  // HTTPヘッダー最適化
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        // 静的アセットのキャッシュ設定
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes のキャッシュ設定
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
      {
        // OG画像のキャッシュ設定
        source: '/api/og',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ]
  },

  // リダイレクト設定
  async redirects() {
    return [
      // SEO改善のための URL 正規化
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = withPWA(nextConfig)