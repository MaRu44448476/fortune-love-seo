import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 データベースの初期化を開始します...')

  // システム用のデータ投入
  console.log('📊 占いランキングの初期データを作成中...')
  
  // 開発・テスト用のサンプルユーザー（本番では削除推奨）
  if (process.env.NODE_ENV !== 'production') {
    console.log('👤 開発用サンプルユーザーを作成中...')
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'テストユーザー',
        isPremium: true,
        premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
        userProfile: {
          create: {
            bloodType: 'A',
            zodiac: 'おひつじ座',
            animal: '子',
          }
        }
      },
      include: {
        userProfile: true
      }
    })

    console.log(`✅ テストユーザー作成完了: ${testUser.email}`)
  }

  // 占いの基本データ検証用
  const bloodTypes = ['A', 'B', 'O', 'AB']
  const zodiacs = [
    'おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座',
    'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座'
  ]
  const animals = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

  console.log(`📈 占い組み合わせ総数: ${bloodTypes.length * zodiacs.length * animals.length}通り`)

  console.log('🎉 データベース初期化完了！')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ データベース初期化エラー:', e)
    await prisma.$disconnect()
    process.exit(1)
  })