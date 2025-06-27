'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { GA_TRACKING_ID, trackPageView, trackPerformance } from '@/lib/analytics'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_TRACKING_ID) return

    const url = pathname + searchParams.toString()
    trackPageView(url)
  }, [pathname, searchParams])

  useEffect(() => {
    // パフォーマンス監視を開始
    trackPerformance()
  }, [])

  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              custom_map: {
                'custom_parameter_1': 'fortune_type',
                'custom_parameter_2': 'user_type',
                'custom_parameter_3': 'premium_status'
              },
              // eコマース測定を有効化
              send_page_view: false
            });
            
            // カスタムディメンション設定
            gtag('config', '${GA_TRACKING_ID}', {
              custom_map: {
                'custom_parameter_1': 'dimension1', // 占いタイプ
                'custom_parameter_2': 'dimension2', // ユーザータイプ
                'custom_parameter_3': 'dimension3'  // プレミアム状態
              }
            });
          `,
        }}
      />
    </>
  )
}