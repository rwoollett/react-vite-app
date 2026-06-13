import React, { useEffect, useState } from 'react';
import type { LivePostPage } from '../types';
import homepage from '../homepage.json';
import { http } from '../utility/fetchData';
import Banner from '../components/Banner';
import PostsComponent from '../components/PostsComponent';
import Button from '../components/Button';
import { useAppDispatch } from '../store/reducers/store';
import { fetchPosts } from '../store/api/postsSlice';
import { useNavigate } from 'react-router';
import { ROUTES } from '../resources/routes-constants';
import { refetchUserByID } from '../store/api/authorUsersSlice';
import { useWebSocket } from "../hooks/use-websocket-context";
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';

const LivePosts: React.FC = () => {
  const { livePostMessageQueue, lastProcessedLivePostSeq, setLastProcessedLivePostSeq } = useWebSocket();
  const { isLoggedIn } = useSignedInAuthorize();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [navCards, setNavCards] = useState<{ title: string; catchPhrase: string; }[]>([]);
  // const [popularCards, setPopularCards] = useState<{ title: string; catchPhrase: string; }[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let updatedSeq = lastProcessedLivePostSeq;
    console.log('\n**client lastProcessedLivePostSeq', updatedSeq);
    for (const { seq, msg } of livePostMessageQueue) {
      if (seq > updatedSeq) {
        // if (msg.subject === "ws_user_Connected") {
        //   setUserId(msg.payload.userId);
        // }
        if (msg.subject === "liveposts_post_Stage") {
          console.log('client', updatedSeq, seq, msg);
          dispatch(fetchPosts());

        }
        updatedSeq = seq;
      }
    }
    console.log('client looped livepost updatesSeq', updatedSeq, lastProcessedLivePostSeq);
    if (updatedSeq !== lastProcessedLivePostSeq) {
      console.log('lastProcessedLivePostSeq', updatedSeq);
      setLastProcessedLivePostSeq(updatedSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePostMessageQueue]);

  useEffect(() => {
    (async () => {
      try {
        const response = await http<LivePostPage>(
          `${import.meta.env.VITE_LIVEPOSTS_URL}/api/v1/livxxeposts/homepage`,
          { method: "GET" });

        const { title, description } = response;
        setTitle(title);
        setDescription(description);
        // setNavCards(navCards);
        // setPopularCards(popularCards);
        setIsFetching(false);
      } catch (err) {
        const error = err as Error;
        console.log(error.message);
        const { title, description } = homepage.homepage;
        console.log("Message page :", title);
        setTitle(title);
        setDescription(description);
        // setNavCards(navCards);
        // setPopularCards(popularCards);
        setIsFetching(false);
      }
    })();
  }, []);

  // const handleOnRefresh = () => {
  //   dispatch(fetchPosts());
  // };

  const toAddPostPage = () => {
    dispatch(refetchUserByID());
    navigate(`${ROUTES.LIVEPOSTS_ROUTE}/create`)
  }

  return (
    isFetching ?
      <div>Fetching home page ...</div> :
      <>
        <Banner title={title} desc={description} />
        <div className='hero'>
          <div className='hero-head'>
            {isLoggedIn &&
              <div className="column is-flex-grow-0 is-size-7">
                <Button type="button" onClick={() => toAddPostPage()} secondary outline>Create Post</Button>
              </div>}
          </div>
          <div className='hero-body p-0'>
            <PostsComponent />
          </div>
        </div>
      </>);

}

export default LivePosts;