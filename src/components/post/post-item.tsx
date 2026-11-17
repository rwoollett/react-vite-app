// components/posts/PostItem.tsx

import {
  Card,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { PostStatus } from "./post-status";
import { useColorMap } from "../../theme/colorMap";
import { selectPostById, useAppSelector } from "../../store/reducers/store";
import { memo } from "react";

interface PostItemProps {
  postId: number;
  selected?: boolean;

  onClick?: () => void;
}

export const PostItem = memo( function PostItem({
  postId,
  selected,
  onClick,
}: PostItemProps) {
  const { surfaceBg, surfaceText } = useColorMap();
  const post = useAppSelector(
    state =>
      selectPostById(
        state,
        postId
      )
  );

  if (!post) {
    return null;
  }

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
      bg={surfaceBg}
      c={surfaceText}
    >
      <Group justify="space-between" align="center">
        <Stack gap={2}>
          <Text fw={600}>
            {post.title}
          </Text>

          <Text size="sm" c="dimmed">
            {post.date}
          </Text>
        </Stack>

        <PostStatus status={post.status} />
      </Group>
    </Card>
  );
});
