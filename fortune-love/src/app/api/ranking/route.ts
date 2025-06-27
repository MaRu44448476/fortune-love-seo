import { NextResponse } from 'next/server'
import { type BloodType, type Zodiac, type Animal, generateFortune } from '@/lib/fortune'

interface RankingItem {
  rank: number
  bloodType: BloodType
  zodiac: Zodiac
  animal: Animal
  score: number
  element: string
  compatibility: string
  mood: string
}

export async function GET() {
  try {
    const bloodTypes: BloodType[] = ['A', 'B', 'O', 'AB']
    const zodiacs: Zodiac[] = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座']
    const animals: Animal[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    
    const today = new Date()
    const combinations: RankingItem[] = []
    
    // 全組み合わせの占い結果を生成
    for (const bloodType of bloodTypes) {
      for (const zodiac of zodiacs) {
        for (const animal of animals) {
          const fortune = generateFortune(bloodType, zodiac, animal, today)
          
          combinations.push({
            rank: 0,
            bloodType,
            zodiac,
            animal,
            score: fortune.score,
            element: fortune.element,
            compatibility: fortune.compatibility,
            mood: fortune.mood
          })
        }
      }
    }
    
    // スコアでソートしてランキング付け
    combinations.sort((a, b) => b.score - a.score)
    combinations.forEach((item, index) => {
      item.rank = index + 1
    })
    
    // 統計情報を計算
    const totalCombinations = combinations.length
    const maxScore = combinations[0].score
    const minScore = combinations[combinations.length - 1].score
    const averageScore = Math.round(
      combinations.reduce((sum, item) => sum + item.score, 0) / combinations.length
    )
    
    // 属性別統計
    const elementStats = combinations.reduce((acc, item) => {
      acc[item.element] = (acc[item.element] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // 相性別統計
    const compatibilityStats = combinations.reduce((acc, item) => {
      acc[item.compatibility] = (acc[item.compatibility] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return NextResponse.json({
      ranking: combinations,
      stats: {
        totalCombinations,
        maxScore,
        minScore,
        averageScore,
        elementStats,
        compatibilityStats
      },
      date: today.toISOString()
    })
  } catch (error) {
    console.error('Ranking generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// 特定の組み合わせの順位を取得
export async function POST(request: Request) {
  try {
    const { bloodType, zodiac, animal } = await request.json()
    
    if (!bloodType || !zodiac || !animal) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    
    // 全ランキングデータを取得
    const rankingResponse = await GET()
    const rankingData = await rankingResponse.json()
    
    // 指定された組み合わせの順位を検索
    const userRank = rankingData.ranking.find((item: RankingItem) => 
      item.bloodType === bloodType && 
      item.zodiac === zodiac && 
      item.animal === animal
    )
    
    if (!userRank) {
      return NextResponse.json({ error: 'Combination not found' }, { status: 404 })
    }
    
    // 周辺の順位も取得（前後3位ずつ）
    const surroundingRanks = rankingData.ranking.filter((item: RankingItem) => 
      Math.abs(item.rank - userRank.rank) <= 3
    )
    
    return NextResponse.json({
      userRank,
      surroundingRanks,
      totalCombinations: rankingData.stats.totalCombinations,
      percentile: Math.round(((rankingData.stats.totalCombinations - userRank.rank + 1) / rankingData.stats.totalCombinations) * 100)
    })
  } catch (error) {
    console.error('User ranking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}