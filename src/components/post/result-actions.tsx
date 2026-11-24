'use client'

import { Badge, Button, Group } from '@mantine/core'
import { IconEdit, IconExternalLink, IconPlus } from '@tabler/icons-react'
import { staticPostUrl } from '../../utility/functions'
import { useColorMap } from '../../theme/colorMap'
import type { PrerenderStatus } from '../../types'

interface ResultActionsProps {
  slug: string;
  prerenderStatus: PrerenderStatus;
  onCreateAnother: () => void
  onEdit: () => void
}

export function ResultActions({ slug, prerenderStatus, onCreateAnother, onEdit }: ResultActionsProps) {
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
      {prerenderStatus === "Completed" ? (
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
          View Post
        </Button>
      ) : (
        <Badge color={buttonColors.warning}>
          Rendering...
        </Badge>
      )}
    </Group>
  )
}
