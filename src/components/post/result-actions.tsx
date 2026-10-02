'use client'

import { Button, Group } from '@mantine/core'
import { IconEdit, IconExternalLink, IconPlus } from '@tabler/icons-react'

interface ResultActionsProps {
  onView: () => void
  onCreateAnother: () => void
  onEdit: () => void
}

export function ResultActions({ onView, onCreateAnother, onEdit }: ResultActionsProps) {
  return (
    <Group gap="md">
      <Button size="md" leftSection={<IconExternalLink size={18} />} onClick={onView}>
        View Published Post
      </Button>
      <Button size="md" leftSection={<IconPlus size={18} />} onClick={onCreateAnother}>
        Create Another Post
      </Button>
      <Button size="md" leftSection={<IconEdit size={18} />} onClick={onEdit}>
        Edit & Republish
      </Button>
    </Group>
  )
}
