import type { Metadata } from 'next'
import { presetOGImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: "週間占い | 7日間の恋愛運詳細予報 - プレミアム限定",
  description: "7日間の詳細な恋愛運を予報。恋愛・仕事・健康・金運を個別分析し、ラッキーデー・注意日も予測。血液型×星座×干支の本格週間占い。",
  keywords: [
    "週間占い", "7日間占い", "週間恋愛運", "恋愛予報", "週間運勢",
    "ラッキーデー", "注意日", "週間分析", "恋愛週間", "仕事運週間",
    "健康運週間", "金運週間", "相性週間", "週間アドバイス"
  ],
  openGraph: {
    title: "週間占い | 7日間の恋愛運詳細予報",
    description: "プレミアム限定の週間占いで7日間の運勢を詳しくチェック！",
    url: "/weekly",
    images: [
      {
        url: presetOGImages.weekly(),
        width: 1200,
        height: 630,
        alt: "週間占い - 7日間の詳細予報",
      },
    ],
  },
  twitter: {
    title: "週間占い | 7日間の詳細予報",
    description: "恋愛・仕事・健康・金運を7日間で詳しく分析！",
    images: [presetOGImages.weekly()],
  },
}

export default function WeeklyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}