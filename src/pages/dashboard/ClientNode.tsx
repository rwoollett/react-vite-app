import React, { useEffect, useState } from "react";
import { type ClientCS } from "../../types";
import { parseISO, format } from 'date-fns';
import { useWebSocket } from "../../hooks/use-websocket-context";

type ClientNodeProps = {
  client: ClientCS;
}
const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  const [connected, setConnected] = useState<boolean>(client.connected);
  const [connectedAt, setConnectedAt] = useState<string>(client.connectedAt);
  const [disconnectedAt, setDisconnectedAt] = useState<string>(client.disconnectedAt || new Date().toISOString());
  const { messageQueue } = useWebSocket();
  const [lastProcessedSeq, setLastProcessedSeq] = useState(0);

  useEffect(() => {
    let updatedSeq = lastProcessedSeq;
    for (const { seq, msg } of messageQueue) {
      if (seq > updatedSeq) {
        if (msg.subject === "cstoken_client_Connected" && client.ip === msg.payload.sourceIp) {
          //console.log('client', client.ip, updatedSeq, seq, msg);
          setConnectedAt(msg.payload.connectedAt);
          setConnected(true);
        }

        if (msg.subject === "cstoken_client_Disconnected" && client.ip === msg.payload.sourceIp) {
          //console.log('client', client.ip, updatedSeq, seq, msg);
          setDisconnectedAt(msg.payload.disconnectedAt);
          setConnected(false);
        }
        updatedSeq = seq;
      }
    }
    if (updatedSeq !== lastProcessedSeq) {
      setLastProcessedSeq(updatedSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageQueue, client.ip]);

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title my-0 px-5">{client.name}</p>
      </header>
      <div className="card-content">
        <div className="media my-1">
          <div className="media-content">
            <p className="title is-7">{client.name}</p>
          </div>
        </div>
        <div className="content">
          <p className="is-size-7 my-1"><span className="has-text-weight-light">Node IP: </span>{client.ip}</p>
          <p className="is-size-7 my-0"><span className="has-text-weight-light">{!connected && 'Disconnected:'}{connected && 'Connected:'}<br /></span>
            <time>{connected && `${format(parseISO(connectedAt), 'P p')}`}{!connected && `${format(parseISO(disconnectedAt), 'P p')}`}</time>
          </p>
        </div>
      </div>
    </div >
  );
};

export default ClientNode;
