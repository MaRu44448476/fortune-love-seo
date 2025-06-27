import { type BloodType, type Zodiac, type Animal, generateFortune } from './fortune'

export interface WeeklyFortuneResult {
  overallScore: number
  loveScore: number
  workScore: number
  healthScore: number
  moneyScore: number
  dailyAdvice: Record<string, string>
  weeklyAdvice: string
  luckyDays: string[]
  unluckyDays: string[]
  compatibility: {
    bestMatch: string
    goodMatches: string[]
    challenges: string[]
  }
}

// 週間占いデータベース
const weeklyFortuneData = {
  bloodTypes: {
    A: {
      traits: ['慎重', '思いやり', '責任感'],
      weeklyModifier: 5,
      workTendency: 'steady',
      loveTendency: 'careful'
    },
    B: {
      traits: ['自由奔放', '創造性', '情熱'],
      weeklyModifier: 15,
      workTendency: 'creative',
      loveTendency: 'passionate'
    },
    O: {
      traits: ['積極性', 'リーダーシップ', '社交性'],
      weeklyModifier: 10,
      workTendency: 'leadership',
      loveTendency: 'active'
    },
    AB: {
      traits: ['独創性', '神秘性', '二面性'],
      weeklyModifier: 20,
      workTendency: 'innovative',
      loveTendency: 'mysterious'
    }
  },
  
  zodiacWeekly: {
    'おひつじ座': { 
      element: '火', 
      weeklyLuck: 8,
      bestDays: ['火曜日', '木曜日'],
      challengeDays: ['水曜日']
    },
    'おうし座': { 
      element: '地', 
      weeklyLuck: -5,
      bestDays: ['金曜日', '土曜日'],
      challengeDays: ['火曜日']
    },
    'ふたご座': { 
      element: '風', 
      weeklyLuck: 12,
      bestDays: ['水曜日', '土曜日'],
      challengeDays: ['木曜日']
    },
    'かに座': { 
      element: '水', 
      weeklyLuck: 3,
      bestDays: ['月曜日', '金曜日'],
      challengeDays: ['土曜日']
    },
    'しし座': { 
      element: '火', 
      weeklyLuck: 15,
      bestDays: ['日曜日', '火曜日'],
      challengeDays: ['水曜日']
    },
    'おとめ座': { 
      element: '地', 
      weeklyLuck: -8,
      bestDays: ['水曜日', '土曜日'],
      challengeDays: ['日曜日']
    },
    'てんびん座': { 
      element: '風', 
      weeklyLuck: 7,
      bestDays: ['金曜日', '日曜日'],
      challengeDays: ['火曜日']
    },
    'さそり座': { 
      element: '水', 
      weeklyLuck: 18,
      bestDays: ['火曜日', '木曜日'],
      challengeDays: ['日曜日']
    },
    'いて座': { 
      element: '火', 
      weeklyLuck: 10,
      bestDays: ['木曜日', '土曜日'],
      challengeDays: ['月曜日']
    },
    'やぎ座': { 
      element: '地', 
      weeklyLuck: -3,
      bestDays: ['土曜日', '日曜日'],
      challengeDays: ['水曜日']
    },
    'みずがめ座': { 
      element: '風', 
      weeklyLuck: 13,
      bestDays: ['水曜日', '金曜日'],
      challengeDays: ['月曜日']
    },
    'うお座': { 
      element: '水', 
      weeklyLuck: 6,
      bestDays: ['月曜日', '木曜日'],
      challengeDays: ['土曜日']
    }
  }
}

const weeklyAdviceTemplates = [
  '今週は{trait}さが幸運の鍵。{element}のエネルギーを活用して{tendency}な行動を心がけて。',
  '{element}の力が強い週です。{trait}な一面を大切にし、{tendency}にアプローチしましょう。',
  '今週のテーマは{trait}。{element}系のアイテムを身につけ、{tendency}な姿勢で過ごして。',
  '{trait}さを活かした週になりそう。{element}のパワーで{tendency}な魅力をアピール。',
  '今週は{element}のエネルギーが高まります。{trait}な性格で{tendency}な結果を導きましょう。'
]

const dailyAdviceTemplates = {
  monday: ['新しい週のスタート。{trait}さで計画を立てましょう', '月曜日は{element}の力で積極的に', '{tendency}な態度で週をスタート'],
  tuesday: ['火のエネルギーが強い日。{trait}さで勝負', '{element}の力を借りて行動的に', '{tendency}なアプローチが吉'],
  wednesday: ['週の中日。{trait}さでバランスを', '水のように{tendency}に流れに身を任せて', '{element}のパワーで調和を'],
  thursday: ['木のように{trait}さで成長を', '拡大の日。{tendency}に視野を広げて', '{element}の力で新しい扉を'],
  friday: ['金のように{trait}さで輝いて', '愛と美の日。{tendency}な魅力をアピール', '{element}のエネルギーで華やかに'],
  saturday: ['土のように{trait}さで安定を', '基盤固めの日。{tendency}に準備を', '{element}の力で確実な歩みを'],
  sunday: ['太陽のように{trait}さで輝く日', '休息と充電。{tendency}にリフレッシュ', '{element}のパワーで心身回復']
}

// 週の開始日（月曜日）を取得
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 月曜日を0とする
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

