export interface StructuredDataProps {
  type: 'website' | 'article' | 'service' | 'organization'
  data?: Record<string, any>
}

const baseStructuredData = {
  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "恋愛占いサイト",
    "alternateName": "Fortune Love",
    "description": "血液型×星座×干支による恋愛占い。576通りの組み合わせで毎日変わる運勢をお届け。",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://fortune-love.com",
    "inLanguage": "ja-JP",
    "sameAs": [
      "https://twitter.com/fortune_love_jp",
      "https://instagram.com/fortune_love_jp"
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_BASE_URL || "https://fortune-love.com"}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Service",
      "name": "恋愛占いサービス",
      "description": "血液型・星座・干支を組み合わせた恋愛占い",
      "provider": {
        "@type": "Organization",
        "name": "恋愛占いサイト"
      },
      "serviceType": "占いサービス",
      "audience": {
        "@type": "Audience",
        "audienceType": "恋愛に関心のある人"
      }
    }
  },
  
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "恋愛占いサイト",
    "alternateName": "Fortune Love",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://fortune-love.com",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL || "https://fortune-love.com"}/logo.png`,
      "width": 200,
      "height": 200
    },
    "description": "血液型×星座×干支による恋愛占いサービスを提供",
    "foundingDate": "2025",
    "serviceArea": {
      "@type": "Country",
      "name": "日本"
    },
    "knowsAbout": [
      "恋愛占い",
      "血液型占い", 
      "星座占い",
      "干支占い",
      "相性診断",
      "運勢"
    ],
    "sameAs": [
      "https://twitter.com/fortune_love_jp",
      "https://instagram.com/fortune_love_jp"
    ]
  },

  fortuneService: {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "恋愛占いサービス",
    "description": "血液型・星座・干支の組み合わせによる576通りの恋愛占い",
    "provider": {
      "@type": "Organization",
      "name": "恋愛占いサイト",
      "url": process.env.NEXT_PUBLIC_BASE_URL || "https://fortune-love.com"
    },
    "serviceType": "占いサービス",
    "category": "恋愛・相性占い",
    "audience": {
      "@type": "Audience",
      "audienceType": "恋愛に関心のある人"
    },
    "areaServed": {
      "@type": "Country",
      "name": "日本"
    },
    "availableLanguage": "ja",
    "isAccessibleForFree": true,
    "offers": [
      {
        "@type": "Offer",
        "name": "無料占い",
        "description": "基本的な恋愛占いを無料で提供",
        "price": "0",
        "priceCurrency": "JPY"
      },
      {
        "@type": "Offer",
        "name": "プレミアムプラン",
        "description": "詳細分析・週間占い・相性診断などの高度機能",
        "price": "980",
        "priceCurrency": "JPY",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "980",
          "priceCurrency": "JPY",
          "unitText": "月額"
        }
      }
    ]
  },

  breadcrumb: (items: Array<{name: string, url: string}>) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${process.env.NEXT_PUBLIC_BASE_URL || "https://fortune-love.com"}${item.url}`
    }))
  }),

  faq: (questions: Array<{question: string, answer: string}>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer
      }
    }))
  })
}

export default function StructuredData({ type, data = {} }: StructuredDataProps) {
  let structuredData

  switch (type) {
    case 'website':
      structuredData = { ...baseStructuredData.website, ...data }
      break
    case 'organization':
      structuredData = { ...baseStructuredData.organization, ...data }
      break
    case 'service':
      structuredData = { ...baseStructuredData.fortuneService, ...data }
      break
    default:
      structuredData = baseStructuredData.website
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

// FAQ用の構造化データ
export function FAQStructuredData({ questions }: { questions: Array<{question: string, answer: string}> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseStructuredData.faq(questions), null, 2)
      }}
    />
  )
}

// パンくずリスト用の構造化データ
export function BreadcrumbStructuredData({ items }: { items: Array<{name: string, url: string}> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseStructuredData.breadcrumb(items), null, 2)
      }}
    />
  )
}

// 占い結果用の構造化データ
export function FortuneResultStructuredData({ 
  bloodType, 
  zodiac, 
  animal, 
  score, 
  date 
}: {
  bloodType: string
  zodiac: string
  animal: string
  score: number
  date: string
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Service",
      "name": "恋愛占い",
      "description": `${bloodType}型×${zodiac}×${animal}の恋愛占い`
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": score,
      "bestRating": 100,
      "worstRating": 1
    },
    "name": `${bloodType}型×${zodiac}×${animal}の恋愛運`,
    "description": `今日の恋愛運スコア: ${score}点`,
    "datePublished": date,
    "author": {
      "@type": "Organization",
      "name": "恋愛占いサイト"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}