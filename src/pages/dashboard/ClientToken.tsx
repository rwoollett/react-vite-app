import React, { useEffect, useState } from "react";
import _ from 'lodash';
import type { ClientCS, RequestCS, AcquireCS, ActionByIp, TokenAction } from "../../types";
import { format, parseISO } from "date-fns";
import { useWebSocket } from "../../hooks/use-websocket-context";
import styles from './ClientToken.module.scss'

/**
 * Client Token activity on CSToken Network.
 * Show all network activity for clients connected in the range of ports on network
 * 
 */
type ClientTokenProps = {
  range: {
    from: number;
    to: number;
  };
  clientsByIp: ActionByIp;
}

const ClientToken: React.FC<ClientTokenProps> = ({ clientsByIp }) => {
  const { messageQueue } = useWebSocket();
  const [lastProcessedSeq, setLastProcessedSeq] = useState(0);
  const [clientActions, setClientActions] = useState<ActionByIp>(clientsByIp);
  const [lastActivity, setLastActivity] = useState<TokenAction | undefined>(undefined);

  useEffect(() => {
    let updatedSeq = lastProcessedSeq;
    for (const { seq, msg } of messageQueue) {
      if (seq > updatedSeq) {
        if (msg.subject === "csToken_request") {
          const event = msg.payload;
          setLastActivity(() => {
            if (event.sourceIp) {
              return {
                parentIp: event.parentIp,
                timestamp: event.requestedAt,
                originalIp: event.originalIp,
                action: event as RequestCS
              } as TokenAction
            }
          });

          setClientActions((state) => {
            if (event.sourceIp) {

              let clientForActivityIP: string = "";
              if (event.originalIp === event.sourceIp) {
                clientForActivityIP = event.sourceIp;
              } else {
                clientForActivityIP = event.originalIp;
              }

              const newState = {
                ..._.cloneDeep(state),
                [clientForActivityIP]: {
                  client: { ..._.cloneDeep(state[clientForActivityIP].client as ClientCS) },
                  actions: [..._.cloneDeep(state[clientForActivityIP].actions),
                  {
                    parentIp: event.parentIp,
                    timestamp: event.requestedAt,
                    originalIp: event.originalIp,
                    action: event as RequestCS
                  } as TokenAction
                  ].slice(-10)
                }
              } as ActionByIp;

              return newState;

            } else {

              return { ...state };
            }
          });

        }
        if (msg.subject === "csToken_acquire") {
          const event = msg.payload;
          setLastActivity(() => {
            if (event.ip) {
              return {
                parentIp: event.sourceIp,
                timestamp: event.acquiredAt,
                originalIp: event.ip,
                action: event as AcquireCS
              } as TokenAction
            }
          });

          setClientActions((state) => {
            if (event.ip) {

              let clientForActivityIP: string = event.ip;

              const newState = {
                ..._.cloneDeep(state),
                [clientForActivityIP]: {
                  client: { ..._.cloneDeep(state[clientForActivityIP].client as ClientCS) },
                  actions: [..._.cloneDeep(state[clientForActivityIP].actions),
                  {
                    parentIp: event.sourceIp,
                    timestamp: event.acquiredAt,
                    originalIp: event.ip,
                    action: event as AcquireCS
                  } as TokenAction
                  ].slice(-10)
                }
              } as ActionByIp;

              return newState;

            } else {

              return { ...state };
            }
          });
        }
        updatedSeq = seq;
      }
    }
    if (updatedSeq !== lastProcessedSeq) {
      setLastProcessedSeq(updatedSeq);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageQueue]);


  const clientsList = Object.entries(clientActions).map(([ip, action]) => {
    const activity = action.actions.map((activity, index) => {

      // Highlight last activity in the table of client token activity.
      let highlighted: string = "";
      let activityLabel: string = "";
      let activityDescription: string = "";
      if (lastActivity && (lastActivity?.timestamp === activity.timestamp)) {
        highlighted = styles.highlightedItem;
      } else {
        highlighted = styles.unhighlightedItem;
      }

      let backgroundItem: string = "";
      // Use discriminated union by checking a unique property of each type
      if ('requestedAt' in activity.action) {
        // This is a RequestCS
        if ((activity.action as RequestCS).sourceIp !== ip) {
          backgroundItem = styles.relayedItem;
          activityLabel = 'Relay';
          activityDescription = `${(activity.action as RequestCS).sourceIp} --> P:${(activity.action as RequestCS).parentIp}`;
        } else {
          backgroundItem = styles.requestedItem;
          activityLabel = 'Request';
          activityDescription = `${ip} --> P:${activity.parentIp}`;
        }
      } else if ('acquiredAt' in activity.action) {
        // This is an AcquireCS
        backgroundItem = styles.acquiredItem;
        activityLabel = 'Acquire';
        activityDescription = `${activity.originalIp} <-- P:${activity.parentIp}`;
      }

      return (
        <div key={`${index}${ip}`} className={`columns is-gapless mb-0 ${backgroundItem} ${highlighted} ${styles.activityItem}`}>
          <div className="column is-narrow p-0" style={{ width: "min-content" }}>
            <div className="is-size-7" >
              <label className="has-background-info-light pl-0">Time stamp<br /></label>
              {`${format(parseISO(activity.timestamp), 'P hh:mm:ss:SSS ')}`}
            </div>
          </div>
          <div className="column p-0" >
            <div className="ml-1 is-size-7">
              <label className="has-background-info-light pl-0">{activityLabel}<br /></label>
              {activityDescription}
            </div>
          </div>
        </div>
      )
    });

    return (
      <tr className="" key={`${action.client.host}_${action.client.ip}`}>
        <td>
          {ip}
        </td>
        <td>
          <div className={styles.flexActivity}>
            {activity}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="panel">
      <p className="panel-heading">Client Token Activity</p>
      <div className="panel-block table-container">
        <table className="table is-narrow is-striped is-bordered my-0">
          <thead>
            <tr>
              <th><p className="is-size-6 my-0"><span className="has-text-weight-light">Client IP</span></p></th>
              <th><p className="is-size-6 my-0"><span className="has-text-weight-light">Token Activity</span></p></th>
            </tr>
          </thead>
          <tbody>
            {clientsList}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientToken;