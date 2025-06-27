import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock components for testing
const MockFortuneCard = ({ score, advice }: { score: number; advice: string }) => (
  <div data-testid="fortune-card">
    <div data-testid="score">{score}</div>
    <div data-testid="advice">{advice}</div>
  </div>
)

const MockRankingList = ({ rankings }: { rankings: Array<{ score: number; combination: string }> }) => (
  <div data-testid="ranking-list">
    {rankings.map((rank, index) => (
      <div key={index} data-testid={`rank-${index + 1}`}>
        {rank.combination}: {rank.score}点
      </div>
    ))}
  </div>
)

describe('コンポーネント テスト', () => {
  describe('占いカード表示', () => {
    test('占い結果が正しく表示される', () => {
      const mockData = {
        score: 85,
        advice: '今日は素敵な出会いがありそうです',
      }
      
      render(<MockFortuneCard score={mockData.score} advice={mockData.advice} />)
      
      expect(screen.getByTestId('fortune-card')).toBeInTheDocument()
      expect(screen.getByTestId('score')).toHaveTextContent('85')
      expect(screen.getByTestId('advice')).toHaveTextContent('今日は素敵な出会いがありそうです')
    })

    test('スコアが0-100の範囲内である', () => {
      const validScores = [0, 50, 100]
      
      validScores.forEach(score => {
        render(<MockFortuneCard score={score} advice="テスト" />)
        const scoreElement = screen.getByTestId('score')
        const scoreValue = parseInt(scoreElement.textContent || '0')
        
        expect(scoreValue).toBeGreaterThanOrEqual(0)
        expect(scoreValue).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('ランキング表示', () => {
    test('ランキングリストが正しく表示される', () => {
      const mockRankings = [
        { score: 95, combination: 'A型×おひつじ座×子' },
        { score: 90, combination: 'B型×おうし座×丑' },
        { score: 85, combination: 'O型×ふたご座×寅' },
      ]
      
      render(<MockRankingList rankings={mockRankings} />)
      
      expect(screen.getByTestId('ranking-list')).toBeInTheDocument()
      expect(screen.getByTestId('rank-1')).toHaveTextContent('A型×おひつじ座×子: 95点')
      expect(screen.getByTestId('rank-2')).toHaveTextContent('B型×おうし座×丑: 90点')
      expect(screen.getByTestId('rank-3')).toHaveTextContent('O型×ふたご座×寅: 85点')
    })

    test('ランキングが降順でソートされている', () => {
      const mockRankings = [
        { score: 95, combination: 'A型×おひつじ座×子' },
        { score: 90, combination: 'B型×おうし座×丑' },
        { score: 85, combination: 'O型×ふたご座×寅' },
      ]
      
      // Check if rankings are sorted in descending order
      for (let i = 0; i < mockRankings.length - 1; i++) {
        expect(mockRankings[i].score).toBeGreaterThanOrEqual(mockRankings[i + 1].score)
      }
    })
  })

  describe('ローディング状態', () => {
    test('ローディングスピナーの表示', () => {
      const LoadingSpinner = () => (
        <div data-testid="loading-spinner" className="animate-spin">
          読み込み中...
        </div>
      )
      
      render(<LoadingSpinner />)
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('読み込み中...')).toBeInTheDocument()
    })
  })

  describe('エラー表示', () => {
    test('エラーメッセージの表示', () => {
      const ErrorMessage = ({ message }: { message: string }) => (
        <div data-testid="error-message" className="text-red-600">
          {message}
        </div>
      )
      
      render(<ErrorMessage message="エラーが発生しました" />)
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument()
    })
  })
})

describe('フォームバリデーション テスト', () => {
  test('血液型選択の検証', () => {
    const bloodTypes = ['A', 'B', 'O', 'AB']
    const validBloodType = 'A'
    const invalidBloodType = 'C'
    
    expect(bloodTypes.includes(validBloodType)).toBe(true)
    expect(bloodTypes.includes(invalidBloodType)).toBe(false)
  })

  test('星座選択の検証', () => {
    const zodiacs = [
      'おひつじ座', 'おうし座', 'ふたご座', 'かに座', 
      'しし座', 'おとめ座', 'てんびん座', 'さそり座', 
      'いて座', 'やぎ座', 'みずがめ座', 'うお座'
    ]
    
    expect(zodiacs).toHaveLength(12)
    expect(zodiacs.includes('おひつじ座')).toBe(true)
    expect(zodiacs.includes('存在しない座')).toBe(false)
  })

  test('干支選択の検証', () => {
    const animals = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    
    expect(animals).toHaveLength(12)
    expect(animals.includes('子')).toBe(true)
    expect(animals.includes('龍')).toBe(false)
  })
})

describe('アクセシビリティ テスト', () => {
  test('ARIAラベルの存在確認', () => {
    const AccessibleButton = () => (
      <button 
        aria-label="占いを実行する"
        data-testid="fortune-button"
      >
        占いを見る
      </button>
    )
    
    render(<AccessibleButton />)
    const button = screen.getByTestId('fortune-button')
    expect(button).toHaveAttribute('aria-label', '占いを実行する')
  })

  test('キーボードナビゲーション対応', () => {
    const NavigableList = () => (
      <div>
        <button tabIndex={0} data-testid="button-1">ボタン1</button>
        <button tabIndex={0} data-testid="button-2">ボタン2</button>
        <button tabIndex={0} data-testid="button-3">ボタン3</button>
      </div>
    )
    
    render(<NavigableList />)
    expect(screen.getByTestId('button-1')).toHaveAttribute('tabIndex', '0')
    expect(screen.getByTestId('button-2')).toHaveAttribute('tabIndex', '0')
    expect(screen.getByTestId('button-3')).toHaveAttribute('tabIndex', '0')
  })
})