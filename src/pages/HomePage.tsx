import React, { useEffect, useRef, useState } from 'react'
import useSignedInAuthorize from '../hooks/use-signedin-authenticate';
import { useWebSocket } from '../hooks/use-websocket-context';
import Banner from '../components/Banner';
import { selectAllTokenActions, useAppSelector } from "../store/reducers/store";

const HomePage: React.FC = () => {
  const { isLoggedIn, email } = useSignedInAuthorize();
  const { wsRefCSToken: wsRef } = useWebSocket();
  const [connected, setConnected] = useState(wsRef.current?.client !== undefined);
  const [received, setReceived] = useState<string[]>([]);
  const lastProcessedSeq = useRef(0);

  const allActions = useAppSelector(state =>
    selectAllTokenActions(state)
  );
  // const handleSendMessage = () => {
  //   const { payload } = { payload: latestTimestamp };
  //   if (wsRef.current && connected) {
  //     wsRef.current.send({ payload });
  //   } else {
  //     console.log('WebSocket is not connected');
  //   }
  // };

  useEffect(() => {
    if (allActions.length === 0) return;

    for (const action of allActions) {
      if (action.seqNo > lastProcessedSeq.current) {
        setConnected(true);
        setReceived(prev => {
          return [...prev].concat(action.seqNo as unknown as string);
        });
        lastProcessedSeq.current = action.seqNo;
      }
    }

  }, [allActions]);

  return (<>
    <Banner title="Net Processor Dashboard" desc="Show the activity of net processor clients by the IP identifier" />
    <div className='hero'>
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
        <div className="container is-fluid">
        </div>
      </div>
    </div>
  </>
  )
}

export default HomePage

