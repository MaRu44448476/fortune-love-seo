import { MetadataRoute } from 'next'

type BloodType = 'A' | 'B' | 'O' | 'AB'
type Zodiac = 'おひつじ座' | 'おうし座' | 'ふたご座' | 'かに座' | 'しし座' | 'おとめ座' | 'てんびん座' | 'さそり座' | 'いて座' | 'やぎ座' | 'みずがめ座' | 'うお座'
type Animal = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fortune-love.com'

// 血液型・星座・干支の全組み合わせページ（検索エンジン向け）
function generateFortunePages(): MetadataRoute.Sitemap {
  const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB']
  const zodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
  const animals: Animal[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  const fortunePages: MetadataRoute.Sitemap = []
  
  // 血液型別ページ
  bloodTypes.forEach(bloodType => {
    fortunePages.push({
      url: `${baseUrl}/fortune/blood-type/${bloodType}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    })
  })
  
  // 星座別ページ
  zodiacs.forEach(zodiac => {
    const encodedZodiac = encodeURIComponent(zodiac)
    fortunePages.push({
      url: `${baseUrl}/fortune/zodiac/${encodedZodiac}`,
      lastModified: new Date(),
      changeFrequency: 'daily', 
      priority: 0.7,
    })
  })
  
  // 干支別ページ
  animals.forEach(animal => {
    fortunePages.push({
      url: `${baseUrl}/fortune/animal/${animal}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    })
  })
  
  // 人気の組み合わせページ（上位50組み合わせ）
  const popularCombinations = [
    { bloodType: 'A', zodiac: 'おひつじ座', animal: '子' },
    { bloodType: 'B', zodiac: 'しし座', animal: '寅' },
    { bloodType: 'O', zodiac: 'いて座', animal: '午' },
    { bloodType: 'AB', zodiac: 'みずがめ座', animal: '申' },
    { bloodType: 'A', zodiac: 'おうし座', animal: '丑' },
    { bloodType: 'B', zodiac: 'ふたご座', animal: '卯' },
    { bloodType: 'O', zodiac: 'かに座', animal: '辰' },
    { bloodType: 'AB', zodiac: 'おとめ座', animal: '巳' },
    { bloodType: 'A', zodiac: 'てんびん座', animal: '未' },
    { bloodType: 'B', zodiac: 'さそり座', animal: '酉' },
    { bloodType: 'O', zodiac: 'やぎ座', animal: '戌' },
    { bloodType: 'AB', zodiac: 'うお座', animal: '亥' },
  ]
  
  popularCombinations.forEach(combo => {
    const encodedZodiac = encodeURIComponent(combo.zodiac)
    fortunePages.push({
      url: `${baseUrl}/fortune/${combo.bloodType}/${encodedZodiac}/${combo.animal}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  })
  
  return fortunePages
}


export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // 基本ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ranking`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/premium`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/premium/success`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/weekly`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/analysis`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/api/auth/signin`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
  
  // 占い関連ページ
  const fortunePages = generateFortunePages()
  
  // 日別ランキングページ（過去30日分）
  const dailyRankingPages: MetadataRoute.Sitemap = []
  for (let i = 0; i < 30; i++) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
    const dateString = date.toISOString().split('T')[0]
    dailyRankingPages.push({
      url: `${baseUrl}/ranking/${dateString}`,
      lastModified: date,
      changeFrequency: 'never',
      priority: 0.5,
    })
  }
  
  // すべてのページを結合
  return [
    ...staticPages,
    ...fortunePages,
    ...dailyRankingPages,
  ]
}

// 画像サイトマップ（別途生成する場合）
export function generateImageSitemap(): string {
  const images = [
    '/og-main.jpg',
    '/og-ranking.jpg', 
    '/og-premium.jpg',
    '/og-weekly.jpg',
    '/og-analysis.jpg',
    '/twitter-card.jpg',
    '/twitter-ranking.jpg',
    '/twitter-premium.jpg',
    '/twitter-weekly.jpg',
    '/twitter-analysis.jpg',
    '/logo.png',
  ]
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${images.map(image => `
  <url>
    <loc>${baseUrl}</loc>
    <image:image>
      <image:loc>${baseUrl}${image}</image:loc>
      <image:title>恋愛占いサイト</image:title>
      <image:caption>血液型×星座×干支による恋愛占い</image:caption>
    </image:image>
  </url>`).join('')}
</urlset>`
  
  return xml
}