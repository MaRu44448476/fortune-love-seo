'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react'

// ローディングスピナー
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`} role="status" aria-live="polite">
      <Loader2 className={`animate-spin text-purple-600 ${sizes[size]}`} aria-hidden="true" />
      {text && (
        <span className="text-sm text-gray-600">
          {text}
        </span>
      )}
      <span className="sr-only">読み込み中...</span>
    </div>
  )
}

// プログレスバー
interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  className?: string
}

export function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true,
  className = '' 
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>{label}</span>
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div 
        className="w-full bg-gray-200 rounded-full h-2"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || '進行状況'}
      >
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// トースト通知
type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

function Toast({ toast, onClose }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  }

  const Icon = icons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      className={`max-w-sm w-full ${colors[toast.type]} border rounded-lg shadow-lg p-4`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColors[toast.type]}`} aria-hidden="true" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">
              {toast.message}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-current"
            onClick={() => onClose(toast.id)}
            aria-label="通知を閉じる"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// トーストコンテナ
interface ToastContainerProps {
  toasts: Toast[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2"
      aria-live="polite"
      aria-label="通知エリア"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// エラーバウンダリー
interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          エラーが発生しました
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          申し訳ございませんが、予期しないエラーが発生しました。
          {process.env.NODE_ENV === 'development' && (
            <>
              <br />
              <code className="text-xs bg-gray-100 p-1 rounded mt-2 block">
                {error.message}
              </code>
            </>
          )}
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={resetError}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            再試行
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            ページを再読み込み
          </button>
        </div>
      </div>
    </div>
  )
}

// スケルトンローダー
interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`} aria-label="読み込み中">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded h-4 mb-2 last:mb-0"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  )
}

// 空の状態表示
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="flex justify-center mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// フォームバリデーションメッセージ
interface ValidationMessageProps {
  errors: string[]
  className?: string
}

export function ValidationMessage({ errors, className = '' }: ValidationMessageProps) {
  if (errors.length === 0) return null

  return (
    <div 
      className={`bg-red-50 border border-red-200 rounded-lg p-3 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex">
        <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" aria-hidden="true" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            入力内容に問題があります
          </h3>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}