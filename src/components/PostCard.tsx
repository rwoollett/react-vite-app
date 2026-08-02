import { Paper, Group, Text } from '@mantine/core';
import { parseISO, formatDistanceToNow } from 'date-fns';
import { useColorMap } from '../theme/colorMap';
import React from 'react';

interface PostCardProps {
  post: {
    id: number;
    slug: string;
    title: string;
    userName: string;
    date: string;
  };
}

const staticPostUrl = (slug: string) =>
  `${import.meta.env.VITE_LIVEPOSTS_STATIC_URL}/${slug}/`;

const PostCard = ({ post }: PostCardProps) => {
  const { surfaceBg, surfaceText } = useColorMap();

  const date = parseISO(post.date);
  const timeAgo = `${formatDistanceToNow(date)} ago`;

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      mb="md"
      bg={surfaceBg}
      c={surfaceText}
    >
      <a
        href={staticPostUrl(post.slug)}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Group gap="xs">
          <Text size="lg" fw={300} c="teal.5">
            {post.title}
          </Text>

          <Text size="sm" style={{ display: 'inline', opacity: 0.8 }}>
            by {post.userName || 'Unknown author'}
          </Text>

          <Text
            size="sm"
            style={{ display: 'inline', opacity: 0.7, fontStyle: 'italic' }}
            title={post.date}
          >
            {timeAgo}
          </Text>
        </Group>
      </a>
    </Paper>
  );
};

export default React.memo(PostCard);
