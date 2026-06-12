import React from "react";
import type { RequestCS, AcquireCS, ActionByIp, ProcSvc } from "../../types";
import { format, parseISO } from "date-fns";
import styles from './ClientToken.module.scss'
import { selectAllTokenActions, useAppSelector } from "../../store/reducers/store";
import type { CSTokenAction } from "../../store/api/cstokenSlice";

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
  const allActions = useAppSelector(selectAllTokenActions);

  const visibleIps = React.useMemo(
    () => new Set(Object.keys(clientsByIp)),
    [clientsByIp]
  );

  const latestVisibleAction = React.useMemo(
    () => allActions.find(a => visibleIps.has(a.clientIp)) ?? null,
    [allActions, visibleIps]
  );

  //const latestGlobalAction = allActions[0];
  const actionsByClient = React.useMemo(() => {
    const map = new Map<string, CSTokenAction[]>();
    for (const action of allActions) {
      if (!map.has(action.clientIp)) {
        map.set(action.clientIp, []);
      }
      map.get(action.clientIp)!.push(action);
    }

    for (const [_ip, list] of map) {
      list.sort((a, b) => b.seqNo - a.seqNo);
    }

    return map;
  }, [allActions]);

  const latestSeq = latestVisibleAction?.seqNo;
  const latestIp = latestVisibleAction?.clientIp;

  const clientsList = Object.entries(clientsByIp).map(([ip, clientForActions]) => {
    const actions = actionsByClient.get(ip) ?? [];

    const activity = actions.map((activity, index) => {
      // const isHighlighted =
      //   latestGlobalAction?.clientIp === ip &&
      //   latestGlobalAction?.seqNo === activity.seqNo;
      const isHighlighted =
        latestIp === ip && latestSeq === activity.seqNo;

      const highlighted = isHighlighted
        ? styles.highlightedItem
        : styles.unhighlightedItem;

      let activityLabel: string = "";
      let activityDescription: string = "";
      let backgroundItem: string = "";
      let widthItem: string = "";
      let timestamp: string = "";
      // Use discriminated union by checking a unique property of each type
      if ('requestedAt' in activity.payload) {
        // This is a RequestCS
        if ((activity.payload as RequestCS).sourceIp !== ip) {
          backgroundItem = styles.relayedItem;
          activityLabel = 'Relay';
          activityDescription = `${(activity.payload as RequestCS).sourceIp} --> P:${(activity.payload as RequestCS).parentIp}`;
        } else {
          backgroundItem = styles.requestedItem;
          activityLabel = 'Request';
          activityDescription = `${ip} --> P:${activity.payload.parentIp}`;
        }
        widthItem = styles.smallActivity;
        timestamp = activity.payload.requestedAt;

      } else if ('acquiredAt' in activity.payload) {
        // This is an AcquireCS
        backgroundItem = styles.acquiredItem;
        activityLabel = (activity.payload as AcquireCS).sourceIp === ip ? 'Held' : 'Acquire';
        activityDescription = `${activity.payload.ip} <-- P:${activity.payload.sourceIp}`;
        widthItem = styles.smallActivity;
        timestamp = activity.payload.acquiredAt;

      } else if ('processedAt' in activity.payload) {
        // This is an AcquireCS
        backgroundItem = styles.processedItem;
        activityLabel = 'Processed Service';
        activityDescription = `${(activity.payload as ProcSvc).serviceMessage}`;
        widthItem = styles.largeActivity;
        timestamp = activity.payload.processedAt;

      }
      console.log(activity);
      return (
        <div key={`${index}${ip}`} className={`columns is-gapless mb-0 ${backgroundItem} ${highlighted} ${styles.activityItem} ${widthItem}`}>
          <div className="column p-0" >
            <div className="ml-1 is-size-7">
              <label className="has-background-info-light pl-0">{activityLabel}<br /></label>
              {activityDescription}
            </div>
          </div>
          <div className="column is-narrow p-0" style={{ width: "min-content" }}>
            <div className="is-size-7" >
              <label className="has-background-info-light pl-0">Time stamp<br /></label>
              {`${format(parseISO(timestamp), ' hh:mm:ss:SSS ')}`}
              {/* {`${format(parseISO(timestamp), 'P hh:mm:ss:SSS ')}`} */}
            </div>
          </div>
        </div>
      )
    });

    return (
      <tr className="" key={`${clientForActions.client.host}_${clientForActions.client.ip}`}>
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