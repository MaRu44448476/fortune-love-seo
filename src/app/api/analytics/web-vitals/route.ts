import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Core Web Vitals データの検証
    const { name, value, rating, delta, id, url, userAgent, timestamp } = data
    
    if (!name || value === undefined) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    // ここで実際の分析サービス（例：Google Analytics、Datadog、カスタムDB）に送信
    console.log('Web Vitals Metric:', {
      name,
      value,
      rating,
      delta,
      id,
      url,
      userAgent,
      timestamp,
      formattedTime: new Date(timestamp).toISOString(),
    })

    // パフォーマンス警告の判定
    const isPerformanceIssue = checkPerformanceThresholds(name, value)
    
    if (isPerformanceIssue) {
      console.warn(`Performance issue detected: ${name} = ${value}`, {
        url,
        rating,
        threshold: getThreshold(name),
      })
      
      // アラート送信（Slack、メールなど）
      // await sendPerformanceAlert(name, value, url, rating)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing web vitals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function checkPerformanceThresholds(name: string, value: number): boolean {
  const thresholds: Record<string, number> = {
    CLS: 0.1,      // Cumulative Layout Shift
    INP: 200,      // Interaction to Next Paint (ms)
    FCP: 1800,     // First Contentful Paint (ms)
    LCP: 2500,     // Largest Contentful Paint (ms)
    TTFB: 800,     // Time to First Byte (ms)
  }

  const threshold = thresholds[name]
  return threshold !== undefined && value > threshold
}

function getThreshold(name: string): number | undefined {
  const thresholds: Record<string, number> = {
    CLS: 0.1,
    INP: 200,
    FCP: 1800,
    LCP: 2500,
    TTFB: 800,
  }
  return thresholds[name]
}