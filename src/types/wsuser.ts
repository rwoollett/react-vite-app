export type WSUserConnect = {
  wsId: string;
};

export type WSUserAuth = {
  wsId: string;
  token: string;
};

export type WSUserMessage = {
  wsId: string;
  message: string;
};

export type WSMessageQueryParams = {
  [key: string]: string;
}

export type WSUserConnectMessage = {
  subject: "ws_user_Connected";
  payload: WSUserConnect;
};

export type WSUserAuthMessage = {
  subject: "ws_auth_Token";
  payload: WSUserAuth;
};

export type WSUserLogoutMessage = {
  subject: "ws_logout_Token";
  payload: WSUserConnect;
};

export type WSGeneralMessage = {
  subject: "ws_user_Message";
  payload: WSUserMessage;
};

