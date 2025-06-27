'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AccessibilityContextType {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  keyboardNavigation: boolean
  screenReader: boolean
  announceMessage: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
  keyboardNavigation: false,
  screenReader: false,
  announceMessage: () => {},
})

export const useAccessibility = () => useContext(AccessibilityContext)

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export default function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)
  const [screenReader, setScreenReader] = useState(false)

  useEffect(() => {
    // ユーザーの設定を検出
    const mediaQueries = {
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      highContrast: window.matchMedia('(prefers-contrast: high)'),
    }

    // 設定を初期化
    setReducedMotion(mediaQueries.reducedMotion.matches)
    setHighContrast(mediaQueries.highContrast.matches)

    // 変更を監視
    const handlers = {
      reducedMotion: (e: MediaQueryListEvent) => setReducedMotion(e.matches),
      highContrast: (e: MediaQueryListEvent) => setHighContrast(e.matches),
    }

    mediaQueries.reducedMotion.addEventListener('change', handlers.reducedMotion)
    mediaQueries.highContrast.addEventListener('change', handlers.highContrast)

    // キーボードナビゲーション検出
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true)
      }
    }

    const handleMouseDown = () => {
      setKeyboardNavigation(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    // スクリーンリーダー検出
    const detectScreenReader = () => {
      const screenReaderElements = document.querySelectorAll('[aria-hidden="true"]')
      setScreenReader(screenReaderElements.length > 0)
    }

    detectScreenReader()

    // ローカルストレージから設定を読み込み
    const savedFontSize = localStorage.getItem('fontSize') as 'small' | 'medium' | 'large'
    if (savedFontSize) {
      setFontSize(savedFontSize)
    }

    return () => {
      mediaQueries.reducedMotion.removeEventListener('change', handlers.reducedMotion)
      mediaQueries.highContrast.removeEventListener('change', handlers.highContrast)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // アナウンス機能（スクリーンリーダー用）
  const announceMessage = (message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    announcement.textContent = message

    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  // フォントサイズ変更
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize)
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  // CSS変数を設定
  useEffect(() => {
    const root = document.documentElement
    
    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms')
      root.style.setProperty('--transition-duration', '0.01ms')
    } else {
      root.style.removeProperty('--animation-duration')
      root.style.removeProperty('--transition-duration')
    }

    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    if (keyboardNavigation) {
      root.classList.add('keyboard-navigation')
    } else {
      root.classList.remove('keyboard-navigation')
    }
  }, [reducedMotion, highContrast, keyboardNavigation])

  const value: AccessibilityContextType = {
    reducedMotion,
    highContrast,
    fontSize,
    keyboardNavigation,
    screenReader,
    announceMessage,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* アクセシビリティ設定パネル */}
      <AccessibilityPanel 
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />
    </AccessibilityContext.Provider>
  )
}

interface AccessibilityPanelProps {
  fontSize: 'small' | 'medium' | 'large'
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void
}

function AccessibilityPanel({ fontSize, onFontSizeChange }: AccessibilityPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        aria-label="アクセシビリティ設定を開く"
        aria-expanded={isOpen}
      >
        ♿
      </button>
      
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-64"
          role="dialog"
          aria-label="アクセシビリティ設定"
        >
          <h3 className="text-lg font-semibold mb-4">アクセシビリティ設定</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文字サイズ
              </label>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => onFontSizeChange(size)}
                    className={`px-3 py-2 rounded ${
                      fontSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    aria-pressed={fontSize === size}
                  >
                    {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
            aria-label="設定パネルを閉じる"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  )
}