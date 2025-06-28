'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Calendar,
  TrendingUp,
  Heart,
  Shield,
  Clock,
  Gift,
  Sparkles,
  X
} from 'lucide-react'
import Header from '@/components/Header'
import Link from 'next/link'
import { PREMIUM_PLANS, PLAN_FEATURES, formatPrice, type PlanType } from '@/lib/stripe'

function PremiumContent() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly')
  const [loading, setLoading] = useState(false)
  const [userStatus, setUserStatus] = useState<'free' | 'premium' | 'trial' | null>(null)
  const [premiumInfo, setPremiumInfo] = useState<any>(null)
  
  const canceled = searchParams.get('canceled')

  useEffect(() => {
    if (session?.user) {
      checkUserStatus()
    }
  }, [session])

  const checkUserStatus = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        if (data.user?.isPremium) {
          setUserStatus('premium')
          setPremiumInfo(data.user)
        } else {
          setUserStatus('free')
        }
      }
    } catch (error) {
      console.error('Failed to check user status:', error)
    }
  }

  const handleSubscribe = async (planType: PlanType) => {
    if (!session) {
      // NextAuthのデフォルト認証ページを使用
      window.location.href = '/api/auth/signin'
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType }),
      })

      const data = await response.json()

      if (response.ok) {
        window.location.href = data.checkoutUrl
      } else {
        alert(data.error || '決済の準備に失敗しました')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('決済の準備中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <Header />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center pt-8 pb-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Crown className="w-12 h-12 text-yellow-500" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            プレミアムプラン
          </h1>
        </div>
        <p className="text-lg text-gray-600 mb-2">さらに詳しい占いで、あなたの恋愛をサポート</p>
        <div className="flex items-center justify-center gap-2">
          <Gift className="w-5 h-5 text-green-500" />
          <span className="text-green-600 font-semibold">7日間無料体験</span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Canceled Message */}
        {canceled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <X className="w-5 h-5" />
              <span>決済がキャンセルされました。いつでも再度お試しいただけます。</span>
            </div>
          </motion.div>
        )}

        {/* Premium Status */}
        {userStatus === 'premium' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-3xl p-8 mb-8 text-center"
          >
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">プレミアム会員</h2>
            <p className="text-yellow-700 mb-4">いつもご利用いただきありがとうございます！</p>
            {premiumInfo?.premiumUntil && (
              <p className="text-sm text-yellow-600">
                次回更新日: {new Date(premiumInfo.premiumUntil).toLocaleDateString('ja-JP')}
              </p>
            )}
            <div className="mt-6 space-y-3">
              <Link 
                href="/weekly"
                className="block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-2xl font-semibold transition-colors"
              >
                週間占いを見る
              </Link>
              <Link 
                href="/profile"
                className="block bg-white border-2 border-yellow-300 text-yellow-700 px-6 py-3 rounded-2xl font-semibold hover:bg-yellow-50 transition-colors"
              >
                設定・履歴を見る
              </Link>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            プレミアムで使える機能
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: '週間占い',
                description: '7日間の詳細な運勢予報をお届け',
                color: 'purple'
              },
              {
                icon: TrendingUp,
                title: '詳細分析',
                description: '恋愛・仕事・健康・金運を個別分析',
                color: 'blue'
              },
              {
                icon: Heart,
                title: '相性診断',
                description: '相性の良い属性との詳細マッチング',
                color: 'pink'
              },
              {
                icon: Clock,
                title: '過去履歴',
                description: '過去の占い結果を無制限で閲覧',
                color: 'green'
              },
              {
                icon: Sparkles,
                title: 'パーソナライズ',
                description: 'あなた専用のアドバイス生成',
                color: 'yellow'
              },
              {
                icon: Shield,
                title: '優先サポート',
                description: '優先的にサポートを受けられます',
                color: 'indigo'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <feature.icon className={`w-12 h-12 text-${feature.color}-500 mb-4`} />
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Plans */}
        {userStatus !== 'premium' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              料金プラン
            </h2>
            
            {/* Plan Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-2 shadow-lg">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedPlan === 'monthly'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  月額プラン
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                    selectedPlan === 'yearly'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  年額プラン
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    お得
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {Object.entries(PREMIUM_PLANS).map(([planKey, plan]) => {
                const isSelected = planKey === selectedPlan
                const isYearly = planKey === 'yearly'
                
                return (
                  <motion.div
                    key={planKey}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`bg-white rounded-3xl p-8 shadow-xl border-4 transition-all ${
                      isSelected 
                        ? 'border-purple-400 shadow-2xl scale-105' 
                        : 'border-gray-200 hover:border-purple-200'
                    } ${!isSelected && selectedPlan !== planKey ? 'opacity-70' : ''}`}
                  >
                    {isYearly && (
                      <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-4 text-center">
                        2ヶ月分お得！
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-purple-600">
                          {formatPrice(plan.amount)}
                        </span>
                        <span className="text-gray-600">/{plan.interval === 'month' ? '月' : '年'}</span>
                      </div>
                      
                      {isYearly && (
                        <p className="text-sm text-green-600 font-medium">
                          月額換算 {formatPrice(plan.amount / 12)}/月
                        </p>
                      )}
                    </div>

                    <div className="space-y-3 mb-8">
                      {PLAN_FEATURES.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-center">
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-3 mb-4">
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <Gift className="w-5 h-5" />
                          <span className="font-semibold">7日間無料体験</span>
                        </div>
                        <p className="text-green-600 text-sm mt-1">
                          体験期間中はいつでもキャンセル可能
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleSubscribe(planKey as PlanType)}
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-bold transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            処理中...
                          </div>
                        ) : (
                          `無料体験を始める`
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Free Trial Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="max-w-2xl mx-auto mt-12 bg-white rounded-3xl p-8 shadow-lg"
            >
              <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                ✨ 7日間無料体験について
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>7日間はすべてのプレミアム機能を無料でお試しいただけます</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>体験期間中はいつでもキャンセル可能です</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>キャンセルした場合、料金は一切発生しません</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p>体験期間終了後、自動的に有料プランに移行します</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all mr-4"
          >
            今日の占いへ戻る
          </Link>
          {!session && (
            <Link 
              href="/api/auth/signin"
              className="inline-block bg-white border-2 border-purple-200 text-purple-600 px-8 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
            >
              ログインする
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function PremiumPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      </div>
    }>
      <PremiumContent />
    </Suspense>
  )
}