import { createContext, useEffect, useRef, useState } from "react";
import websocketClient, { type WebSocketClient } from "../client/wsock";
import type { WSCSTokenMessage, WSTTTMessage, WSLivePostMessage } from "../types";
import { useAppDispatch } from "../store/reducers/store";
import { actionReceived, truncateClient } from '../store/api/cstokenSlice';

type WebSocketContextType = {
  wsRefCSToken: React.RefObject<WebSocketClient | null>;
  wsRefTTT: React.RefObject<WebSocketClient | null>;
  wsRefLivePost: React.RefObject<WebSocketClient | null>;
  tttMessageQueue: { seq: number, msg: WSTTTMessage }[];
  livePostMessageQueue: { seq: number, msg: WSLivePostMessage }[];
  lastProcessedCSSeq: number;
  setLastProcessedCSSeq: React.Dispatch<React.SetStateAction<number>>;
  lastProcessedLivePostSeq: number;
  setLastProcessedLivePostSeq: React.Dispatch<React.SetStateAction<number>>;
  lastProcessedTTTSeq: number;
  setLastProcessedTTTSeq: React.Dispatch<React.SetStateAction<number>>;
};

const MSG_QUEUE_MAX = 150;
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  const wsRefCSToken = useRef<WebSocketClient | null>(null);
  const wsRefTTT = useRef<WebSocketClient | null>(null);
  const wsRefLivePost = useRef<WebSocketClient | null>(null);
  const updateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [tttMessageQueue, setTTTMessageQueue] = useState<{ seq: number, msg: WSTTTMessage }[]>([]);
  const [livePostMessageQueue, setLivePostMessageQueue] = useState<{ seq: number, msg: WSLivePostMessage }[]>([]);
  const [, setTTTSeq] = useState(0);
  const [, setLivePostSeq] = useState(0);
  const [lastProcessedCSSeq, setLastProcessedCSSeq] = useState(0);
  const [lastProcessedTTTSeq, setLastProcessedTTTSeq] = useState(0);
  const [lastProcessedLivePostSeq, setLastProcessedLivePostSeq] = useState(0);

  useEffect(() => {
    const handleWSMessage = (msg: WSCSTokenMessage) => {
      const clientIp =
        msg.subject === "cstoken_client_Connected" ? msg.payload.sourceIp :
          msg.subject === "cstoken_client_Disconnected" ? msg.payload.sourceIp :
            msg.subject === "cstoken_token_Acquire" ? msg.payload.ip :
              msg.subject === "cstoken_token_Request" ? msg.payload.sourceIp :
                msg.subject === "cstoken_process_Service" ? msg.payload.ip :
                  undefined;

      const seqNo =
        msg.subject === "cstoken_client_Connected" ? msg.payload.seqNo :
          msg.subject === "cstoken_client_Disconnected" ? msg.payload.seqNo :
            msg.subject === "cstoken_token_Acquire" ? msg.payload.seqNo :
              msg.subject === "cstoken_token_Request" ? msg.payload.seqNo :
                msg.subject === "cstoken_process_Service" ? msg.payload.seqNo :
                  undefined;

      const timestamp =
        'requestedAt' in msg.payload ? msg.payload.requestedAt :
          'acquiredAt' in msg.payload ? msg.payload.acquiredAt :
            'processedAt' in msg.payload ? msg.payload.processedAt :
              'connectedAt' in msg.payload ? msg.payload.connectedAt :
                'disconnectedAt' in msg.payload ? msg.payload.disconnectedAt :
                  null;

      if (!seqNo || !clientIp || !timestamp) return;

      dispatch(actionReceived({
        id: `${clientIp}_${seqNo}`,
        clientIp,
        seqNo,
        timestamp,
        subject: msg.subject,
        payload: msg.payload
      }));

      dispatch(truncateClient(clientIp));
    }


    wsRefCSToken.current = websocketClient<WSCSTokenMessage>(
      {
        queryParams: { type: "all" },
        service: "CSToken",
        onMessage: handleWSMessage,
        onDisconnect: () => { },
      },
      (client) => { wsRefCSToken.current = client; }
    );
    return () => {
      wsRefCSToken.current?.close();
      if (updateTimer.current) clearTimeout(updateTimer.current);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    wsRefTTT.current = websocketClient<WSTTTMessage>(
      {
        queryParams: { type: "all" },
        service: "TTT",
        onMessage: (msg) => {
          setTTTSeq(prevSeq => {
            const nextSeq = prevSeq + 1;
            setTTTMessageQueue(
              q => [...q, { seq: nextSeq, msg }]
                .slice(-MSG_QUEUE_MAX)
            );
            return nextSeq;
          });
        },
        onDisconnect: () => { },
      },
      (client) => { wsRefTTT.current = client; }
    );
    return () => wsRefTTT.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    wsRefLivePost.current = websocketClient<WSLivePostMessage>(
      {
        queryParams: { type: "all" },
        service: "LivePost",
        onMessage: (msg) => {
          setLivePostSeq(prevSeq => {
            const nextSeq = prevSeq + 1;
            setLivePostMessageQueue(
              q => [...q, { seq: nextSeq, msg }]
                .slice(-MSG_QUEUE_MAX)
            );
            return nextSeq;
          });
        },
        onDisconnect: () => { },
      },
      (client) => { wsRefLivePost.current = client; }
    );
    return () => wsRefLivePost.current?.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WebSocketContext.Provider value={{
      wsRefCSToken,
      wsRefTTT,
      wsRefLivePost,
      lastProcessedCSSeq,
      setLastProcessedCSSeq,
      tttMessageQueue,
      lastProcessedTTTSeq,
      setLastProcessedTTTSeq,
      livePostMessageQueue,
      lastProcessedLivePostSeq,
      setLastProcessedLivePostSeq
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;

