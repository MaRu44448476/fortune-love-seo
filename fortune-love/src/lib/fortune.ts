export type BloodType = 'A' | 'B' | 'O' | 'AB'
export type Zodiac = 'おひつじ座' | 'おうし座' | 'ふたご座' | 'かに座' | 'しし座' | 'おとめ座' | 'てんびん座' | 'さそり座' | 'いて座' | 'やぎ座' | 'みずがめ座' | 'うお座'
export type Animal = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

export interface FortuneResult {
  score: number
  luckyColor: string
  luckyItem: string
  advice: string
  element: string
  compatibility: string
  mood: string
}

// 占い結果データベース（576通りの組み合わせに対応）
const fortuneData = {
  bloodTypes: {
    A: { 
      base: 5, 
      traits: ['慎重', '真面目', '思いやり'],
      colors: ['ピンク', 'ブルー', 'ホワイト'],
      items: ['手紙', '本', 'ハンカチ']
    },
    B: { 
      base: 15, 
      traits: ['自由奔放', '創造的', '情熱的'],
      colors: ['レッド', 'オレンジ', 'イエロー'],
      items: ['アクセサリー', '音楽', 'アート作品']
    },
    O: { 
      base: 10, 
      traits: ['積極的', 'リーダーシップ', '社交的'],
      colors: ['グリーン', 'ブラウン', 'ゴールド'],
      items: ['スポーツ用品', 'アウトドアグッズ', '植物']
    },
    AB: { 
      base: 20, 
      traits: ['独創的', '神秘的', '二面性'],
      colors: ['パープル', 'シルバー', 'ターコイズ'],
      items: ['クリスタル', '香水', 'アンティーク']
    }
  },
  zodiacs: {
    'おひつじ座': { modifier: 8, element: '火', season: '春' },
    'おうし座': { modifier: -5, element: '地', season: '春' },
    'ふたご座': { modifier: 12, element: '風', season: '春' },
    'かに座': { modifier: 3, element: '水', season: '夏' },
    'しし座': { modifier: 15, element: '火', season: '夏' },
    'おとめ座': { modifier: -8, element: '地', season: '夏' },
    'てんびん座': { modifier: 7, element: '風', season: '秋' },
    'さそり座': { modifier: 18, element: '水', season: '秋' },
    'いて座': { modifier: 10, element: '火', season: '秋' },
    'やぎ座': { modifier: -3, element: '地', season: '冬' },
    'みずがめ座': { modifier: 13, element: '風', season: '冬' },
    'うお座': { modifier: 6, element: '水', season: '冬' }
  },
  animals: {
    '子': { boost: 5, compatibility: ['辰', '申'] },
    '丑': { boost: -2, compatibility: ['巳', '酉'] },
    '寅': { boost: 8, compatibility: ['午', '戌'] },
    '卯': { boost: 3, compatibility: ['未', '亥'] },
    '辰': { boost: 12, compatibility: ['子', '申'] },
    '巳': { boost: 1, compatibility: ['丑', '酉'] },
    '午': { boost: 7, compatibility: ['寅', '戌'] },
    '未': { boost: -1, compatibility: ['卯', '亥'] },
    '申': { boost: 9, compatibility: ['子', '辰'] },
    '酉': { boost: 4, compatibility: ['丑', '巳'] },
    '戌': { boost: 6, compatibility: ['寅', '午'] },
    '亥': { boost: 2, compatibility: ['卯', '未'] }
  }
}

const adviceTemplates = [
  '今日は{trait}さが魅力となりそう。{element}の力を借りて積極的に行動しましょう。',
  '{season}の{element}エネルギーがあなたを後押し。{trait}な一面を大切にして。',
  '{trait}な性格が今日のキーポイント。{element}系のアイテムがお守りになります。',
  '今日は{trait}さを活かした恋愛アプローチがおすすめ。{element}を意識してみて。',
  '{element}の力が強い今日、{trait}な魅力で相手の心を掴めそう。'
]

const moodDescriptions = [
  'ロマンチックな気分',
  'ワクワクする予感',
  '穏やかな幸せ',
  'ドキドキの出会い',
  '心温まる瞬間',
  'キラキラした日',
  '特別な一日',
  '愛に満ちた時間'
]

