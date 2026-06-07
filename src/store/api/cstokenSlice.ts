import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { WSCSTokenMessage } from '../../types';

export type CSTokenAction = {
  id: string;              // compound ID
  clientIp: string;
  seqNo: number;
  subject: WSCSTokenMessage["subject"];
  payload: WSCSTokenMessage["payload"];
};

// Entity adaptor for normalised posts structure; ids end entities.
export const csTokenActionsAdapter = createEntityAdapter<CSTokenAction>({
  sortComparer: (a, b) => b.seqNo - a.seqNo
});

export const csTokenActionsSlice = createSlice({
  name: 'csTokenActions',
  initialState: csTokenActionsAdapter.getInitialState(),
  reducers: {
    actionReceived: csTokenActionsAdapter.upsertOne,

    truncateClient: (state, action) => {
      const ip = action.payload;
      const ids = state.ids.filter((id) => id.startsWith(ip + "_"));
      if (ids.length > 20) {
        const toRemove = ids.slice(20);
        csTokenActionsAdapter.removeMany(state, toRemove);
      }
    }    //addPosts: postsAdapter.addMany,
  }
});

export const { reducer } = csTokenActionsSlice;

