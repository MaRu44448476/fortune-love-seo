import { type BloodType, type Zodiac, type Animal, generateFortune } from './fortune'

export interface DetailedAnalysisResult {
  personalityProfile: {
    coreTraits: string[]
    strengths: string[]
    challenges: string[]
    loveStyle: string
    communicationStyle: string
  }
  fortuneBreakdown: {
    loveDetailedAnalysis: string
    workDetailedAnalysis: string
    healthDetailedAnalysis: string
    moneyDetailedAnalysis: string
    overallInsights: string
  }
  compatibilityAnalysis: {
    idealPartner: {
      description: string
      traits: string[]
      zodiacMatches: string[]
    }
    relationshipAdvice: string[]
    communicationTips: string[]
  }
  timing: {
    bestDatesThisMonth: string[]
    cautionDates: string[]
    optimalTimeOfDay: string
    seasonalInfluence: string
  }
  actionPlan: {
    shortTerm: string[]  // 今週の行動計画
    mediumTerm: string[] // 今月の行動計画
    longTerm: string[]   // 3ヶ月の行動計画
  }
  numerology: {
    luckyNumbers: number[]
    unluckyNumbers: number[]
    personalNumber: number
    numerologyMeaning: string
  }
}

// 詳細分析データベース
const analysisData = {
  bloodTypeProfiles: {
    A: {
      coreTraits: ['慎重', '真面目', '責任感強い', '協調性がある', '完璧主義'],
      strengths: ['信頼される', '計画性がある', '思いやりがある', '努力家', '安定感がある'],
      challenges: ['心配性', '優柔不断', 'ストレスを溜めやすい', '変化を恐れる', '自己犠牲的'],
      loveStyle: '慎重で安定重視の恋愛スタイル。相手を深く理解してから愛を育む',
      communicationStyle: '相手の気持ちを察する繊細なコミュニケーション'
    },
    B: {
      coreTraits: ['自由奔放', '創造的', '情熱的', '楽観的', '独立心強い'],
      strengths: ['発想力豊か', '行動力がある', '明るい', '多様性を受け入れる', '個性的'],
      challenges: ['飽きっぽい', '計画性に欠ける', '他人の目を気にしない', '気分屋', '協調性に欠ける'],
      loveStyle: '情熱的で自由な恋愛スタイル。刺激と変化を求める',
      communicationStyle: '率直で表現豊かなコミュニケーション'
    },
    O: {
      coreTraits: ['積極的', 'リーダーシップがある', '社交的', '現実的', '競争心がある'],
      strengths: ['決断力がある', '人を引っ張る力', '適応力がある', '目標達成力', '包容力がある'],
      challenges: ['短気', '大雑把', '人の意見を聞かない', 'プライドが高い', '細かい作業が苦手'],
      loveStyle: '積極的でリードする恋愛スタイル。情熱的にアプローチする',
      communicationStyle: 'ストレートで分かりやすいコミュニケーション'
    },
    AB: {
      coreTraits: ['独創的', '神秘的', '知的', '二面性がある', '客観的'],
      strengths: ['分析力がある', 'ユニークな視点', '冷静な判断', '多才', '芸術的センス'],
      challenges: ['理解されにくい', '気分の変動が激しい', '他人との距離感', '完璧主義', '孤独感'],
      loveStyle: '神秘的で知的な恋愛スタイル。精神的な繋がりを重視',
      communicationStyle: '知的で深みのあるコミュニケーション'
    }
  },
  
  fortuneAnalysisTemplates: {
    love: {
      high: '恋愛運が非常に高い時期です。{trait}さを活かして積極的にアプローチしましょう。{zodiac_element}の力が恋愛面で特に強く働いており、理想的なパートナーとの出会いや関係の深化が期待できます。',
      medium: '恋愛運は安定している時期です。{trait}な魅力を自然に発揮することで、良い関係を築けるでしょう。{zodiac_element}のエネルギーを意識して、焦らずじっくりと愛を育んでください。',
      low: '恋愛運がやや低調な時期ですが、{trait}さを見つめ直すチャンスでもあります。{zodiac_element}の力を借りて自分磨きに集中し、内面的な魅力を高める時期として捉えましょう。'
    },
    work: {
      high: '仕事運が絶好調です。{trait}な能力が認められ、重要なプロジェクトや昇進のチャンスが巡ってくるでしょう。{zodiac_element}のパワーを活用して、積極的にチャレンジしてください。',
      medium: '仕事運は順調です。{trait}さを活かして着実に成果を積み重ねましょう。{zodiac_element}のエネルギーを意識することで、より効率的に作業を進められます。',
      low: '仕事面で一時的な停滞を感じるかもしれません。しかし、{trait}な性格を活かして基盤を固める時期と考えましょう。{zodiac_element}の力で忍耐強く取り組めば、必ず道は開けます。'
    }
  }
}

