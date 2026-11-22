// pages/MyPostsPage.tsx

import {
  Button,
  Card,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";

import {
  IconArrowLeft,
  IconPlus,
  IconUser,
} from "@tabler/icons-react";

import { PostList } from "./post-list";
import { useNavigate } from 'react-router-dom'
import { useColorMap } from "../../theme/colorMap";
import { ROUTES } from "../../resources/routes-constants";

interface MyPostsPageProps {
  postIds: number[];
  selectedPostId?: number;

  onPostSelect?: (
    postId: number //PostSummary
  ) => void;

  onAddPost: () => void;
  email: string;
}

export function MyPostsPage({
  postIds,
  selectedPostId,
  onPostSelect,
  onAddPost,
  email
}: MyPostsPageProps) {
  const { buttonColors, surfaceBg, surfaceText } = useColorMap();
  const navigate = useNavigate();
  //
  return (
    <Container size="xl" p="xs">
      <Card withBorder bg={surfaceBg} c={surfaceText} p="sm">
        <Stack>
          <Group justify="space-between">
            <div>
              <Title
                bg={surfaceBg}
                c={surfaceText}
                order={2}>My Posts</Title>
              <Stack gap={6} mt={2}>
                <Group gap="xs">
                  <IconUser size={14} color="gray" />
                  <Text size="sm" c="dimmed">
                    {email}
                  </Text>
                </Group>
              </Stack>

            </div>
            <Stack align="flex-end" gap="xs">
              <Button
                variant="subtle"
                color={buttonColors.secondary}
                leftSection={<IconArrowLeft size={16} />}
                onClick={() =>
                  navigate(`${ROUTES.LIVEPOSTS_ROUTE}`)
                }
              >
                Live Posts
              </Button>
              <Button
                leftSection={
                  <IconPlus size={18} />
                }
                color={buttonColors.secondary}
                variant='outline'
                onClick={onAddPost}
              >
                Add Post
              </Button>

            </Stack>

          </Group>

          <PostList
            postIds={postIds}
            selectedPostId={selectedPostId}
            onPostSelect={(postId) => onPostSelect?.(postId)}
          />

          <Group justify="flex-end">
            <Text
              size="sm"
              ta="center"
              c="dimmed"
              bg={surfaceBg}
            >
              {postIds.length} post(s)
            </Text>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}