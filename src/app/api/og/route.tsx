import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // パラメータ取得
    const title = searchParams.get('title') || '恋愛占い'
    const subtitle = searchParams.get('subtitle') || '血液型×星座×干支で毎日変わる運勢'
    const score = searchParams.get('score')
    const bloodType = searchParams.get('bloodType')
    const zodiac = searchParams.get('zodiac')
    const animal = searchParams.get('animal')
    const type = searchParams.get('type') || 'default' // default, fortune, ranking, premium, weekly, analysis

    // 背景色とアクセントカラーをタイプ別に設定
    const getColors = (type: string) => {
      switch (type) {
        case 'fortune':
          return { bg: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)', accent: '#ec4899' }
        case 'ranking':
          return { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', accent: '#06b6d4' }
        case 'premium':
          return { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#f59e0b' }
        case 'weekly':
          return { bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', accent: '#f97316' }
        case 'analysis':
          return { bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', accent: '#8b5cf6' }
        default:
          return { bg: 'linear-gradient(135deg, #ffeef8 0%, #f0e6ff 100%)', accent: '#ec4899' }
      }
    }

    const colors = getColors(type)

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.bg,
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* 装飾的な背景パターン */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.accent} 2px, transparent 2px), radial-gradient(circle at 75% 75%, ${colors.accent} 2px, transparent 2px)`,
              backgroundSize: '60px 60px',
            }}
          />
          
          {/* メインコンテンツ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* タイトル */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 24px 0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>

            {/* サブタイトル */}
            <p
              style={{
                fontSize: '32px',
                color: '#4b5563',
                margin: '0 0 40px 0',
                fontWeight: '500',
                maxWidth: '900px',
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </p>

            {/* 占い結果表示エリア */}
            {score && bloodType && zodiac && animal && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '32px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '32px 48px',
                  borderRadius: '24px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  margin: '0 0 40px 0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: colors.accent,
                      margin: '0 0 8px 0',
                    }}
                  >
                    {score}点
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      color: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    今日の運勢
                  </div>
                </div>
                
                <div
                  style={{
                    width: '2px',
                    height: '80px',
                    background: '#e5e7eb',
                  }}
                />
                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                    }}
                  >
                    {bloodType}型 × {zodiac} × {animal}
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#6b7280',
                    }}
                  >
                    あなたの組み合わせ
                  </div>
                </div>
              </div>
            )}

            {/* プレミアム表示 */}
            {type === 'premium' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: '2px solid #f59e0b',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                  }}
                >
                  👑
                </div>
                <span
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                  }}
                >
                  プレミアム限定
                </span>
              </div>
            )}
          </div>

          {/* フッター */}
          <div
            style={{
              position: 'absolute',
              bottom: '32px',
              right: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#6b7280',
              fontSize: '20px',
              fontWeight: '500',
            }}
          >
            <div
              style={{
                fontSize: '24px',
              }}
            >
              💕
            </div>
            恋愛占いサイト
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    console.log(`Failed to generate the image`, e)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}