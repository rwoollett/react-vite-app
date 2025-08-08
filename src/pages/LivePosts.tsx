import React, { useEffect, useState } from 'react';
//import style from '../scss/labshome.scss';
//import PopularCards from './PopularCards';
import type { LivePostPage } from '../types';
import homepage from '../homepage.json';
import { http } from '../utility/fetchData';
import Banner from '../components/Banner';
import HomeNavigation from '../components/HomeNavigation';
import PopularCards from '../components/PopularCards';
import PostsComponent from '../components/PostsComponent';
//import PostsComponent from './PostsComponent';
//import { stringify } from 'querystring';
//const HomeNavigation = lazy(() => import('./HomeNavigation'));

const LivePosts: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [navCards, setNavCards] = useState<{ title: string; catchPhrase: string; }[]>([]);
  const [popularCards, setPopularCards] = useState<{ title: string; catchPhrase: string; }[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await http<LivePostPage>(
          '/api/v1/homepage',
          { method: "GET" });

        const { title, description, navCards, popularCards } = response;
        setTitle(title);
        setDescription(description);
        setNavCards(navCards);
        setPopularCards(popularCards);
        setIsFetching(false);
      } catch (err) {
        const error = err as Error;
        console.log(error.message);
        const { title, description, navCards, popularCards } = homepage.homepage;
        console.log("Message page :", title);
        setTitle(title);
        setDescription(description);
        setNavCards(navCards);
        setPopularCards(popularCards);
        setIsFetching(false);
      }
    })();
  }, []);

  return (
    isFetching ?
      <div>Fetching home page ...</div> :
      <>
        <Banner title={title} desc={description} />
        <div className='hero is-fullheight-with-navbar'>
          <div className='hero-head'>
            <HomeNavigation cards={navCards} />
          </div>

          <div className='hero-body'>
            <div className="container is-fluid">
              <PostsComponent />
              <PopularCards cards={popularCards} />
            </div>
          </div>
        </div>
      </>);

}

export default LivePosts;