import { useEffect } from 'react';
import { Box, Text, Stack } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';
import { selectPostsForList, useAppDispatch, useAppSelector } from '../store/reducers/store';
import { fetchPosts } from '../store/api/postsSlice';
import PostCard from './PostCard';
import PostCardSkeleton from './PostCardSkeleton';

function PostsComponent() {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectPostsForList);
  const postStatus = useAppSelector((state) => state.posts.status);
  const error = useAppSelector((state) => state.posts.error);

  const { surfaceBg, surfaceText } = useColorMap();

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === 'loading') {
    content = Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />);

  } else if (postStatus === 'succeeded') {
    content = posts.map((post) => (
      <PostCard key={post.id} post={post} />
    ));

  } else if (postStatus === 'failed') {
    content = (
      <Text p="md" c="red">
        {error}
      </Text>
    );
  }

  return (
    <Box bg={surfaceBg} c={surfaceText} p="md">
      <Stack>{content}</Stack>
    </Box>
  );
}

export default PostsComponent;
