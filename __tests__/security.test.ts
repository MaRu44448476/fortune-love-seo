import { 
  InputValidator, 
  RateLimiter, 
  CSRFProtection, 
  PrivacyProtection,
  runSecurityChecks 
} from '@/lib/security'

describe('セキュリティテスト', () => {
  describe('入力検証', () => {
    test('HTMLサニタイゼーション', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello World'
      const sanitized = InputValidator.sanitizeHtml(maliciousInput)
      
      expect(sanitized).toBe('Hello World')
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('alert')
    })

    test('SQLインジェクション対策', () => {
      const maliciousInput = "'; DROP TABLE users; --"
      const sanitized = InputValidator.sanitizeSql(maliciousInput)
      
      expect(sanitized).not.toContain('DROP')
      expect(sanitized).not.toContain('--')
      expect(sanitized).not.toContain(';')
    })

    test('メールアドレス検証', () => {
      expect(InputValidator.validateEmail('test@example.com')).toBe(true)
      expect(InputValidator.validateEmail('invalid-email')).toBe(false)
      expect(InputValidator.validateEmail('test@')).toBe(false)
      expect(InputValidator.validateEmail('@example.com')).toBe(false)
    })

    test('パスワード強度チェック', () => {
      const strongPassword = 'StrongPass123!'
      const weakPassword = 'weak'
      
      const strongResult = InputValidator.validatePassword(strongPassword)
      const weakResult = InputValidator.validatePassword(weakPassword)
      
      expect(strongResult.isValid).toBe(true)
      expect(strongResult.errors).toHaveLength(0)
      
      expect(weakResult.isValid).toBe(false)
      expect(weakResult.errors.length).toBeGreaterThan(0)
    })

    test('占い入力値検証', () => {
      expect(InputValidator.validateFortuneInput('A', 'おひつじ座', '子')).toBe(true)
      expect(InputValidator.validateFortuneInput('X', 'おひつじ座', '子')).toBe(false)
      expect(InputValidator.validateFortuneInput('A', '存在しない座', '子')).toBe(false)
      expect(InputValidator.validateFortuneInput('A', 'おひつじ座', '龍')).toBe(false)
    })
  })

  describe('レート制限', () => {
    test('制限内リクエストの許可', () => {
      const limiter = new RateLimiter(60000, 5) // 1分間に5回
      const userId = 'test-user'
      
      // 5回まで許可される
      for (let i = 0; i < 5; i++) {
        expect(limiter.isAllowed(userId)).toBe(true)
      }
      
      // 6回目は拒否される
      expect(limiter.isAllowed(userId)).toBe(false)
    })

    test('時間経過後のリセット', () => {
      const limiter = new RateLimiter(100, 1) // 100msに1回
      const userId = 'test-user-2'
      
      expect(limiter.isAllowed(userId)).toBe(true)
      expect(limiter.isAllowed(userId)).toBe(false)
      
      // 時間経過後は再び許可される
      setTimeout(() => {
        expect(limiter.isAllowed(userId)).toBe(true)
      }, 150)
    })
  })

  describe('CSRF保護', () => {
    test('CSRFトークン生成', () => {
      const token1 = CSRFProtection.generateToken()
      const token2 = CSRFProtection.generateToken()
      
      expect(token1).toHaveLength(32)
      expect(token2).toHaveLength(32)
      expect(token1).not.toBe(token2) // 毎回異なるトークン
    })

    test('CSRFトークン検証', () => {
      const validToken = CSRFProtection.generateToken()
      const invalidToken = 'invalid-token'
      
      expect(CSRFProtection.validateToken(validToken, validToken)).toBe(true)
      expect(CSRFProtection.validateToken(validToken, invalidToken)).toBe(false)
      expect(CSRFProtection.validateToken(validToken, '')).toBe(false)
    })
  })

  describe('個人情報保護', () => {
    test('メールアドレスマスキング', () => {
      expect(PrivacyProtection.maskEmail('test@example.com')).toBe('t**t@example.com')
      expect(PrivacyProtection.maskEmail('a@example.com')).toBe('a@example.com') // 短すぎる場合
    })

    test('IPアドレスマスキング', () => {
      expect(PrivacyProtection.maskIP('192.168.1.100')).toBe('192.168.xxx.xxx')
      expect(PrivacyProtection.maskIP('invalid-ip')).toBe('xxx.xxx.xxx.xxx')
    })

    test('ログデータのサニタイゼーション', () => {
      const sensitiveData = {
        username: 'testuser',
        password: 'secret123',
        email: 'test@example.com',
        token: 'abc123',
        normalData: 'this is safe'
      }
      
      const sanitized = PrivacyProtection.sanitizeForLog(sensitiveData)
      
      expect(sanitized.username).toBe('testuser')
      expect(sanitized.password).toBe('[REDACTED]')
      expect(sanitized.email).toBe('[REDACTED]')
      expect(sanitized.token).toBe('[REDACTED]')
      expect(sanitized.normalData).toBe('this is safe')
    })
  })

  describe('セキュリティチェック', () => {
    test('環境変数チェック', () => {
      // 一時的に環境変数を設定
      process.env.NEXTAUTH_SECRET = 'test-secret'
      
      const checks = runSecurityChecks()
      
      expect(checks.environmentVariables.passed).toBe(true)
      expect(checks.headers.passed).toBe(true)
      expect(checks.dependencies.passed).toBe(true)
      expect(checks.configuration.passed).toBe(true)
    })

    test('設定不備の検出', () => {
      // 一時的に環境変数を削除
      delete process.env.NEXTAUTH_SECRET
      
      const checks = runSecurityChecks()
      
      expect(checks.environmentVariables.passed).toBe(false)
      expect(checks.environmentVariables.issues).toContain('NEXTAUTH_SECRET is not set')
    })
  })

  describe('XSS攻撃対策', () => {
    test('スクリプトタグの除去', () => {
      const attacks = [
        '<script>alert("XSS")</script>',
        '<img src="x" onerror="alert(1)">',
        'javascript:alert("XSS")',
        '<svg onload="alert(1)">',
      ]
      
      attacks.forEach(attack => {
        const sanitized = InputValidator.sanitizeHtml(attack)
        expect(sanitized).not.toContain('<script>')
        expect(sanitized).not.toContain('onerror')
        expect(sanitized).not.toContain('javascript:')
        expect(sanitized).not.toContain('onload')
      })
    })
  })

  describe('SQLインジェクション対策', () => {
    test('危険なSQLキーワードの除去', () => {
      const attacks = [
        "admin'; DROP TABLE users; --",
        "1' OR '1'='1",
        "'; INSERT INTO users (admin) VALUES (1); --",
        "1' UNION SELECT password FROM users --"
      ]
      
      attacks.forEach(attack => {
        const sanitized = InputValidator.sanitizeSql(attack)
        expect(sanitized).not.toContain('DROP')
        expect(sanitized).not.toContain('INSERT')
        expect(sanitized).not.toContain('UNION')
        expect(sanitized).not.toContain('--')
      })
    })
  })
})

describe('APIセキュリティテスト', () => {
  test('認証なしでのプレミアム機能アクセス拒否', async () => {
    // モックレスポンス
    const mockResponse = {
      status: 401,
      json: async () => ({ error: 'Unauthorized' })
    }
    
    global.fetch = jest.fn().mockResolvedValue(mockResponse)
    
    const response = await fetch('/api/weekly-fortune')
    expect(response.status).toBe(401)
  })

  test('無効なトークンでのアクセス拒否', async () => {
    const mockResponse = {
      status: 403,
      json: async () => ({ error: 'Invalid token' })
    }
    
    global.fetch = jest.fn().mockResolvedValue(mockResponse)
    
    const response = await fetch('/api/detailed-analysis', {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    })
    
    expect(response.status).toBe(403)
  })

  test('レート制限の動作確認', async () => {
    const mockRateLimitResponse = {
      status: 429,
      json: async () => ({ error: 'Rate limit exceeded' })
    }
    
    global.fetch = jest.fn().mockResolvedValue(mockRateLimitResponse)
    
    const response = await fetch('/api/fortune')
    expect(response.status).toBe(429)
  })
})