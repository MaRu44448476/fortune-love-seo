'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Crown, 
  User, 
  Heart, 
  Briefcase, 
  Activity, 
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
  Lock,
  Star,
  Brain,
  Lightbulb,
  Shield
} from 'lucide-react'
import Header from '@/components/Header'
import Link from 'next/link'
import type { DetailedAnalysisResult } from '@/lib/detailedAnalysis'

export default function DetailedAnalysisPage() {
  const { data: session, status } = useSession()
  const [analysis, setAnalysis] = useState<DetailedAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      setError('ログインが必要です')
      setLoading(false)
      return
    }

    fetchDetailedAnalysis()
  }, [session, status])

  const fetchDetailedAnalysis = async () => {
    try {
      const response = await fetch('/api/detailed-analysis')
      
      if (response.status === 403) {
        setError('プレミアムプランへの加入が必要です')
        setLoading(false)
        return
      }

      if (response.status === 400) {
        setError('プロフィール設定を完了してください')
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error('詳細分析の取得に失敗しました')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : '詳細分析の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">詳細分析を生成中...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            {error === 'プレミアムプランへの加入が必要です' ? (
              <>
                <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🔮 詳細分析レポート</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-purple-800 mb-3">詳細分析でわかること</h3>
                  <ul className="text-left text-purple-700 space-y-2">
                    <li>• あなたの性格の詳細プロフィール</li>
                    <li>• 恋愛・仕事・健康・金運の深い分析</li>
                    <li>• 理想的なパートナーの特徴</li>
                    <li>• 今月のベストタイミング</li>
                    <li>• 具体的な行動プラン</li>
                    <li>• パーソナル数秘術</li>
                  </ul>
                </div>
                <Link 
                  href="/premium"
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  プレミアムプランを見る
                </Link>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">😔</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">エラーが発生しました</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                {error === 'プロフィール設定を完了してください' ? (
                  <Link 
                    href="/profile"
                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
                  >
                    プロフィール設定へ
                  </Link>
                ) : error === 'ログインが必要です' ? (
                  <Link 
                    href="/api/auth/signin"
                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
                  >
                    ログインする
                  </Link>
                ) : (
                  <button 
                    onClick={() => window.location.reload()}
                    className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
                  >
                    再読み込み
                  </button>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">詳細分析データが見つかりません</p>
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
          <Brain className="w-12 h-12 text-purple-500" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            詳細分析レポート
          </h1>
        </div>
        <p className="text-lg text-gray-600">あなたの運勢を深く解析</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-yellow-600 font-medium">プレミアム限定</span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Personality Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <User className="w-8 h-8 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-800">あなたの性格プロフィール</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-purple-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                核となる特徴
              </h3>
              <div className="space-y-2">
                {analysis.personalityProfile.coreTraits.map((trait, index) => (
                  <div key={index} className="bg-purple-50 rounded-xl p-3 text-purple-700">
                    • {trait}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-green-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                あなたの強み
              </h3>
              <div className="space-y-2">
                {analysis.personalityProfile.strengths.map((strength, index) => (
                  <div key={index} className="bg-green-50 rounded-xl p-3 text-green-700">
                    • {strength}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-orange-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                成長ポイント
              </h3>
              <div className="space-y-2">
                {analysis.personalityProfile.challenges.map((challenge, index) => (
                  <div key={index} className="bg-orange-50 rounded-xl p-3 text-orange-700">
                    • {challenge}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="bg-pink-50 rounded-2xl p-6">
              <h3 className="font-bold text-pink-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                恋愛スタイル
              </h3>
              <p className="text-pink-700">{analysis.personalityProfile.loveStyle}</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                コミュニケーション
              </h3>
              <p className="text-blue-700">{analysis.personalityProfile.communicationStyle}</p>
            </div>
          </div>
        </motion.div>

        {/* Fortune Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-pink-500" />
            <h2 className="text-2xl font-bold text-gray-800">運勢の詳細分析</h2>
          </div>

          <div className="space-y-6">
            {[
              { icon: Heart, title: '恋愛運', content: analysis.fortuneBreakdown.loveDetailedAnalysis, color: 'pink' },
              { icon: Briefcase, title: '仕事運', content: analysis.fortuneBreakdown.workDetailedAnalysis, color: 'blue' },
              { icon: Activity, title: '健康運', content: analysis.fortuneBreakdown.healthDetailedAnalysis, color: 'green' },
              { icon: DollarSign, title: '金運', content: analysis.fortuneBreakdown.moneyDetailedAnalysis, color: 'yellow' }
            ].map((item, index) => (
              <div key={item.title} className={`bg-${item.color}-50 rounded-2xl p-6`}>
                <h3 className={`font-bold text-${item.color}-800 mb-3 flex items-center gap-2`}>
                  <item.icon className="w-6 h-6" />
                  {item.title}
                </h3>
                <p className={`text-${item.color}-700`}>{item.content}</p>
              </div>
            ))}

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                総合的な洞察
              </h3>
              <p className="text-purple-700">{analysis.fortuneBreakdown.overallInsights}</p>
            </div>
          </div>
        </motion.div>

        {/* Compatibility Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-800">相性分析</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-red-800 mb-4">💖 理想のパートナー</h3>
              <div className="bg-red-50 rounded-2xl p-6 mb-4">
                <p className="text-red-700 mb-4">{analysis.compatibilityAnalysis.idealPartner.description}</p>
                <div className="space-y-2">
                  {analysis.compatibilityAnalysis.idealPartner.traits.map((trait, index) => (
                    <div key={index} className="text-red-600 text-sm">• {trait}</div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">相性の良い星座</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.compatibilityAnalysis.idealPartner.zodiacMatches.map((zodiac, index) => (
                    <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      {zodiac}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-purple-800 mb-4">💝 恋愛アドバイス</h3>
              <div className="space-y-3 mb-6">
                {analysis.compatibilityAnalysis.relationshipAdvice.map((advice, index) => (
                  <div key={index} className="bg-purple-50 rounded-xl p-3 text-purple-700 text-sm">
                    • {advice}
                  </div>
                ))}
              </div>

              <h4 className="font-semibold text-purple-800 mb-2">コミュニケーションのコツ</h4>
              <div className="space-y-2">
                {analysis.compatibilityAnalysis.communicationTips.map((tip, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl p-3 text-blue-700 text-sm">
                    • {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timing Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-800">最適なタイミング</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-green-800 mb-4">🌟 今月のベストデート</h3>
              <div className="space-y-2 mb-6">
                {analysis.timing.bestDatesThisMonth.map((date, index) => (
                  <div key={index} className="bg-green-50 rounded-xl p-3 text-green-700 font-medium">
                    ✨ {date}
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-orange-800 mb-4">⚠️ 注意が必要な日</h3>
              <div className="space-y-2">
                {analysis.timing.cautionDates.map((date, index) => (
                  <div key={index} className="bg-orange-50 rounded-xl p-3 text-orange-700">
                    🚨 {date}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-blue-800 mb-4">⏰ 最適な時間帯</h3>
              <div className="bg-blue-50 rounded-2xl p-6 mb-6">
                <p className="text-blue-700 font-medium text-lg">{analysis.timing.optimalTimeOfDay}</p>
              </div>

              <h3 className="font-bold text-purple-800 mb-4">🌸 季節の影響</h3>
              <div className="bg-purple-50 rounded-2xl p-6">
                <p className="text-purple-700">{analysis.timing.seasonalInfluence}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-emerald-500" />
            <h2 className="text-2xl font-bold text-gray-800">具体的な行動プラン</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                今週の行動
              </h3>
              <div className="space-y-3">
                {analysis.actionPlan.shortTerm.map((action, index) => (
                  <div key={index} className="bg-emerald-50 rounded-xl p-3 text-emerald-700 text-sm">
                    • {action}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                今月の目標
              </h3>
              <div className="space-y-3">
                {analysis.actionPlan.mediumTerm.map((action, index) => (
                  <div key={index} className="bg-blue-50 rounded-xl p-3 text-blue-700 text-sm">
                    • {action}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                3ヶ月計画
              </h3>
              <div className="space-y-3">
                {analysis.actionPlan.longTerm.map((action, index) => (
                  <div key={index} className="bg-purple-50 rounded-xl p-3 text-purple-700 text-sm">
                    • {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Numerology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-800">パーソナル数秘術</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl font-bold text-white">{analysis.numerology.personalNumber}</span>
                </div>
                <h3 className="font-bold text-amber-800 text-xl">あなたのパーソナルナンバー</h3>
                <p className="text-amber-600 mt-2">{analysis.numerology.numerologyMeaning}</p>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">🍀 ラッキーナンバー</h4>
                  <div className="flex gap-2">
                    {analysis.numerology.luckyNumbers.map((num, index) => (
                      <div key={index} className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-green-700">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ 注意ナンバー</h4>
                  <div className="flex gap-2">
                    {analysis.numerology.unluckyNumbers.map((num, index) => (
                      <div key={index} className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-red-700">{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all mr-4"
          >
            今日の占いへ戻る
          </Link>
          <Link 
            href="/weekly"
            className="inline-block bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all mr-4"
          >
            週間占いを見る
          </Link>
          <Link 
            href="/profile"
            className="inline-block bg-white border-2 border-purple-200 text-purple-600 px-8 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
          >
            プロフィール
          </Link>
        </motion.div>
      </div>
    </div>
  )
}