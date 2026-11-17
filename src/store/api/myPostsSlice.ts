import {
  createSlice,
  createAsyncThunk
} from '@reduxjs/toolkit';
import { http } from '../../utility/fetchData';
import type { Post } from '../../types';

// My Posts structure; only ids which ref Post adaptor ids
interface MyPostsStateProp {
  ids: number[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: MyPostsStateProp = {
  ids: [],
  status: 'idle',
};

export const fetchMyPosts = createAsyncThunk(
  'myposts/fetchMyPosts',
  async () => {
    const apiUrl = `${import.meta.env.VITE_LIVEPOSTS_URL}`;
    try {
      const response = await http<{ fetchUserPosts: Post[] }>(
        `${apiUrl}/api/v1/liveposts/user/posts`,
        {
          method: "GET",
          credentials: "include"
        }
      );
      if (!response.fetchUserPosts)
        return [];
      return response.fetchUserPosts;
    } catch (_e) {
      return [];
    }
  });


// Warning on reducer immutabiliy:
export const myPostsSlice = createSlice({
  name: 'myposts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchMyPosts.pending, (state, _action) => {
      state.status = 'loading';
    });
    builder.addCase(fetchMyPosts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.ids =
        action.payload.map(
          p => p.id
        );
    });
    builder.addCase(fetchMyPosts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
  }
});

export const { reducer } = myPostsSlice;

