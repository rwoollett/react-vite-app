import queryString from 'query-string';

interface Message {
  [key: string]: string;
}

interface WebSocketClientOptions<T> {
  onDisconnect?: () => void;
  onMessage?: (payload: T) => void;
  queryParams?: Message;
  service?: string;
}

export interface WebSocketClient {
  client: WebSocket;
  send: (payload: Message) => void;
  close: () => void;
}

const websockets = {
  url: "ws://localhost",
  //produrl: (process.env.NODE_ENV === 'production' && ENV.host && `ws://${ENV.host}`) || ""
};

const wsUrl = (service: string) => {
  if (service === 'TTT') {
    return `${websockets.url}:3009`;
  } else if (service === 'CSToken') {
    return `${websockets.url}:3003`;
  } else {
    return `${websockets.url}:3003`;
  }
}

const websocketClient = <T>(
  options: WebSocketClientOptions<T> = {},
  onConnect: (client: WebSocketClient) => void
): WebSocketClient => {
  let url = wsUrl("CSToken");
  if (options.service) {
    url = wsUrl(options.service)
  }
  if (options.queryParams) {
    url = `${url}?${queryString.stringify(options.queryParams)}`;
  }

  let client: WebSocket | null = new WebSocket(url);

  const connection: WebSocketClient = {
    client,
    send: (payload = {}) => {
      if (options.queryParams) {
        payload = { ...payload, ...options.queryParams };
      }

      return client?.send(JSON.stringify(payload));
    },
    close: () => {
      client?.close();
    }
  };

  client.addEventListener("open", () => {
    if (onConnect) onConnect(connection);
  });

  client.addEventListener("close", () => {
    client = null;

    if (options?.onDisconnect) {
      options.onDisconnect();
    }
  });

  client.addEventListener("message", (event) => {
    if (event?.data && options.onMessage) {
      options.onMessage(JSON.parse(event.data));
    }
  });

  return connection;

};

export default websocketClient;