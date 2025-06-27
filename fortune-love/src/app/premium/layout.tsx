import type { Metadata } from 'next'
import { presetOGImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: "プレミアムプラン | 詳細占い・週間占い - 7日間無料体験",
  description: "プレミアムプランで恋愛占いをもっと詳しく！週間占い、詳細分析、相性診断など充実機能。月額980円、年額9800円。7日間無料体験実施中。",
  keywords: [
    "プレミアム占い", "週間占い", "詳細分析", "相性診断", "恋愛占い有料",
    "無料体験", "月額980円", "年額9800円", "詳細レポート", "恋愛相談",
    "パーソナル占い", "数秘術", "恋愛コーチング", "運勢分析"
  ],
  openGraph: {
    title: "プレミアムプラン | 恋愛占いの詳細機能",
    description: "週間占い・詳細分析・相性診断などプレミアム機能が7日間無料体験！",
    url: "/premium",
    images: [
      {
        url: presetOGImages.premium(),
        width: 1200,
        height: 630,
        alt: "プレミアムプラン - 7日間無料体験",
      },
    ],
  },
  twitter: {
    title: "プレミアムプラン | 7日間無料体験",
    description: "恋愛占いの詳細機能が使い放題！週間占い・詳細分析・相性診断",
    images: [presetOGImages.premium()],
  },
}

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}