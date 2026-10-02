'use client'

import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core'
import { IconAlertTriangle, IconCircleCheck, IconCircleX, IconFlask } from '@tabler/icons-react'
import type { ModerationScenario } from '../../lib/moderation'

interface PrototypeControlsProps {
  disabled: boolean
  onScenario: (scenario: ModerationScenario) => void
}

export function PrototypeControls({ disabled, onScenario }: PrototypeControlsProps) {
  return (
    <Card withBorder radius="md" padding="md" style={{ borderStyle: 'dashed' }}>
      <Stack gap="sm">
        <Group gap="xs">
          <IconFlask size={18} aria-hidden />
          <Text fw={600} size="sm">
            Test flow
          </Text>
          <Badge variant="light" color="gray" size="sm">
            Prototype only
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          These buttons skip Toxic BERT and use fixed scores so you can test each moderation result.
        </Text>
        <Group gap="sm">
          <Button
            variant="light"
            color="green"
            leftSection={<IconCircleCheck size={18} />}
            onClick={() => onScenario('approved')}
            disabled={disabled}
          >
            Create Post (Approved)
          </Button>
          <Button
            variant="light"
            color="red"
            leftSection={<IconCircleX size={18} />}
            onClick={() => onScenario('rejected')}
            disabled={disabled}
          >
            Create Post (Rejected)
          </Button>
          <Button
            variant="light"
            color="yellow"
            leftSection={<IconAlertTriangle size={18} />}
            onClick={() => onScenario('borderline')}
            disabled={disabled}
          >
            Create Post (Borderline)
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}
