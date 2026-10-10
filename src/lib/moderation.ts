
export const PUBLISH_THRESHOLD = 60
export const ATTENTION_THRESHOLD = 40

export type ModerationStatus = 'live' | 'pending' | 'approved' | 'rejected' | 'borderline'

export type RiskLevel = 'low' | 'medium' | 'high'

export type ModerationCategory = 'insult' | 'threat' | 'toxic' | 'obscene'

export type ModerationScenario = 'approved' | 'rejected' | 'borderline'

export interface CategoryScore {
  category: ModerationCategory
  score: number
}

export interface Post {
  id: string
  title: string
  content: string
  scores: CategoryScore[]
  publishedAt: Date
}

export const CATEGORY_LABELS: Record<ModerationCategory, string> = {
  insult: 'Insult',
  threat: 'Threat',
  toxic: 'Toxicity',
  obscene: 'Obscene',
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export const SCENARIO_SCORES: Record<ModerationScenario, CategoryScore[]> = {
  approved: [
    { category: "insult", score: 12 },
    { category: "threat", score: 0 },
    { category: "toxic", score: 12 },
    { category: "obscene", score: 8 }],
  borderline: [
    { category: "insult", score: 52 },
    { category: "threat", score: 0 },
    { category: "toxic", score: 12 },
    { category: "obscene", score: 8 }],
  rejected: [
    { category: "insult", score: 78 },
    { category: "threat", score: 0 },
    { category: "toxic", score: 12 },
    { category: "obscene", score: 51 }]
}

//export const PUBLISHING_THRESHOLD = 60

export function getExceededCategory(scores: CategoryScore[]): ModerationCategory | null {
  if (scores.length === 0) {
    return null
  }

  const topScore = scores.reduce((top, current) =>
    current.score > top.score ? current : top,
  )

  return topScore.score >= PUBLISH_THRESHOLD
    ? topScore.category
    : null
}

const RISK_RANK: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 }

export function getSeverity(score: number): RiskLevel {
  if (score >= PUBLISH_THRESHOLD) return 'high'
  if (score >= ATTENTION_THRESHOLD) return 'medium'
  return 'low'
}

export function getOverallRisk(scores: CategoryScore[]): RiskLevel {
  return scores.reduce<RiskLevel>((highest, { score }) => {
    const severity = getSeverity(score)
    return RISK_RANK[severity] > RISK_RANK[highest] ? severity : highest
  }, 'low')
}

export function getStatusForScores(scores: CategoryScore[]): ModerationStatus {
  const risk = getOverallRisk(scores)
  if (risk === 'high') return 'rejected'
  if (risk === 'medium') return 'borderline'
  return 'approved'
}

const FLAGGED_TERMS: Record<ModerationCategory, string[]> = {
  insult: ['idiot', 'stupid', 'loser', 'dumb'],
  threat: ['kill', 'hurt', 'destroy', 'attack'],
  toxic: ['hate', 'awful', 'disgusting', 'worst'],
  obscene: ['damn', 'crap', 'hell'],
}

export function estimateScores(text: string): CategoryScore[] {
  const words = new Set(text.toLowerCase().match(/[a-z']+/g) ?? [])
  const baseline = text.trim().length > 0 ? 4 : 0

  const score = (category: ModerationCategory) => {
    const hits = FLAGGED_TERMS[category].filter((term) => words.has(term)).length
    return Math.min(baseline + hits * 32, 98)
  }

  return [
    { category: "insult", score: score('insult') },
    { category: "threat", score: score('threat') },
    { category: "toxic", score: score('toxic') },
    { category: "obscene", score: score('obscene') }
  ]
}

export function clampScore(score: number): number {
  return Math.min(100, Math.max(0, Math.round(score)))
}




