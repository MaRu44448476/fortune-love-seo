import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// レート制限用のマップ
const rateLimit = new Map()

// レート制限設定
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15分
  maxRequests: 100, // 最大リクエスト数
  skipSuccessfulRequests: false,
}

// APIエンドポイント別制限
const API_LIMITS = {
  '/api/fortune': { windowMs: 60 * 1000, maxRequests: 10 }, // 1分間に10回
  '/api/ranking': { windowMs: 60 * 1000, maxRequests: 20 }, // 1分間に20回
  '/api/og': { windowMs: 60 * 1000, maxRequests: 30 }, // 1分間に30回
}

function getIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  const remote = (request as NextRequest & { ip?: string }).ip
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (real) {
    return real
  }
  return remote || '127.0.0.1'
}

function isRateLimited(ip: string, endpoint: string): boolean {
  const now = Date.now()
  const config = API_LIMITS[endpoint as keyof typeof API_LIMITS] || RATE_LIMIT_CONFIG
  
  const key = `${ip}:${endpoint}`
  const userRequests = rateLimit.get(key) || []
  
  // 期限切れのリクエストを削除
  const validRequests = userRequests.filter(
    (timestamp: number) => now - timestamp < config.windowMs
  )
  
  if (validRequests.length >= config.maxRequests) {
    return true
  }
  
  validRequests.push(now)
  rateLimit.set(key, validRequests)
  
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 静的ファイルはスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // セキュリティヘッダーを設定
  const response = NextResponse.next()
  
  // 本番環境でのセキュリティヘッダー
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com;"
    )
  }

  // APIエンドポイントのレート制限
  if (pathname.startsWith('/api/')) {
    const ip = getIP(request)
    
    if (isRateLimited(ip, pathname)) {
      return new NextResponse(
        JSON.stringify({ 
          error: 'レート制限に達しました。しばらく待ってから再試行してください。',
          retryAfter: Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(RATE_LIMIT_CONFIG.windowMs / 1000).toString(),
          },
        }
      )
    }
  }


  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}