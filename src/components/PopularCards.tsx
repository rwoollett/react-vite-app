import React, { type JSX } from 'react';
import style from './PopularCards.module.scss';
import Card from './Card';
import type { FlashCard } from '../types';

const PopularCards: React.FC<{cards: FlashCard[]}> = (
     {cards}): JSX.Element => {

  return (<div className={style.popular}>
    <h2>Popular Laboratories</h2>
    <p>Select a laboratory and explore the algorithm 
      with the program and input data.</p>
    <div className={style['popular-labs']}>
      {
        cards.map( (card: FlashCard, i:number):JSX.Element => 
          (
            <Card key={i} title={card.title} catchPhrase={card.catchPhrase}/>
          )
        ) 
      }
    </div>
  </div>);
};

export default PopularCards;