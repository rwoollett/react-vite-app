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
import { RiskBadge } from '../moderation/risk-badge';
import { getOverallRisk, type CategoryScore } from '../../lib/moderation';

interface PostWorkflowHeaderProps {
  author: string;
  status?: PostStatusType;
  title: string;
  scores: CategoryScore[];
}

export function PostWorkflowHeader({ author, status, title, scores }: PostWorkflowHeaderProps) {
  const navigate = useNavigate();
  const overallRisk = getOverallRisk(scores);

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

          <Group gap={6} align="flex-start">
            <Text fw={600} size="sm">
              Overall Risk
            </Text>
            <RiskBadge level={overallRisk} />
          </Group>


        </Stack>
      </Group>
    </Paper>
  );
}