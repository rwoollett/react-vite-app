import React, { useEffect, useState } from "react";
import { type ActionByIp, type ClientCS } from "../../types";
import ClientToken from "./ClientToken";
import NetworkList from "./NetworkList";

/**
 * Network list.  
 * Show all network node clients in the range of ports network
 * 
 */

const Dashboard: React.FC = () => {
  const range = { from: 5000, to: 7040 };

  const [data, setData] = useState<{ getClients: ClientCS[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_CSTOKEN_SERVER_URL}/api/v1/cstoken/clients/range/${range.from}/${range.to}`)
      .then(res => res.json())
      .then(json => {
        if (!json || !Array.isArray(json.getClients)) {
          throw new Error("Invalid response format");
        }
        const sortedClients = [...json.getClients].sort((a, b) => a.ip.localeCompare(b.ip));
        //const filteredClients = sortedClients.filter(client => client.connected === true);
        setData({ getClients: sortedClients });
        //console.log(import.meta.env.VITE_CSTOKEN_SERVER_URL, json.getClients);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [range.from, range.to]);

  let networkContent = null;
  let clientContent = null;
  if (loading) {
    networkContent = (<div><p>Loading...</p></div>)
    clientContent = (<div><p>Loading...</p></div>)
  } else if (data) {
    networkContent = (<NetworkList
      clientList={data.getClients as ClientCS[]}
      range={range} />);
    clientContent = (<ClientToken
      range={range}
      clientsByIp={(data.getClients as ClientCS[]).reduce((prev: ActionByIp, client) => {
        prev[client.ip] = { client, actions: [] };
        return prev;
      }, {})} />);
  } else {
    networkContent = (<div><p>No network clients found.</p></div>)
    clientContent = (<div><p>No network clients found.</p></div>)
  }

  return (
    <div className="columns is-multiline">
      <div className="column is-full">
        {networkContent}
      </div>
      <div className="column is-full">
        {clientContent}
      </div>
    </div>
  );

};

export default Dashboard;