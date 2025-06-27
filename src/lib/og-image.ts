interface OGImageParams {
  title?: string
  subtitle?: string
  score?: number | string
  bloodType?: string
  zodiac?: string
  animal?: string
  type?: 'default' | 'fortune' | 'ranking' | 'premium' | 'weekly' | 'analysis'
}

export function generateOGImageURL(params: OGImageParams = {}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fortune-love.com'
  const searchParams = new URLSearchParams()
  
  // パラメータを設定
  if (params.title) searchParams.set('title', params.title)
  if (params.subtitle) searchParams.set('subtitle', params.subtitle)
  if (params.score) searchParams.set('score', params.score.toString())
  if (params.bloodType) searchParams.set('bloodType', params.bloodType)
  if (params.zodiac) searchParams.set('zodiac', params.zodiac)
  if (params.animal) searchParams.set('animal', params.animal)
  if (params.type) searchParams.set('type', params.type)
  
  return `${baseUrl}/api/og?${searchParams.toString()}`
}

// プリセット画像URL生成関数
export const presetOGImages = {
  main: () => generateOGImageURL({
    title: '恋愛占い',
    subtitle: '血液型×星座×干支で毎日変わる運勢',
    type: 'default'
  }),
  
  ranking: () => generateOGImageURL({
    title: '恋愛運ランキング',
    subtitle: '今日の運勢トップ10をチェック！',
    type: 'ranking'
  }),
  
  premium: () => generateOGImageURL({
    title: 'プレミアムプラン',
    subtitle: '詳細占い・週間占いで更に詳しく',
    type: 'premium'
  }),
  
  weekly: () => generateOGImageURL({
    title: '週間占い',
    subtitle: '7日間の詳細な恋愛運予報',
    type: 'weekly'
  }),
  
  analysis: () => generateOGImageURL({
    title: '詳細分析レポート',
    subtitle: '恋愛・性格・相性の深い洞察',
    type: 'analysis'
  }),
  
  // 占い結果用の動的画像
  fortune: (params: { score: number, bloodType: string, zodiac: string, animal: string }) => 
    generateOGImageURL({
      title: '今日の恋愛運',
      subtitle: `${params.bloodType}型×${params.zodiac}×${params.animal}`,
      score: params.score,
      bloodType: params.bloodType,
      zodiac: params.zodiac,
      animal: params.animal,
      type: 'fortune'
    })
}