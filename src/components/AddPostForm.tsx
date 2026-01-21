import React, { useEffect, useState, type FormEvent } from 'react';
import style from './PostsComponent.module.scss';
import Button from './Button';
import { selectIdByAuth, useAppDispatch, useAppSelector } from '../store/reducers/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { addNewPost } from '../store/api/postsSlice';
import { addNewUser } from '../store/api/authorUsersSlice';
import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import { ReactionButtons } from './ReactionButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../resources/routes-constants';
import Skeleton from './Skeleton';
import { fetchUserByAuthId } from '../store/api/authorUsersSlice';


const AddPostForm: React.FC<{ email: string }> = ({ email }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const postUserByAuthIdStatus = useAppSelector(state => state.postusers.status);
  const postUsersNewUserStatus = useAppSelector(state => state.postusers.statusNewUser);
  const authUser = useAppSelector(state => selectIdByAuth(state, email));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const canSave = [title, content, authUser.length > 0 && authUser[0].id].every(Boolean);

  useEffect(() => {
    if (postUserByAuthIdStatus === 'idle') {
      dispatch(fetchUserByAuthId({ authId: email }))
    }
  }, [dispatch, postUserByAuthIdStatus]);

  useEffect(() => {
    if (authUser.length === 0 && postUserByAuthIdStatus === 'succeeded' && postUsersNewUserStatus === 'idle') {
      dispatch(addNewUser({ name: email, authId: email }));
    }
    authUser.length && postUsersNewUserStatus && setAuthor(authUser[0].name);
  }, [author, authUser, postUserByAuthIdStatus, postUsersNewUserStatus, dispatch]);

  console.log('postUserByAuthIdStatus', postUserByAuthIdStatus);
  if (postUserByAuthIdStatus === 'failed') {
    navigate(ROUTES.LIVEPOSTS_ROUTE);
  }

  if (postUserByAuthIdStatus === 'idle' || postUserByAuthIdStatus === 'loading') {
    return (
      <div className='panel'>
        <p className="panel-heading mb-4 is-size-5">Live Posts</p>
        <div className='panel-block mb-2  '>
          <div className='container'>
            <Skeleton times={4} className={'sign-in-skeleton'} />
          </div>
        </div>
      </div>
    )
  }

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);
  const onAuthorChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAuthor(e.target.value);

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

  const formOption = (formTitle: string, buttonText: string) => (
    <div className='panel ml-3'>
      <p className="panel-heading mb-4 is-size-7">{formTitle}</p>
      <div className='panel-block'>
        <form onSubmit={onSavePostClicked}>

          <div className="field">
            <div className="control">
              <label className='label' htmlFor="postTitle">Post Title</label>
              <input
                className='input'
                type="text"
                id="postTitle"
                name="postTitle"
                value={title}
                onChange={onTitleChanged}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className='label' htmlFor="postAuthor">Author</label>
              <input
                className='input is-static'
                type="text"
                id="postAuthor"
                name="postAuthor"
                value={author}
                onChange={onAuthorChanged}
                readOnly
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className='label' htmlFor="postContent">Content</label>
              <textarea
                className='textarea has-fixed-size'
                rows={12}
                id="postContent"
                name="postContent"
                value={content}
                onChange={onContentChanged}
                placeholder='Textarea'
              />
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <Button secondary outline type="submit">{buttonText}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="panel">
      {/* <p className="panel-heading mb-4">Post to LivePosts {gameActive && hasMovedBoard && "Move made"} {gameActive && (hasMovedBoard || "Make a move")}</p> */}
      <p className="panel-heading mb-4 is-size-5">Live Posts</p>
      <div className='panel-block mb-2  '>
        <div className="columns">
          <div className="column">
            {/* {gameActive || gameOption('Select Game Options', startButtonText, true)}
            {gameActive && gameOption('Playing Tic Tac Toe!', 'Finish Game', false)} */}
            {formOption('Create a Post', 'Create')}
          </div>
          <div className="column">
            <div className={style.post}>
              <h3>{title}</h3>
              <PostAuthor author={author} />
              <TimeAgo timeISO={new Date().toISOString()} />
              <p>{content}</p>
              <ReactionButtons post={{ reactions: {}, slug:"unknown", id: 0, title, userId: 5, userName: author, content, date: new Date().toISOString() }} />
              <Button secondary outline type="button">
                View Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostForm;