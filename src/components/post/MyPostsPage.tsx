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
import { useColorMap } from "../../theme/colorMap";


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
  const { surfaceBg, surfaceText } = useColorMap();

  return (
    <Card withBorder
      bg={surfaceBg}
      c={surfaceText}>
      <Stack>
        <Group justify="space-between">
          <Text
            size="xl"
            fw={700}
            bg={surfaceBg}
            c={surfaceText}>
            {email} My Posts
          </Text>

          <Button
            leftSection={
              <IconPlus size={18} />
            }
            color="gray"
            variant='outline'
            onClick={onAddPost}
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
            bg={surfaceBg}
          >
            {posts.length} post(s)
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}