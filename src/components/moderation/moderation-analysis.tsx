import { Stack, Text } from '@mantine/core'
import { ModerationScore } from './moderation-score'
import { getSeverity, type CategoryScore } from '../../lib/moderation'

export interface ModerationAnalysisProps {
  scores: CategoryScore[]
  heading?: string
}

export function ModerationAnalysis({ scores, heading = 'Moderation Analysis' }: ModerationAnalysisProps) {
  return (
    <Stack gap="xs" component="section" aria-label={heading}>
      <Text fw={600}>{heading}</Text>
      <Stack gap={6}>
        {scores.map(({ category, score }) => (
          <ModerationScore
            key={category}
            category={category}
            score={score}
            severity={getSeverity(score)}
          />
        ))}
      </Stack>
    </Stack>
  )
}
