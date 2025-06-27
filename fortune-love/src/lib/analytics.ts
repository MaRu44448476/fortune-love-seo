// Google Analytics 4 設定
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// gtag関数の型定義
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

// Google Analytics初期化
export const gtag = (...args: Parameters<typeof window.gtag>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// ページビュー追跡
export const trackPageView = (url: string) => {
  if (!GA_TRACKING_ID) return
  
  gtag('config', GA_TRACKING_ID, {
    page_location: url,
  })
}

// イベント追跡
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!GA_TRACKING_ID) return
  
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// コンバージョン追跡
export const trackConversion = (
  action: 'premium_subscription' | 'fortune_view' | 'ranking_view' | 'weekly_view' | 'analysis_view',
  value?: number
) => {
  trackEvent(action, 'conversion', action, value)
}

// エンゲージメント追跡
export const trackEngagement = (
  action: 'scroll_depth' | 'time_on_page' | 'click' | 'share',
  label?: string,
  value?: number
) => {
  trackEvent(action, 'engagement', label, value)
}

// エラー追跡
export const trackError = (
  error: string,
  context?: string
) => {
  trackEvent('error', 'javascript_error', `${context}: ${error}`)
}

// カスタムイベント追跡関数
export const analytics = {
  // 占い関連
  fortuneGenerated: (bloodType: string, zodiac: string, animal: string, score: number) => {
    trackEvent('fortune_generated', 'fortune', `${bloodType}_${zodiac}_${animal}`, score)
  },
  
  fortuneShared: (platform: 'twitter' | 'facebook' | 'line' | 'copy') => {
    trackEvent('fortune_shared', 'social', platform)
  },
  
  // プレミアム関連
  premiumTrialStarted: () => {
    trackConversion('premium_subscription', 0)
  },
  
  premiumPurchased: (plan: 'monthly' | 'yearly', amount: number) => {
    trackConversion('premium_subscription', amount)
    trackEvent('purchase', 'premium', plan, amount)
  },
  
  // ランキング関連
  rankingViewed: (date?: string) => {
    trackConversion('ranking_view')
    trackEvent('ranking_viewed', 'navigation', date)
  },
  
  // 詳細分析関連
  analysisViewed: () => {
    trackConversion('analysis_view')
    trackEvent('analysis_viewed', 'premium')
  },
  
  // 週間占い関連
  weeklyViewed: () => {
    trackConversion('weekly_view')
    trackEvent('weekly_viewed', 'premium')
  },
  
  // ユーザー行動
  userSignedIn: (provider: 'google' | 'email') => {
    trackEvent('sign_in', 'authentication', provider)
  },
  
  userSignedUp: (provider: 'google' | 'email') => {
    trackEvent('sign_up', 'authentication', provider)
  },
  
  profileCompleted: () => {
    trackEvent('profile_completed', 'onboarding')
  },
  
  // UI インタラクション
  buttonClicked: (buttonName: string, location: string) => {
    trackEvent('button_click', 'ui_interaction', `${location}_${buttonName}`)
  },
  
  pageScrolled: (percentage: number) => {
    if (percentage >= 75) {
      trackEngagement('scroll_depth', 'deep_scroll', percentage)
    }
  }
}

// パフォーマンス監視
export const trackPerformance = () => {
  if (typeof window === 'undefined') return
  
  // ページ読み込み完了後にパフォーマンスメトリクスを送信
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        // ページ読み込み時間
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        trackEvent('page_load_time', 'performance', 'milliseconds', Math.round(pageLoadTime))
        
        // DOM Content Loaded時間
        const domContentLoadedTime = navigation.domContentLoadedEventEnd - navigation.fetchStart
        trackEvent('dom_content_loaded_time', 'performance', 'milliseconds', Math.round(domContentLoadedTime))
        
        // First Contentful Paint
        const paintEntries = performance.getEntriesByType('paint')
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
        if (fcp) {
          trackEvent('first_contentful_paint', 'performance', 'milliseconds', Math.round(fcp.startTime))
        }
      }
    }, 1000)
  })
}