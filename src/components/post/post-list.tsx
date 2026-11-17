// components/posts/PostList.tsx

import {
  Alert,
  Stack,
} from "@mantine/core";

import { IconInfoCircle } from "@tabler/icons-react";

import { PostItem } from "./post-item";
//import type { PostSummary } from "../../types";
import { useColorMap } from "../../theme/colorMap";



interface PostListProps {
  postIds: number[];//PostSummary[];

  selectedPostId?: number;

  onPostSelect?: (
    postId: number //PostSummary
  ) => void;

  emptyMessage?: string;
}

export function PostList({
  postIds,
  selectedPostId,
  onPostSelect,
  emptyMessage = "No posts found.",
}: PostListProps) {
  const { POST_STATUS_COLORS, surfaceText } = useColorMap();

  if (postIds.length === 0) {
    return (
      <Alert
        icon={<IconInfoCircle size={18} />}
        bg={POST_STATUS_COLORS[5]}
        c={surfaceText}
      >
        {emptyMessage}
      </Alert>
    );
  }

  return (
    <Stack
      c={surfaceText}
    >
      {postIds.map((postId) => (
        <PostItem
          key={postId}
          postId={postId}
          selected={
            selectedPostId === postId
          }
          onClick={() =>
            onPostSelect?.(postId)
          }
        />
      ))}
    </Stack>
  );
}