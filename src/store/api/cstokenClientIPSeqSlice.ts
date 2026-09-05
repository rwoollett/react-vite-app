import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
//import type { WSCSTokenMessage } from '../../types';

interface ClientSeqState {
  [clientIp: string]: number;
}

const initialState: ClientSeqState = {};

const clientIPSeqSlice = createSlice({
  name: "clientIPSeq",
  initialState,
  reducers: {
    updateLastSeq(state, action: PayloadAction<{ clientIp: string; seq: number }>) {
      state[action.payload.clientIp] = action.payload.seq;
    }
  }
});

export const { updateLastSeq } = clientIPSeqSlice.actions;
export default clientIPSeqSlice.reducer;
