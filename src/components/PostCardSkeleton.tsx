import { Paper, Skeleton, Group } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';

const PostCardSkeleton = () => {
  const { surfaceBg } = useColorMap();

  return (
    <Paper
      shadow="sm"
      radius="md"
      p="md"
      mb="md"
      bg={surfaceBg}
    >
      <Group gap="xs">
        <Skeleton height={20} width="40%" radius="sm" />
        <Skeleton height={16} width="20%" radius="sm" />
        <Skeleton height={16} width="15%" radius="sm" />
      </Group>
    </Paper>
  );
};

export default PostCardSkeleton;
