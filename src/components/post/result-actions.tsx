'use client'

import { Button, Group } from '@mantine/core'
import { IconEdit, IconExternalLink, IconPlus } from '@tabler/icons-react'
import { staticPostUrl } from '../../utility/functions'
import { useColorMap } from '../../theme/colorMap'

interface ResultActionsProps {
  slug: string;
  onCreateAnother: () => void
  onEdit: () => void
}

export function ResultActions({ slug, onCreateAnother, onEdit }: ResultActionsProps) {
  const { surfaceText, buttonColors } = useColorMap();

  return (
    <Group gap="md">
      <Button
        c={surfaceText}
        bg={buttonColors.primary}
        size="md"
        leftSection={<IconEdit size={18} />}
        onClick={onEdit}>
        Edit & Republish
      </Button>
      <Button
        c={surfaceText}
        bg={buttonColors.secondary}
        size="md"
        leftSection={<IconPlus size={18} />}
        onClick={onCreateAnother}>
        Create Another Post
      </Button>
      <Button
        c={surfaceText}
        bg={buttonColors.success}
        size="md"
        leftSection={<IconExternalLink size={18} />}
        component="a"
        href={staticPostUrl(slug)}
        target="_blank"
        variant="light"
      >
        View Published Post
      </Button>
    </Group>
  )
}
