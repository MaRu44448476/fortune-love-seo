'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Settings, Crown, History, Heart, Save, Star } from 'lucide-react'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type BloodType = 'A' | 'B' | 'O' | 'AB'
type Zodiac = 'おひつじ座' | 'おうし座' | 'ふたご座' | 'かに座' | 'しし座' | 'おとめ座' | 'てんびん座' | 'さそり座' | 'いて座' | 'やぎ座' | 'みずがめ座' | 'うお座'
type Animal = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB']
const zodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
const animals: Animal[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

interface UserProfile {
  bloodType?: string
  zodiac?: string
  animal?: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/auth/signin')
    }
  }, [status])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      
      if (response.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Profile save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-pink-200 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-4 border-pink-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full flex items-center justify-center border-4 border-pink-200">
                    <User className="w-10 h-10 text-pink-600" />
                  </div>
                )}
                {session.user.isPremium && (
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white p-1 rounded-full">
                    <Crown className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {session.user.name || 'ユーザー'}
                </h1>
                <p className="text-gray-600">{session.user.email}</p>
                {session.user.isPremium && (
                  <div className="flex items-center gap-2 mt-2">
                    <Crown className="w-4 h-4 text-purple-500" />
                    <span className="text-purple-600 font-semibold">プレミアム会員</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl hover:shadow-lg transition-all"
              >
                <Settings className="w-4 h-4" />
                {isEditing ? 'キャンセル' : '編集'}
              </button>
            </div>

            {/* Profile Settings */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">血液型</label>
                {isEditing ? (
                  <select
                    value={profile.bloodType || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, bloodType: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="">選択してください</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}型</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-800">
                    {profile.bloodType ? `${profile.bloodType}型` : '未設定'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">星座</label>
                {isEditing ? (
                  <select
                    value={profile.zodiac || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, zodiac: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="">選択してください</option>
                    {zodiacs.map(sign => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-800">
                    {profile.zodiac || '未設定'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">干支</label>
                {isEditing ? (
                  <select
                    value={profile.animal || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, animal: e.target.value }))}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:border-pink-400 focus:outline-none"
                  >
                    <option value="">選択してください</option>
                    {animals.map(zodiacAnimal => (
                      <option key={zodiacAnimal} value={zodiacAnimal}>{zodiacAnimal}</option>
                    ))}
                  </select>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-2xl text-gray-800">
                    {profile.animal || '未設定'}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? '保存中...' : '保存'}
                </motion.button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl p-6 border-4 border-pink-200 shadow-xl hover:shadow-2xl transition-all"
            >
              <Heart className="w-12 h-12 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">今日の占い</h3>
              <p className="text-gray-600">恋愛運をチェックしよう</p>
            </motion.a>

            <motion.a
              href="/ranking"
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-3xl p-6 border-4 border-purple-200 shadow-xl hover:shadow-2xl transition-all"
            >
              <History className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">ランキング</h3>
              <p className="text-gray-600">今日の運勢ランキング</p>
            </motion.a>

            {session.user.isPremium ? (
              <>
                <motion.a
                  href="/weekly"
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-6 border-4 border-purple-200 shadow-xl hover:shadow-2xl transition-all"
                >
                  <Crown className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">週間占い</h3>
                  <p className="text-gray-600">7日間の詳細予報</p>
                </motion.a>
                
                <motion.a
                  href="/analysis"
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-indigo-100 to-pink-100 rounded-3xl p-6 border-4 border-indigo-200 shadow-xl hover:shadow-2xl transition-all"
                >
                  <Star className="w-12 h-12 text-indigo-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">詳細分析</h3>
                  <p className="text-gray-600">深い洞察レポート</p>
                </motion.a>
              </>
            ) : (
              <Link
                href="/premium"
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-6 border-4 border-yellow-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                >
                  <Crown className="w-12 h-12 text-yellow-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">プレミアム</h3>
                  <p className="text-gray-600">詳細占いで更に深く</p>
                  <div className="mt-3 text-sm text-yellow-600 font-semibold">
                    7日間無料体験 🎁
                  </div>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Fortune History */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-indigo-200">
            <div className="flex items-center gap-3 mb-6">
              <History className="w-8 h-8 text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-800">占い履歴</h2>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">まだ占い履歴がありません</h3>
              <p className="text-gray-600 mb-6">占いを始めて、あなたの運勢を記録しましょう！</p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                占いを始める
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}