import { createReducer } from '@reduxjs/toolkit'
import {
  setCurrentGame, clearCurrentGame,
  setCurrentGameUser, clearCurrentGameUser
} from '../actions/ttt'
import { type Game } from '../../types/ttt'

interface TTTReducer {
  currentGame: Game | null
  currentGameUser: string | null
}

const initialState: TTTReducer = {
  currentGame: null,
  currentGameUser: null
};

const tttReducer = createReducer<TTTReducer>(initialState, (builder) => {
  builder.addCase(setCurrentGame, (state, action) => {
    state.currentGame = action.payload;
  });
  builder.addCase(clearCurrentGame, state => {
    state.currentGame = null;
  });
  builder.addCase(setCurrentGameUser, (state, action) => {
    state.currentGameUser = action.payload;
  });
  builder.addCase(clearCurrentGameUser, state => {
    state.currentGameUser = null;
  });
});

export default tttReducer;
