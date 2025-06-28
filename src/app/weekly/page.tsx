'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Crown, 
  Heart, 
  Briefcase, 
  Activity, 
  DollarSign, 
  Star,
  ChevronLeft,
  ChevronRight,
  Lock,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import Header from '@/components/Header'
import Link from 'next/link'

interface WeeklyFortuneData {
  id: string
  overallScore: number
  loveScore: number
  workScore: number
  healthScore: number
  moneyScore: number
  dailyAdvice: Record<string, string>
  weeklyAdvice: string
  luckyDays: string[]
  unluckyDays: string[]
  compatibility: {
    bestMatch: string
    goodMatches: string[]
    challenges: string[]
  }
  weekStartFormatted: string
  weekEndFormatted?: string
}

export default function WeeklyFortunePage() {
  const { data: session, status } = useSession()
  const [weeklyFortune, setWeeklyFortune] = useState<WeeklyFortuneData | null>(null)
  const [history, setHistory] = useState<WeeklyFortuneData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedWeek, setSelectedWeek] = useState(0) // 0 = current week

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      setError('ログインが必要です')
      setLoading(false)
      return
    }

    fetchWeeklyFortune()
    fetchHistory()
  }, [session, status])

  const fetchWeeklyFortune = async () => {
    try {
      // ユーザープロフィールから血液型等を取得
      const profileResponse = await fetch('/api/profile')
      if (!profileResponse.ok) {
        throw new Error('プロフィール情報の取得に失敗しました')
      }

      const profileData = await profileResponse.json()
      if (!profileData.profile?.bloodType || !profileData.profile?.zodiac || !profileData.profile?.animal) {
        setError('プロフィール設定を完了してください')
        setLoading(false)
        return
      }

      const fortuneResponse = await fetch('/api/weekly-fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloodType: profileData.profile.bloodType,
          zodiac: profileData.profile.zodiac,
          animal: profileData.profile.animal,
        }),
      })

      if (fortuneResponse.status === 403) {
        setError('プレミアムプランへの加入が必要です')
        setLoading(false)
        return
      }

      if (!fortuneResponse.ok) {
        throw new Error('週間占いの取得に失敗しました')
      }

      const fortuneData = await fortuneResponse.json()
      setWeeklyFortune(fortuneData.weeklyFortune)
    } catch (err) {
      setError(err instanceof Error ? err.message : '週間占いの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/weekly-fortune?weeks=8')
      if (response.ok) {
        const data = await response.json()
        setHistory(data.weeklyHistory || [])
      }
    } catch (err) {
      console.error('Failed to fetch weekly history:', err)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50'
    if (score >= 60) return 'text-purple-600 bg-purple-50'
    if (score >= 40) return 'text-blue-600 bg-blue-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🔥'
    if (score >= 60) return '✨'
    if (score >= 40) return '⭐'
    return '📊'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">週間占いを読み込み中...</p>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🌟 プレミアム機能</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-bold text-yellow-800 mb-3">週間占いでできること</h3>
                  <ul className="text-left text-yellow-700 space-y-2">
                    <li>• 7日間の詳細な運勢予報</li>
                    <li>• 恋愛・仕事・健康・金運の個別分析</li>
                    <li>• ラッキーデー・注意日の予測</li>
                    <li>• 相性の良い属性との出会い情報</li>
                    <li>• 過去の週間占い履歴の閲覧</li>
                  </ul>
                </div>
                <Link 
                  href="/premium"
                  className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
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

  const currentFortune = selectedWeek === 0 ? weeklyFortune : history[selectedWeek - 1]

  if (!currentFortune) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-600">週間占いデータが見つかりません</p>
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
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          🌟 週間占い 🌟
        </h1>
        <p className="text-lg text-gray-600">7日間の詳細な運勢をお届け</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-yellow-600 font-medium">プレミアム限定</span>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        {/* Week Navigation */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => setSelectedWeek(Math.min(selectedWeek + 1, history.length))}
              disabled={selectedWeek >= history.length}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="bg-white rounded-2xl px-6 py-3 shadow-md">
              <Calendar className="w-5 h-5 inline mr-2 text-purple-600" />
              <span className="font-semibold">
                {selectedWeek === 0 ? '今週' : `${selectedWeek}週前`}: {currentFortune.weekStartFormatted}
                {currentFortune.weekEndFormatted && ` 〜 ${currentFortune.weekEndFormatted}`}
              </span>
            </div>
            
            <button
              onClick={() => setSelectedWeek(Math.max(selectedWeek - 1, 0))}
              disabled={selectedWeek <= 0}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 text-center mb-8 border-4 border-purple-200"
        >
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">今週の総合運</h2>
          
          <div className={`text-7xl font-bold mb-2 ${getScoreColor(currentFortune.overallScore).replace('bg-', '').replace('50', '600')}`}>
            {currentFortune.overallScore}
          </div>
          <div className="text-lg text-gray-600 mb-4">/ 100</div>
          <div className="text-4xl mb-4">{getScoreIcon(currentFortune.overallScore)}</div>
          
          <div className="bg-purple-50 rounded-2xl p-4">
            <p className="text-purple-700 font-medium">{currentFortune.weeklyAdvice}</p>
          </div>
        </motion.div>

        {/* Detailed Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: '恋愛運', score: currentFortune.loveScore, icon: Heart, color: 'pink' },
            { label: '仕事運', score: currentFortune.workScore, icon: Briefcase, color: 'blue' },
            { label: '健康運', score: currentFortune.healthScore, icon: Activity, color: 'green' },
            { label: '金運', score: currentFortune.moneyScore, icon: DollarSign, color: 'yellow' }
          ].map((item, index) => (
            <div key={item.label} className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <item.icon className={`w-8 h-8 text-${item.color}-500 mx-auto mb-3`} />
              <h3 className="font-bold text-gray-800 mb-2">{item.label}</h3>
              <div className={`text-4xl font-bold ${getScoreColor(item.score).replace('bg-', '').replace('50', '600')} mb-2`}>
                {item.score}
              </div>
              <div className="text-2xl">{getScoreIcon(item.score)}</div>
            </div>
          ))}
        </motion.div>

        {/* Daily Advice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📅 日別アドバイス</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(currentFortune.dailyAdvice).map(([day, advice]) => (
              <div key={day} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                <h3 className="font-bold text-purple-800 mb-2">{day}</h3>
                <p className="text-purple-700 text-sm">{advice}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lucky & Unlucky Days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6" />
              ラッキーデー
            </h2>
            <div className="space-y-2">
              {currentFortune.luckyDays.map((day, index) => (
                <div key={index} className="bg-green-50 rounded-xl p-3 text-green-700 font-medium">
                  ✨ {day}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              注意日
            </h2>
            <div className="space-y-2">
              {currentFortune.unluckyDays.map((day, index) => (
                <div key={index} className="bg-orange-50 rounded-xl p-3 text-orange-700 font-medium">
                  ⚠️ {day}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">💕 今週の相性</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-bold text-pink-800 mb-3">💖 最高の相性</h3>
              <div className="bg-pink-50 rounded-2xl p-4">
                <div className="text-2xl mb-2">👑</div>
                <p className="text-pink-700 font-semibold">{currentFortune.compatibility.bestMatch}</p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-bold text-purple-800 mb-3">✨ 良い相性</h3>
              <div className="space-y-2">
                {currentFortune.compatibility.goodMatches.map((match, index) => (
                  <div key={index} className="bg-purple-50 rounded-xl p-3">
                    <p className="text-purple-700">{match}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-bold text-gray-800 mb-3">⚡ 要注意</h3>
              <div className="space-y-2">
                {currentFortune.compatibility.challenges.map((challenge, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-700">{challenge}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all mr-4"
          >
            今日の占いへ戻る
          </Link>
          <Link 
            href="/profile"
            className="inline-block bg-white border-2 border-purple-200 text-purple-600 px-8 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
          >
            プロフィール設定
          </Link>
        </motion.div>
      </div>
    </div>
  )
}