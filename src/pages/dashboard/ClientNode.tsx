import React, { useEffect, useState } from "react";
import { type ClientCS, type ConnectedClient, type DisconnectedClient } from "../../types";
import { parseISO, format } from 'date-fns';
import { useWebSocket } from "../../hooks/use-websocket-context";
import { selectNewActionsForClient, useAppSelector } from "../../store/reducers/store";

type ClientNodeProps = {
  client: ClientCS;
}
const ClientNode: React.FC<ClientNodeProps> = ({ client }) => {
  const [connected, setConnected] = useState<boolean>(client.connected);
  const [connectedAt, setConnectedAt] = useState<string>(client.connectedAt);
  const [disconnectedAt, setDisconnectedAt] = useState<string>(client.disconnectedAt || new Date().toISOString());
  const { lastProcessedCSSeq, setLastProcessedCSSeq } = useWebSocket();

  const newActions = useAppSelector(state =>
    selectNewActionsForClient(state, client.ip, lastProcessedCSSeq)
  );

  useEffect(() => {
    if (newActions.length === 0) return;

    let updatedSeq = lastProcessedCSSeq;

    for (const action of newActions) {
      if (action.subject === "cstoken_client_Connected") {
        const payload = action.payload as ConnectedClient;
        setConnectedAt(payload.connectedAt);
        setConnected(true);
      }

      if (action.subject === "cstoken_client_Disconnected") {
        const payload = action.payload as DisconnectedClient;
        setDisconnectedAt(payload.disconnectedAt);
        setConnected(false);
      }

      updatedSeq = action.seqNo;
    }

    setLastProcessedCSSeq(updatedSeq);
  }, [newActions, client.ip]);

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
