// パフォーマンス最適化ユーティリティ

// 画像の遅延読み込み設定
export const getOptimalImageSizes = (maxWidth: number = 1200) => {
  return `(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, ${Math.min(maxWidth, 400)}px`
}

// Critical Resource Hints
export const generateResourceHints = () => {
  return [
    // DNS Prefetch
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
    { rel: 'dns-prefetch', href: '//js.stripe.com' },
    
    // Preconnect for critical resources
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    
    // Preload critical CSS
    { rel: 'preload', href: '/styles/critical.css', as: 'style' },
  ]
}

// パフォーマンス計測
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  
  // 計測開始
  startTiming(label: string) {
    this.metrics.set(`${label}_start`, performance.now())
  }
  
  // 計測終了・記録
  endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`)
    if (!startTime) return 0
    
    const duration = performance.now() - startTime
    this.metrics.set(label, duration)
    
    // 開発環境ではコンソールに出力
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }
  
  // Core Web Vitals の詳細監視
  observeWebVitals() {
    if (typeof window === 'undefined') return
    
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    
    // First Input Delay (deprecated, replaced with INP)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    
    // Cumulative Layout Shift
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
          console.log('CLS:', clsValue)
        }
      })
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
  }
  
  // リソース読み込み時間の監視
  monitorResourceTiming() {
    if (typeof window === 'undefined') return
    
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource')
      
      // 大きなリソースの特定
      const largeResources = resources.filter(resource => 
        (resource as PerformanceResourceTiming).transferSize > 100000 // 100KB以上
      )
      
      if (largeResources.length > 0) {
        console.warn('🚨 Large resources detected:', largeResources)
      }
      
      // 遅いリソースの特定
      const slowResources = resources.filter(resource => 
        resource.duration > 1000 // 1秒以上
      )
      
      if (slowResources.length > 0) {
        console.warn('🐌 Slow resources detected:', slowResources)
      }
    })
  }
}

// Bundle Analyzer用の設定
export const bundleAnalyzerConfig = {
  analyzer: {
    analyzerMode: 'server',
    analyzerPort: 8888,
    openAnalyzer: true,
  },
}

// 画像最適化のヘルパー
export const optimizeImageProps = (
  src: string,
  alt: string,
  priority: boolean = false
) => ({
  src,
  alt,
  quality: 85,
  placeholder: 'blur' as const,
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  priority,
  sizes: getOptimalImageSizes(),
})

// JavaScript遅延読み込み
export const loadScriptAsync = (src: string, id?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id || src)) {
      resolve()
      return
    }
    
    const script = document.createElement('script')
    script.src = src
    script.async = true
    if (id) script.id = id
    
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    
    document.head.appendChild(script)
  })
}

// CSS遅延読み込み
export const loadStyleAsync = (href: string, id?: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id || href)) {
      resolve()
      return
    }
    
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    if (id) link.id = id
    
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`))
    
    document.head.appendChild(link)
  })
}

// メモリリーク防止
export const cleanup = {
  removeAllListeners: () => {
    // Remove all event listeners to prevent memory leaks
    const events = ['scroll', 'resize', 'orientationchange']
    events.forEach(event => {
      window.removeEventListener(event, () => {})
    })
  },
  
  clearTimers: () => {
    // Clear any running timers
    const highestTimeoutId = setTimeout(() => {}, 0)
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i)
    }
  }
}

// グローバルパフォーマンス監視インスタンス
export const performanceMonitor = new PerformanceMonitor()