// 日付ベースのシード値生成
function generateDateSeed(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return (year * 10000) + (month * 100) + day
}

// シード値を使った疑似乱数生成
function seededRandom(seed: number, min: number = 0, max: number = 1): number {
  const x = Math.sin(seed) * 10000
  const random = x - Math.floor(x)
  return min + Math.floor(random * (max - min + 1))
}

// ハッシュ関数
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit integer
  }
  return Math.abs(hash)
}

export function generateFortune(
  bloodType: BloodType,
  zodiac: Zodiac,
  animal: Animal,
  date: Date = new Date()
): FortuneResult {
  // 日付ベースのシード値
  const dateSeed = generateDateSeed(date)
  
  // 組み合わせベースのハッシュ
  const combinationHash = hashString(`${bloodType}-${zodiac}-${animal}`)
  
  // 最終シード値
  const finalSeed = dateSeed + combinationHash
  
  // 基本スコア計算
  const bloodData = fortuneData.bloodTypes[bloodType]
  const zodiacData = fortuneData.zodiacs[zodiac]
  const animalData = fortuneData.animals[animal]
  
  let baseScore = bloodData.base + zodiacData.modifier + animalData.boost
  
  // 日替わり変動 (-10 to +20)
  const dailyVariation = seededRandom(finalSeed, -10, 20)
  baseScore += dailyVariation
  
  // 相性ボーナス
  const isCompatible = animalData.compatibility.includes(animal)
  if (isCompatible) baseScore += 10
  
  // スコアを1-100に正規化
  const normalizedScore = Math.max(1, Math.min(100, baseScore + 50))
  
  // ラッキーカラー選択
  const colorSeed = seededRandom(finalSeed + 1, 0, bloodData.colors.length - 1)
  const luckyColor = bloodData.colors[colorSeed]
  
  // ラッキーアイテム選択
  const itemSeed = seededRandom(finalSeed + 2, 0, bloodData.items.length - 1)
  const luckyItem = bloodData.items[itemSeed]
  
  // アドバイス生成
  const traitSeed = seededRandom(finalSeed + 3, 0, bloodData.traits.length - 1)
  const trait = bloodData.traits[traitSeed]
  
  const adviceSeed = seededRandom(finalSeed + 4, 0, adviceTemplates.length - 1)
  const adviceTemplate = adviceTemplates[adviceSeed]
  
  const advice = adviceTemplate
    .replace(/{trait}/g, trait)
    .replace(/{element}/g, zodiacData.element)
    .replace(/{season}/g, zodiacData.season)
  
  // 相性判定
  const compatibilityScore = normalizedScore > 70 ? '最高' : 
                           normalizedScore > 50 ? '良好' : 
                           normalizedScore > 30 ? 'まずまず' : '要注意'
  
  // 今日の気分
  const moodSeed = seededRandom(finalSeed + 5, 0, moodDescriptions.length - 1)
  const mood = moodDescriptions[moodSeed]
  
  return {
    score: normalizedScore,
    luckyColor,
    luckyItem,
    advice,
    element: zodiacData.element,
    compatibility: compatibilityScore,
    mood
  }
}

// デバッグ用：全組み合わせの統計
export function getFortuneStats(): {
  totalCombinations: number
  averageScore: number
  scoreDistribution: Record<string, number>
} {
  const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB']
  const zodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
  const animals: Animal[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  let totalScore = 0
  let count = 0
  const scoreDistribution: Record<string, number> = {
    '1-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0
  }
  
  const testDate = new Date('2025-06-27')
  
  for (const bloodType of bloodTypes) {
    for (const zodiac of zodiacs) {
      for (const animal of animals) {
        const result = generateFortune(bloodType, zodiac, animal, testDate)
        totalScore += result.score
        count++
        
        if (result.score <= 20) scoreDistribution['1-20']++
        else if (result.score <= 40) scoreDistribution['21-40']++
        else if (result.score <= 60) scoreDistribution['41-60']++
        else if (result.score <= 80) scoreDistribution['61-80']++
        else scoreDistribution['81-100']++
      }
    }
  }
  
  return {
    totalCombinations: count,
    averageScore: Math.round(totalScore / count),
    scoreDistribution
  }
}