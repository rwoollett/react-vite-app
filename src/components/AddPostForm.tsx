import React, { useEffect, useState, type FormEvent } from 'react';
import { Stack, Paper, Text, TextInput, Textarea, Button, Grid, Skeleton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { useColorMap } from '../theme/colorMap';

import { 
  selectIdByAuth, 
  useAppDispatch, 
  useAppSelector 
} from '../store/reducers/store';

import { addNewPost } from '../store/api/postsSlice';
import { addNewUser, fetchUserByAuthId } from '../store/api/authorUsersSlice';
import { ROUTES } from '../resources/routes-constants';

const AddPostForm: React.FC<{ email: string }> = ({ email }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const postUserByAuthIdStatus = useAppSelector(state => state.postusers.status);
  const postUsersNewUserStatus = useAppSelector(state => state.postusers.statusNewUser);
  const authUser = useAppSelector(state => selectIdByAuth(state, email));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const { buttonText, surfaceBg, surfaceText } = useColorMap();

  const canSave =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    authUser.length > 0 &&
    authUser[0].id;

  // Fetch user by authId
  useEffect(() => {
    if (postUserByAuthIdStatus === 'idle') {
      dispatch(fetchUserByAuthId({ authId: email }));
    }
  }, [dispatch, postUserByAuthIdStatus, email]);

  // Create user if missing
  useEffect(() => {
    if (authUser.length === 0 && postUserByAuthIdStatus === 'succeeded' && postUsersNewUserStatus === 'idle') {
      dispatch(addNewUser({ name: email, authId: email }));
    }
    if (authUser.length && postUsersNewUserStatus) {
      setAuthor(authUser[0].name);
    }
  }, [authUser, postUserByAuthIdStatus, postUsersNewUserStatus, dispatch, email]);

  if (postUserByAuthIdStatus === 'failed') {
    navigate(ROUTES.LIVEPOSTS_ROUTE);
  }

  // Skeleton loader
  if (postUserByAuthIdStatus === 'idle' || postUserByAuthIdStatus === 'loading') {
    return (
      <Paper shadow="sm" radius="md" p="lg" bg={surfaceBg} c={surfaceText}>
        <Text size="lg" mb="md">Live Posts</Text>
        <Stack>
          <Skeleton height={30} radius="sm" />
          <Skeleton height={30} radius="sm" />
          <Skeleton height={200} radius="sm" />
          <Skeleton height={40} radius="sm" />
        </Stack>
      </Paper>
    );
  }

  const onSavePostClicked = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSave) {
      try {
        const resultAction = await dispatch(
          addNewPost({ title, content, userId: authUser[0].id })
        );
        unwrapResult(resultAction);
        navigate(ROUTES.LIVEPOSTS_ROUTE);
      } catch (err) {
        console.error('Failed to save the post: ', err);
      }
    }
  };

  return (
    <Paper shadow="sm" radius="md" p="lg" bg={surfaceBg} c={surfaceText}>
      <Text size="lg" mb="md">Live Posts – Create Post</Text>

      <form onSubmit={onSavePostClicked}>
        <Grid gap="xl">

          {/* LEFT SIDE */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              label="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <TextInput
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              readOnly
              mt="md"
            />
          </Grid.Col>

          {/* RIGHT SIDE */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Textarea
              label="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minRows={14}
              autosize={false}
              styles={{
                input: {
                  minHeight: 300,
                  borderRadius: 6,
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                },
              }}
            />
          </Grid.Col>

          {/* FOOTER BUTTON */}
          <Grid.Col span={12}>
            <Button c={buttonText} type="submit" disabled={!canSave}>
              Create
            </Button>
          </Grid.Col>

        </Grid>
      </form>
    </Paper>
  );
};

export default AddPostForm;
