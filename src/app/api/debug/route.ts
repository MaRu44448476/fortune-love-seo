import { NextResponse } from 'next/server'

export async function GET() {
  const debugInfo = {
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '設定済み' : '未設定',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '設定済み' : '未設定',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '設定済み' : '未設定',
      DATABASE_URL: process.env.DATABASE_URL ? '設定済み' : '未設定',
    },
    vercelUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(debugInfo)
}