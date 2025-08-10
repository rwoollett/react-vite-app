import { type JSX } from 'react';
import {parseISO, formatDistanceToNow} from 'date-fns';
import style from './PostsComponent.module.scss';

const TimeAgo = ({ timeISO }: { timeISO:string }):JSX.Element => {
  let timeAgo = '';
  if (timeISO) {
    const date = parseISO(timeISO);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }
  return (<span title={timeISO} className={style.timePosted}>
      &nbsp;<i>{timeAgo}</i>
    </span>);
};

export default TimeAgo;