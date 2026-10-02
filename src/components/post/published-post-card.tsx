'use client'

import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import type { Post } from '@/lib/moderation'

interface PublishedPostCardProps {
  post: Post
}

export function PublishedPostCard({ post }: PublishedPostCardProps) {
  return (
    <Card withBorder padding="lg" radius="md" id={`post-${post.id}`}>
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Title order={3} size="h4">
            {post.title}
          </Title>
          <Badge color="green" variant="light">
            Live
          </Badge>
        </Group>
        <Text style={{ whiteSpace: 'pre-wrap' }}>{post.content}</Text>
        <Group gap={6}>
          <IconClock size={14} color="var(--mantine-color-dimmed)" />
          <Text size="xs" c="dimmed">
            {`Published ${post.publishedAt.toLocaleString()}`}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
}
