import React, { type JSX } from 'react';
import style from './Card.module.scss';
import { Link } from 'react-router-dom';
import type { FlashCard } from '../types';
  

const Card: React.FC<FlashCard> = (
    {title, catchPhrase, link, author, timeAgo, reactEmoji}
  ): JSX.Element => {
  return (
    <div className={style.card}>
      <div>
        <h3>{title}</h3>
        { author ? author : '' }
        { timeAgo ? timeAgo : '' }
        <p>{catchPhrase}</p>
        { reactEmoji ? reactEmoji : "" }
        <div className={style['button-container']}>
          { link ? <Link to={link.to}>
            {link.text}
          </Link> : "" }
        </div>
      </div>
   </div>);
};

export default Card;
