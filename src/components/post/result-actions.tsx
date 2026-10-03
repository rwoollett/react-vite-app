'use client'

import { Button, Group } from '@mantine/core'
import { IconEdit, IconExternalLink, IconPlus } from '@tabler/icons-react'

interface ResultActionsProps {
  slug: string;
  onView: () => void
  onCreateAnother: () => void
  onEdit: () => void
}

const staticPostUrl = (slug: string) =>
  `${import.meta.env.VITE_LIVEPOSTS_STATIC_URL}/${slug}/`;

export function ResultActions({ slug, onView, onCreateAnother, onEdit }: ResultActionsProps) {
  return (
    <Group gap="md">
      <a
        href={staticPostUrl(slug)}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Button size="md" leftSection={<IconExternalLink size={18} />} onClick={onView}>
          View Published Post
        </Button>
      </a>
      {/* <Button size="md" leftSection={<IconExternalLink size={18} />} onClick={onView}>
        View Published Post
      </Button> */}
      <Button size="md" leftSection={<IconPlus size={18} />} onClick={onCreateAnother}>
        Create Another Post
      </Button>
      <Button size="md" leftSection={<IconEdit size={18} />} onClick={onEdit}>
        Edit & Republish
      </Button>
    </Group>
  )
}
