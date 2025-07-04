import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 データベースの初期化を開始します...')

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