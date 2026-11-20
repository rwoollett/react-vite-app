import {
  Paper,
  Group,
  Title,
  Text,
  ThemeIcon,
  Button,
  Stack,
} from '@mantine/core';
import { IconArrowLeft, IconShieldCheck, IconUser } from '@tabler/icons-react';
import { PostStatus } from './post-status';
import type { PostStatusType } from '../../types';
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants';

interface PostWorkflowHeaderProps {
  author: string;
  status?: PostStatusType;
  title: string;
}

export function PostWorkflowHeader({ author, status, title }: PostWorkflowHeaderProps) {
  const navigate = useNavigate();

  return (
    <Paper p="md" radius="md" withBorder mb="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{title}</Title>

          <Stack gap={6} mt={2}>
            <Group gap="xs">
              <IconUser size={14} color="gray" />
              <Text size="sm" c="dimmed">
                {author}
              </Text>
            </Group>
            <Group gap="xs">
              <ThemeIcon
                variant="light"
                color="blue"
                size="md"
                radius="xl"
              >
                <IconShieldCheck size={16} />
              </ThemeIcon>

              <Text size="sm" c="dimmed">
                Toxic BERT moderation
              </Text>
            </Group>
          </Stack>
        </div>

        <Stack align="flex-end" gap="xs">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() =>
              navigate(`${ROUTES.LIVEPOSTS_ROUTE}/myposts`)
            }
          >
            My Posts
          </Button>

          {status && (
            <PostStatus status={status} />
          )}

        </Stack>
      </Group>
    </Paper>
  );
}