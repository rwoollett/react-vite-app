import type { ReactNode } from 'react'
import { Alert, Card, Loader, Stack, Text } from '@mantine/core'
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
} from '@tabler/icons-react'
import { ModerationAnalysis } from './moderation-analysis'
import { CATEGORY_LABELS, getOverallRisk, getExceededCategory, PUBLISH_THRESHOLD } from '../../lib/moderation'
import { RiskBadge } from './risk-badge'
import type { CategoryScore, ModerationStatus, RiskLevel } from '../../lib/moderation'

export interface ModerationCardProps {
  status: ModerationStatus
  scores: CategoryScore[]
  title?: string
  message?: string
  riskLevel?: RiskLevel
}

interface StatusAppearance {
  color: string
  cardBackground?: string
  icon: ReactNode
}

interface StatusConfig {
  title: string
  message: string
}

const REVISE_MESSAGE = 'Please revise potentially offensive language.'
const LIVE_CONFIG: Record<RiskLevel, StatusConfig> = {
  low: {
    title: 'Content Ready',
    message: 'Content is ready for publishing.',
  },
  medium: {
    title: 'Content Needs Attention',
    message: REVISE_MESSAGE,
  },
  high: {
    title: 'Publishing Blocked',
    message: REVISE_MESSAGE,
  },
}

const RESULT_CONFIG: Record<Exclude<ModerationStatus, 'live'>, StatusConfig> = {
  pending: {
    title: 'Moderating...',
    message: 'Running Toxic BERT analysis.',
  },
  approved: {
    title: 'Published Successfully',
    message: 'Content passed moderation and was published.',
  },
  borderline: {
    title: 'Content Needs Attention',
    message: REVISE_MESSAGE,
  },
  rejected: {
    title: 'Publishing Blocked',
    message: 'Content failed moderation and was not published.',
  },
}

function getConfig(status: ModerationStatus, scores: CategoryScore[]): StatusConfig {
  if (status === 'live') return LIVE_CONFIG[getOverallRisk(scores)]

  const config = RESULT_CONFIG[status]
  if (status === 'rejected') {
    const exceeded = getExceededCategory(scores)
    if (exceeded) {
      return {
        ...config,
        message: `${CATEGORY_LABELS[exceeded]} score exceeded publishing threshold (${PUBLISH_THRESHOLD}%).`,
      }
    }
  }
  return config
}

function getAppearance(status: ModerationStatus, riskLevel: RiskLevel): StatusAppearance {
  switch (status) {
    case 'pending':
      return {
        color: 'blue',
        cardBackground: 'var(--mantine-color-blue-light)',
        icon: <Loader size={18} color="blue" />,
      }
    case 'approved':
      return {
        color: 'green',
        cardBackground: 'var(--mantine-color-green-light)',
        icon: <IconCircleCheck size={20} />,
      }
    case 'rejected':
      return {
        color: 'red',
        cardBackground: 'var(--mantine-color-red-light)',
        icon: <IconCircleX size={20} />,
      }
    case 'borderline':
      return {
        color: 'orange',
        cardBackground: 'var(--mantine-color-orange-light)',
        icon: <IconAlertTriangle size={20} />,
      }
    case 'live':
      return riskLevel === 'low'
        ? { color: 'green', icon: <IconCircleCheck size={20} /> }
        : {
          color: riskLevel === 'high' ? 'red' : 'yellow',
          icon: <IconAlertTriangle size={20} />,
        }
  }
}

export function ModerationCard({
  status,
  scores,
  riskLevel,
}: ModerationCardProps) {
  const overallRisk = riskLevel ?? getOverallRisk(scores)
  const { color, cardBackground, icon } = getAppearance(status, overallRisk)

  const config = getConfig(status, scores)

  return (
    <Card
      withBorder
      radius="md"
      padding="lg"
      bg={cardBackground}
      aria-busy={status === 'pending'}
      style={{ transition: 'background-color 200ms ease' }}
    >
      <Stack gap="lg">
        <Alert
          variant="light"
          color={color}
          title={config.title}
          icon={icon}
          radius="md"
          role="status"
          aria-live="polite"
        >
          {config.message}
        </Alert>

        <ModerationAnalysis scores={scores} />

        <Stack gap={6} align="flex-start">
          <Text fw={600} size="sm">
            Overall Risk
          </Text>
          <RiskBadge level={overallRisk} />
        </Stack>

      </Stack>
    </Card>
  )
}
