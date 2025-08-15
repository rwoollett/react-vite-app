import React, { memo, useEffect, type JSX } from 'react';
import styles from './Card.module.scss';
import postStyles from './PostsComponent.module.scss';
import { ReactionButtons } from './ReactionButton';
import { useNavigate } from 'react-router-dom';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
//import AddPostForm from './AddPostForm';
import { ROUTES } from '../resources/routes-constants';
import Button from './Button';
import { selectPostById, selectPostIds, useAppDispatch, useAppSelector } from '../store/reducers/store';
import { fetchPosts } from '../store/api/postsSlice';

interface ExcerptProps {
  postId: number;
}

let PostExcerpt: React.FC<ExcerptProps> = ({ postId: p }: ExcerptProps) => {
  const post = useAppSelector(state => selectPostById(state, p));
  const navigate = useNavigate();
  const toPostPage = () => {
    navigate(ROUTES.LIVEPOSTS_ROUTE)
  }

  let postExcerpt;
  if (post) {
    postExcerpt = (<div className={postStyles.post}>
      <h3>{post.title}</h3>
      <PostAuthor author={post.userName} />
      <TimeAgo timeISO={post.date} />
      <p>{post.content}</p>
      <ReactionButtons post={post} />
      <Button secondary outline type="button" onClick={() => toPostPage()}>
        View Post
      </Button>
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


  // content = <PostExcerpt key="1234" postId="1234" />;
  return (<div className={postStyles.posts}>
    <div className={postStyles['posts-content']}>
      {/* <div className={postStyles['posts-list']}> */}
      {/* <div className={postStyles['posts-form']}>
        <h2>Post to Popular Laboratories</h2>
        <Button type="button" onClick={handleOnRefresh} secondary>Refresh Posts</Button>
        <AddPostForm />
      </div> */}
      {content}
      {/* </div> */}
    </div>
  </div>);
}

export default PostsComponent;

