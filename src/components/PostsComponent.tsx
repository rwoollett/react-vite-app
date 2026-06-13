import React, { memo, useEffect, type JSX } from 'react';
import styles from './Card.module.scss';
import postStyles from './PostsComponent.module.scss';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import { selectPostById, selectPostIds, useAppDispatch, useAppSelector } from '../store/reducers/store';
import { fetchPosts } from '../store/api/postsSlice';

interface ExcerptProps {
  postId: number;
}
const staticPostUrl = (slug: string) =>
  `${import.meta.env.VITE_LIVEPOSTS_STATIC_URL}/${slug}/`;

let PostExcerpt: React.FC<ExcerptProps> = ({ postId: p }: ExcerptProps) => {
  const post = useAppSelector(state => selectPostById(state, p));

  let postExcerpt;
  if (post) {
    postExcerpt = (<div className={postStyles.post}>
      <a href={staticPostUrl(post.slug)} style={{ textDecoration: 'none' }}>
        <h3>{post.title}&nbsp;</h3>
        <PostAuthor author={post.userName} />
        <TimeAgo timeISO={post.date} />
        {/* <Button secondary outline type="button">
          View Post
        </Button> */}
      </a>
    </div>
    );
  } else {
    postExcerpt = (<div>
      <p>Post not found</p>
    </div>);
  }
  return (
    <div className={styles.card}>
      {postExcerpt}
    </div>
  );
};

PostExcerpt = memo(PostExcerpt);

function PostsComponent(): JSX.Element {
  const dispatch = useAppDispatch();
  const orderedPosts = useAppSelector(selectPostIds);
  const postStatus = useAppSelector(state => state.posts.status);
  const error = useAppSelector(state => state.posts.error);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === 'loading') {
    content = <div className={styles.loader}>Loading...</div>;

  } else if (postStatus === 'succeeded') {
    content = orderedPosts.map(postId =>
    (
      <PostExcerpt key={postId} postId={postId} />
    ));

  } else if (postStatus === 'failed') {
    content = <div>{error}</div>;
  }

  return (<div className={postStyles.posts}>
    <div className={postStyles['posts-content']}>
      {content}
    </div>
  </div>);
}

export default PostsComponent;

