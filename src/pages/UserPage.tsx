import React, { useEffect, useRef, useState, type FormEvent } from 'react'
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import { useAppSelector } from '../store/reducers/store';
import Greeting from '../components/Greeting';
import { sayFarewell } from '../utility/functions';
import Button from '../components/Button';
import { useWebSocket } from '../hooks/use-websocket-context';
import Dashboard from './dashboard/Dashboard';


const UserPage: React.FC = () => {
  const [farewell, setFarewell] = useState("");
  const { isLoggedIn, email } = useSignedInAuthorize();
  const { wsRef, messageQueue } = useWebSocket();
  const [connected, setConnected] = useState(wsRef.current?.client !== undefined);
  const [received, setReceived] = useState<string[]>([]);
  //const latestTimestamp = 'something';
  const lastProcessedSeq = useRef(0);

  const contents = useAppSelector((state) => {
    return state.data.contents;
  });

  // const handleSendMessage = () => {
  //   const { payload } = { payload: latestTimestamp };
  //   if (wsRef.current && connected) {
  //     wsRef.current.send({ payload });
  //   } else {
  //     console.log('WebSocket is not connected');
  //   }
  // };

  useEffect(() => {
    console.log('userpage updated messagequeue', lastProcessedSeq, messageQueue);
    for (const { seq, msg } of messageQueue) {
      if (seq > lastProcessedSeq.current) {
        setConnected(true);
        setReceived(prev => {
          return [...prev].concat(msg.payload as unknown as string);
        });
        lastProcessedSeq.current = seq;
      }
    }
  }, [messageQueue]);

  const onHandleGreet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFarewell(sayFarewell(contents[0]));
  };

  return (
    <div className='hero is-fullheight-with-navbar'>
      <div className='hero-head'>
        <header>
          {isLoggedIn && (
            <div className='mt-0 columns has-background-info-light'>
              <div className="column is-narrow">
                <div className="is-size-6">Welcome, <b>{email}</b>!</div>
              </div>
              <div className="column is-narrow">
                <span className={`tag ${connected ? 'is-success' : 'is-danger'}`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {/* <div className="column">
                <button type="button" className="tag is-link" onClick={handleSendMessage}>Send</button>
              </div> */}
              <div className="column is-narrow">
                <span className={`tag ${received.length > 0 ? 'is-warning' : 'is-info'}`}>
                  {received.length > 0 ? `Received ${received.length} notifications` : 'No new notifications'}
                </span>
              </div>
            </div>
          )}
        </header>
      </div>

      <div className='hero-body'>
        <div className="container is-widescreen">
          <form onSubmit={onHandleGreet}>

            <div className="field is-grouped">
              <div className="control">
                <Button primary type="submit">Greet</Button>
              </div>
            </div>

            <div className='block'>
              {isLoggedIn && <Greeting name={`${contents}`} />}
              <p>{farewell}</p>
            </div>
          </form>
          <div className="px-4 pb-6">
            <Dashboard />
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserPage

