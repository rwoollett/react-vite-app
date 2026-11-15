// components/posts/PostList.tsx

import {
  Alert,
  Stack,
} from "@mantine/core";

import { IconInfoCircle } from "@tabler/icons-react";

import { PostItem } from "./post-item";
import type { PostSummary } from "../../types";
import { useColorMap } from "../../theme/colorMap";



interface PostListProps {
  posts: PostSummary[];

  selectedPostId?: number;

  onPostSelect?: (
    post: PostSummary
  ) => void;

  emptyMessage?: string;
}

export function PostList({
  posts,
  selectedPostId,
  onPostSelect,
  emptyMessage = "No posts found.",
}: PostListProps) {
  const { POST_STATUS_COLORS, surfaceText } = useColorMap();

  if (posts.length === 0) {
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
      {posts.map((post) => (
        <PostItem
          key={post.id}
          title={post.title}
          date={new Date(
            post.date
          ).toLocaleString()}
          status={post.status}
          selected={
            selectedPostId === post.id
          }
          onClick={() =>
            onPostSelect?.(post)
          }
        />
      ))}
    </Stack>
  );
}