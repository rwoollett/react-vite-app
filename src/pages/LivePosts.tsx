import React, { useEffect, useState } from 'react';
import type { LivePostPage } from '../types';
import homepage from '../homepage.json';
import { http } from '../utility/fetchData';
import Banner from '../components/Banner';
import PostsComponent from '../components/PostsComponent';
import { Button } from '@mantine/core';
import { useAppDispatch } from '../store/reducers/store';
import { useNavigate } from 'react-router';
import { ROUTES } from '../resources/routes-constants';
import { refetchAuthor } from '../store/api/authorUsersSlice';
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';

import { Box, Paper, Group, Text } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';

const LivePosts: React.FC = () => {
  const { isLoggedIn } = useSignedInAuthorize();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { buttonColors, surfaceBg, surfaceText } = useColorMap();

  // Fetch homepage content
  useEffect(() => {
    (async () => {
      try {
        const response = await http<LivePostPage>(
          `${import.meta.env.VITE_LIVEPOSTS_URL}/api/v1/liveposts/homepage`,
          { method: "GET" }
        );

        setTitle(response.title);
        setDescription(response.description);
      } catch (_err) {
        const { title, description } = homepage.homepage;
        setTitle(title);
        setDescription(description);
      } finally {
        setIsFetching(false);
      }
    })();
  }, []);

  const toMyPostsPage = () => {
    dispatch(refetchAuthor());
    navigate(`${ROUTES.LIVEPOSTS_ROUTE}/myposts`);
  };

  if (isFetching) {
    return <Text p="md">Fetching home page ...</Text>;
  }

  return (
    <>
      <Banner title={title} desc={description} />

      <Box bg={surfaceBg} c={surfaceText} p="xs">

        {/* Header Section */}
        {isLoggedIn && (
          <Paper
            shadow="sm"
            radius="md"
            p="sm"
            mb="lg"
            bg={surfaceBg}
            c={surfaceText}
          >
            <Group justify="flex-start">
              <Button
                type="button"
                color={buttonColors.secondary}
                variant='outline'
                onClick={toMyPostsPage}
              >
                My Posts
              </Button>
            </Group>
          </Paper>
        )}

        {/* Posts Section */}
        <Paper
          shadow="md"
          radius="md"
          p="sm"
          bg={surfaceBg}
          c={surfaceText}
        >
          <PostsComponent />
        </Paper>

      </Box>
    </>
  );
};

export default LivePosts;
