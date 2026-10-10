'use client'

import { Group, Text } from '@mantine/core'
import { getSeverity } from '../../lib/moderation'
import { RiskBadge } from './risk-badge'

interface ScoreRowProps {
  label: string
  score: number
}

export function ScoreRow({ label, score }: ScoreRowProps) {
  return (
    <Group gap="md" wrap="nowrap">
      <Text w={110} size="sm">{label}</Text>
      <Text w={48} ta="right" ff="monospace" fw={500} size="sm">
        {`${score}%`}
      </Text>
      <RiskBadge level={getSeverity(score)} size="sm" />
    </Group>
  )
}
