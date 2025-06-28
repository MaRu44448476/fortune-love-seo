# 🗄️ データベース設定ガイド (Supabase)

## 1. Supabaseプロジェクト作成

### ステップ1: プロジェクト作成
1. https://supabase.com にアクセス
2. 「New Project」をクリック
3. 以下の設定:
   - **Organization**: 既存または新規作成
   - **Project Name**: `fortune-love-seo`
   - **Database Password**: 強力なパスワード（記録しておく）
   - **Region**: `Northeast Asia (Tokyo)` 推奨
   - **Pricing Plan**: `Free` (月50MB, 500MB転送)

### ステップ2: 接続情報取得
プロジェクト作成後（約2-3分）:

1. **Settings > Database** に移動
2. **Connection string** の **URI** をコピー:
   ```
   postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
   ```

### ステップ3: セキュリティ設定
1. **Authentication > Settings** に移動
2. **Site URL** を設定:
   ```
   https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app
   ```

## 2. Vercel環境変数設定

### 必須環境変数
```bash
# データベース
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_SECRET="[32文字以上のランダム文字列]"
NEXTAUTH_URL="https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app"
```

### NEXTAUTH_SECRET生成方法
```bash
# オンラインツール使用
https://generate-secret.now.sh/32

# または Node.js使用
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. データベース初期化

環境変数設定後、以下コマンドを実行:

```bash
# ローカルで実行（環境変数設定後）
npx prisma db push

# 確認
npx prisma studio
```

## 4. トラブルシューティング

### 接続エラーの場合
1. Supabaseプロジェクトがアクティブか確認
2. パスワードに特殊文字が含まれている場合はURLエンコード
3. CONNECTION_STRINGのプロジェクトIDが正しいか確認

### SSL関連エラー
```bash
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

## 5. 本番運用のヒント

- **バックアップ**: Supabaseは自動バックアップ有効
- **モニタリング**: Supabaseダッシュボードでクエリ監視
- **スケーリング**: 無料プランで十分な容量から開始