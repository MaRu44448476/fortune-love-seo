import Link from 'next/link'
import type { Metadata } from 'next'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ページが見つかりません | 恋愛占いサイト',
  description: 'お探しのページは見つかりませんでした。恋愛占いサイトのホームページから占いをお楽しみください。',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔮</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          ページが見つかりません
        </h2>
        <p className="text-gray-600 mb-6">
          お探しのページは移動したか、削除された可能性があります。
          <br />
          占いのページからお楽しみください。
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
          >
            今日の占いを見る
          </Link>
          
          <Link
            href="/ranking"
            className="block w-full bg-white border-2 border-purple-200 text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
          >
            ランキングを見る
          </Link>
          
          <Link
            href="/premium"
            className="block w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
          >
            プレミアムプランを見る
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            問題が続く場合は、
            <a href="mailto:support@fortune-love.com" className="text-purple-600 hover:text-purple-700 underline">
              サポート
            </a>
            までご連絡ください。
          </p>
        </div>
      </div>
    </div>
  )
}