import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { bloodType, zodiac, animal, score, luckyColor, luckyItem, advice } = await request.json()

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 今日の占い履歴を保存（同じ日は上書き）
    const fortuneHistory = await prisma.fortuneHistory.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date: today,
        },
      },
      update: {
        bloodType,
        zodiac,
        animal,
        score,
        luckyColor,
        luckyItem,
        advice,
      },
      create: {
        userId: user.id,
        bloodType,
        zodiac,
        animal,
        date: today,
        score,
        luckyColor,
        luckyItem,
        advice,
      },
    })

    return NextResponse.json({ success: true, fortuneHistory })
  } catch (error) {
    console.error('Fortune save error:', error)
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
    const limit = parseInt(searchParams.get('limit') || '10')

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 占い履歴を取得
    const fortuneHistory = await prisma.fortuneHistory.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: limit,
    })

    return NextResponse.json({ fortuneHistory })
  } catch (error) {
    console.error('Fortune history fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}