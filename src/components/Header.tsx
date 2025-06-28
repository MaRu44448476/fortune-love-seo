'use client'

import { useSession, signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, LogOut, Crown, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
            >
              ✨ 恋愛占い
            </motion.div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/ranking"
              className="flex items-center gap-1 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              ランキング
            </Link>
            
            {session?.user?.isPremium ? (
              <Link
                href="/weekly"
                className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
              >
                <Crown className="w-4 h-4" />
                週間占い
              </Link>
            ) : (
              <Link
                href="/premium"
                className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
              >
                <Crown className="w-4 h-4" />
                プレミアム
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full hover:from-pink-200 hover:to-purple-200 transition-all"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">
                    {session.user.name || 'マイページ'}
                  </span>
                </Link>
                
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
                  title="ログアウト"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/api/auth/signin"
                  className="px-4 py-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  ログイン
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition-all font-medium"
                >
                  新規登録
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}