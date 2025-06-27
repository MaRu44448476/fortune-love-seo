import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import StructuredData from "@/components/StructuredData";
import PerformanceOptimizer from "@/components/PerformanceOptimizer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { presetOGImages } from "@/lib/og-image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "恋愛占い | 血液型×星座×干支で毎日変わる運勢 - 576通りの本格占い",
  description: "血液型・星座・干支の組み合わせで576通りの恋愛占い。毎日0時に更新される日替わり占いで、あなたの恋愛運をチェック！無料占いから詳細分析まで完全対応。",
  keywords: [
    "恋愛占い", "血液型占い", "星座占い", "干支占い", "日替わり占い", 
    "無料占い", "恋愛運", "相性占い", "今日の運勢", "占いランキング",
    "恋愛運アップ", "毎日占い", "本格占い", "恋愛相談", "運勢診断"
  ],
  authors: [{ name: "恋愛占いサイト" }],
  creator: "恋愛占いサイト",
  publisher: "恋愛占いサイト",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fortune-love.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "恋愛占い | 毎日変わる運勢をチェック",
    description: "576通りの組み合わせであなたの恋愛運を占います。血液型×星座×干支の本格占いで今日の運勢をチェック！",
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: "恋愛占いサイト",
    images: [
      {
        url: presetOGImages.main(),
        width: 1200,
        height: 630,
        alt: "恋愛占いサイト - 576通りの本格占い",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "恋愛占い | 毎日変わる運勢",
    description: "血液型×星座×干支で恋愛運をチェック。576通りの組み合わせで毎日更新！",
    images: [presetOGImages.main()],
    creator: "@fortune_love_jp",
    site: "@fortune_love_jp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <StructuredData type="website" />
        <StructuredData type="organization" />
        <StructuredData type="service" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <PerformanceOptimizer />
          <ServiceWorkerRegistration />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
