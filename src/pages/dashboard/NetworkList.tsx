import React from "react";
import type { ClientCS } from "../../types";
import ClientNode from "./ClientNode";
import Button from "../../components/Button";

/**
 * Network list.
 * Show all network node clients in the range of ports network
 */
type NetworkListProps = {
  clientList: ClientCS[];
  range: {
    from: number;
    to: number;
  }
}

const NetworkList: React.FC<NetworkListProps> = ({ clientList, range }) => {

  const clientsList = clientList.map((client) => {
    return (
      <div key={`${client.host}_${client.ip}`} className="cell mb-2">
        {/* <div className="panel-block"> */}
        <ClientNode client={client} />
        {/* </div> */}
      </div>
    );
  });

  //const [errors, setErrors] = useState<JSX.Element | null>(null);

  const doPostStartRequest = async (props = {}) => {
    const body = {};
    console.log(body, props);
    // try {
    //   setErrors(null);
    //   const response = await axios.post('/api/client/start', { ...body, ...props });
    //   return response.data;
    // } catch (err) {
    //   if (axios.isAxiosError(err)) {
    //     console.log(err);
    //     // } else {
    //     //   handleUnexpectedError(err);
    //   }
    // }
  };

  const doPostStopRequest = async (props = {}) => {
    const body = {};
    console.log(body, props);
    // try {
    //   setErrors(null);
    //   const response = await axios.post('/api/client/stop', { ...body, ...props });
    //   return response.data;
    // } catch (err) {
    //   if (axios.isAxiosError(err)) {
    //     console.log(err);
    //   }
    // }
  };

  return (
    <div className="panel">
      <p className="panel-heading">Network Nodes</p>
      <div className="panel-block">
        <div className="content">
          <p className="is-size-7 has-text-weight-bold ">Range of IP: <span className="has-text-weight-light">From {range.from} to {range.to}</span>. </p>
          {/* <p className="is-size-7 "> </p>
          <p className="is-size-7 "> </p> */}
        </div>
      </div>
      <div className="panel-block">
        <div>
          <div className="fixed-grid has-2-cols">
            <div className="grid">
              {/* <p className="is-size-7 my-0 p-0 cell is-col-span-3">Range&nbsp;of&nbsp;IP:</p>
              <p className="is-size-7 my-0 p-0 cell"><span className="has-text-weight-light">From: </span>{range.from}</p>
              <p className="is-size-7 my-0 p-0 cell"><span className="has-text-weight-light">To: </span>{range.to}</p> */}
              <div className="cell is-size-7">
                <Button secondary outline type="button" onClick={() => doPostStartRequest()}>
                  Only&nbsp;Connected
                </Button>
              </div>
              <div className="cell is-size-7">
                <Button secondary outline type="button" onClick={() => doPostStopRequest()}>
                  Show&nbsp;All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <label className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <GrSearch />
          </span>
        </p>
      </label> */}
      {/* <div className="panel-block"> */}
      <div className="grid is-gap-1 m-2">
        {clientsList}
      </div>
    </div>
    // </div>
  );

};

export default NetworkList;