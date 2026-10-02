import {
  Paper,
  Group,
  Title,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconShieldCheck, IconUser } from '@tabler/icons-react';

export function PostWorkflowHeader({ author, title }: { author: string; title: string }) {
  return (
    <Paper p="md" radius="md" withBorder mb="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>{title}</Title>
          
          <Group gap={6} mt={2}>
            <IconUser size={14} color="gray" />
            <Text size="sm" c="dimmed">
              {author}
            </Text>
          </Group>
        </div>

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
      </Group>
    </Paper>
  );
}