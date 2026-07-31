import React, { createContext, useEffect, useRef, useState } from "react";
import websocketClient, { type WebSocketClient } from "../client/wsock";
import type {
  WSTTTMessage,
  WSLivePostMessage,
  GatewayMessage,
  AcquireCS,
  ProcSvc,
  RequestCS,
  ConnectedClient,
  DisconnectedClient,
  WSCSTokenMessage
} from "../types";
import { useAppDispatch } from "../store/reducers/store";
import { actionReceived, truncateClient } from '../store/api/cstokenSlice';
import type { WSUserConnectMessage } from "../types/wsuser";

type WebSocketContextType = {
  wsRefGateway: React.RefObject<WebSocketClient | null>;
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

  const wsRefTTT = useRef<WebSocketClient | null>(null);
  const wsRefLivePost = useRef<WebSocketClient | null>(null);

  const wsRefGateway = useRef<WebSocketClient | null>(null);

  const [tttMessageQueue, setTTTMessageQueue] = useState<{ seq: number, msg: WSTTTMessage }[]>([]);
  const [livePostMessageQueue, setLivePostMessageQueue] = useState<{ seq: number, msg: WSLivePostMessage }[]>([]);
  const [, setTTTSeq] = useState(0);
  const [, setLivePostSeq] = useState(0);
  const [lastProcessedCSSeq, setLastProcessedCSSeq] = useState(0);
  const [lastProcessedTTTSeq, setLastProcessedTTTSeq] = useState(0);
  const [lastProcessedLivePostSeq, setLastProcessedLivePostSeq] = useState(0);


  // NetWS Gateway
  useEffect(() => {

    const handleWSUserConnect = (msg: WSUserConnectMessage) => {
      console.log("Gateway WS connected with userId:", msg.payload.userId);

      // You can store this in context if needed:
      // setGatewayUserId(msg.payload.userId);
    };

    const handleAcquireCS = (msg: { subject: "cstoken_token_Acquire"; payload: AcquireCS }) => {
      const { seqNo, acquiredAt, ip } = msg.payload;

      dispatch(actionReceived({
        id: `${ip}_${seqNo}`,
        clientIp: ip,
        seqNo,
        timestamp: acquiredAt,
        subject: msg.subject,
        payload: msg.payload
      }));

      dispatch(truncateClient(ip));
    };

    const handleProcSvc = (msg: { subject: "cstoken_process_Service"; payload: ProcSvc }) => {
      const { seqNo, processedAt, ip } = msg.payload;
      console.log("procsvc handler form ");
      dispatch(actionReceived({
        id: `${ip}_${seqNo}`,
        clientIp: ip,
        seqNo,
        timestamp: processedAt,
        subject: msg.subject,
        payload: msg.payload
      }));

      dispatch(truncateClient(ip));
    };

    const handleRequestCS = (msg: { subject: "cstoken_token_Request"; payload: RequestCS }) => {
      const { seqNo, requestedAt, sourceIp } = msg.payload;

      dispatch(actionReceived({
        id: `${sourceIp}_${seqNo}`,
        clientIp: sourceIp,
        seqNo,
        timestamp: requestedAt,
        subject: msg.subject,
        payload: msg.payload
      }));

      dispatch(truncateClient(sourceIp));
    };

    const handleConnected = (msg: { subject: "cstoken_client_Connected"; payload: ConnectedClient }) => {
      const { seqNo, connectedAt, sourceIp } = msg.payload;

      dispatch(actionReceived({
        id: `${sourceIp}_${seqNo}`,
        clientIp: sourceIp,
        seqNo,
        timestamp: connectedAt,
        subject: msg.subject,
        payload: msg.payload
      }));

      dispatch(truncateClient(sourceIp));
    };

    const handleDisconnected = (msg: { subject: "cstoken_client_Disconnected"; payload: DisconnectedClient }) => {
      const { seqNo, disconnectedAt, sourceIp } = msg.payload;

      dispatch(actionReceived({
        id: `${sourceIp}_${seqNo}`,
        clientIp: sourceIp,
        seqNo,
        timestamp: disconnectedAt,
        subject: msg.subject,
        payload: msg.payload
      }));

      dispatch(truncateClient(sourceIp));
    };

    const handleTTT = (msg: WSTTTMessage) => {
      setTTTSeq(prev => {
        const next = prev + 1;
        setTTTMessageQueue(q =>
          [...q, { seq: next, msg }].slice(-MSG_QUEUE_MAX)
        );
        return next;
      });
    };

    const handleLivePost = (msg: WSLivePostMessage) => {
      setLivePostSeq(prev => {
        const next = prev + 1;
        setLivePostMessageQueue(q =>
          [...q, { seq: next, msg }].slice(-MSG_QUEUE_MAX)
        );
        return next;
      });
    };

    function isCSTokenMessage(msg: GatewayMessage): msg is WSCSTokenMessage {
      return msg.subject.startsWith("cstoken_");
    }

    const handleGatewayMessage = (msg: GatewayMessage) => {
      // WSUserConnectEvent
      if (msg.subject === "ws_user_Connected") {
        handleWSUserConnect(msg);
        return;
      }

      // CSToken
      if (isCSTokenMessage(msg)) {
        switch (msg.subject) {
          case "cstoken_client_Connected":
            handleConnected(msg);
            return;

          case "cstoken_client_Disconnected":
            handleDisconnected(msg);
            return;

          case "cstoken_token_Acquire":
            handleAcquireCS(msg);
            return;

          case "cstoken_token_Request":
            handleRequestCS(msg);
            return;

          case "cstoken_process_Service":
            handleProcSvc(msg);
            return;
        }
      }

      // TTT
      if (msg.subject === "ttt_game_Update") {
        handleTTT(msg);
        return;
      }

      // LivePost
      if (msg.subject === "liveposts_post_Stage") {
        handleLivePost(msg);
        return;
      }

      console.warn("Unknown subject in msg:", msg);
    };

    wsRefGateway.current = websocketClient<GatewayMessage>(
      {
        queryParams: { type: "all" },
        service: "NetWSGateway",
        onMessage: handleGatewayMessage,
        onDisconnect: () => { },
      },
      (client) => { wsRefGateway.current = client; }
    );
    return () => {
      wsRefGateway.current?.close();

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
  }, []);

  return (
    <WebSocketContext.Provider value={{
      wsRefGateway,
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

