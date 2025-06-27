import { generateOGImageURL } from '@/lib/og-image'

interface DynamicOGImageProps {
  score: number
  bloodType: string
  zodiac: string
  animal: string
  type?: string
}

export default function DynamicOGImage({ 
  score, 
  bloodType, 
  zodiac, 
  animal, 
  type = 'fortune' 
}: DynamicOGImageProps) {
  const ogImageUrl = generateOGImageURL({
    title: type === 'fortune' ? '今日の恋愛運' : '占い結果',
    subtitle: `${bloodType}型×${zodiac}×${animal}の運勢`,
    score,
    bloodType,
    zodiac,
    animal,
    type: type as any
  })

  return (
    <>
      {/* Open Graph meta tags */}
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${bloodType}型×${zodiac}×${animal}の恋愛運 - ${score}点`} />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={`${bloodType}型×${zodiac}×${animal}の恋愛運 - ${score}点`} />
      
      {/* Additional meta for sharing */}
      <meta property="og:title" content={`${bloodType}型×${zodiac}×${animal}の恋愛運 - ${score}点`} />
      <meta property="og:description" content={`今日のあなたの恋愛運は${score}点！詳細な占い結果をチェックしてみよう。`} />
      <meta name="twitter:title" content={`${bloodType}型×${zodiac}×${animal}の恋愛運`} />
      <meta name="twitter:description" content={`今日の恋愛運は${score}点！詳しい分析結果を見る`} />
    </>
  )
}

// Head component for Next.js pages (客户端使用)
export function DynamicOGImageHead(props: DynamicOGImageProps) {
  const ogImageUrl = generateOGImageURL({
    title: '今日の恋愛運',
    subtitle: `${props.bloodType}型×${props.zodiac}×${props.animal}の運勢`,
    score: props.score,
    bloodType: props.bloodType,
    zodiac: props.zodiac,
    animal: props.animal,
    type: 'fortune'
  })

  return (
    <head>
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${props.bloodType}型×${props.zodiac}×${props.animal}の恋愛運 - ${props.score}点`} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={`${props.bloodType}型×${props.zodiac}×${props.animal}の恋愛運 - ${props.score}点`} />
      <meta property="og:title" content={`${props.bloodType}型×${props.zodiac}×${props.animal}の恋愛運 - ${props.score}点`} />
      <meta property="og:description" content={`今日のあなたの恋愛運は${props.score}点！詳細な占い結果をチェックしてみよう。`} />
      <meta name="twitter:title" content={`${props.bloodType}型×${props.zodiac}×${props.animal}の恋愛運`} />
      <meta name="twitter:description" content={`今日の恋愛運は${props.score}点！詳しい分析結果を見る`} />
    </head>
  )
}