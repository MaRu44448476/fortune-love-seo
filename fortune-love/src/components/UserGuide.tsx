'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Heart, Sparkles, Crown } from 'lucide-react'

interface GuideStep {
  id: string
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  icon?: React.ReactNode
}

interface UserGuideProps {
  steps: GuideStep[]
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function UserGuide({ steps, isOpen, onClose, onComplete }: UserGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (isOpen && steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target) as HTMLElement
      setTargetElement(element)
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.style.position = 'relative'
        element.style.zIndex = '1000'
      }
    }
    
    return () => {
      if (targetElement) {
        targetElement.style.position = ''
        targetElement.style.zIndex = ''
      }
    }
  }, [currentStep, isOpen, steps])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    onClose()
    setCurrentStep(0)
  }

  if (!isOpen || steps.length === 0) return null

  const step = steps[currentStep]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* オーバーレイ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={handleClose}
        />
        
        {/* スポットライト効果 */}
        {targetElement && (
          <div
            className="absolute"
            style={{
              top: targetElement.offsetTop - 10,
              left: targetElement.offsetLeft - 10,
              width: targetElement.offsetWidth + 20,
              height: targetElement.offsetHeight + 20,
              border: '3px solid #ec4899',
              borderRadius: '8px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              zIndex: 999,
              pointerEvents: 'none',
            }}
          />
        )}
        
        {/* ガイドカード */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-4 z-[1001]"
          role="dialog"
          aria-labelledby="guide-title"
          aria-describedby="guide-description"
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {step.icon && (
                <div className="text-purple-600">
                  {step.icon}
                </div>
              )}
              <h2 id="guide-title" className="text-lg font-semibold text-gray-900">
                {step.title}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="ガイドを閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* コンテンツ */}
          <p id="guide-description" className="text-gray-600 mb-6 leading-relaxed">
            {step.description}
          </p>
          
          {/* プログレスインジケーター */}
          <div className="flex gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-purple-600 w-8'
                    : index < currentStep
                    ? 'bg-purple-300 w-2'
                    : 'bg-gray-200 w-2'
                }`}
              />
            ))}
          </div>
          
          {/* フッター */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </div>
            
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  戻る
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {currentStep === steps.length - 1 ? '完了' : '次へ'}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

// 初回訪問者向けのオンボーディング
export function OnboardingGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // ローカルストレージから完了状態をチェック
    const completed = localStorage.getItem('onboarding-completed')
    if (!completed) {
      setIsOpen(true)
    } else {
      setIsCompleted(true)
    }
  }, [])

  const steps: GuideStep[] = [
    {
      id: 'welcome',
      title: 'ようこそ！恋愛占いサイトへ',
      description: '血液型×星座×干支の組み合わせで、576通りの本格的な恋愛占いをお楽しみいただけます。',
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: 'select-attributes',
      title: 'あなたの属性を選択',
      description: '血液型、星座、干支を選択してください。これらの組み合わせであなただけの運勢を占います。',
      target: '[data-guide="fortune-form"]',
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      id: 'view-results',
      title: '占い結果を確認',
      description: '今日のあなたの恋愛運スコア、ラッキーカラー、アドバイスが表示されます。',
      target: '[data-guide="fortune-results"]',
    },
    {
      id: 'premium-features',
      title: 'プレミアム機能',
      description: 'プレミアムプランでは詳細分析、週間占い、相性診断などの高度機能をご利用いただけます。',
      icon: <Crown className="w-6 h-6" />,
    },
  ]

  const handleComplete = () => {
    setIsOpen(false)
    setIsCompleted(true)
    localStorage.setItem('onboarding-completed', 'true')
  }

  const handleRestart = () => {
    localStorage.removeItem('onboarding-completed')
    setIsCompleted(false)
    setIsOpen(true)
  }

  return (
    <>
      <UserGuide
        steps={steps}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComplete={handleComplete}
      />
      
      {/* ヘルプボタン */}
      {isCompleted && (
        <button
          onClick={handleRestart}
          className="fixed bottom-4 left-4 bg-white text-purple-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-purple-200 z-40"
          aria-label="操作ガイドを再表示"
          title="操作ガイドを再表示"
        >
          ❓
        </button>
      )}
    </>
  )
}

// 機能別ガイド
export function FeatureGuide({ feature }: { feature: 'premium' | 'ranking' | 'weekly' }) {
  const guides = {
    premium: [
      {
        id: 'premium-benefits',
        title: 'プレミアム機能について',
        description: 'プレミアムプランでは、より詳細な占い結果と特別機能をご利用いただけます。',
        icon: <Crown className="w-6 h-6" />,
      },
      {
        id: 'detailed-analysis',
        title: '詳細分析レポート',
        description: 'あなたの性格分析、恋愛傾向、相性診断など深い洞察を提供します。',
      },
      {
        id: 'weekly-forecast',
        title: '週間占い',
        description: '7日間の詳細な運勢予報で、最適なタイミングを見つけられます。',
      },
    ],
    ranking: [
      {
        id: 'ranking-overview',
        title: '恋愛運ランキング',
        description: '576通りの組み合わせの中から、今日の恋愛運トップ10を発表します。',
      },
      {
        id: 'your-rank',
        title: 'あなたの順位',
        description: 'ログインするとあなたの今日の順位を確認できます。',
      },
    ],
    weekly: [
      {
        id: 'weekly-overview',
        title: '週間占い',
        description: '7日間の詳細な運勢をお届けします。プレミアム限定機能です。',
        icon: <Crown className="w-6 h-6" />,
      },
      {
        id: 'daily-breakdown',
        title: '日別の運勢',
        description: '恋愛、仕事、健康、金運を日別に詳しく分析します。',
      },
    ],
  }

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-purple-600 hover:text-purple-700 text-sm underline"
      >
        使い方ガイド
      </button>
      
      <UserGuide
        steps={guides[feature]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComplete={() => setIsOpen(false)}
      />
    </>
  )
}