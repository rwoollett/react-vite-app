import { createReducer } from '@reduxjs/toolkit'
import { setContents, addCountdown, removeCountdown } from '../actions/data'
import { type CountdownTimer } from '../../types/countdown'

interface DataReducer {
  timers: CountdownTimer[];
  contents: string[];
}

const initialState: DataReducer = {
  timers: [],
  contents: []
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
});

export default dataReducer;
