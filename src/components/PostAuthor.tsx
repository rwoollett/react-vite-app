import { type JSX } from 'react';
//import {useTypedSelector} from '../features/rootReducer';
//import {selectUserById } from '../features/users/usersSlice';
import style from './PostsComponent.module.scss';

const PostAuthor = ({ userId }: { userId:string}):JSX.Element => {
  //const author = useTypedSelector(state => selectUserById(state, userId));
  console.log (userId);
  const author = {
          id: "400",
          name: "Mrs. Ryan Adamsh",
        };
  return (<span className={style.author}>by {
    author ? author.name : 'Unknown author'}</span>);
};

export default PostAuthor;