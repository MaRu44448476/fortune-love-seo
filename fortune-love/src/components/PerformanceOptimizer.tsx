'use client'

import { useEffect } from 'react'
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

// Core Web Vitals計測とレポート
export default function PerformanceOptimizer() {
  useEffect(() => {
    // Core Web Vitalsの計測
    onCLS(sendToAnalytics)
    onINP(sendToAnalytics)
    onFCP(sendToAnalytics)
    onLCP(sendToAnalytics)
    onTTFB(sendToAnalytics)
  }, [])

  return null // このコンポーネントは何もレンダリングしない
}

function sendToAnalytics(metric: {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
}) {
  // 開発環境では Console に出力
  if (process.env.NODE_ENV === 'development') {
    console.log('Core Web Vitals:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    })
  }

  // 本番環境では分析サービスに送信
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4 に送信
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        custom_parameter_1: metric.value,
        custom_parameter_2: metric.rating,
        custom_parameter_3: metric.delta,
      })
    }

    // 独自の分析エンドポイントに送信
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    }).catch(console.error)
  }
}

// TypeScript の型定義
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}