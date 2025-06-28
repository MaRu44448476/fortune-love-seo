# 🔑 Google OAuth設定ガイド

## 1. Google Cloud Console設定

### ステップ1: プロジェクト作成
1. **https://console.cloud.google.com** にアクセス
2. 新しいプロジェクトを作成:
   - **Project Name**: `fortune-love-seo`
   - **Project ID**: 自動生成（記録しておく）

### ステップ2: OAuth同意画面設定
1. **APIs & Services > OAuth consent screen** に移動
2. **External** を選択（個人利用の場合）
3. 必須項目入力:
   ```
   App Name: 恋愛占いサイト
   User support email: あなたのメールアドレス
   Developer contact: あなたのメールアドレス
   ```
4. **Authorized domains** に追加:
   ```
   vercel.app
   ```

### ステップ3: OAuth 2.0 認証情報作成
1. **APIs & Services > Credentials** に移動
2. **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs** をクリック
3. 設定:
   ```
   Application type: Web application
   Name: Fortune Love OAuth Client
   
   Authorized JavaScript origins:
   https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app
   
   Authorized redirect URIs:
   https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app/api/auth/callback/google
   ```
4. **CREATE** をクリック
5. **Client ID** と **Client Secret** をコピーして保存

## 2. 環境変数設定

以下をVercelの環境変数に追加:

```bash
GOOGLE_CLIENT_ID="123456789-abcdefghijk.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret-key"
```

## 3. 動作確認

設定完了後:
1. アプリの「ログイン」ボタンをクリック
2. Googleアカウント選択画面が表示される
3. 認証後、アプリに戻る
4. ユーザー情報が正しく表示される

## 4. 本番環境での注意点

### セキュリティ設定
- OAuth同意画面を「Published」状態にする（100ユーザー以上の場合）
- 不要なスコープは削除
- 定期的にClient Secretを更新

### ドメイン設定
- 本番ドメイン取得後は、Authorized domainsを更新
- 複数環境（staging/production）用に複数のOAuth Clientを作成推奨

## 5. トラブルシューティング

### よくあるエラー
1. **Error 400: redirect_uri_mismatch**
   - Authorized redirect URIが正確でない
   - HTTPSを使用しているか確認

2. **Error 403: access_blocked**
   - OAuth同意画面が未設定
   - App verification が必要な場合あり

3. **Invalid client error**
   - GOOGLE_CLIENT_IDまたはGOOGLE_CLIENT_SECRETが間違っている