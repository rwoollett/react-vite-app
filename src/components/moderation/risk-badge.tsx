'use client'

import { Badge, ColorSwatch, type BadgeProps } from '@mantine/core'
import { RISK_COLORS, RISK_LABELS, type RiskLevel } from '../../lib/moderation'

interface RiskBadgeProps {
  level: RiskLevel
  size?: BadgeProps['size']
}

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const color = RISK_COLORS[level]

  return (
    <Badge
      size={size} 
      radius="md"
      variant="default"
      tt="none"
      fw={500}
      leftSection={
        <ColorSwatch color={`var(--mantine-color-${color}-filled)`} size={10} withShadow={false} />
      }
      aria-label={`Overall risk: ${RISK_LABELS[level]}`}
    >
      {RISK_LABELS[level]}
    </Badge>
  )
}

