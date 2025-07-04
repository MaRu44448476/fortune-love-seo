'use client'

import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function Header() {

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
          </nav>
        </div>
      </div>
    </header>
  )
}