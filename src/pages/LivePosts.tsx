import React, { useEffect, useState } from 'react';
import type { LivePostPage } from '../types';
import homepage from '../homepage.json';
import { http } from '../utility/fetchData';
import Banner from '../components/Banner';
import PostsComponent from '../components/PostsComponent';
import Button from '../components/Button';
import { useAppDispatch } from '../store/reducers/store';
import { fetchPosts } from '../store/api/postsSlice';
import { useNavigate } from 'react-router';
import { ROUTES } from '../resources/routes-constants';
import { refetchUserByID } from '../store/api/authorUsersSlice';
import { useWebSocket } from "../hooks/use-websocket-context";
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';

import { Box, Paper, Group, Text } from '@mantine/core';
import { useColorMap } from '../theme/colorMap';

const LivePosts: React.FC = () => {
  const { livePostMessageQueue, lastProcessedLivePostSeq, setLastProcessedLivePostSeq } = useWebSocket();
  const { isLoggedIn } = useSignedInAuthorize();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { surfaceBg, surfaceText } = useColorMap();

  // WebSocket updates
  useEffect(() => {
    let updatedSeq = lastProcessedLivePostSeq;

    for (const { seq, msg } of livePostMessageQueue) {
      if (seq > updatedSeq) {
        if (msg.subject === "liveposts_post_Stage") {
          dispatch(fetchPosts());
        }
        updatedSeq = seq;
      }
    }

    if (updatedSeq !== lastProcessedLivePostSeq) {
      setLastProcessedLivePostSeq(updatedSeq);
    }
  }, [livePostMessageQueue]);

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
      } catch (err) {
        const { title, description } = homepage.homepage;
        setTitle(title);
        setDescription(description);
      } finally {
        setIsFetching(false);
      }
    })();
  }, []);

  const toAddPostPage = () => {
    dispatch(refetchUserByID());
    navigate(`${ROUTES.LIVEPOSTS_ROUTE}/create`);
  };

  if (isFetching) {
    return <Text p="md">Fetching home page ...</Text>;
  }

  return (
    <>
      <Banner title={title} desc={description} />

      <Box bg={surfaceBg} c={surfaceText} p="lg">

        {/* Header Section */}
        {isLoggedIn && (
          <Paper
            shadow="sm"
            radius="md"
            p="md"
            mb="lg"
            bg={surfaceBg}
            c={surfaceText}
          >
            <Group justify="flex-start">
              <Button
                type="button"
                secondary
                outline
                onClick={toAddPostPage}
              >
                Create Post
              </Button>
            </Group>
          </Paper>
        )}

        {/* Posts Section */}
        <Paper
          // shadow="sm"
          radius="md"
          p="md"
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
