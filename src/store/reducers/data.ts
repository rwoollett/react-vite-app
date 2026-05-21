import { createReducer } from '@reduxjs/toolkit'
import {
  setCurrentGame, clearCurrentGame,
  setCurrentGameUser, clearCurrentGameUser,
  setContents, addCountdown, removeCountdown
} from '../actions/data'
import { type CountdownTimer } from '../../types/countdown'
import { type Game } from '../../types/ttt'

interface DataReducer {
  timers: CountdownTimer[];
  contents: string[];
  currentGame: Game | null
  currentGameUser: string | null
}

const initialState: DataReducer = {
  timers: [],
  contents: [],
  currentGame: null,
  currentGameUser: null
};

const dataReducer = createReducer<DataReducer>(initialState, (builder) => {
  builder.addCase(addCountdown, (state, action) => {
    if (state.timers) {
      state.timers.push(action.payload);
    } else {
      state.timers = [action.payload];
    }
  });
  builder.addCase(removeCountdown, (state, action) => {
    const indexRemove = state.timers.findIndex((item) => item.id === action.payload.id);
    state.timers.splice(indexRemove, 1);
  });
  builder.addCase(setContents, (state, action) => {
    state.contents = action.payload;
  });
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

export default dataReducer;
