'use client'

import { motion } from 'framer-motion'
import { Crown, Trophy, Medal, Star } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import { type BloodType, type Zodiac, type Animal, generateFortune } from '@/lib/fortune'

interface RankingItem {
  rank: number
  bloodType: BloodType
  zodiac: Zodiac
  animal: Animal
  score: number
  element: string
  compatibility: string
}

function generateDailyRanking(): RankingItem[] {
  const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB']
  const zodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
  const animals: Animal[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  const today = new Date()
  const combinations: RankingItem[] = []
  
  bloodTypes.forEach(bloodType => {
    zodiacs.forEach(zodiac => {
      animals.forEach(animal => {
        const fortune = generateFortune(bloodType, zodiac, animal, today)
        
        combinations.push({
          rank: 0,
          bloodType,
          zodiac,
          animal,
          score: fortune.score,
          element: fortune.element,
          compatibility: fortune.compatibility
        })
      })
    })
  })
  
  // スコアでソートしてランキング付け
  combinations.sort((a, b) => b.score - a.score)
  combinations.forEach((item, index) => {
    item.rank = index + 1
  })
  
  return combinations
}

export default function RankingPage() {
  const ranking = generateDailyRanking()
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Star className="w-5 h-5 text-purple-400" />
    }
  }

  const getRankColor = (rank: number) => {
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300'
    if (rank <= 10) return 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
    if (rank <= 50) return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
    return 'bg-gray-50 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🏆 今日のランキング 🏆
          </h1>
          <p className="text-lg text-gray-600 mb-2">恋愛運ランキング - {today}</p>
          <Link 
            href="/"
            className="inline-block bg-white px-6 py-2 rounded-full border-2 border-pink-200 text-pink-600 hover:bg-pink-50 transition-colors"
          >
            ← 占いに戻る
          </Link>
        </motion.div>

        {/* Top 3 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          {ranking.slice(0, 3).map((item) => (
            <div
              key={`${item.bloodType}-${item.zodiac}-${item.animal}`}
              className={`bg-white rounded-3xl p-6 text-center shadow-xl border-4 ${
                item.rank === 1 ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' :
                item.rank === 2 ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-slate-50' :
                'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50'
              }`}
            >
              <div className="flex justify-center items-center mb-4">
                {getRankIcon(item.rank)}
                <span className="ml-2 text-2xl font-bold text-gray-800">{item.rank}位</span>
              </div>
              
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                {item.score}
              </div>
              
              <div className="text-gray-600">
                <p className="font-semibold">{item.bloodType}型</p>
                <p>{item.zodiac}</p>
                <p>{item.animal}</p>
                <p className="text-xs mt-1 text-purple-600">{item.element}・{item.compatibility}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Full Ranking */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-6 border-4 border-pink-200"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">全ランキング</h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {ranking.map((item) => (
              <motion.div
                key={`${item.bloodType}-${item.zodiac}-${item.animal}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: item.rank * 0.01 }}
                className={`flex items-center justify-between p-3 rounded-2xl border-2 ${getRankColor(item.rank)}`}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(item.rank)}
                  <span className="font-bold text-lg">{item.rank}位</span>
                  <div className="text-sm">
                    <span className="font-medium">{item.bloodType}型</span>
                    <span className="mx-1">×</span>
                    <span>{item.zodiac}</span>
                    <span className="mx-1">×</span>
                    <span>{item.animal}</span>
                    <div className="text-xs text-purple-600 mt-1">
                      {item.element}の力・{item.compatibility}
                    </div>
                  </div>
                </div>
                
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {item.score}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <div className="bg-white rounded-3xl p-6 border-4 border-purple-200 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 今日の統計</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-pink-600">576</div>
                <div className="text-sm text-gray-600">総組み合わせ数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{ranking[0].score}</div>
                <div className="text-sm text-gray-600">最高スコア</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">{ranking[ranking.length - 1].score}</div>
                <div className="text-sm text-gray-600">最低スコア</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(ranking.reduce((sum, item) => sum + item.score, 0) / ranking.length)}
                </div>
                <div className="text-sm text-gray-600">平均スコア</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}