import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // エラーログをコンソールに出力（Vercelログで確認可能）
    console.error('認証エラー:', {
      error: body.error,
      url: body.url,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    })
    
    return NextResponse.json({ logged: true })
  } catch (error) {
    console.error('エラーログ記録失敗:', error)
    return NextResponse.json({ logged: false }, { status: 500 })
  }
}