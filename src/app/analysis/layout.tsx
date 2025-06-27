import type { Metadata } from 'next'
import { presetOGImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: "詳細分析レポート | 恋愛・性格・相性の深い洞察 - プレミアム限定",
  description: "あなたの性格プロフィール、恋愛・仕事・健康・金運の詳細分析、理想のパートナー診断、具体的な行動プラン、パーソナル数秘術まで完全解析。",
  keywords: [
    "詳細分析", "性格分析", "恋愛分析", "相性分析", "パーソナル占い",
    "数秘術", "行動プラン", "恋愛レポート", "性格診断", "恋愛診断",
    "理想のパートナー", "恋愛アドバイス", "深層心理", "恋愛心理学"
  ],
  openGraph: {
    title: "詳細分析レポート | 恋愛・性格・相性の深い洞察",
    description: "プレミアム限定の詳細分析で、あなたの恋愛傾向を深く理解！",
    url: "/analysis",
    images: [
      {
        url: presetOGImages.analysis(),
        width: 1200,
        height: 630,
        alt: "詳細分析レポート - 深い洞察",
      },
    ],
  },
  twitter: {
    title: "詳細分析レポート | 恋愛・性格・相性分析",
    description: "あなたの恋愛傾向を深く分析！性格・相性・行動プランまで",
    images: [presetOGImages.analysis()],
  },
}

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
