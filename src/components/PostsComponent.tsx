import React, { memo, type JSX } from 'react';
import styles from './Card.module.scss';
import postStyles from './PostsComponent.module.scss';
//import { useDispatch } from 'react-redux';
// import { fetchPosts, 
// 	selectPostIds, 
// 	selectPostById } from '../features/posts/postsSlice';
// import { useTypedSelector } from '../features/rootReducer';
// import AddPostForm from './AddPostForm';
import { ReactionButtons } from './ReactionButton';
import { useNavigate } from 'react-router-dom';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import AddPostForm from './AddPostForm';
import { ROUTES } from '../resources/routes-constants';
import Button from './Button';

interface ExcerptProps {
  postId: string | number;
}

let PostExcerpt: React.FC<ExcerptProps> = ({ postId: p }: ExcerptProps) => {
  // const post = useTypedSelector(state => selectPostById(state, p));
  const navigate = useNavigate();
  console.log('postid', p);

  const toPostPage = () => {
    navigate(ROUTES.LIVEPOSTS_ROUTE)
  }

  const post = {
    id: "1234",
    date: new Date(2021, 5, 12, 16, 30, 12),
    title: "Some tough spiders are thought of simply as figs",
    content: "Their bird was, in this moment, a silly bear. They were lost without the amicable kiwi that composed their fox. A peach is an amicable crocodile. A tidy fox without sharks is truly a scorpion of willing cats. Shouting with happiness, a currant is a wise currant!",
    user: "400",
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  };

  let postExcerpt;
  if (post) {
    console.log(post);
    postExcerpt = (<div className={postStyles.post}>
      <h3>{post.title}</h3>
      <PostAuthor userId={post.user} />
      <TimeAgo timeISO={post.date.toISOString()} />
      <p>{post.content}</p>
      <ReactionButtons post={post} />
      {/* <div className={styles['button-container']}> */}
      <Button secondary outline type="button" onClick={() => toPostPage()}>
        View Post
      </Button>
      {/* <Link to={`/posts/${post.id}`}>
          View Post
        </Link> */}
      {/* </div> */}
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
  // const dispatch = useDispatch();
  // const orderedPosts = useTypedSelector(selectPostIds);
  // const postStatus = useTypedSelector(state => state.posts.status);
  // const error = useTypedSelector(state => state.posts.error);

  // useEffect(() => {
  // 	if (postStatus === 'idle') {
  // 		dispatch(fetchPosts());
  // 	}
  // }, [postStatus, dispatch]);

  let content;

  // if (postStatus === 'loading') {
  //   content = <div className={styles.loader}>Loading...</div>;

  // } else if (postStatus === 'succeeded') {
  //   content = orderedPosts.map( postId => 
  // 	(
  // 		<PostExcerpt key={postId} postId={postId}/>
  // 	));

  // } else if (postStatus === 'failed') {
  //   content = <div>{error}</div>;

  // }

  content = <PostExcerpt key="1234" postId="1234" />;
  return (<div className={postStyles.posts}>
    <h2>Posts to Popular Laboratories</h2>
    <p>Follow the posts made to Programming Laboratories</p>
    <div className={postStyles['posts-content']}>
      <AddPostForm />
      <div className={postStyles['posts-list']}>
        {content}
      </div>
    </div>
  </div>);
}

export default PostsComponent;
