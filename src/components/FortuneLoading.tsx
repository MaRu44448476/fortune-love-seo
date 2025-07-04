'use client'

import { motion } from 'framer-motion'
import { Heart, Star, Sparkles } from 'lucide-react'

const loadingMessages = [
  "✨ 宇宙の力を感じています...",
  "🔮 あなたの運命を読み取り中...",
  "💫 星々が語りかけています...",
  "💖 恋愛運を計算しています...",
  "🌙 月の神秘があなたを導いています...",
  "⭐ 運命の糸を紡いでいます..."
]

export default function FortuneLoading() {
  const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center"
    >
      <div className="max-w-md mx-auto text-center p-8">
        {/* メインローディングアニメーション */}
        <div className="relative mb-8">
          {/* 中央のクリスタルボール */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-200 to-pink-200 rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full shadow-inner flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-purple-600" />
            </motion.div>
          </motion.div>

          {/* 周りの星 */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: `${60 * Math.cos((i * 60 * Math.PI) / 180)}px ${60 * Math.sin((i * 60 * Math.PI) / 180)}px`
              }}
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 5 + i * 0.5, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 0.2
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="w-6 h-6 -mt-3 -ml-3"
              >
                {i % 3 === 0 && <Star className="w-6 h-6 text-yellow-400 fill-current" />}
                {i % 3 === 1 && <Heart className="w-6 h-6 text-pink-400 fill-current" />}
                {i % 3 === 2 && <Sparkles className="w-6 h-6 text-purple-400" />}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ローディングメッセージ */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            占い中...
          </h2>
          <motion.p
            key={randomMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-lg"
          >
            {randomMessage}
          </motion.p>
        </motion.div>

        {/* プログレスバー */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </div>

        {/* キラキラ効果 */}
        <div className="relative">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* サブテキスト */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-500 mt-4"
        >
          あなただけの特別な占い結果を準備しています
        </motion.p>
      </div>
    </motion.div>
  )
}