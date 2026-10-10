import { Group, Progress, Text, ThemeIcon, Tooltip } from '@mantine/core'
import { IconStarFilled } from '@tabler/icons-react'
import { clampScore, RISK_COLORS, type RiskLevel } from '../../lib/moderation'

export interface ModerationScoreProps {
  category: string
  score: number
  severity: RiskLevel
}

export function ModerationScore({ category, score, severity }: ModerationScoreProps) {
  const value = clampScore(score)
  const color = RISK_COLORS[severity]
  const isFlagged = severity !== 'low'

  return (
    <Group gap="md" wrap="nowrap" align="center">
      <Text w={96} size="sm" fw={500}>
        {category}
      </Text>
      <Progress
        value={value}
        color={color}
        size="md"
        radius="xl"
        style={{ flex: 1, maxWidth: 280 }}
        aria-label={`${category} score`}
      />
      <Text w={44} size="sm" ta="right" ff="monospace">
        {value}%
      </Text>
      <Group w={24} justify="center">
        {isFlagged ? (
          <Tooltip label={`${category} flagged`} withArrow>
            <ThemeIcon variant="transparent" color="red" size="sm" aria-label={`${category} flagged`}>
              <IconStarFilled size={16} />
            </ThemeIcon>
          </Tooltip>
        ) : null}
      </Group>
    </Group>
  )
}