// 週間シード値生成
function generateWeeklySeed(weekStart: Date, bloodType: BloodType, zodiac: Zodiac, animal: Animal): number {
  const year = weekStart.getFullYear()
  const week = Math.floor((weekStart.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
  const combination = `${bloodType}-${zodiac}-${animal}`
  
  let hash = 0
  const str = `${year}-W${week}-${combination}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

// 疑似乱数生成（シード値ベース）
function seededRandom(seed: number, min: number = 0, max: number = 1): number {
  const x = Math.sin(seed) * 10000
  const random = x - Math.floor(x)
  return min + Math.floor(random * (max - min + 1))
}

export function generateWeeklyFortune(
  bloodType: BloodType,
  zodiac: Zodiac,
  animal: Animal,
  date: Date = new Date()
): WeeklyFortuneResult {
  const weekStart = getWeekStart(date)
  const weekSeed = generateWeeklySeed(weekStart, bloodType, zodiac, animal)
  
  const bloodData = weeklyFortuneData.bloodTypes[bloodType]
  const zodiacData = weeklyFortuneData.zodiacWeekly[zodiac]
  
  // 各運勢スコア計算
  const baseScore = 50
  const bloodModifier = bloodData.weeklyModifier
  const zodiacModifier = zodiacData.weeklyLuck
  
  // 週間変動 (-15 to +25)
  const weeklyVariation = seededRandom(weekSeed, -15, 25)
  
  const overallScore = Math.max(1, Math.min(100, baseScore + bloodModifier + zodiacModifier + weeklyVariation))
  
  // 個別運勢計算
  const loveScore = Math.max(1, Math.min(100, overallScore + seededRandom(weekSeed + 1, -20, 20)))
  const workScore = Math.max(1, Math.min(100, overallScore + seededRandom(weekSeed + 2, -20, 20)))
  const healthScore = Math.max(1, Math.min(100, overallScore + seededRandom(weekSeed + 3, -20, 20)))
  const moneyScore = Math.max(1, Math.min(100, overallScore + seededRandom(weekSeed + 4, -20, 20)))
  
  // 曜日別アドバイス生成
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日']
  const dailyAdvice: Record<string, string> = {}
  
  days.forEach((day, index) => {
    const templates = dailyAdviceTemplates[day as keyof typeof dailyAdviceTemplates]
    const templateIndex = seededRandom(weekSeed + 10 + index, 0, templates.length - 1)
    const template = templates[templateIndex]
    
    const trait = bloodData.traits[seededRandom(weekSeed + 20 + index, 0, bloodData.traits.length - 1)]
    
    const advice = template
      .replace(/{trait}/g, trait)
      .replace(/{element}/g, zodiacData.element)
      .replace(/{tendency}/g, bloodData.loveTendency)
    
    dailyAdvice[dayNames[index]] = advice
  })
  
  // 週間総合アドバイス
  const adviceTemplateIndex = seededRandom(weekSeed + 100, 0, weeklyAdviceTemplates.length - 1)
  const adviceTemplate = weeklyAdviceTemplates[adviceTemplateIndex]
  const trait = bloodData.traits[seededRandom(weekSeed + 101, 0, bloodData.traits.length - 1)]
  
  const weeklyAdvice = adviceTemplate
    .replace(/{trait}/g, trait)
    .replace(/{element}/g, zodiacData.element)
    .replace(/{tendency}/g, bloodData.loveTendency)
  
  // ラッキーデー・注意日
  const allDays = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日']
  const luckyDays = zodiacData.bestDays.slice()
  const unluckyDays = zodiacData.challengeDays.slice()
  
  // 相性情報
  const allZodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
  const compatibleElements = {
    '火': ['火', '風'],
    '地': ['地', '水'],
    '風': ['風', '火'],
    '水': ['水', '地']
  }
  
  const currentElement = zodiacData.element
  const compatibleZodiacs = allZodiacs.filter(z => 
    compatibleElements[currentElement].includes(weeklyFortuneData.zodiacWeekly[z].element)
  )
  
  const bestMatchIndex = seededRandom(weekSeed + 200, 0, compatibleZodiacs.length - 1)
  const bestMatch = compatibleZodiacs[bestMatchIndex]
  
  const goodMatches = compatibleZodiacs.filter(z => z !== bestMatch).slice(0, 2)
  const challenges = allZodiacs.filter(z => 
    !compatibleElements[currentElement].includes(weeklyFortuneData.zodiacWeekly[z].element)
  ).slice(0, 2)
  
  return {
    overallScore,
    loveScore,
    workScore,
    healthScore,
    moneyScore,
    dailyAdvice,
    weeklyAdvice,
    luckyDays,
    unluckyDays,
    compatibility: {
      bestMatch,
      goodMatches,
      challenges
    }
  }
}

// 週間占いの統計情報取得
export function getWeeklyFortuneStats(date: Date = new Date()): {
  averageOverall: number
  averageLove: number
  averageWork: number
  averageHealth: number
  averageMoney: number
  totalCombinations: number
} {
  const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB']
  const zodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
  const animals: Animal[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  
  let totalOverall = 0, totalLove = 0, totalWork = 0, totalHealth = 0, totalMoney = 0
  let count = 0
  
  for (const bloodType of bloodTypes) {
    for (const zodiac of zodiacs) {
      for (const animal of animals) {
        const result = generateWeeklyFortune(bloodType, zodiac, animal, date)
        totalOverall += result.overallScore
        totalLove += result.loveScore
        totalWork += result.workScore
        totalHealth += result.healthScore
        totalMoney += result.moneyScore
        count++
      }
    }
  }
  
  return {
    averageOverall: Math.round(totalOverall / count),
    averageLove: Math.round(totalLove / count),
    averageWork: Math.round(totalWork / count),
    averageHealth: Math.round(totalHealth / count),
    averageMoney: Math.round(totalMoney / count),
    totalCombinations: count
  }
}