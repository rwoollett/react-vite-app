'use client'

import { Alert, Badge, Card, Divider, Group, Loader, Stack, Text, Title } from '@mantine/core'
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconHourglass,
  IconRosetteDiscountCheck,
} from '@tabler/icons-react'
import type { ReactNode } from 'react'
import {
  CATEGORY_LABELS,
  PUBLISHING_THRESHOLD,
  type ModerationCategory,
  type ModerationScores,
  type ModerationStatus,
  type RiskLevel,
  getExceededCategory,
  getOverallRisk,
} from '../../lib/moderation'
import { RiskBadge } from './risk-badge'
import { ScoreRow } from './score-row'

interface StatusConfig {
  cardBg?: string
  cardBorder?: string
  alertColor: string
  icon: ReactNode
  title: string
  message: string
}

const REVISE_MESSAGE = 'Please revise potentially offensive language.'

const LIVE_CONFIG: Record<RiskLevel, StatusConfig> = {
  low: {
    alertColor: 'green',
    icon: <IconCircleCheck size={20} />,
    title: 'Content Ready',
    message: 'Content is ready for publishing.',
  },
  medium: {
    alertColor: 'yellow',
    icon: <IconAlertTriangle size={20} />,
    title: 'Content Needs Attention',
    message: REVISE_MESSAGE,
  },
  high: {
    alertColor: 'red',
    icon: <IconCircleX size={20} />,
    title: 'Publishing Blocked',
    message: REVISE_MESSAGE,
  },
}

const RESULT_CONFIG: Record<Exclude<ModerationStatus, 'live'>, StatusConfig> = {
  pending: {
    cardBg: 'blue.0',
    cardBorder: 'blue.2',
    alertColor: 'blue',
    icon: <IconHourglass size={20} />,
    title: 'Moderating...',
    message: 'Running Toxic BERT analysis.',
  },
  approved: {
    cardBg: 'green.0',
    cardBorder: 'green.3',
    alertColor: 'green',
    icon: <IconRosetteDiscountCheck size={20} />,
    title: 'Published Successfully',
    message: 'Content passed moderation and was published.',
  },
  borderline: {
    cardBg: 'yellow.0',
    cardBorder: 'yellow.3',
    alertColor: 'yellow',
    icon: <IconAlertTriangle size={20} />,
    title: 'Content Needs Attention',
    message: REVISE_MESSAGE,
  },
  rejected: {
    cardBg: 'red.0',
    cardBorder: 'red.3',
    alertColor: 'red',
    icon: <IconCircleX size={20} />,
    title: 'Publishing Blocked',
    message: 'Content failed moderation and was not published.',
  },
}

function getConfig(status: ModerationStatus, scores: ModerationScores): StatusConfig {
  if (status === 'live') return LIVE_CONFIG[getOverallRisk(scores)]

  const config = RESULT_CONFIG[status]
  if (status === 'rejected') {
    const exceeded = getExceededCategory(scores)
    if (exceeded) {
      return {
        ...config,
        message: `${CATEGORY_LABELS[exceeded]} score exceeded publishing threshold (${PUBLISHING_THRESHOLD}%).`,
      }
    }
  }
  return config
}

const CATEGORY_ORDER: ModerationCategory[] = ['insult', 'threat', 'toxic', 'obscene']

interface ModerationAnalysisProps {
  status: ModerationStatus
  scores: ModerationScores
}

export function ModerationAnalysis({ status, scores }: ModerationAnalysisProps) {
  const config = getConfig(status, scores)
  const overallRisk = getOverallRisk(scores)
  const isPending = status === 'pending'

  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      bg={config.cardBg}
      style={
        config.cardBorder
          ? { borderColor: `var(--mantine-color-${config.cardBorder.replace('.', '-')})` }
          : undefined
      }
      aria-busy={isPending}
      aria-live="polite"
    >
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <Title order={2} size="h4" fw={500}>
            Moderation Analysis
          </Title>
          {isPending ? (
            <Loader size="sm" color="blue" aria-label="Analysis in progress" />
          ) : (
            <Badge variant="outline" color="gray" size="sm">
              {status === 'live' ? 'Live' : 'Final'}
            </Badge>
          )}
        </Group>

        <Stack gap={6} maw={360}>
          {CATEGORY_ORDER.map((category) => (
            <ScoreRow key={category} label={CATEGORY_LABELS[category]} score={scores[category]} />
          ))}
        </Stack>

        <Divider color={config.cardBorder ?? 'gray.2'} />

        <Stack gap={6}>
          <Text fw={500}>Overall Risk</Text>
          <Group>
            <RiskBadge level={overallRisk} size="lg" />
          </Group>
        </Stack>

        <Alert
          variant="light"
          color={config.alertColor}
          icon={config.icon}
          title={config.title}
          radius="md"
        >
          {config.message}
        </Alert>
      </Stack>
    </Card>
  )
}
