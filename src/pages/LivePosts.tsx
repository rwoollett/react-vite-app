import React, { useEffect, useState } from 'react';
import type { LivePostPage } from '../types';
import homepage from '../homepage.json';
import { http } from '../utility/fetchData';
import Banner from '../components/Banner';
import HomeNavigation from '../components/HomeNavigation';
import PostsComponent from '../components/PostsComponent';
import Button from '../components/Button';
import { useAppDispatch } from '../store/reducers/store';
import { fetchPosts } from '../store/api/postsSlice';
import { useNavigate } from 'react-router';
import { ROUTES } from '../resources/routes-constants';

const LivePosts: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [navCards, setNavCards] = useState<{ title: string; catchPhrase: string; }[]>([]);
  //const [popularCards, setPopularCards] = useState<{ title: string; catchPhrase: string; }[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await http<LivePostPage>(
          `${import.meta.env.VITE_LIVEPOSTS_URL}/api/v1/liveposts/homepage`,
          { method: "GET" });

        const { title, description, navCards } = response;
        setTitle(title);
        setDescription(description);
        setNavCards(navCards);
        // setPopularCards(popularCards);
        setIsFetching(false);
      } catch (err) {
        const error = err as Error;
        console.log(error.message);
        const { title, description, navCards } = homepage.homepage;
        console.log("Message page :", title);
        setTitle(title);
        setDescription(description);
        setNavCards(navCards);
        //  setPopularCards(popularCards);
        setIsFetching(false);
      }
    })();
  }, []);

  const handleOnRefresh = () => {
    dispatch(fetchPosts());
  };

  const toAddPostPage = () => {
    navigate(ROUTES.LIVEPOSTS_ROUTE)
  }

  return (
    isFetching ?
      <div>Fetching home page ...</div> :
      <>
        <Banner title={title} desc={description} />
        <div className='hero is-fullheight-with-navbar'>
          <div className='hero-head'>
            <HomeNavigation cards={navCards} />

          </div>

          <div className='hero-body p-0'>
            <div className="columns is-mobile is-justify-content-start" >
              <div className="column is-flex-grow-0 is-size-7">
                <Button type="button" onClick={handleOnRefresh} secondary outline>Refresh Posts</Button>
              </div>
              <div className="column is-flex-grow-0 is-size-7">
                <Button type="button" onClick={() => toAddPostPage()} secondary outline>Create Post</Button>
              </div>
            </div>
          </div>
          <div className='hero-body p-0'>
            <PostsComponent />
            {/* <PopularCards cards={popularCards} /> */}
          </div>
        </div>
      </>);

}

export default LivePosts;