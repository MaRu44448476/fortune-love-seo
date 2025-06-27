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

    const { bloodType, zodiac, animal } = await request.json()

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // プロフィールを更新または作成
    const userProfile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        bloodType,
        zodiac,
        animal,
      },
      create: {
        userId: user.id,
        bloodType,
        zodiac,
        animal,
      },
    })

    return NextResponse.json({ success: true, profile: userProfile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ユーザーとプロフィールを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { userProfile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        premiumUntil: user.premiumUntil,
      },
      profile: user.userProfile 
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}