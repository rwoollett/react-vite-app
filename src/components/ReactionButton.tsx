import { type JSX } from 'react';
//import { Post } from '../features/posts/types';
import type { Post, ReactionEmoji } from '../types';
import style from './Card.module.scss';
//import {useDispatch} from 'react-redux';
//import { reactionAdded } from '../features/posts/postsSlice';
//import { Button } from '@mantine/core';


const reactionEmoji:ReactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

export const ReactionButtons = ({ post }: {post:Post}):JSX.Element => {
 // const dispatch = useDispatch();
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button key={name} type="button" 
        className={style["reaction-button"]}>
        {/* // onClick={() => 
        //   dispatch(reactionAdded({
        //     postId: post.id,
        //     reaction: name
        //   }))
        // } */}
        
        {emoji}&nbsp;{post.reactions[name]} 
      </button>
    );
  });

  return <div className={style.reaction}>{reactionButtons}</div>;
};