'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Crown, Check, Calendar, Gift, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import Link from 'next/link'

function PremiumSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // セッション詳細を取得する場合
      // 現在はシンプルに成功表示のみ
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">処理中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-white" />
            </div>
            <Crown className="w-16 h-16 text-yellow-500 mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🎉 プレミアム会員になりました！
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              7日間の無料体験が始まりました。すべてのプレミアム機能をお楽しみください！
            </p>
          </motion.div>

          {/* Free Trial Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Gift className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-green-800">無料体験期間</h2>
            </div>
            <p className="text-green-700 mb-4">
              今から7日間はすべてのプレミアム機能を無料でご利用いただけます
            </p>
            <div className="text-sm text-green-600 space-y-1">
              <p>• 体験期間中はいつでもキャンセル可能です</p>
              <p>• キャンセルした場合、料金は発生しません</p>
              <p>• 設定はプロフィールページから変更できます</p>
            </div>
          </motion.div>

          {/* Available Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              今すぐ使える機能
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  icon: Calendar,
                  title: '週間占い',
                  description: '7日間の詳細な運勢予報'
                },
                {
                  icon: Sparkles,
                  title: '詳細分析',
                  description: '恋愛・仕事・健康・金運を分析'
                },
                {
                  icon: Crown,
                  title: '無制限履歴',
                  description: '過去の占い結果をすべて閲覧'
                },
                {
                  icon: Check,
                  title: '優先サポート',
                  description: '問い合わせに優先対応'
                }
              ].map((feature, index) => (
                <div key={feature.title} className="bg-purple-50 rounded-2xl p-4">
                  <feature.icon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-800 mb-1">{feature.title}</h4>
                  <p className="text-purple-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="space-y-4"
          >
            <Link 
              href="/weekly"
              className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
            >
              週間占いを試す 📅
            </Link>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Link 
                href="/"
                className="block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                今日の占いへ
              </Link>
              <Link 
                href="/profile"
                className="block bg-white border-2 border-purple-200 text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
              >
                設定・履歴
              </Link>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500">
              ご不明な点がございましたら、プロフィールページからお問い合わせください。<br />
              素敵な恋愛運アップをお手伝いさせていただきます！
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function PremiumSuccessPage() {
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
      <PremiumSuccessContent />
    </Suspense>
  )
}