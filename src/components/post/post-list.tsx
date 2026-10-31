// components/posts/PostList.tsx

import {
  Alert,
  Stack,
} from "@mantine/core";

import { IconInfoCircle } from "@tabler/icons-react";

import { PostItem } from "./post-item";
import type { PostSummary } from "../../types";



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
  if (posts.length === 0) {
    return (
      <Alert
        icon={<IconInfoCircle size={18} />}
        color="gray"
        variant="light"
      >
        {emptyMessage}
      </Alert>
    );
  }

  return (
    <Stack>
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