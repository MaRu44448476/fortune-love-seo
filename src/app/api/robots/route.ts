import { NextResponse } from 'next/server'

export function GET() {
  const robotsTxt = `
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://fortune-love.com'}/sitemap.xml

# 除外ページ
Disallow: /api/
Disallow: /auth/
Disallow: /_next/
Disallow: /profile/
Disallow: /premium/success/

# 検索エンジン向け最適化
Crawl-delay: 1

# 主要ページの明示
Allow: /
Allow: /ranking
Allow: /premium
Allow: /weekly
Allow: /analysis
`.trim()

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}