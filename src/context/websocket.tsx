import { createContext, useEffect, useRef, useState } from "react";
import websocketClient, { type WebSocketClient } from "../client/wsock";
import type { WSMessage, WSTTTMessage } from "../types";

type WebSocketContextType = {
  wsRef: React.RefObject<WebSocketClient | null>;
  wsRefTTT: React.RefObject<WebSocketClient | null>;
  messageQueue: { seq: number, msg: WSMessage }[];
  tttMessageQueue: { seq: number, msg: WSTTTMessage }[];
};

const MSG_QUEUE_MAX = 150;
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wsRef = useRef<WebSocketClient | null>(null);
  const wsRefTTT = useRef<WebSocketClient | null>(null);
  const [messageQueue, setMessageQueue] = useState<{ seq: number, msg: WSMessage }[]>([]);
  const messageBuffer = useRef<{ seq: number, msg: WSMessage }[]>([]);
  const updateTimer = useRef<NodeJS.Timeout | null>(null);
  const [tttMessageQueue, setTTTMessageQueue] = useState<{ seq: number, msg: WSTTTMessage }[]>([]);
  const [, setSeq] = useState(0);
  const [, setTTTSeq] = useState(0);
  useEffect(() => {
    console.log("PROVIDER messageQueue updated:", messageQueue);
  }, [messageQueue]);
  
  useEffect(() => {
    wsRef.current = websocketClient<WSMessage>(
      {
        queryParams: { type: "all" },
        service: "CSToken",
        onMessage: (msg) => {
          setSeq(prevSeq => {
            const nextSeq = prevSeq + 1;
            messageBuffer.current.push({ seq: nextSeq, msg });
            if (!updateTimer.current) {
              updateTimer.current = setTimeout(() => {
                const buffered = [...messageBuffer.current]; // need to get const buffered before setting react state with it.
                console.log('set message queue state', buffered);
                setMessageQueue(q =>
                  [...q, ...buffered].slice(-MSG_QUEUE_MAX)
                );
                messageBuffer.current = [];
                updateTimer.current = null;
              }, 100); // update every 100ms
            }
            return nextSeq;
          });
        },
        onDisconnect: () => { },
      },
      (client) => { wsRef.current = client; }
    );
    return () => {
      wsRef.current?.close();
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

  return (
    <WebSocketContext.Provider value={{ wsRef, wsRefTTT, messageQueue, tttMessageQueue }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;

