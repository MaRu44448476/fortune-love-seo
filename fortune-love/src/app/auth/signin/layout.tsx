import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "ログイン | 恋愛占いサイト - あなたの占い履歴を管理",
  description: "恋愛占いサイトにログインして、占い履歴の確認、プレミアム機能の利用、お気に入り管理など便利機能をご利用ください。",
  robots: {
    index: false,
    follow: true,
  },
}

export default function SigninLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