// スコアレベルの判定
function getScoreLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

// 数秘術計算
function calculatePersonalNumber(bloodType: BloodType, zodiac: Zodiac, animal: Animal): number {
  const bloodValue = { A: 1, B: 2, O: 3, AB: 4 }[bloodType]
  const zodiacValue = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座'].indexOf(zodiac) + 1
  const animalValue = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].indexOf(animal) + 1
  
  let sum = bloodValue + zodiacValue + animalValue
  while (sum > 9) {
    sum = Math.floor(sum / 10) + (sum % 10)
  }
  return sum
}

// 今月のラッキーデートを生成
function generateLuckyDates(seed: number): string[] {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  const luckyDates: string[] = []
  for (let i = 0; i < 5; i++) {
    const day = (seed + i * 3) % daysInMonth + 1
    const date = new Date(currentYear, currentMonth, day)
    luckyDates.push(date.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' }))
  }
  
  return luckyDates.sort()
}

export function generateDetailedAnalysis(
  bloodType: BloodType,
  zodiac: Zodiac,
  animal: Animal,
  date: Date = new Date()
): DetailedAnalysisResult {
  const basicFortune = generateFortune(bloodType, zodiac, animal, date)
  const bloodProfile = analysisData.bloodTypeProfiles[bloodType]
  
  // 数秘術
  const personalNumber = calculatePersonalNumber(bloodType, zodiac, animal)
  const luckyNumbers = [personalNumber, (personalNumber + 3) % 9 + 1, (personalNumber + 7) % 9 + 1]
  const unluckyNumbers = [(personalNumber + 4) % 9 + 1, (personalNumber + 8) % 9 + 1]
  
  // シード値
  const analysisSeed = bloodType.charCodeAt(0) + zodiac.length + animal.charCodeAt(0) + date.getDate()
  
  // タイミング分析
  const bestDates = generateLuckyDates(analysisSeed)
  const cautionDates = generateLuckyDates(analysisSeed + 10).slice(0, 2)
  
  const optimalTimes = ['早朝 (6-9時)', '午前中 (9-12時)', '午後 (12-15時)', '夕方 (15-18時)', '夜 (18-21時)']
  const optimalTimeOfDay = optimalTimes[analysisSeed % optimalTimes.length]
  
  // 相性分析
  const zodiacElements = {
    'おひつじ座': '火', 'しし座': '火', 'いて座': '火',
    'おうし座': '地', 'おとめ座': '地', 'やぎ座': '地',
    'ふたご座': '風', 'てんびん座': '風', 'みずがめ座': '風',
    'かに座': '水', 'さそり座': '水', 'うお座': '水'
  }
  
  const compatibleElements = {
    '火': ['火', '風'],
    '地': ['地', '水'],
    '風': ['風', '火'],
    '水': ['水', '地']
  }
  
  const currentElement = zodiacElements[zodiac as keyof typeof zodiacElements]
  const compatibleZodiacs = Object.entries(zodiacElements)
    .filter(([_, element]) => compatibleElements[currentElement].includes(element))
    .map(([zodiac, _]) => zodiac)
    .slice(0, 3)
  
  // 詳細分析生成
  const loveLevel = getScoreLevel(basicFortune.score)
  const workLevel = getScoreLevel(basicFortune.score + (analysisSeed % 20 - 10))
  
  const loveTemplate = analysisData.fortuneAnalysisTemplates.love[loveLevel]
  const workTemplate = analysisData.fortuneAnalysisTemplates.work[workLevel]
  
  const trait = bloodProfile.coreTraits[analysisSeed % bloodProfile.coreTraits.length]
  
  return {
    personalityProfile: {
      coreTraits: bloodProfile.coreTraits,
      strengths: bloodProfile.strengths,
      challenges: bloodProfile.challenges,
      loveStyle: bloodProfile.loveStyle,
      communicationStyle: bloodProfile.communicationStyle
    },
    
    fortuneBreakdown: {
      loveDetailedAnalysis: loveTemplate
        .replace(/{trait}/g, trait)
        .replace(/{zodiac_element}/g, currentElement),
      workDetailedAnalysis: workTemplate
        .replace(/{trait}/g, trait)
        .replace(/{zodiac_element}/g, currentElement),
      healthDetailedAnalysis: `${currentElement}の属性を持つあなたは、${trait}さを活かした健康管理が効果的です。バランスの取れた生活リズムを心がけ、ストレス発散に時間を割きましょう。`,
      moneyDetailedAnalysis: `金運面では${trait}な性格が幸運の鍵となります。${currentElement}のエネルギーを意識した投資や貯蓄計画を立てることで、安定した資産形成が期待できます。`,
      overallInsights: `${bloodType}型×${zodiac}×${animal}の組み合わせは、${trait}さと${currentElement}の力を併せ持つ特別な運勢です。この組み合わせの真の力を発揮するには、内面の調和と外面の行動のバランスが重要です。`
    },
    
    compatibilityAnalysis: {
      idealPartner: {
        description: `${currentElement}の属性と調和する相手が理想的。知性と感性のバランスが取れた人物`,
        traits: ['理解力がある', '共感力が高い', '価値観が合う', '成長志向', '安定感がある'],
        zodiacMatches: compatibleZodiacs
      },
      relationshipAdvice: [
        `${trait}さを活かして相手との信頼関係を築く`,
        `${currentElement}のエネルギーを意識したコミュニケーションを心がける`,
        '相手の立場に立って物事を考える',
        '感謝の気持ちを言葉で表現する',
        '共通の目標や趣味を見つける'
      ],
      communicationTips: [
        bloodProfile.communicationStyle,
        '相手のペースに合わせる柔軟性を持つ',
        '批判よりも建設的な提案を心がける',
        '感情的になった時は一度冷静になる時間を作る'
      ]
    },
    
    timing: {
      bestDatesThisMonth: bestDates,
      cautionDates: cautionDates,
      optimalTimeOfDay: optimalTimeOfDay,
      seasonalInfluence: `${currentElement}の属性は${new Date().getMonth() < 6 ? '春夏' : '秋冬'}の季節と特に調和し、この時期の行動が大きな成果をもたらします`
    },
    
    actionPlan: {
      shortTerm: [
        `${trait}さを活かした新しいチャレンジを始める`,
        `${currentElement}系のアイテムを身につける`,
        'ラッキーデーに重要な決断や行動を起こす'
      ],
      mediumTerm: [
        '理想のパートナーとの出会いの場に積極的に参加する',
        `${bloodType}型の特性を活かしたスキルアップに取り組む`,
        '人間関係の整理と新しいネットワーク作りを行う'
      ],
      longTerm: [
        `${currentElement}の力を最大化する生活環境を整える`,
        '長期的な目標設定とそれに向けた計画的な行動',
        '内面的な成長と外面的な魅力向上の両立を図る'
      ]
    },
    
    numerology: {
      luckyNumbers: luckyNumbers,
      unluckyNumbers: unluckyNumbers,
      personalNumber: personalNumber,
      numerologyMeaning: `パーソナルナンバー${personalNumber}は、${['', '始まり', '協調', '創造', '安定', '変化', '愛情', '知性', '成功', '完成'][personalNumber]}の意味を持ち、あなたの人生の重要なテーマを示しています`
    }
  }
}