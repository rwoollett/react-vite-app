import React, { type JSX } from 'react';
import style from './HomeNavigation.module.scss';
import Card from  './Card';
import type { FlashCard } from '../types';

const HomeNavigation: React.FC<{cards: FlashCard[]}> = (
     {cards}): JSX.Element => {

  return (<div className={style['home-nav']}>
    {
       cards.map( (card: FlashCard, i:number):JSX.Element => 
        (
          <Card key={i} title={card.title} catchPhrase={card.catchPhrase}/>
        )
      ) 
    }
  </div>);
};

export default HomeNavigation;