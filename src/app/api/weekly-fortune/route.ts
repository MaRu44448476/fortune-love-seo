import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type BloodType, type Zodiac, type Animal } from '@/lib/fortune'
import { generateWeeklyFortune } from '@/lib/weeklyFortune'

// 週の開始日（月曜日）を取得
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // プレミアムユーザーかチェック
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isPremium || (user.premiumUntil && user.premiumUntil < new Date())) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    const { bloodType, zodiac, animal, date } = await request.json()

    if (!bloodType || !zodiac || !animal) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const targetDate = date ? new Date(date) : new Date()
    const weekStart = getWeekStart(targetDate)

    // 既存の週間占いをチェック
    const existingWeeklyFortune = await prisma.weeklyFortune.findUnique({
      where: {
        userId_weekStart: {
          userId: user.id,
          weekStart: weekStart,
        },
      },
    })

    let weeklyFortune

    if (existingWeeklyFortune) {
      // 既存のデータを返す
      weeklyFortune = existingWeeklyFortune
    } else {
      // 新しい週間占いを生成
      const fortune = generateWeeklyFortune(bloodType as BloodType, zodiac as Zodiac, animal as Animal, targetDate)

      // データベースに保存
      weeklyFortune = await prisma.weeklyFortune.create({
        data: {
          userId: user.id,
          bloodType,
          zodiac,
          animal,
          weekStart,
          overallScore: fortune.overallScore,
          loveScore: fortune.loveScore,
          workScore: fortune.workScore,
          healthScore: fortune.healthScore,
          moneyScore: fortune.moneyScore,
          dailyAdvice: fortune.dailyAdvice,
          weeklyAdvice: fortune.weeklyAdvice,
          luckyDays: fortune.luckyDays,
          unluckyDays: fortune.unluckyDays,
          compatibility: fortune.compatibility,
        },
      })
    }

    return NextResponse.json({ 
      success: true, 
      weeklyFortune: {
        ...weeklyFortune,
        weekStartFormatted: weekStart.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }
    })
  } catch (error) {
    console.error('Weekly fortune generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const weeks = parseInt(searchParams.get('weeks') || '4') // デフォルト4週間

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isPremium || (user.premiumUntil && user.premiumUntil < new Date())) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    // 過去の週間占い履歴を取得
    const weeklyHistory = await prisma.weeklyFortune.findMany({
      where: { userId: user.id },
      orderBy: { weekStart: 'desc' },
      take: weeks,
    })

    // 各週の情報にフォーマット済み日付を追加
    const formattedHistory = weeklyHistory.map(fortune => ({
      ...fortune,
      weekStartFormatted: fortune.weekStart.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      weekEndFormatted: new Date(fortune.weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric'
      })
    }))

    return NextResponse.json({ weeklyHistory: formattedHistory })
  } catch (error) {
    console.error('Weekly fortune history fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}