import type { Post } from "../types";


export const CATEGORY_THRESHOLDS = {
  toxic:         { publish: 80, attention: 40 },
  severe_toxic:  { publish: 80, attention: 40 },
  obscene:       { publish: 60, attention: 30 },
  threat:        { publish: 50, attention: 25 },
  insult:        { publish: 80, attention: 40 },
  identity_hate: { publish: 80, attention: 40 },
} as const;

export type ModerationStatus = 'live' | 'pending' | 'approved' | 'rejected' | 'borderline'

export type RiskLevel = 'low' | 'medium' | 'high'

export type ModerationCategory = 'insult' | 'threat' | 'toxic' | 'obscene'

export type ModerationScenario = 'approved' | 'rejected' | 'borderline'

export interface CategoryScore {
  category: ModerationCategory
  score: number
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

export function getPublishThreshold(
  category: ModerationCategory
) {
  return CATEGORY_THRESHOLDS[
    category
  ].publish;
}

export function getAttentionThreshold(
  category: ModerationCategory
) {
  return CATEGORY_THRESHOLDS[
    category
  ].attention;
}

export function getExceededCategory(
  scores: CategoryScore[]
): ModerationCategory | null {

  const exceeded = scores.filter(score =>
    score.score >= getPublishThreshold(score.category)
  );

  if (
    exceeded.length === 0
  ) {
    return null;
  }

  exceeded.sort(
    (a, b) => b.score - a.score
  );

  return exceeded[0].category;
}

const RISK_RANK: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 }

export function getSeverity(
  category: ModerationCategory,
  score: number
): RiskLevel {
  if (score >= getPublishThreshold(category)) {
    return 'high';
  }
  if (score >= getAttentionThreshold(category)) {
    return 'medium';
  }
  return 'low';
}

export function getOverallRisk(scores: CategoryScore[]): RiskLevel {
  return scores.reduce<RiskLevel>((highest, { category, score }) => {
    const severity = getSeverity(category, score)
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

export function getEditableTitle(post: Post) {

    if (
        post.status === "Rejected" &&
        post.draftTitle
    ) {
        return post.draftTitle;
    }

    return post.title;
}

export function getEditableContent(post: Post) {

    if (
        post.status === "Rejected" &&
        post.draftContent
    ) {
        return post.draftContent;
    }

    return post.content;
}




