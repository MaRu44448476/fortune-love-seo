import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type BloodType, type Zodiac, type Animal } from '@/lib/fortune'
import { generateDetailedAnalysis } from '@/lib/detailedAnalysis'

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
    
    // 詳細分析を生成
    const analysis = generateDetailedAnalysis(
      bloodType as BloodType, 
      zodiac as Zodiac, 
      animal as Animal, 
      targetDate
    )

    return NextResponse.json({ 
      success: true, 
      analysis,
      generatedAt: targetDate.toISOString(),
      user: {
        bloodType,
        zodiac,
        animal
      }
    })
  } catch (error) {
    console.error('Detailed analysis generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userProfile: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.isPremium || (user.premiumUntil && user.premiumUntil < new Date())) {
      return NextResponse.json({ error: 'Premium subscription required' }, { status: 403 })
    }

    if (!user.userProfile?.bloodType || !user.userProfile?.zodiac || !user.userProfile?.animal) {
      return NextResponse.json({ error: 'Profile not complete' }, { status: 400 })
    }

    // 今日の詳細分析を生成
    const analysis = generateDetailedAnalysis(
      user.userProfile.bloodType as BloodType,
      user.userProfile.zodiac as Zodiac,
      user.userProfile.animal as Animal
    )

    return NextResponse.json({ 
      success: true, 
      analysis,
      generatedAt: new Date().toISOString(),
      user: {
        bloodType: user.userProfile.bloodType,
        zodiac: user.userProfile.zodiac,
        animal: user.userProfile.animal
      }
    })
  } catch (error) {
    console.error('Detailed analysis fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}