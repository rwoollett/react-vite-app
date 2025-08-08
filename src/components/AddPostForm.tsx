import React, { useState } from 'react';
//import { AppDispatch } from '../store/store';
//import { useDispatch } from 'react-redux';
//import { useTypedSelector } from '../features/rootReducer';
import style from './PostsComponent.module.scss';
import Button from './Button';
//import { unwrapResult } from '@reduxjs/toolkit';
//import { addNewPost } from '../features/posts/postsSlice';
//import { selectAllUsers } from '../features/users/usersSlice';

const AddPostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  //  const dispatch = useDispatch<AppDispatch>();

  // const users = useTypedSelector(selectAllUsers);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onContentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.target.value);
  const onAuthorChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, content, userId].every(Boolean) &&
    addRequestStatus === 'idle';

  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending');
        // const resultAction = await dispatch(
        //   addNewPost({ title, content, user: userId })
        // );
        //        unwrapResult(resultAction);
        setTitle('');
        setContent('');
        setUserId('');
      } catch (err) {
        console.error('Failed to save the post: ', err);
      } finally {
        setAddRequestStatus('idle');
      }
    }
  };

  const users = [
    {
      id: "400",
      name: "Mrs. Ryan Adamsh",
    },
    {
      id: "300",
      name: "Natalie Emard",
    }
  ];
  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <form>
      <label htmlFor="postTitle">Post Title</label>
      <input
        type="text"
        id="postTitle"
        name="postTitle"
        value={title}
        onChange={onTitleChanged}
      />

      <label htmlFor="postAuthor">Author:</label>
      <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
        <option value=""></option>
        {usersOptions}
      </select>

      <label htmlFor="postContent">Content</label>
      <textarea
        id="postContent"
        name="postContent"
        value={content}
        onChange={onContentChanged}
      />
      <div className={style['button-container']}>
        <Button secondary outline type="button"
          onClick={onSavePostClicked}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default AddPostForm;