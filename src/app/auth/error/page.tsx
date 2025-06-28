'use client'

import Link from 'next/link'
import { useEffect, Suspense } from 'react'
import { trackError } from '@/lib/analytics'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic'

const errorMessages: Record<string, string> = {
  Configuration: 'サーバー設定に問題があります。しばらく時間をおいて再度お試しください。',
  AccessDenied: 'アクセスが拒否されました。権限を確認してください。',
  Verification: 'メール認証に失敗しました。新しい認証メールをお送りください。',
  Default: 'ログイン中にエラーが発生しました。再度お試しください。',
  OAuthSignin: 'OAuth認証の開始に失敗しました。',
  OAuthCallback: 'OAuth認証のコールバックに失敗しました。',
  OAuthCreateAccount: 'OAuth アカウントの作成に失敗しました。',
  EmailCreateAccount: 'メールアカウントの作成に失敗しました。',
  Callback: 'コールバック処理中にエラーが発生しました。',
  OAuthAccountNotLinked: '別の認証方法で既に登録されているメールアドレスです。',
  EmailSignin: 'メール送信に失敗しました。メールアドレスを確認してください。',
  CredentialsSignin: 'ログイン情報が正しくありません。',
  SessionRequired: 'このページにアクセスするにはログインが必要です。',
}

function AuthErrorContent() {
  const error = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('error')
    : null
  
  useEffect(() => {
    if (error) {
      trackError(`Auth Error: ${error}`, 'authentication')
    }
  }, [error])

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          ログインエラー
        </h1>
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-600">
              エラーコード: {error}
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <Link
            href="/auth/signin"
            className="block w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all"
          >
            ログインページに戻る
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-white border-2 border-purple-200 text-purple-600 px-6 py-3 rounded-2xl font-semibold hover:bg-purple-50 transition-all"
          >
            ホームに戻る
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            問題が解決しない場合は、
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

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            読み込み中...
          </h1>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}