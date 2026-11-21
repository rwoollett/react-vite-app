'use client'

import { Group, Text } from '@mantine/core'
import { CATEGORY_LABELS, getSeverity, type ModerationCategory } from '../../lib/moderation'
import { RiskBadge } from './risk-badge'

interface ScoreRowProps {
  category: ModerationCategory
  score: number
}

export function ScoreRow({ category, score }: ScoreRowProps) {
  return (
    <Group gap="md" wrap="nowrap">
      <Text w={110} size="sm">{CATEGORY_LABELS[category]}</Text>
      <Text w={48} ta="right" ff="monospace" fw={500} size="sm">
        {`${score}%`}
      </Text>
      <RiskBadge level={getSeverity(category, score)} size="sm" />
    </Group>
  )
}
