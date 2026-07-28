import type { ClientCS, AcquireCS, RequestCS, ProcSvc } from "./cstoken";
import type { Game, PlayerMove } from "./ttt";

export * from "./cstoken";
export * from "./ttt";
export * from "./livePosts";

export type TokenAction = {
  parentIp: string;
  timestamp: string;
  originalIp: string;
  action: AcquireCS | RequestCS | ProcSvc;
}

export interface Notification {
  id: string;
  name: string;
  date: string;
  user: string;
  message: string;
  isNew: boolean;
  read: boolean;
}

export type ActionByIp = Record<string, { client: ClientCS; actions: TokenAction[]; }>;

export function isGame(obj: unknown): obj is Game {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as Game).id === "string" &&
    typeof (obj as Game).board === "string" &&
    typeof (obj as Game).createdAt === "string"
  );
}

export function isMove(obj: unknown): obj is PlayerMove {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof (obj as PlayerMove).id === "string" &&
    typeof (obj as PlayerMove).gameId === "string" &&
    typeof (obj as PlayerMove).player === "number" &&
    typeof (obj as PlayerMove).moveCell === "number"
  );
}

export type CreateGameMutationVariables = {
  userId: string;
};

export type StartGameMutationVariables = {
  gameId: string;
};

export type BoardMoveMutationVariables = {
  gameId: string;
  isOpponentStart: boolean;
  moveCell: number;
  player: number;
};

export type GameUpdateByGameIdSubscriptionVariables = {
  gameId: string;
};


