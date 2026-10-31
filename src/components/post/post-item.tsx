// components/posts/PostItem.tsx

import {
  Card,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { PostStatus } from "./post-status";
import type { PostStatusType } from "../../types";

interface PostItemProps {
  title: string;
  date: string;
  status: PostStatusType;

  selected?: boolean;

  onClick?: () => void;
}

export function PostItem({
  title,
  date,
  status,
  selected,
  onClick,
}: PostItemProps) {
  return (
    <Card
      withBorder
      radius="md"
      shadow={selected ? "sm" : undefined}
      p="md"
      onClick={onClick}
      style={{
        cursor: "pointer",
        borderWidth: selected ? 2 : 1,
      }}
    >
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Text fw={600}>
            {title}
          </Text>

          <Text size="sm" c="dimmed">
            {date}
          </Text>
        </Stack>

        <PostStatus status={status} />
      </Group>
    </Card>
  );
}