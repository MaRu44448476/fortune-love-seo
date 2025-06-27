'use client'

import { useEffect } from 'react'
import { trackError } from '@/lib/analytics'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをGoogle Analyticsに送信
    trackError(error.message, 'global_error')
    
    // 本番環境では外部ログサービスに送信
    if (process.env.NODE_ENV === 'production') {
      console.error('Global Error:', {
        message: error.message,
        stack: error.stack,
        digest: error.digest,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        url: typeof window !== 'undefined' ? window.location.href : '',
      })
    }
  }, [error])

  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              申し訳ございません
            </h2>
            <p className="text-gray-600 mb-6">
              予期しないエラーが発生しました。
              <br />
              お手数をおかけして申し訳ございません。
            </p>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                再試行する
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white border-2 border-purple-200 text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
              >
                ホームに戻る
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  開発者情報
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {error.message}
                  {error.digest && `\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}