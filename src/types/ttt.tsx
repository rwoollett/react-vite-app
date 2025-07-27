
// /** A board update of tictactoe */
// export type BoardOutput = {
//   __typename?: 'BoardOutput';
//   board: Scalars['String']['output'];
//   gameId: Scalars['Int']['output'];
//   result: Scalars['String']['output'];
// };

/** Tic Tac Toes game board. The player can play as Nought(1) or Cross(2). O is empty cell. */
export type Game = {
  board: string;
  createdAt: string;
  id: string;
  userId: string;
};


/** The players moves in the Tic Tac Toe board against oppenent. */
export type PlayerMove = {
  /** When found with query getPlayerMove as findFirst this is marked true. */
  allocated: boolean;
  gameId: string;
  id: string;
  isOpponentStart: boolean;
  moveCell: number;
  player: number;
};

/** Removal result. */
export type RemovalResult = {
  message: string;
};

export type BoardOutput = {
  board: string;
  gameId: string;
  result: string;
};

export type WSTTTMessage = { subject: "game_Update"; payload: BoardOutput };

