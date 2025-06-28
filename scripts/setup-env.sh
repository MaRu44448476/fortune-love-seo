#!/bin/bash

echo "🚀 Fortune Love SEO - 環境変数設定支援スクリプト"
echo "================================================="
echo ""

# 現在のURL確認
CURRENT_URL="https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app"
echo "📍 現在のアプリURL: $CURRENT_URL"
echo ""

# 必要な設定の確認
echo "✅ 設定が必要な項目:"
echo ""
echo "🗄️  1. データベース (Supabase)"
echo "   - https://supabase.com でプロジェクト作成"
echo "   - DATABASE_URL と DIRECT_URL を設定"
echo ""
echo "🔐 2. NextAuth認証"
echo "   - NEXTAUTH_SECRET: 688ee56137a372bfd707873e09032da9efe2bb37ced0229ad2ec8df0ae489a5f"
echo "   - NEXTAUTH_URL: $CURRENT_URL"
echo ""
echo "🔑 3. Google OAuth"
echo "   - https://console.cloud.google.com で認証情報作成"
echo "   - リダイレクトURL: $CURRENT_URL/api/auth/callback/google"
echo ""
echo "💳 4. Stripe決済（オプション）"
echo "   - https://stripe.com でテストキー取得"
echo "   - Webhook URL: $CURRENT_URL/api/webhooks/stripe"
echo ""

# 設定手順
echo "📋 設定手順:"
echo "1. Vercelダッシュボード → Settings → Environment Variables"
echo "2. .env.production.template の内容を参考に環境変数を追加"
echo "3. 設定後、Vercelで再デプロイ実行"
echo ""

# 動作確認項目
echo "🧪 動作確認項目:"
echo "□ メインページ表示"
echo "□ 占い機能動作"
echo "□ ログイン機能（Google OAuth）"
echo "□ プレミアムページアクセス"
echo "□ データベース保存機能"
echo "□ 決済機能（Stripe設定時）"
echo ""

echo "📚 詳細ドキュメント:"
echo "- データベース: docs/DATABASE_SETUP.md"
echo "- Google OAuth: docs/GOOGLE_OAUTH_SETUP.md"
echo "- Stripe決済: docs/STRIPE_SETUP.md"
echo ""

echo "🎯 サポートが必要な場合:"
echo "- GitHub Issues: https://github.com/MaRu44448476/fortune-love-seo/issues"
echo "- 各サービスの公式ドキュメントを参照"

echo ""
echo "🎉 設定完了後、素晴らしい恋愛占いアプリをお楽しみください！"