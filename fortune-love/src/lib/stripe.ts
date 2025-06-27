import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set - using placeholder for build')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// プレミアムプランの設定
export const PREMIUM_PLANS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_premium',
    amount: 980, // 980円
    interval: 'month' as const,
    name: '月額プレミアムプラン',
    description: 'いつでもキャンセル可能',
  },
  yearly: {
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly_premium',
    amount: 9800, // 9,800円（月額の10ヶ月分）
    interval: 'year' as const,
    name: '年額プレミアムプラン',
    description: '2ヶ月分お得！',
  },
} as const

export type PlanType = keyof typeof PREMIUM_PLANS

// プランの詳細情報
export const PLAN_FEATURES = [
  '📅 週間占い（7日間の詳細予報）',
  '📊 詳細分析レポート',
  '💎 過去の占い履歴無制限閲覧',
  '🌟 相性診断の詳細解説',
  '🎯 パーソナライズされたアドバイス',
  '📱 優先サポート',
  '🔮 新機能の先行アクセス'
]

// Stripe Webhook用のイベントタイプ
export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.payment_succeeded',
  INVOICE_FAILED: 'invoice.payment_failed',
} as const

// 7日間無料体験の設定
export const FREE_TRIAL_DAYS = 7

// 日本円での価格表示用フォーマッター
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount)
}

// プレミアムステータスの確認
export function isPremiumActive(user: { isPremium: boolean; premiumUntil: Date | null }): boolean {
  if (!user.isPremium) return false
  if (!user.premiumUntil) return true // 無期限プレミアム
  return user.premiumUntil > new Date()
}

// 残り日数の計算
export function getDaysUntilExpiry(premiumUntil: Date | null): number | null {
  if (!premiumUntil) return null
  const now = new Date()
  const expiry = new Date(premiumUntil)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}