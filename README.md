# 🔮 恋愛占いサイト - Fortune Love

血液型×星座×干支による576通りの本格恋愛占いサイト

## 🚀 **現在のデプロイ状況**

**本番URL**: https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app

### ✅ 実装済み機能
- メイン占い機能（完全動作）
- Google OAuth認証（設定済み）
- プレミアムページ（認証済みユーザー向け）
- データベース（Supabase設定済み）

### 📋 次回作業用チェックリスト
別PCで作業を継続する場合は、以下の設定が必要:

1. **Google OAuth設定** - `docs/GOOGLE_OAUTH_SETUP.md` 参照
2. **Stripe決済設定** - `docs/STRIPE_SETUP.md` 参照  
3. **最終確認** - `FINAL_SETUP_CHECKLIST.md` で動作確認

### 🔧 環境構築スクリプト
```bash
# 環境設定の確認
./scripts/setup-env.sh

# 開発環境の起動
npm install && npm run dev
```

## ✨ 機能概要

### 🎯 コア機能
- **576通りの占い組み合わせ**: 血液型(4) × 星座(12) × 干支(12)
- **日替わり占い**: 毎日0時に更新される運勢
- **ランキング機能**: 今日の恋愛運トップ10
- **プレミアム機能**: 詳細分析・週間占い・相性診断

### 🚀 技術スタック
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth + Email)
- **Payment**: Stripe (サブスクリプション決済)
- **Analytics**: Vercel Analytics + Google Analytics 4
- **Deployment**: Vercel + CI/CD

### 🛡️ SEO・パフォーマンス最適化
- **SEO完全対応**: 構造化データ・サイトマップ・OGP動的生成
- **Core Web Vitals監視**: パフォーマンス自動計測
- **PWA対応**: オフライン機能・アプリライク体験
- **セキュリティ強化**: CSRF保護・レート制限・セキュアクッキー

## 🏗️ セットアップ手順

### 1. リポジトリのクローン
```bash
git clone https://github.com/MaRu44448476/fortune-love-seo.git
cd fortune-love-seo
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
```bash
cp .env.example .env.local
```

`.env.local` を編集して必要な値を設定：

```env
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Site Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### 4. データベースの設定
```bash
# Prisma Client生成
npm run db:generate

# データベースマイグレーション
npm run db:push

# 初期データ投入
npm run db:seed
```

### 5. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアクセス可能

## 🚀 本番デプロイ

### Vercelでのデプロイ

1. **Vercelプロジェクト作成**
```bash
npx vercel --prod
```

2. **環境変数設定**
Vercelダッシュボードで以下を設定：
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_GA_ID`

3. **データベース本番設定**
- Supabaseで本番プロジェクト作成
- マイグレーション実行
- 初期データ投入

4. **Stripe Webhook設定**
```bash
# Stripe CLI使用
stripe webhooks create \
  --url https://your-domain.com/api/webhooks/stripe \
  --events customer.subscription.created,customer.subscription.updated,customer.subscription.deleted
```

### GitHub Actions CI/CD

自動デプロイを有効にするために、GitHub Secretsに以下を設定：

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID` 
- `VERCEL_PROJECT_ID`
- その他の環境変数

## 📊 監視・分析

### Google Analytics 4
- ページビュー追跡
- イベント追跡（占い生成、プレミアム購入等）
- コンバージョン測定
- カスタムディメンション設定

### Vercel Analytics
- パフォーマンス監視
- Core Web Vitals計測
- ユーザー行動分析

### エラー監視
- グローバルエラーハンドラー
- 認証エラーページ
- 404カスタムページ
- Analytics連携エラー追跡

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# 型チェック
npm run type-check

# リンティング
npm run lint

# テスト実行
npm run test

# データベース関連
npm run db:generate    # Prisma Client生成
npm run db:push        # スキーマ反映
npm run db:migrate     # マイグレーション実行
npm run db:seed        # シードデータ投入
npm run db:reset       # データベースリセット
```

## 📁 プロジェクト構造

```
src/
├── app/                  # Next.js App Router
│   ├── api/             # API Routes
│   ├── auth/            # 認証関連ページ
│   ├── premium/         # プレミアム機能
│   ├── ranking/         # ランキングページ
│   ├── weekly/          # 週間占い
│   └── analysis/        # 詳細分析
├── components/          # React Components
├── lib/                 # ユーティリティ・設定
└── types/               # TypeScript型定義

prisma/
├── schema.prisma        # データベーススキーマ
└── seed.ts             # シードデータ

public/
├── manifest.json        # PWA設定
├── sw.js               # Service Worker
└── robots.txt          # SEO設定
```

## 🎯 主要API endpoints

- `GET /api/fortune` - 今日の占い取得
- `GET /api/ranking` - ランキング取得
- `GET /api/weekly-fortune` - 週間占い取得
- `GET /api/detailed-analysis` - 詳細分析取得
- `POST /api/checkout` - Stripe決済開始
- `POST /api/webhooks/stripe` - Stripe Webhook
- `GET /api/og` - OG画像動的生成
- `GET /sitemap.xml` - サイトマップ
- `GET /robots.txt` - robots.txt

## 📈 SEO設定

- **構造化データ**: Website, Organization, Service スキーマ
- **サイトマップ**: 576通りの占い組み合わせ対応
- **OGP動的生成**: 占い結果に応じた画像生成
- **メタタグ最適化**: 日本語SEOキーワード完全対応

## 🛡️ セキュリティ

- **CSRF保護**: NextAuth.js組み込み保護
- **レート制限**: API endpoint別制限
- **セキュアクッキー**: 本番環境でのHTTPS強制
- **入力検証**: zod使用の型安全な検証
- **認証保護**: プレミアム機能のアクセス制御

## 📱 PWA機能

- **オフライン対応**: Service Worker by next-pwa
- **アプリライク体験**: manifest.json設定
- **キャッシュ戦略**: NetworkFirst + StaleWhileRevalidate
- **インストール可能**: ホーム画面追加対応

## 🆘 サポート

問題や質問がある場合：

1. [Issues](https://github.com/MaRu44448476/fortune-love-seo/issues) で報告
2. [Discussions](https://github.com/MaRu44448476/fortune-love-seo/discussions) で相談
3. メール: support@fortune-love.com

## 📄 ライセンス

MIT License

---

🔮 **本格的な恋愛占いをお楽しみください！** 💕