export type WSUserConnect = {
  userId: string;
};

export type WSUserConnectMessage = {
  subject: "ws_user_Connected";
  payload: WSUserConnect;
};

