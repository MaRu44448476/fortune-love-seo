'use client'

import { useState } from 'react'
import React from 'react'
import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import { Heart, Star, Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import FortuneLoading from '@/components/FortuneLoading'
import { type BloodType, type Zodiac, type Animal, generateFortune } from '@/lib/fortune'
import Link from 'next/link'

const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB']
const zodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
const animals: Animal[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

export default function Home() {
  const [bloodType, setBloodType] = useState<BloodType | ''>('')
  const [zodiac, setZodiac] = useState<Zodiac | ''>('')
  const [animal, setAnimal] = useState<Animal | ''>('')
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    if (bloodType && zodiac && animal) {
      setIsLoading(true)
      
      // ローディング画面を2.5-3.5秒表示（演出的な効果）
      const loadingTime = 2500 + Math.random() * 1000
      
      setTimeout(() => {
        setIsLoading(false)
        setShowResult(true)
      }, loadingTime)
    }
  }

  const handleReset = () => {
    setShowResult(false)
    setIsLoading(false)
    setBloodType('')
    setZodiac('')
    setAnimal('')
  }

  return (
    <>
      {isLoading ? (
        <FortuneLoading />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
          <Header />
          {/* Header */}
          <header className="pt-8 pb-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ✨ 恋愛占い ✨
              </h1>
              <p className="text-lg text-gray-600 mt-2">血液型 × 星座 × 干支で占う今日の恋愛運</p>
              <div className="absolute -top-2 -right-8 animate-pulse">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div className="absolute -bottom-2 -left-8 animate-bounce">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
            </motion.div>
          </header>

          <main className="container mx-auto px-4 py-8">
            {!showResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8 border-4 border-pink-200"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">あなたの情報を教えてください</h2>
              <p className="text-gray-600">今日の恋愛運を占います</p>
            </div>

            <div className="space-y-6">
              {/* Blood Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">血液型</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value as BloodType)}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors"
                >
                  <option value="">選択してください</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}型</option>
                  ))}
                </select>
              </div>

              {/* Zodiac */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">星座</label>
                <select
                  value={zodiac}
                  onChange={(e) => setZodiac(e.target.value as Zodiac)}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors"
                >
                  <option value="">選択してください</option>
                  {zodiacs.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>

              {/* Animal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">干支</label>
                <select
                  value={animal}
                  onChange={(e) => setAnimal(e.target.value as Animal)}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none transition-colors"
                >
                  <option value="">選択してください</option>
                  {animals.map(zodiacAnimal => (
                    <option key={zodiacAnimal} value={zodiacAnimal}>{zodiacAnimal}</option>
                  ))}
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!bloodType || !zodiac || !animal}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
              >
                占う ✨
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <FortuneResult bloodType={bloodType as BloodType} zodiac={zodiac as Zodiac} animal={animal as Animal} onReset={handleReset} />
        )}
      </main>
        </div>
      )}
    </>
  )
}

function FortuneResult({ bloodType, zodiac, animal, onReset }: {
  bloodType: BloodType
  zodiac: Zodiac
  animal: Animal
  onReset: () => void
}) {
  const [userRank, setUserRank] = React.useState<{
    userRank: { rank: number }
    totalCombinations: number
    percentile: number
  } | null>(null)
  const [loadingRank, setLoadingRank] = React.useState(true)
  
  // 高度な占い結果生成
  const fortune = generateFortune(bloodType, zodiac, animal)
  
  const handleSave = async () => {
    try {
      await fetch('/api/fortune', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloodType,
          zodiac,
          animal,
          score: fortune.score,
          luckyColor: fortune.luckyColor,
          luckyItem: fortune.luckyItem,
          advice: fortune.advice,
        }),
      })
    } catch (error) {
      console.error('Failed to save fortune:', error)
    }
  }
  
  const fetchUserRank = async () => {
    try {
      const response = await fetch('/api/ranking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bloodType,
          zodiac,
          animal,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setUserRank(data)
      }
    } catch (error) {
      console.error('Failed to fetch user rank:', error)
    } finally {
      setLoadingRank(false)
    }
  }
  
  // 結果を自動保存とランキング取得
  React.useEffect(() => {
    const saveAndFetch = async () => {
      await handleSave()
      await fetchUserRank()
    }
    saveAndFetch()
  }, [bloodType, zodiac, animal])
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-pink-500 to-red-500'
    if (score >= 60) return 'from-purple-500 to-pink-500'
    if (score >= 40) return 'from-blue-500 to-purple-500'
    return 'from-gray-500 to-blue-500'
  }
  
  const getRankIcon = (rank: number) => {
    if (rank <= 3) return '🏆'
    if (rank <= 10) return '🥇'
    if (rank <= 50) return '⭐'
    return '📊'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">今日の恋愛運</h2>
        <p className="text-gray-600">{bloodType}型 × {zodiac} × {animal}</p>
      </div>

      <div className="space-y-6">
        {/* Score */}
        <div className="text-center">
          <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreColor(fortune.score)} bg-clip-text text-transparent mb-2`}>
            {fortune.score}
          </div>
          <div className="text-lg text-gray-600">/ 100</div>
          <div className="text-sm text-gray-500 mt-1">相性度: {fortune.compatibility}</div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-pink-50 rounded-2xl p-4">
            <h3 className="font-semibold text-pink-800 mb-2">🎨 ラッキーカラー</h3>
            <p className="text-pink-700">{fortune.luckyColor}</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4">
            <h3 className="font-semibold text-purple-800 mb-2">✨ ラッキーアイテム</h3>
            <p className="text-purple-700">{fortune.luckyItem}</p>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-4">
            <h3 className="font-semibold text-indigo-800 mb-2">🌟 あなたの属性</h3>
            <p className="text-indigo-700">{fortune.element}の力・{fortune.mood}</p>
          </div>

          <div className="bg-green-50 rounded-2xl p-4">
            <h3 className="font-semibold text-green-800 mb-2">💕 今日のアドバイス</h3>
            <p className="text-green-700">{fortune.advice}</p>
          </div>

          {/* User Ranking */}
          {!loadingRank && userRank && (
            <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">
                {getRankIcon(userRank.userRank.rank)} あなたの今日の順位
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-700 font-bold text-lg">
                    {userRank.userRank.rank}位 / {userRank.totalCombinations}通り
                  </p>
                  <p className="text-yellow-600 text-sm">
                    上位 {userRank.percentile}% に入っています！
                  </p>
                </div>
                <div className="text-right">
                  <Link 
                    href="/ranking" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    全順位を見る
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl hover:shadow-lg transition-all"
          >
            もう一度占う
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}