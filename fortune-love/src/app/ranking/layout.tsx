import type { Metadata } from 'next'
import { presetOGImages } from '@/lib/og-image'

export const metadata: Metadata = {
  title: "恋愛運ランキング | 今日の運勢トップ10 - 576通りの占い結果",
  description: "血液型×星座×干支の組み合わせ576通りの今日の恋愛運ランキング。あなたの順位をチェックして、恋愛運アップのヒントを見つけよう！毎日0時更新。",
  keywords: [
    "恋愛運ランキング", "今日の運勢", "占いランキング", "恋愛運順位", 
    "血液型ランキング", "星座ランキング", "干支ランキング", "運勢比較",
    "恋愛運アップ", "今日のトップ", "占い結果", "毎日更新"
  ],
  openGraph: {
    title: "恋愛運ランキング | 今日のトップ10をチェック",
    description: "576通りの組み合わせから今日の恋愛運ランキングを発表！あなたの順位は何位？",
    url: "/ranking",
    images: [
      {
        url: presetOGImages.ranking(),
        width: 1200,
        height: 630,
        alt: "恋愛運ランキング - 今日のトップ10",
      },
    ],
  },
  twitter: {
    title: "恋愛運ランキング | 今日の運勢トップ10",
    description: "576通りの組み合わせから今日の恋愛運ランキングを発表！",
    images: [presetOGImages.ranking()],
  },
}

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}