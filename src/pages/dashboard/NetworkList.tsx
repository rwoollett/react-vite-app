import React from "react";
import type { ClientCS } from "../../types";
import ClientNode from "./ClientNode";

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
      <div key={`${client.host}_${client.ip}`} className="cell">
        <div  className="panel-block">
          <ClientNode client={client} />
        </div>
      </div>
    );
  });

  // const [errors, setErrors] = useState<JSX.Element | null>(null);

  // const doPostStartRequest = async (props = {}) => {
  //   const body = {};
  //   try {
  //     setErrors(null);
  //     const response = await axios.post('/api/client/start', { ...body, ...props });
  //     return response.data;
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       console.log(err);
  //       // } else {
  //       //   handleUnexpectedError(err);
  //     }
  //   }
  // };

  // const doPostStopRequest = async (props = {}) => {
  //   const body = {};
  //   try {
  //     setErrors(null);
  //     const response = await axios.post('/api/client/stop', { ...body, ...props });
  //     return response.data;
  //   } catch (err) {
  //     if (axios.isAxiosError(err)) {
  //       console.log(err);
  //     }
  //   }
  // };

  return (
    <div className="panel">
      <p className="panel-heading">Network Nodes</p>
      <div className="panel-block">
        <div className="columns is-multiline my-0">
          <p className="is-size-7 my-0 p-0 column is-full">Range of IP for network group is:</p>
          <p className="is-size-7 my-0 p-0 column  is-one-third"><span className="has-text-weight-light">From: </span>{range.from}</p>
          <p className="is-size-7 my-0 p-0 column is-one-third"><span className="has-text-weight-light">To: </span>{range.to}</p>
        </div>
      </div>
      {/* <div className="panel-block">
        <div>
          {errors}
          <div className="fixed-grid has-2-cols">
            <div className="grid buttons are-small">
              <div className="cell">
                <button onClick={() => doPostStartRequest()} className="button  is-info is-light">
                  Start Group
                </button>
              </div>
              <div className="cell">
                <button onClick={() => doPostStopRequest()} className="button  is-info is-light">
                  Stop Group
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* <label className="panel-block">
        <p className="control has-icons-left">
          <input className="input" type="text" placeholder="Search" />
          <span className="icon is-left">
            <GrSearch />
          </span>
        </p>
      </label> */}
      <div className="grid is-gap-0 is-col-min-6">
        {clientsList}
      </div>

    </div>
  );

};

export default NetworkList;