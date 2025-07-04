import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { bloodType, zodiac, animal, score, luckyColor, luckyItem, advice } = await request.json()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 今日の占い履歴を保存（同じ組み合わせは上書き）
    const fortuneHistory = await prisma.fortuneHistory.upsert({
      where: {
        bloodType_zodiac_animal_date: {
          bloodType,
          zodiac,
          animal,
          date: today,
        },
      },
      update: {
        score,
        luckyColor,
        luckyItem,
        advice,
      },
      create: {
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
    const url = new URL(request.url)
    const bloodType = url.searchParams.get('bloodType')
    const zodiac = url.searchParams.get('zodiac')
    const animal = url.searchParams.get('animal')

    if (!bloodType || !zodiac || !animal) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 今日の占い履歴を取得
    const fortuneHistory = await prisma.fortuneHistory.findUnique({
      where: {
        bloodType_zodiac_animal_date: {
          bloodType,
          zodiac,
          animal,
          date: today,
        },
      },
    })

    return NextResponse.json({ fortuneHistory })
  } catch (error) {
    console.error('Fortune get error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}