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
import { useColorMap } from '../../theme/colorMap';

interface PostWorkflowHeaderProps {
  author: string;
  status?: PostStatusType;
  title: string;
  scores: CategoryScore[];
}

export function PostWorkflowHeader({ author, status, title, scores }: PostWorkflowHeaderProps) {
  const navigate = useNavigate();
  const overallRisk = getOverallRisk(scores);
  const { buttonColors } = useColorMap();

  return (
    <Paper p="sm" radius="sm" withBorder >
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{title}</Title>

          <Stack gap={24} mt={2}>
            <Group gap="xs">
              <IconUser size={14} color="gray" />
              <Text size="sm" c="dimmed">
                {author}
              </Text>
            </Group>
            <Group gap="sm">
              <ThemeIcon
                variant="light"
                color="blue"
                size="sm"
                radius="lg"
              >
                <IconShieldCheck size={14} />
              </ThemeIcon>
              <Text size="sm" c="dimmed">
                Toxic BERT moderation
              </Text>
            </Group>
          </Stack>
        </div>

        <Stack align="flex-end" gap="sm">
          <Button p={4}
            variant="subtle"
            color={buttonColors.secondary}

            leftSection={<IconArrowLeft size={16} />}
            onClick={() =>
              navigate(`${ROUTES.LIVEPOSTS_ROUTE}/myposts`)
            }
          >
            My Posts
          </Button>

          <Group gap={4}>
            <Text fw={500} size="sm">
              Overall Risk
            </Text>
            <RiskBadge level={overallRisk} />
          </Group>

          {status && (
            <PostStatus status={status} />
          )}

        </Stack>
      </Group>
    </Paper>
  );
}