# 💳 Stripe決済設定ガイド

## 1. Stripeアカウント作成

### ステップ1: アカウント作成
1. **https://stripe.com** にアクセス
2. **Start now** でアカウント作成
3. **テストモード** で開始（本番化は後で）

### ステップ2: APIキー取得
1. **Developers > API keys** に移動
2. 以下をコピー:
   ```
   Publishable key: pk_test_xxxxx
   Secret key: sk_test_xxxxx
   ```

## 2. プロダクト・価格設定

### ステップ1: プロダクト作成
1. **Products** に移動
2. **+ Add product** をクリック
3. プレミアムプラン設定:
   ```
   Name: プレミアムプラン
   Description: 週間占い・詳細分析・無制限履歴
   ```

### ステップ2: 価格設定
1. **Pricing** で以下を作成:
   ```
   月額プラン:
   - Price: ¥980
   - Billing period: Monthly
   - Currency: JPY
   
   年額プラン:
   - Price: ¥9,800
   - Billing period: Yearly
   - Currency: JPY
   ```
2. 各Price IDをコピー（price_xxxxx）

## 3. Webhook設定

### ステップ1: Webhook作成
1. **Developers > Webhooks** に移動
2. **+ Add endpoint** をクリック
3. 設定:
   ```
   Endpoint URL: https://fortune-love-jcf5763s5-marus-projects-f78c41e4.vercel.app/api/webhooks/stripe
   
   Listen to: Events on your account
   
   Select events:
   ✓ checkout.session.completed
   ✓ customer.subscription.created
   ✓ customer.subscription.updated
   ✓ customer.subscription.deleted
   ✓ invoice.payment_succeeded
   ✓ invoice.payment_failed
   ```
4. **Add endpoint** をクリック
5. **Signing secret** をコピー（whsec_xxxxx）

## 4. 環境変数設定

以下をVercelの環境変数に追加:

```bash
# Stripe設定
STRIPE_SECRET_KEY="sk_test_your-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-publishable-key"
STRIPE_MONTHLY_PRICE_ID="price_your-monthly-price-id"
STRIPE_YEARLY_PRICE_ID="price_your-yearly-price-id"
```

## 5. テスト決済

### テスト用カード番号
```
成功: 4242 4242 4242 4242
拒否: 4000 0000 0000 0002
認証要求: 4000 0025 0000 3155

CVV: 任意の3桁
有効期限: 未来の日付
```

### 決済フロー確認
1. プレミアムページで「月額プラン」選択
2. Stripe Checkoutページが開く
3. テストカード情報入力
4. 決済完了→Success ページに遷移
5. ユーザーのプレミアム状態が更新される

## 6. 本番環境移行

### 本番モード有効化
1. **Account settings** でビジネス情報入力
2. **本番APIキー** に切り替え
3. 環境変数を本番用に更新:
   ```bash
   STRIPE_SECRET_KEY="sk_live_xxxxx"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"
   ```

### 税務設定
- 日本の消費税設定
- 適格請求書発行事業者登録（必要に応じて）
- 価格に税込み表示設定

## 7. セキュリティ対策

### Webhook検証
```javascript
// 実装済み: src/app/api/webhooks/stripe/route.ts
const signature = headers.get('stripe-signature')
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
```

### 冗長性確保
- Webhook失敗時の再試行処理
- 決済状態の定期的な同期
- エラー通知システム

## 8. 分析・監視

### Stripe Dashboard活用
- 売上データ分析
- チャージバック監視
- 顧客解約率追跡

### カスタム分析
```javascript
// 実装例: 月次売上レポート
const revenue = await stripe.paymentIntents.list({
  created: { gte: startOfMonth, lt: endOfMonth },
  status: 'succeeded'
})
```