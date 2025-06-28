# 🤖 Claude Code継続作業ガイド

## 📍 現在の状況 (2025-06-28時点)

### ✅ 完了事項
- **基本アプリケーション**: 占い機能完全実装・動作確認済み
- **デプロイメント**: Vercel本番環境構築済み
- **認証システム**: NextAuth.js + Google OAuth設定済み
- **データベース**: Supabase PostgreSQL接続済み

### 🌐 重要なURL・リンク
- **本番アプリ**: https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app
- **GitHub**: https://github.com/MaRu44448476/fortune-love-seo
- **Vercelダッシュボード**: https://vercel.com/dashboard
- **Supabaseダッシュボード**: https://supabase.com/dashboard

## 🚀 クイックスタート（新しいPC用）

### 1. リポジトリクローン
```bash
git clone https://github.com/MaRu44448476/fortune-love-seo.git
cd fortune-love-seo
npm install
```

### 2. 現在の実装状況確認
```bash
# 最新コミット確認
git log --oneline -5

# 設定状況確認
./scripts/setup-env.sh

# 開発サーバー起動
npm run dev
```

### 3. 必要に応じて追加設定
環境変数が不足している場合は以下を参照:
- `docs/GOOGLE_OAUTH_SETUP.md` - Google OAuth設定
- `docs/STRIPE_SETUP.md` - Stripe決済設定
- `.env.production.template` - 環境変数テンプレート

## 🔧 主要な技術スタック

```bash
# フレームワーク
Next.js 15.3.4 (App Router)
TypeScript 5.6
Tailwind CSS 3.4

# データベース・認証
Prisma ORM + PostgreSQL (Supabase)
NextAuth.js + Google OAuth

# 決済・分析
Stripe決済 (サブスクリプション)
Google Analytics 4
Vercel Analytics

# デプロイメント
Vercel + CI/CD
```

## 📁 重要なファイル構造

```
/home/wiwcw/fortune-love-seo/
├── src/app/                  # メインアプリケーション
│   ├── api/                 # API Routes（占い・認証・決済）
│   ├── premium/             # プレミアム機能
│   └── ranking/             # ランキング機能
├── docs/                    # 設定ドキュメント
│   ├── DATABASE_SETUP.md    # Supabase設定
│   ├── GOOGLE_OAUTH_SETUP.md # Google OAuth設定
│   └── STRIPE_SETUP.md      # Stripe決済設定
├── scripts/setup-env.sh     # 環境確認スクリプト
├── FINAL_SETUP_CHECKLIST.md # 完成チェックリスト
└── .env.production.template # 環境変数テンプレート
```

## 🛠️ よく使うコマンド

```bash
# 開発環境
npm run dev              # 開発サーバー起動
npm run build            # 本番ビルド
npm run lint             # コード品質チェック

# データベース
npm run db:generate      # Prisma Client生成
npm run db:push          # スキーマ反映
npm run db:seed          # テストデータ投入

# デプロイ
npx vercel --prod        # Vercel本番デプロイ
git push origin master   # GitHubプッシュ
```

## 🎯 主要API確認方法

### ローカル確認
```bash
# 占い機能
curl http://localhost:3000/api/fortune?blood=A&zodiac=aries&chinese=rat

# ランキング機能
curl http://localhost:3000/api/ranking

# 認証状態確認
curl http://localhost:3000/api/auth/session
```

### 本番確認
```bash
# 占い機能動作確認
curl "https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app/api/fortune?blood=A&zodiac=aries&chinese=rat"
```

## 🚨 既知の問題・注意点

### 認証関連
- カスタム認証ページ削除済み（NextAuth.jsデフォルト使用）
- プレミアムページは `/api/auth/signin` へリダイレクト
- Suspense boundary問題は修正済み

### データベース
- 本番: PostgreSQL (Supabase)
- ローカル: SQLite可（development用）
- Prisma @db.Text はPostgreSQL使用時のみ有効

### デプロイメント
- ESLint/TypeScript エラーは無視設定済み
- 環境変数は Vercelダッシュボードで管理

## 📋 次回作業の優先度

### 🔴 高優先度（必須）
1. **Google OAuth設定完了** - ログイン機能有効化
2. **Stripe決済実装完了** - プレミアム機能収益化

### 🟡 中優先度
1. **UI/UX改善** - デザイン調整・レスポンシブ対応
2. **SEO最適化** - メタタグ・構造化データ強化
3. **パフォーマンス最適化** - 画像最適化・キャッシュ戦略

### 🟢 低優先度
1. **機能拡張** - 新しい占い種類・分析機能
2. **管理画面** - ユーザー管理・統計ダッシュボード
3. **モバイルアプリ化** - PWA機能拡張

## 💡 トラブルシューティング

### よくある問題
1. **環境変数エラー** → `.env.production.template` 確認
2. **認証エラー** → Google OAuth設定確認
3. **ビルドエラー** → `npm run lint` で構文確認
4. **データベース接続エラー** → Supabase接続文字列確認

### ログ確認場所
- **Vercelログ**: Vercelダッシュボード > Functions タブ
- **ローカルログ**: ターミナル出力
- **ブラウザログ**: 開発者ツール > Console

---

**📞 緊急時連絡先**: GitHub Issues または上記のドキュメントを参照
**⏰ 最終更新**: 2025-06-28 (Claude Code by Anthropic)