'use client'

import { Alert, Container, Paper, Stack, Skeleton } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import {
  type ModerationCategory,
  type CategoryScore,
  type ModerationStatus,
  getOverallRisk,
  getStatusForScores,
} from '../../lib/moderation'
import { PostForm } from './post-form'
//import { PublishedPostCard } from './published-post-card'
import { ResultActions } from './result-actions'
import { PostWorkflowHeader } from './post-workflow-header'
import { v4 as uuidv4 } from "uuid";
import { useWebSocket } from "../../hooks/use-websocket-context";
import type { CreateStatus, ModerateResult } from "../../types";
import { http } from "../../utility/fetchData";

import {
  selectIdByAuth,
  selectPostById,
  useAppDispatch,
  useAppSelector
} from '../../store/reducers/store';
import { fetchAuthor } from '../../store/api/authorUsersSlice';

import { useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../../resources/routes-constants'
import { useColorMap } from '../../theme/colorMap'
import { ModerationCard } from '../moderation/moderation-card'
import { addNewPost, updatePost } from '../../store/api/postsSlice'

type WorkflowMode =
  | "create"
  | "update";

export function PostWorkflow({ email }: { email: string }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { postId } = useParams();
  const post = useAppSelector(
    state =>
      postId
        ? selectPostById(
          state,
          Number(postId)
        )
        : undefined
  );

  const { gatewayWsId, livePostMessageQueue, lastProcessedLivePostSeq, setLastProcessedLivePostSeq } = useWebSocket();
  const [title, setTitle] = useState(post ? post.title : '')
  const [content, setContent] = useState(post ? post.content : '')
  const [status, setStatus] = useState<ModerationStatus>('live')
  const [createStatus, setCreateStatus] = useState<CreateStatus>("idle");
  const [author, setAuthor] = useState(''); // from logged credentails
  const [workflowMode, setWorkflowMode] = useState<WorkflowMode>(post ? "update" : "create");

  const { surfaceBg, surfaceText } = useColorMap();
  const [resultScores, setResultScores] = useState<CategoryScore[] | null>(null)
  const [liveScores, setLiveScores] = useState<CategoryScore[]>([
    { category: "insult", score: 0 },
    { category: "threat", score: 0 },
    { category: "toxic", score: 0 },
    { category: "obscene", score: 0 },
  ])

  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  const postUserByAuthIdStatus = useAppSelector(state => state.postusers.status);
  const authUser = useAppSelector(state => selectIdByAuth(state, email));

  const draftId = useRef(uuidv4()).current;
  const moderationSeq = useRef(0);
  const lastQueueIndex = useRef(0);
  const lastModeratedLength = useRef(0);
  const moderationPending = useRef(false);
  const queuedValue = useRef<string | null>(null);

  function debounce<A extends unknown[], R>(
    fn: (...args: A) => R,
    delay: number
  ) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return (...args: A) => {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const sendModerationRequest = debounce(async (value: string) => {
    if (moderationPending.current) {
      queuedValue.current = value;
      return;
    }

    moderationPending.current = true;

    try {
      const seq = ++moderationSeq.current;
      const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
      const reqInit = {
        body: JSON.stringify({
          id: draftId,
          wsId: gatewayWsId,
          seq,
          value
        }),
        method: "PUT"
      };
      await http<{ createPost: ModerateResult }>(`${apiUrl}/api/v1/liveposts/moderate`, reqInit);

    } catch (_err) {
      console.warn("Moderate Job not authenticated.");
      moderationPending.current = false;
    }
  }, 500);

  useEffect(() => {
    for (let i = lastQueueIndex.current; i < livePostMessageQueue.length; ++i) {
      //for (const { seq, msg } of livePostMessageQueue) {
      const { seq, msg } = livePostMessageQueue[i];

      if (seq <= lastProcessedLivePostSeq) {
        continue;
      }

      const labels = [
        "toxic",
        "severe_toxic",
        "obscene",
        "threat",
        "insult",
        "identity_hate"
      ] as const;

      if (msg.subject === "liveposts_post_StatusChanged") {
        //if (msg.payload.status === "PendingModeration") {
        navigate(
          `../edit/${msg.payload.postId}`,
          { replace: true }
        );
        //}
        // if (msg.payload.status === "Live") {
        //   console.log('live post status');
        //   setStatus("approved");
        //   setCreateStatus("created");
        // }
      }

      if (msg.subject === "liveposts_moderate_Result") {

        const score = (category: ModerationCategory) => {
          const idx = labels.indexOf(category as typeof labels[number]);
          return Math.min(Math.round(msg.payload.probabilities[idx] * 100), 98)
        }

        if (msg.payload.id === draftId && msg.payload.purpose === "live") {
          moderationPending.current = false;
          const latest = queuedValue.current;

          queuedValue.current = null;

          if (latest && latest.trim().length >= 8) {
            sendModerationRequest(latest);
          }

          if (msg.payload.seq < moderationSeq.current) {
            continue;
          }

          const scores = [
            { category: "insult", score: score('insult') },
            { category: "threat", score: score('threat') },
            { category: "toxic", score: score('toxic') },
            { category: "obscene", score: score('obscene') }
          ] as CategoryScore[]
          // console.log('set live scores', draftId, scores);
          setResultScores(null);
          setLiveScores(scores);

        }

        if (msg.payload.purpose === "publish") {

          const scores = [
            { category: "insult", score: score('insult') },
            { category: "threat", score: score('threat') },
            { category: "toxic", score: score('toxic') },
            { category: "obscene", score: score('obscene') }
          ] as CategoryScore[]

          const finalStatus = getStatusForScores(scores)
          setResultScores(scores)
          setStatus(finalStatus)

        }

      }

      setLastProcessedLivePostSeq(seq);
    }

    lastQueueIndex.current = livePostMessageQueue.length;

  }, [dispatch, navigate,
    title, content,
    sendModerationRequest,
    livePostMessageQueue,
    draftId,
    lastProcessedLivePostSeq,
    setLastProcessedLivePostSeq
  ]);

  const handleSubmit = async () => {
    if (gatewayWsId) {
      try {
        setError(null)
        //setResultScores(null)
        setStatus('pending')
        setCreateStatus("creating");

        if (workflowMode === "create") {
          await dispatch(
            addNewPost({
              title,
              content,
              wsId: gatewayWsId
            })
          ).unwrap(); // promise ready to throw
        }
        else {
          if (postId)
            await dispatch(
              updatePost({
                postId: Number(postId),
                title,
                content,
                wsId: gatewayWsId
              })
            ).unwrap();
        }
      } catch (err) {
        console.error('Failed to save the post: ', err);
      }
    }
  }

  const resetToForm = (clear: boolean) => {
    if (clear) {
      setTitle('')
      setContent('')
      setResultScores(null)
    }
    requestIdRef.current++
    setStatus('live')
    setCreateStatus('idle')
    setError(null)
  }

  const moderateLiveOnChangePost = (value: string, cursorPos: number) => {
    const previousModeratedLength = lastModeratedLength.current;
    const snippet = value[cursorPos - 1];
    setContent(value);

    const moderateValue = title + '\n' + value;

    if (moderateValue.trim().length < 8)
      return;

    if ([" ", ".", ",", "!", "?", "\n"].includes(snippet))
      return;

    if (Math.abs(moderateValue.length - previousModeratedLength) < 8)
      return;

    sendModerationRequest(moderateValue);
    lastModeratedLength.current = moderateValue.length;

    //console.log('send moderation debounce! length value now:', lastModeratedLength.current, '\nModerate Value:', moderateValue);
  };

  const isPending = status === 'pending'
  const isAwaitingContinue = status === 'rejected' || status === 'borderline'
  const scores = resultScores ?? liveScores
  const isLiveHighRisk = status === 'live' && getOverallRisk(liveScores) === 'high'

  // Fetch author PostUser record for logged in authuser
  useEffect(() => {
    if (postUserByAuthIdStatus === 'idle' && gatewayWsId) {
      dispatch(fetchAuthor({ wsId: gatewayWsId }));
    }
    if (postUserByAuthIdStatus === 'failed') {
      navigate(ROUTES.LIVEPOSTS_ROUTE);
    }
  }, [dispatch, navigate, postUserByAuthIdStatus, gatewayWsId]);

  // Create user if missing
  useEffect(() => {
    if (authUser.length) {
      setAuthor(authUser[0].name);
    }
  }, [authUser]);

  // Skeleton loader
  if (postUserByAuthIdStatus === 'idle' ||
    postUserByAuthIdStatus === 'loading' ||
    (postUserByAuthIdStatus === 'succeeded' && authUser.length === 0)) {
    return (
      <Container size="md" py="md">
        <Paper shadow="sm" radius="md" p="lg" bg={surfaceBg} c={surfaceText}>
          <Stack gap="xl">
            <Skeleton height={70} radius="sm" />
            <Skeleton height={70} radius="sm" />
            <Skeleton height={200} radius="sm" />
            <Skeleton height={60} radius="sm" />
            <ModerationCard status={'live'} scores={scores} />
          </Stack>
        </Paper>
      </Container>
    );
  }
  // of End Fetch author

  if (post && status === 'approved') {
    return (
      <Container size="md" py="md">

        <PostWorkflowHeader author={author} status={post?.status} title={"Live Posts"} scores={scores} />

        <Paper shadow="sm" radius="md" p="lg">
          <Stack gap="xl">
            <ModerationCard status={status} scores={scores} />
            <ResultActions
              slug={post.slug}
              onCreateAnother={() => {
                setWorkflowMode("create");
                resetToForm(true);
                navigate(
                  `../create`,
                  { replace: true }
                );
              }}
              onEdit={() => {
                setWorkflowMode("update");
                resetToForm(false);
              }}
            />
          </Stack>
        </Paper>
      </Container>
    )
  }

  return (
    <Container size="md" py="md">
      <PostWorkflowHeader author={author} status={post?.status} title={workflowMode === "create"
        ? "Create Post"
        : "Update Post"}  scores={scores} />

      <Paper shadow="sm" radius="md" p="lg">
        <Stack gap="xl">
          <PostForm
            title={title}
            content={content}
            isModerating={isPending}
            isLocked={isAwaitingContinue}
            isSubmitBlocked={isLiveHighRisk}
            createStatus={createStatus}
            workflowMode={workflowMode}
            onTitleChange={setTitle}
            onContentChange={moderateLiveOnChangePost}
            onSubmit={handleSubmit}
            onContinue={() => resetToForm(false)}
          />
          {error && (
            <Alert color="red" variant="light" icon={<IconAlertCircle />} title="Moderation failed">
              {error}
            </Alert>
          )}
          <ModerationCard status={status} scores={scores} />

        </Stack>
      </Paper>
    </Container>
  )
}
