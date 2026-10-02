'use client'

import { Alert, Container, Paper, Text, Stack, Skeleton } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconAlertCircle } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { ModerationAnalysis } from '../moderation/moderation-analysis'
import {
  type ModerationScenario,
  type ModerationScores,
  type ModerationStatus,
  type Post,
  estimateScores,
  getOverallRisk,
  getStatusForScores,
} from '../../lib/moderation'
import { moderatePost, simulateModeration } from '../../lib/moderation-service'
import { PostForm } from './post-form'
import { PrototypeControls } from './prototype-controls'
import { PublishedPostCard } from './published-post-card'
import { ResultActions } from './result-actions'
import { PostWorkflowHeader } from './post-workflow-header'

import {
  selectIdByAuth,
  useAppDispatch,
  useAppSelector
} from '../../store/reducers/store';
import { addNewUser, fetchUserByAuthId } from '../../store/api/authorUsersSlice';

import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'
import { useColorMap } from '../../theme/colorMap'


const SAMPLE_POSTS: Record<ModerationScenario, { title: string; content: string }> = {
  approved: {
    title: 'Weekend hiking recap',
    content: 'Had a great time on the ridge trail this weekend. The views were incredible!',
  },
  borderline: {
    title: 'Hot take on the finale',
    content: 'Honestly that finale was the worst writing I have seen in years. Awful pacing.',
  },
  rejected: {
    title: 'Reply to that thread',
    content: 'You are an idiot and I hate everything you post.',
  },
}

export function PostWorkflow({ email }: { email: string }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<ModerationStatus>('live')
  const [author, setAuthor] = useState('');
  const { surfaceBg, surfaceText } = useColorMap();
  
  
  const [resultScores, setResultScores] = useState<ModerationScores | null>(null)
  const [publishedPost, setPublishedPost] = useState<Post | null>(null)
  const [showPost, setShowPost] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const postUserByAuthIdStatus = useAppSelector(state => state.postusers.status);
  const postUsersNewUserStatus = useAppSelector(state => state.postusers.statusNewUser);
  const authUser = useAppSelector(state => selectIdByAuth(state, email));

  const [debouncedText] = useDebouncedValue(`${title}\n${content}`, 300)
  const liveScores = estimateScores(debouncedText)

  const runModeration = async (
    draft: { title: string; content: string },
    getScores: () => Promise<ModerationScores>,
  ) => {
    const requestId = ++requestIdRef.current
    setError(null)
    setResultScores(null)
    setStatus('pending')

    try {
      const scores = await getScores()
      if (requestId !== requestIdRef.current) return

      const finalStatus = getStatusForScores(scores)
      setResultScores(scores)
      setStatus(finalStatus)
      if (finalStatus === 'approved') {
        setPublishedPost({ id: crypto.randomUUID(), ...draft, scores, publishedAt: new Date() })
      }
    } catch {
      if (requestId !== requestIdRef.current) return
      setStatus('live')
      setError('Moderation service is unavailable. Please try again.')
    }
  }

  const handleSubmit = () => {
    const draft = { title, content }
    runModeration(draft, () => moderatePost(draft))
  }

  const handleScenario = (scenario: ModerationScenario) => {
    const useSample = !title.trim() || !content.trim()
    const draft = useSample ? SAMPLE_POSTS[scenario] : { title, content }
    setTitle(draft.title)
    setContent(draft.content)
    runModeration(draft, () => simulateModeration(scenario))
  }

  const resetToForm = (clear: boolean) => {
    if (clear) {
      setTitle('')
      setContent('')
    }
    requestIdRef.current++
    setStatus('live')
    setResultScores(null)
    setShowPost(false)
    setError(null)
  }

  const isPending = status === 'pending'
  const isAwaitingContinue = status === 'rejected' || status === 'borderline'
  const scores = resultScores ?? liveScores
  const isLiveHighRisk = status === 'live' && getOverallRisk(liveScores) === 'high'

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

  if (status === 'approved') {
    return (
      <Container size="md" py="md">

        <PostWorkflowHeader  author={author} title={"Live Posts"} />

        <Paper shadow="sm" radius="md" p="lg">
          <Stack gap="xl">
            <ModerationAnalysis status={status} scores={scores} />
            <ResultActions
              onView={() => setShowPost(true)}
              onCreateAnother={() => resetToForm(true)}
              onEdit={() => resetToForm(false)}
            />
            {showPost && publishedPost && <PublishedPostCard post={publishedPost} />}
          </Stack>
        </Paper>
      </Container>
    )
  }

  return (
    <Container size="md" py="md">
      <PostWorkflowHeader author={author} title={"Create Post"} />

      <Paper shadow="sm" radius="md" p="lg">
        <Stack gap="xl">
          <PostForm
            title={title}
            content={content}
            isModerating={isPending}
            isLocked={isAwaitingContinue}
            isSubmitBlocked={isLiveHighRisk}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSubmit={handleSubmit}
            onContinue={() => resetToForm(false)}
          />
          {error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle />} title="Moderation failed">
              {error}
            </Alert>
          )}
          <ModerationAnalysis status={status} scores={scores} />
          <PrototypeControls disabled={isPending} onScenario={handleScenario} />
        </Stack>
      </Paper>
    </Container>
  )
}
