export type ModerationStatus = 'live' | 'pending' | 'approved' | 'rejected' | 'borderline'

export type RiskLevel = 'low' | 'medium' | 'high'

export type ModerationCategory = 'insult' | 'threat' | 'toxicity' | 'obscene'

export type ModerationScores = Record<ModerationCategory, number>

export type ModerationScenario = 'approved' | 'rejected' | 'borderline'

export interface Post {
  id: string
  title: string
  content: string
  scores: ModerationScores
  publishedAt: Date
}

export const CATEGORY_LABELS: Record<ModerationCategory, string> = {
  insult: 'Insult',
  threat: 'Threat',
  toxicity: 'Toxicity',
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

export const SCENARIO_SCORES: Record<ModerationScenario, ModerationScores> = {
  approved: { insult: 12, threat: 0, toxicity: 12, obscene: 8 },
  borderline: { insult: 52, threat: 0, toxicity: 12, obscene: 8 },
  rejected: { insult: 78, threat: 0, toxicity: 12, obscene: 51 },
}

export const PUBLISHING_THRESHOLD = 60

export function getExceededCategory(scores: ModerationScores): ModerationCategory | null {
  const [category, score] = (Object.entries(scores) as [ModerationCategory, number][]).reduce(
    (top, entry) => (entry[1] > top[1] ? entry : top),
  )
  return score >= PUBLISHING_THRESHOLD ? category : null
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 60) return 'high'
  if (score >= 30) return 'medium'
  return 'low'
}

export function getOverallRisk(scores: ModerationScores): RiskLevel {
  return getRiskLevel(Math.max(...Object.values(scores)))
}

export function getStatusForScores(scores: ModerationScores): ModerationStatus {
  const risk = getOverallRisk(scores)
  if (risk === 'high') return 'rejected'
  if (risk === 'medium') return 'borderline'
  return 'approved'
}

const FLAGGED_TERMS: Record<ModerationCategory, string[]> = {
  insult: ['idiot', 'stupid', 'loser', 'dumb'],
  threat: ['kill', 'hurt', 'destroy', 'attack'],
  toxicity: ['hate', 'awful', 'disgusting', 'worst'],
  obscene: ['damn', 'crap', 'hell'],
}

export function estimateScores(text: string): ModerationScores {
  const words = new Set(text.toLowerCase().match(/[a-z']+/g) ?? [])
  const baseline = text.trim().length > 0 ? 4 : 0

  const score = (category: ModerationCategory) => {
    const hits = FLAGGED_TERMS[category].filter((term) => words.has(term)).length
    return Math.min(baseline + hits * 32, 98)
  }

  return {
    insult: score('insult'),
    threat: score('threat'),
    toxicity: score('toxicity'),
    obscene: score('obscene'),
  }
}
