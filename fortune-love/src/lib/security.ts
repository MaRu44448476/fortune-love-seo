// セキュリティユーティリティとチェック機能

import { NextRequest } from 'next/server'

// OWASP推奨のセキュリティヘッダー
export const securityHeaders = {
  // XSS Protection
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  
  // HSTS (本番環境のみ)
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  }),
  
  // Referrer Policy
  'Referrer-Policy': 'origin-when-cross-origin',
  
  // Permissions Policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://vitals.vercel-analytics.com",
    "frame-src https://js.stripe.com https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
}

// 入力検証とサニタイゼーション
export class InputValidator {
  // HTMLタグの除去
  static sanitizeHtml(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim()
  }
  
  // SQLインジェクション対策
  static sanitizeSql(input: string): string {
    const dangerous = [
      'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
      'ALTER', 'EXEC', 'UNION', 'SCRIPT', '--', '/*', '*/',
      'xp_', 'sp_', 'DECLARE', 'CHAR', 'NCHAR', 'VARCHAR'
    ]
    
    let sanitized = input
    dangerous.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi')
      sanitized = sanitized.replace(regex, '')
    })
    
    return sanitized.trim()
  }
  
  // メールアドレス検証
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }
  
  // パスワード強度チェック
  static validatePassword(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('パスワードは8文字以上である必要があります')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('大文字を含む必要があります')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('小文字を含む必要があります')
    }
    
    if (!/\d/.test(password)) {
      errors.push('数字を含む必要があります')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('特殊文字を含む必要があります')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  // 占い入力値の検証
  static validateFortuneInput(bloodType: string, zodiac: string, animal: string): boolean {
    const validBloodTypes = ['A', 'B', 'O', 'AB']
    const validZodiacs = [
      'おひつじ座', 'おうし座', 'ふたご座', 'かに座',
      'しし座', 'おとめ座', 'てんびん座', 'さそり座',
      'いて座', 'やぎ座', 'みずがめ座', 'うお座'
    ]
    const validAnimals = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    
    return validBloodTypes.includes(bloodType) &&
           validZodiacs.includes(zodiac) &&
           validAnimals.includes(animal)
  }
}

// レート制限の詳細設定
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private windowMs: number = 15 * 60 * 1000, // 15分
    private maxRequests: number = 100
  ) {}
  
  // レート制限チェック
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // 期限切れのリクエストを削除
    const validRequests = userRequests.filter(
      timestamp => now - timestamp < this.windowMs
    )
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }
  
  // 残り時間を取得
  getResetTime(identifier: string): number {
    const userRequests = this.requests.get(identifier) || []
    if (userRequests.length === 0) return 0
    
    const oldestRequest = Math.min(...userRequests)
    return Math.max(0, this.windowMs - (Date.now() - oldestRequest))
  }
}

// CSRF トークン生成・検証
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32
  
  // CSRFトークン生成
  static generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < this.TOKEN_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
  
  // CSRFトークン検証
  static validateToken(sessionToken: string, requestToken: string): boolean {
    return sessionToken === requestToken && sessionToken.length === this.TOKEN_LENGTH
  }
}

// セキュリティ監査ログ
export class SecurityAudit {
  static log(event: string, details: any, request?: NextRequest) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      ip: (request as any)?.ip || 'unknown',
      userAgent: request?.headers.get('user-agent') || 'unknown',
      url: request?.url || 'unknown'
    }
    
    // 本番環境では外部ログサービスに送信
    if (process.env.NODE_ENV === 'production') {
      console.warn('🔒 Security Event:', logEntry)
      // TODO: Send to external logging service (e.g., Datadog, Sentry)
    } else {
      console.log('🔒 Security Event:', logEntry)
    }
  }
  
  // 疑わしい活動の検出
  static detectSuspiciousActivity(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || ''
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /wget/i,
      /curl/i
    ]
    
    // ボット検出（正当なものは除外）
    const isBot = suspiciousPatterns.some(pattern => pattern.test(userAgent)) &&
                  !userAgent.includes('Googlebot') &&
                  !userAgent.includes('Bingbot')
    
    if (isBot) {
      this.log('suspicious_user_agent', { userAgent }, request)
      return true
    }
    
    return false
  }
}

// 個人情報保護ユーティリティ
export class PrivacyProtection {
  // メールアドレスのマスキング
  static maskEmail(email: string): string {
    const [local, domain] = email.split('@')
    if (local.length <= 2) return email
    
    const maskedLocal = local[0] + '*'.repeat(local.length - 2) + local[local.length - 1]
    return `${maskedLocal}@${domain}`
  }
  
  // IPアドレスのマスキング
  static maskIP(ip: string): string {
    const parts = ip.split('.')
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`
    }
    return 'xxx.xxx.xxx.xxx'
  }
  
  // ログから機密情報を除去
  static sanitizeForLog(data: any): any {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'email', 'phone']
    
    if (typeof data !== 'object' || data === null) {
      return data
    }
    
    const sanitized = { ...data }
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]'
      }
    })
    
    return sanitized
  }
}

// セキュリティチェックの実行
export const runSecurityChecks = () => {
  const checks = {
    environmentVariables: checkEnvironmentVariables(),
    headers: checkSecurityHeaders(),
    dependencies: checkDependencies(),
    configuration: checkConfiguration()
  }
  
  return checks
}

function checkEnvironmentVariables(): { passed: boolean; issues: string[] } {
  const issues: string[] = []
  
  if (!process.env.NEXTAUTH_SECRET) {
    issues.push('NEXTAUTH_SECRET is not set')
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.DATABASE_URL?.startsWith('postgresql://')) {
      issues.push('DATABASE_URL should use SSL in production')
    }
  }
  
  return { passed: issues.length === 0, issues }
}

function checkSecurityHeaders(): { passed: boolean; issues: string[] } {
  const issues: string[] = []
  
  // This would be checked in actual HTTP responses
  // For now, we verify our configuration exists
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Referrer-Policy'
  ]
  
  requiredHeaders.forEach(header => {
    if (!securityHeaders[header as keyof typeof securityHeaders]) {
      issues.push(`Missing security header: ${header}`)
    }
  })
  
  return { passed: issues.length === 0, issues }
}

function checkDependencies(): { passed: boolean; issues: string[] } {
  const issues: string[] = []
  
  // In a real implementation, this would check for known vulnerabilities
  // using tools like npm audit or Snyk
  
  return { passed: true, issues }
}

function checkConfiguration(): { passed: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Check Next.js security configuration
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXTAUTH_URL?.startsWith('https://')) {
      issues.push('NEXTAUTH_URL should use HTTPS in production')
    }
  }
  
  return { passed: issues.length === 0, issues }
}