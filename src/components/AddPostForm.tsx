import React, { useEffect, useState, type FormEvent } from 'react';
import style from './AddPostForm.module.scss';
import Button from './Button';
import { selectIdByAuth, useAppDispatch, useAppSelector } from '../store/reducers/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { addNewPost } from '../store/api/postsSlice';
import { addNewUser } from '../store/api/authorUsersSlice';
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
    <div className="panel ml-3 mb-4">
      <p className="panel-heading mb-4 is-size-7">{formTitle}</p>

      <div className="panel-block is-block">
        <form onSubmit={onSavePostClicked} className={style.postFormGrid}>

          {/* LEFT SIDE */}
          <div className={style.leftSide}>
            <div className="field">
              <label className="label">Post Title</label>
              <div className="control">
                <input
                  className="input"
                  id="postTitle"
                  name="postTitle"
                  type="text"
                  value={title}
                  onChange={onTitleChanged}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Author</label>
              <div className="control">
                <input
                  className="input is-static"
                  id="postAuthor"
                  name="postAuthor"
                  type="text"
                  value={author}
                  onChange={onAuthorChanged}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className={style.rightSide}>
            <div className="field">
              <label className="label">Content</label>
              <div className="control">
                <textarea
                  className="textarea has-fixed-size"
                  rows={14}
                  id="postContent"
                  name="postContent"
                  value={content}
                  onChange={onContentChanged}
                />
              </div>
            </div>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="form-footer">
            <Button secondary outline type="submit">{buttonText}</Button>
          </div>

        </form>
      </div>
    </div>
  );

  return formOption('Live Posts - Create Post', 'Create');

};

export default AddPostForm;