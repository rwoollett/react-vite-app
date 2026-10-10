import {
  type ModerationScenario,
  type CategoryScore,
  SCENARIO_SCORES,
  estimateScores,
} from './moderation'

export interface ModerationRequest {
  title: string
  content: string
}

const SIMULATED_DELAY_MS = 1800

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Integration point for Toxic BERT.
 * Replace the body with your API call and return scores as percentages (0-100).
 */
export async function moderatePost(request: ModerationRequest): Promise<CategoryScore[]> {
  await delay(SIMULATED_DELAY_MS)
  return estimateScores(`${request.title}\n${request.content}`)
}

/** Prototype-only: resolves with fixed scores so each result state can be tested. */
export async function simulateModeration(scenario: ModerationScenario): Promise<CategoryScore[]> {
  await delay(SIMULATED_DELAY_MS)
  return SCENARIO_SCORES[scenario]
}
