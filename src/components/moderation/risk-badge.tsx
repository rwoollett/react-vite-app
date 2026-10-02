'use client'

import { Badge, type BadgeProps } from '@mantine/core'
import { RISK_COLORS, RISK_LABELS, type RiskLevel } from '../../lib/moderation'

interface RiskBadgeProps {
  level: RiskLevel
  size?: BadgeProps['size']
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  return (
    <Badge variant="dot" color={RISK_COLORS[level]} size={size} radius="xl" bg="white">
      {RISK_LABELS[level]}
    </Badge>
  )
}
