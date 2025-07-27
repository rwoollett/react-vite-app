
/** A client ip takes ownership of CS token from the sourceIp */
export type AcquireCS = {
  acquiredAt: string;
  ip: string;
  sourceIp: string;
};

/** Clients to request and acquire the single token for CS */
export type ClientCS = {
  connected: boolean;
  connectedAt: string;
  disconnectedAt: string;
  host: string;
  id: number;
  ip: string;
  name: string;
  processId?: string | null;
  /** The client ip associated request parent record(always the same two record using ip) */
  requestParent: RequestParent;
};

/** Connected client to an ip on network CS */
export type ConnectedClient = {
  connectedAt: string;
  processId: string;
  sourceIp: string;
};

/** Disconnected client from an ip on network CS */
export type DisconnectedClient = {
  disconnectedAt: string;
  sourceIp: string;
};


/** Port range for list of clients. Ie. all from 5010 to 5020 (from and to) */
export type RangePort = {
  from: number;
  to: number;
};

/**
 * A request for CS from a client source ip to its currently known parent ip in the distributed tree
 * If relayed Request, it is because a parentIP was not the root, or is unreachable.
 * The originalIp is the real client wanting to enter CS and acquire token.
 * And when relayed, the sourceIp was the parent ip of the previous relayed sourceIp.
 *
 */
export type RequestCS = {
  originalIp: string;
  parentIp: string;
  relayed: boolean;
  requestedAt: string;
  sourceIp: string;
};

/** Clients to request and acquire the single token for CS */
export type RequestParent = {
  clientIp: string;
  id: number;
};


export type WSMessage =
  | { subject: "clientCS_Connected"; payload: ConnectedClient }
  | { subject: "clientCS_Disconnected"; payload: DisconnectedClient }
  | { subject: "csToken_acquire"; payload: AcquireCS }
  | { subject: "csToken_request"; payload: RequestCS };


// export type Subscription = {
//   __typename?: 'Subscription';
//   acquireCS_Created?: Maybe<AcquireCs>;
//   clientCS_Connected?: Maybe<ConnectedClient>;
//   clientCS_Disconnected?: Maybe<DisconnectedClient>;
//   requestCS_Created?: Maybe<RequestCs>;
// };


// export type SubscriptionClientCs_ConnectedArgs = {
//   sourceIp: Scalars['String']['input'];
// };


// export type SubscriptionClientCs_DisconnectedArgs = {
//   sourceIp: Scalars['String']['input'];
// };

// export type GetClientsQueryVariables = Exact<{
//   range: RangePort;
// }>;


