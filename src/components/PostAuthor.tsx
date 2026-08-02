import { type JSX } from 'react';
import style from './PostsComponent.module.css';

const PostAuthor = ({ author }: { author: string}):JSX.Element => {
  return (<span className={style.author}>by {
    author ? author : 'Unknown author'}</span>);
};

export default PostAuthor;