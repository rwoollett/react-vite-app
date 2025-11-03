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


export function isGame(obj: any): obj is Game {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.board === "string" &&
    typeof obj.createdAt === "string"
  );
}

export function isMove(obj: any): obj is PlayerMove {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    typeof obj.gameId === "string" &&
    typeof obj.player === "number" &&
    typeof obj.moveCell === "number"
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


