import { Noto_Sans_JP, Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Google Fonts の最適化設定
export const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  preload: true,
  fallback: [
    'Hiragino Kaku Gothic ProN',
    'Hiragino Sans',
    'Meiryo',
    'sans-serif',
  ],
})

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

// ローカルフォントの設定（必要に応じて）
export const customFont = localFont({
  src: [
    {
      path: '../assets/fonts/custom-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/custom-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-custom',
  display: 'swap',
})

// フォント最適化のためのCSS変数
export const fontVariables = [
  notoSansJP.variable,
  inter.variable,
].join(' ')