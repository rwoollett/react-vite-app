// pages/MyPostsPage.tsx

import {
  Button,
  Card,
  Group,
  Stack,
  Text,
} from "@mantine/core";

import {
  IconPlus,
} from "@tabler/icons-react";

import { PostList } from "./post-list";
import type { PostSummary } from "../../types";


interface MyPostsPageProps {
  posts: PostSummary[];
  selectedPostId?: number;

  onPostSelect?: (
    post: PostSummary
  ) => void;

  onAddPost: () => void;
  email: string;
}

export function MyPostsPage({
  posts,
  selectedPostId,
  onPostSelect,
  onAddPost,
  email
}: MyPostsPageProps) {

  return (
    <Card withBorder>
      <Stack>
        <Group justify="space-between">
          <Text
            size="xl"
            fw={700}
          >
            {email} My Posts
          </Text>

          <Button
            leftSection={
              <IconPlus size={18} />
            }
            onClick={() => onAddPost}
          >
            Add Post
          </Button>
        </Group>
        <PostList
          posts={posts}
          selectedPostId={selectedPostId}
          onPostSelect={(post) => onPostSelect?.(post)}
        />

        <Group justify="flex-end">
          <Text
            size="sm"
            ta="center"
            c="dimmed"
          >
            {posts.length} post(s)
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}