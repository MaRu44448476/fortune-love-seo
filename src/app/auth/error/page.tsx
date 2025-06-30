'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: '認証の設定に問題があります。管理者にお問い合わせください。',
    AccessDenied: 'アクセスが拒否されました。',
    Verification: 'リンクの有効期限が切れています。もう一度お試しください。',
    Default: '認証中にエラーが発生しました。もう一度お試しください。',
  }

  const errorMessage = errorMessages[error as string] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">認証エラー</CardTitle>
          <CardDescription className="text-center">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">
              ログインページに戻る
            </Link>
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="text-purple-600 hover:underline">
              トップページに戻る
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}